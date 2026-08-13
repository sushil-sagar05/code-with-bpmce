'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderGit2, Award, BookOpen, PenTool, UserCheck,
  ChevronRight, LogOut, Shield, Plus, CheckCircle, X, Trash2, ExternalLink,
  Code2, Loader2, Sparkles, AlertCircle, Edit3, Save, Globe, Star, Users, Eye, Camera
} from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { usersAPI, achievementsAPI, projectsAPI, blogsAPI, roadmapsAPI, uploadAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { SharedProfileComponent } from '@/app/profile/page';
import DetailModal from '@/components/ui/DetailModal';
import PageLoader, { SectionLoader, ButtonLoader } from '@/components/ui/PageLoader';

export default function StudentDashboardPage() {
  const { user, isAdmin, logout, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTabState] = useState('overview');

  // Sync activeTab with URL query parameter & localStorage for refresh persistence
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab');
      const savedTab = localStorage.getItem('cwb_dashboard_tab');
      const tabToUse = urlTab || savedTab || 'overview';
      setActiveTabState(tabToUse);
    }
  }, []);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cwb_dashboard_tab', tab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Show form toggles
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddAchievement, setShowAddAchievement] = useState(false);
  const [showAddBlog, setShowAddBlog] = useState(false);

  // Form states
  const [projectForm, setProjectForm] = useState({ title: '', description: '', tech: '', github: '', demo: '', category: 'web' });
  const [submittingProject, setSubmittingProject] = useState(false);

  const [achievementForm, setAchievementForm] = useState({ title: '', description: '', type: 'internship', company: '', proof: '', date: '' });
  const [submittingAchievement, setSubmittingAchievement] = useState(false);

  const [blogForm, setBlogForm] = useState({ title: '', excerpt: '', content: '', category: 'tech', tags: '', coverImage: '' });
  const [submittingBlog, setSubmittingBlog] = useState(false);
  const [blogCoverUploading, setBlogCoverUploading] = useState(false);
  const [achievementImageUploading, setAchievementImageUploading] = useState(false);
  const blogCoverRef = useRef(null);
  const achievementImageRef = useRef(null);

  // Data lists
  const [myProjects, setMyProjects] = useState([]);
  const [myAchievements, setMyAchievements] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Detail Modal state
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [modalType, setModalType] = useState('project');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const loadData = useCallback(() => {
    if (user) {
      setLoadingData(true);
      Promise.allSettled([
        projectsAPI.getAll({ addedBy: user._id }),
        achievementsAPI.getAll({ user: user._id }),
        blogsAPI.getAll({ author: user._id }),
      ]).then(([p, a, b]) => {
        if (p.value?.data?.data) setMyProjects(p.value.data.data.filter(x => x.addedBy?._id === user._id || x.addedBy === user._id));
        if (a.value?.data?.data) setMyAchievements(a.value.data.data);
        if (b.value?.data?.data) setMyBlogs(b.value.data.data);
      }).finally(() => setLoadingData(false));
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setSubmittingProject(true);
    try {
      const payload = {
        ...projectForm,
        tech: projectForm.tech.split(',').map(s => s.trim()).filter(Boolean),
      };
      const { data } = await projectsAPI.create(payload);
      setMyProjects(prev => [data.data, ...prev]);
      setProjectForm({ title: '', description: '', tech: '', github: '', demo: '', category: 'web' });
      setShowAddProject(false);
      toast.success('Project submitted! It will appear in the showcase once approved by admin.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit project');
    } finally { setSubmittingProject(false); }
  };

  const handleSubmitAchievement = async (e) => {
    e.preventDefault();
    setSubmittingAchievement(true);
    try {
      const payload = {
        ...achievementForm,
        date: achievementForm.date || new Date().toISOString(),
      };
      const { data } = await achievementsAPI.create(payload);
      setMyAchievements(prev => [data.data, ...prev]);
      setAchievementForm({ title: '', description: '', type: 'internship', company: '', proof: '', date: '' });
      setShowAddAchievement(false);
      toast.success('Achievement submitted for verification! 🎯');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit achievement');
    } finally { setSubmittingAchievement(false); }
  };

  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    setSubmittingBlog(true);
    try {
      const payload = {
        ...blogForm,
        tags: blogForm.tags.split(',').map(s => s.trim()).filter(Boolean),
      };
      const { data } = await blogsAPI.create(payload);
      setMyBlogs(prev => [data.data, ...prev]);
      setBlogForm({ title: '', excerpt: '', content: '', category: 'tech', tags: '', coverImage: '' });
      setShowAddBlog(false);
      toast.success('Blog post published successfully! 📝');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish blog');
    } finally { setSubmittingBlog(false); }
  };

  const handleBlogCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setBlogCoverUploading(true);
    try {
      const { data } = await uploadAPI.uploadImage(file);
      setBlogForm(prev => ({ ...prev, coverImage: data.url }));
      toast.success('Cover image uploaded!');
    } catch { toast.error('Upload failed. Try again.'); }
    finally { setBlogCoverUploading(false); }
  };

  const handleAchievementImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setAchievementImageUploading(true);
    try {
      const { data } = await uploadAPI.uploadImage(file);
      setAchievementForm(prev => ({ ...prev, image: data.url }));
      toast.success('Image uploaded!');
    } catch { toast.error('Upload failed. Try again.'); }
    finally { setAchievementImageUploading(false); }
  };

  if (authLoading || !user) {
    return <PageLoader text="Loading student dashboard..." />;
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: UserCheck },
    { id: 'projects', label: 'My Projects', icon: FolderGit2, count: myProjects.length },
    { id: 'achievements', label: 'Achievements', icon: Award, count: myAchievements.length },
    { id: 'blogs', label: 'My Blogs', icon: PenTool, count: myBlogs.length },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16 flex flex-col md:flex-row">

      {/* STATIC STICKY SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#0d0d0d] border-r border-[#1f1f1f] p-4 flex flex-col flex-shrink-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] z-30">
        
        {/* User Card */}
        {/* <div className="p-4 rounded-xl bg-[#111111] border border-[#1f1f1f] mb-6 flex items-center gap-3">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-[#FF6B00]/30 flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#FF6B00]/15 border border-[#FF6B00]/30 text-[#FF6B00] font-bold font-mono flex items-center justify-center text-base flex-shrink-0">
              {user.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-white font-dosis font-bold text-sm truncate">{user.name}</p>
            <p className="text-[#555] font-mono text-[10px] truncate">{user.email}</p>
            <span className="inline-block mt-1 font-mono text-[9px] text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-0.5 rounded border border-[#FF6B00]/20">
              Student Dashboard
            </span>
          </div>
        </div> */}

        {/* Navigation Items */}
        <nav className="space-y-1 flex-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-dosis font-semibold text-sm transition-all ${
                activeTab === id
                  ? 'bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/30 shadow-md'
                  : 'text-[#888] hover:text-white hover:bg-[#141414]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </div>
              {count !== undefined && count > 0 && (
                <span className="font-mono text-[10px] bg-[#1a1a1a] text-[#aaa] border border-[#2a2a2a] px-2 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Quick Links & Logout */}
        <div className="pt-4 border-t border-[#1f1f1f] space-y-2 mt-auto">
          {isAdmin && (
            <Link href="/admin" className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-dosis font-bold text-xs hover:bg-red-500/20 transition-colors">
              <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Admin Panel</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          )}
          <button onClick={logout} className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-[#666] hover:text-red-400 hover:bg-red-500/10 font-dosis font-semibold text-xs transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-5xl overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-white">Dashboard Overview</h1>
                    <p className="text-[#666] font-dosis text-sm">Track your projects, achievements, and club activities.</p>
                  </div>
                  <button onClick={() => { setActiveTab('projects'); setShowAddProject(true); }} className="btn-primary text-xs py-2 px-4">
                    <Plus className="w-3.5 h-3.5" /> Submit Project
                  </button>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div onClick={() => setActiveTab('projects')} className="bg-[#111] border border-[#1f1f1f] hover:border-[#FF6B00]/30 rounded-xl p-5 cursor-pointer transition-all">
                    <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] flex items-center justify-center mb-3">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                    <p className="text-[#555] font-mono text-[10px] uppercase">My Projects</p>
                    <p className="text-white font-display text-2xl font-bold">{myProjects.length}</p>
                  </div>
                  <div onClick={() => setActiveTab('achievements')} className="bg-[#111] border border-[#1f1f1f] hover:border-yellow-500/30 rounded-xl p-5 cursor-pointer transition-all">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center mb-3">
                      <Award className="w-5 h-5" />
                    </div>
                    <p className="text-[#555] font-mono text-[10px] uppercase">Achievements</p>
                    <p className="text-white font-display text-2xl font-bold">{myAchievements.length}</p>
                  </div>
                  <div onClick={() => setActiveTab('blogs')} className="bg-[#111] border border-[#1f1f1f] hover:border-green-500/30 rounded-xl p-5 cursor-pointer transition-all">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mb-3">
                      <PenTool className="w-5 h-5" />
                    </div>
                    <p className="text-[#555] font-mono text-[10px] uppercase">Blogs Written</p>
                    <p className="text-white font-display text-2xl font-bold">{myBlogs.length}</p>
                  </div>
                </div>

                {/* Quick actions grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div onClick={() => setActiveTab('profile')} className="bg-[#111] border border-[#1f1f1f] hover:border-[#FF6B00]/40 rounded-xl p-5 cursor-pointer transition-all group">
                    <UserCheck className="w-6 h-6 text-[#FF6B00] mb-2" />
                    <h3 className="text-white font-dosis font-bold text-base group-hover:text-[#FF6B00] transition-colors">Update Your Profile</h3>
                    <p className="text-[#666] font-dosis text-xs mt-1">Add your GitHub, LinkedIn, LeetCode handles, and bio.</p>
                  </div>
                  <div onClick={() => { setActiveTab('achievements'); setShowAddAchievement(true); }} className="bg-[#111] border border-[#1f1f1f] hover:border-[#FF6B00]/40 rounded-xl p-5 cursor-pointer transition-all group">
                    <Award className="w-6 h-6 text-yellow-400 mb-2" />
                    <h3 className="text-white font-dosis font-bold text-base group-hover:text-yellow-400 transition-colors">Submit Achievement</h3>
                    <p className="text-[#666] font-dosis text-xs mt-1">Add SIH, GSoC, PPO, or Contest achievements for admin verification.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROFILE */}
            {activeTab === 'profile' && (
              <SharedProfileComponent embedded={true} />
            )}

            {/* TAB 3: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-white">My Submitted Projects</h1>
                    <p className="text-[#666] font-dosis text-sm">View all your submitted projects and add new ones.</p>
                  </div>
                  <button
                    onClick={() => setShowAddProject(!showAddProject)}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    {showAddProject ? 'Cancel' : <><Plus className="w-3.5 h-3.5" /> Add Project</>}
                  </button>
                </div>

                {/* Project Submission Form */}
                {showAddProject && (
                  <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleSubmitProject} className="bg-[#111] border border-[#FF6B00]/30 rounded-xl p-6 space-y-4">
                    <h3 className="font-dosis font-bold text-lg text-white">Add New Project</h3>
                    <div>
                      <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Project Title</label>
                      <input type="text" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} required placeholder="e.g. AgriConnect AI" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
                    </div>
                    <div>
                      <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Description</label>
                      <textarea value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} required rows={3} placeholder="Briefly describe what your project does..." className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none resize-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Tech Stack (comma separated)</label>
                        <input type="text" value={projectForm.tech} onChange={e => setProjectForm({...projectForm, tech: e.target.value})} placeholder="Next.js, Python, Tailwind" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
                      </div>
                      <div>
                        <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Category</label>
                        <select value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})} className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none">
                          <option value="web">Web Dev</option>
                          <option value="app">Mobile App</option>
                          <option value="ai-ml">AI / ML</option>
                          <option value="blockchain">Web3 / Blockchain</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">GitHub Repo URL</label>
                        <input type="url" value={projectForm.github} onChange={e => setProjectForm({...projectForm, github: e.target.value})} placeholder="https://github.com/user/repo" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
                      </div>
                      <div>
                        <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Live Demo URL</label>
                        <input type="url" value={projectForm.demo} onChange={e => setProjectForm({...projectForm, demo: e.target.value})} placeholder="https://myproject.vercel.app" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
                      </div>
                    </div>
                    <button type="submit" disabled={submittingProject} className="btn-primary py-2.5 px-6 text-sm">
                      {submittingProject ? <ButtonLoader text="Submitting..." /> : <><Plus className="w-4 h-4" /> Save &amp; Submit Project</>}
                    </button>
                  </motion.form>
                )}

                {/* List of Added Projects */}
                {loadingData ? (
                  <SectionLoader text="Loading your projects..." />
                ) : myProjects.length === 0 ? (
                  <div className="text-center py-12 bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
                    <FolderGit2 className="w-10 h-10 text-[#444] mx-auto mb-2" />
                    <p className="text-[#666] font-dosis">No projects added yet.</p>
                    <button onClick={() => setShowAddProject(true)} className="btn-primary text-xs py-2 px-4 mt-3">Add Your First Project</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myProjects.map((p) => (
                      <div key={p._id} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-dosis font-bold text-base">{p.title}</h3>
                            {p.isFeatured ? (
                              <span className="font-mono text-[9px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">Approved / Featured</span>
                            ) : (
                              <span className="font-mono text-[9px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">Pending Approval</span>
                            )}
                          </div>
                          <p className="text-[#888] font-dosis text-xs line-clamp-2">{p.description}</p>
                          {p.tech && p.tech.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {p.tech.map((t, idx) => (
                                <span key={idx} className="font-mono text-[9px] text-[#aaa] bg-[#1a1a1a] px-2 py-0.5 rounded">{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => { setSelectedDetail(p); setModalType('project'); }} className="p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#FF6B00] hover:text-white transition-colors" title="View Full Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          {p.github && (
                            <a href={p.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#888] hover:text-white transition-colors">
                              <FaGithub className="w-4 h-4" />
                            </a>
                          )}
                          {p.demo && (
                            <a href={p.demo} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#FF6B00] hover:text-white transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ACHIEVEMENTS */}
            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-white">My Achievements</h1>
                    <p className="text-[#666] font-dosis text-sm">View verified achievements and submit new accomplishments.</p>
                  </div>
                  <button
                    onClick={() => setShowAddAchievement(!showAddAchievement)}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    {showAddAchievement ? 'Cancel' : <><Plus className="w-3.5 h-3.5" /> Add Achievement</>}
                  </button>
                </div>

                {/* Achievement Submission Form */}
                {showAddAchievement && (
                  <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleSubmitAchievement} className="bg-[#111] border border-yellow-500/30 rounded-xl p-6 space-y-4">
                    <h3 className="font-dosis font-bold text-lg text-white">Submit New Achievement</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Achievement Title</label>
                        <input type="text" value={achievementForm.title} onChange={e => setAchievementForm({...achievementForm, title: e.target.value})} required placeholder="e.g. SIH 2024 Finalist" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-yellow-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Type</label>
                        <select value={achievementForm.type} onChange={e => setAchievementForm({...achievementForm, type: e.target.value})} className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-yellow-500 outline-none">
                          <option value="internship">Internship</option>
                          <option value="ppo">PPO / Job Offer</option>
                          <option value="hackathon">Hackathon Win</option>
                          <option value="sih">SIH (Smart India Hackathon)</option>
                          <option value="gsoc">GSoC</option>
                          <option value="open-source">Open Source</option>
                          <option value="leetcode">LeetCode Milestone</option>
                          <option value="codeforces">Codeforces Milestone</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Company / Organization / Platform</label>
                        <input type="text" value={achievementForm.company} onChange={e => setAchievementForm({...achievementForm, company: e.target.value})} placeholder="e.g. Google, Microsoft, Unstop" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-yellow-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Proof URL (Offer Letter / Certificate Link)</label>
                        <input type="url" value={achievementForm.proof} onChange={e => setAchievementForm({...achievementForm, proof: e.target.value})} placeholder="https://drive.google.com/..." className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-yellow-500 outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Description &amp; Key Highlights</label>
                        <textarea value={achievementForm.description} onChange={e => setAchievementForm({...achievementForm, description: e.target.value})} rows={3} placeholder="Provide details, rank, team members, or stipend info..." className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-yellow-500 outline-none resize-none" />
                      </div>
                      <div>
                        <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Certificate / Proof Image (optional)</label>
                        <input ref={achievementImageRef} type="file" accept="image/*" className="hidden" onChange={handleAchievementImageUpload} />
                        <div className="flex items-center gap-3">
                          {achievementForm.image ? (
                            <img src={achievementForm.image} alt="Proof Preview" className="w-16 h-16 rounded object-cover border border-yellow-500/30 flex-shrink-0" />
                          ) : (
                            <div className="w-16 h-16 rounded bg-[#0d0d0d] border border-dashed border-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                              <Camera className="w-5 h-5 text-[#444]" />
                            </div>
                          )}
                          <div>
                            <button type="button" onClick={() => achievementImageRef.current?.click()} disabled={achievementImageUploading} className="flex items-center gap-1.5 px-4 py-2 rounded border border-yellow-500/30 text-yellow-400 font-dosis text-xs font-semibold hover:bg-yellow-500/10 transition-all disabled:opacity-50">
                              <Camera className="w-3.5 h-3.5" />
                              {achievementImageUploading ? 'Uploading...' : achievementForm.image ? 'Change Image' : 'Upload Certificate'}
                            </button>
                            {achievementForm.image && (
                              <button type="button" onClick={() => setAchievementForm(p => ({ ...p, image: '' }))} className="block mt-1 text-red-400/60 hover:text-red-400 font-mono text-[10px] underline">Remove</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button type="submit" disabled={submittingAchievement} className="btn-primary py-2.5 px-6 text-sm">
                      {submittingAchievement ? <ButtonLoader text="Submitting..." /> : <><Plus className="w-4 h-4" /> Submit Achievement</>}
                    </button>
                  </motion.form>
                )}

                {/* List of Added Achievements */}
                {loadingData ? (
                  <SectionLoader text="Loading your achievements..." />
                ) : myAchievements.length === 0 ? (
                  <div className="text-center py-12 bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
                    <Award className="w-10 h-10 text-[#444] mx-auto mb-2" />
                    <p className="text-[#666] font-dosis">No achievements added yet.</p>
                    <button onClick={() => setShowAddAchievement(true)} className="btn-primary text-xs py-2 px-4 mt-3">Add First Achievement</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myAchievements.map((a) => (
                      <div key={a._id} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2 py-0.5 rounded uppercase">{a.type}</span>
                            {a.isVerified ? (
                              <span className="font-mono text-[9px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">✓ Verified</span>
                            ) : (
                              <span className="font-mono text-[9px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">Pending Verification</span>
                            )}
                          </div>
                          <h3 className="text-white font-dosis font-bold text-base pt-1">{a.title}</h3>
                          <p className="text-[#888] font-dosis text-xs">{a.description}</p>
                        </div>
                        <Link href={`/achievements/${a._id}`} className="p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#FF6B00] hover:text-white transition-colors flex-shrink-0" title="View Full Achievement Page">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: MY BLOGS */}
            {activeTab === 'blogs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-white">My Technical Blogs</h1>
                    <p className="text-[#666] font-dosis text-sm">Write articles and share knowledge with fellow students.</p>
                  </div>
                  <button
                    onClick={() => setShowAddBlog(!showAddBlog)}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    {showAddBlog ? 'Cancel' : <><PenTool className="w-3.5 h-3.5" /> Write Blog</>}
                  </button>
                </div>

                {/* Blog Post Form */}
                {showAddBlog && (
                  <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleSubmitBlog} className="bg-[#111] border border-green-500/30 rounded-xl p-6 space-y-4">
                    <h3 className="font-dosis font-bold text-lg text-white">Write New Blog Post</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Blog Title</label>
                        <input type="text" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} required placeholder="e.g. Mastering Async JavaScript in 2025" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-green-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Category</label>
                        <select value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})} className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-green-500 outline-none">
                          <option value="tech">Tech Tutorial</option>
                          <option value="career">Career / Interview Prep</option>
                          <option value="dsa">DSA &amp; Problem Solving</option>
                          <option value="techno">Bytes</option>
                          <option value="web-dev">Web Development</option>
                          <option value="ai-ml">AI &amp; Machine Learning</option>
                          <option value="college">College &amp; Club News</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Tags (comma separated)</label>
                        <input type="text" value={blogForm.tags} onChange={e => setBlogForm({...blogForm, tags: e.target.value})} placeholder="javascript, webdev, react" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-green-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Cover Image (optional)</label>
                        <input ref={blogCoverRef} type="file" accept="image/*" className="hidden" onChange={handleBlogCoverUpload} />
                        <div className="flex items-center gap-3">
                          {blogForm.coverImage ? (
                            <img src={blogForm.coverImage} alt="Cover Preview" className="w-16 h-16 rounded object-cover border border-green-500/30 flex-shrink-0" />
                          ) : (
                            <div className="w-16 h-16 rounded bg-[#0d0d0d] border border-dashed border-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                              <Camera className="w-5 h-5 text-[#444]" />
                            </div>
                          )}
                          <div>
                            <button type="button" onClick={() => blogCoverRef.current?.click()} disabled={blogCoverUploading} className="flex items-center gap-1.5 px-4 py-2 rounded border border-green-500/30 text-green-400 font-dosis text-xs font-semibold hover:bg-green-500/10 transition-all disabled:opacity-50">
                              <Camera className="w-3.5 h-3.5" />
                              {blogCoverUploading ? 'Uploading...' : blogForm.coverImage ? 'Change Cover' : 'Upload Cover'}
                            </button>
                            {blogForm.coverImage && (
                              <button type="button" onClick={() => setBlogForm(p => ({ ...p, coverImage: '' }))} className="block mt-1 text-red-400/60 hover:text-red-400 font-mono text-[10px] underline">Remove</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Short Excerpt / Summary</label>
                      <input type="text" value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} placeholder="A one-sentence summary of your article..." className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-green-500 outline-none" />
                    </div>
                    <div>
                      <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Content (Markdown supported)</label>
                      <textarea value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} required rows={8} placeholder="Write your blog post here in Markdown..." className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-green-500 outline-none resize-none font-mono" />
                    </div>
                    <button type="submit" disabled={submittingBlog} className="btn-primary py-2.5 px-6 text-sm">
                      {submittingBlog ? <ButtonLoader text="Publishing..." /> : <><PenTool className="w-4 h-4" /> Publish Article</>}
                    </button>
                  </motion.form>
                )}

                {/* List of Added Blogs */}
                {loadingData ? (
                  <SectionLoader text="Loading your blog articles..." />
                ) : myBlogs.length === 0 ? (
                  <div className="text-center py-12 bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
                    <PenTool className="w-10 h-10 text-[#444] mx-auto mb-2" />
                    <p className="text-[#666] font-dosis">No blogs published yet.</p>
                    <button onClick={() => setShowAddBlog(true)} className="btn-primary text-xs py-2 px-4 mt-3">Write Your First Blog</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myBlogs.map((b) => (
                      <div key={b._id} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-white font-dosis font-bold text-base">{b.title}</h3>
                          <p className="text-[#888] font-dosis text-xs line-clamp-2">{b.excerpt || b.content?.slice(0, 120)}</p>
                        </div>
                        <Link href={`/blogs/${b._id}`} className="p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#FF6B00] hover:text-white transition-colors flex-shrink-0" title="View Full Article Page">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Detail Modal */}
      <DetailModal
        isOpen={!!selectedDetail}
        onClose={() => setSelectedDetail(null)}
        data={selectedDetail}
        type={modalType}
      />

    </div>
  );
}
