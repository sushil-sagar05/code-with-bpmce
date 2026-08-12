'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Users, CheckCircle, X, LayoutDashboard, Calendar, BookOpen,
  AlertCircle, LogOut, Loader2, ChevronRight, Plus, Trash2, Eye,
  Activity, Star, Settings, Terminal, FolderGit2, PenTool, Compass, Sparkles, Check, UserPlus, Phone, ExternalLink
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usersAPI, achievementsAPI, eventsAPI, blogsAPI, projectsAPI, roadmapsAPI, applicationsAPI, resourcesAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import DetailModal from '@/components/ui/DetailModal';
import AdminRoadmapPanel from '@/components/admin/AdminRoadmapPanel';
import PageLoader, { SectionLoader, ButtonLoader } from '@/components/ui/PageLoader';

// ─── Stat Card Component ───────────────────────────────────────────────────
function StatsCard({ label, value, icon: Icon, color = 'red' }) {
  const colors = {
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
    orange: 'bg-[#FF6B00]/10 border-[#FF6B00]/30 text-[#FF6B00]',
    green: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  };
  return (
    <div className="bg-[#11131a] border border-[#1e2330] hover:border-[#2b3245] rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 shadow-sm group">
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-[#667085] font-mono text-[10px] uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-white font-display font-bold text-2xl sm:text-3xl mt-0.5">{value ?? '—'}</p>
      </div>
    </div>
  );
}

function MembersPanel({ onViewDetail }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    usersAPI.getLeaderboard().then(({ data }) => setMembers(data.data || []))
      .catch(() => toast.error('Failed to load members'))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleToggle = async (userItem) => {
    const newRole = userItem.role === 'admin' ? 'student' : 'admin';
    try {
      await usersAPI.updateRole(userItem._id, newRole);
      setMembers(prev => prev.map(m => m._id === userItem._id ? { ...m, role: newRole } : m));
      toast.success(`${userItem.name} role changed to ${newRole}`);
    } catch { toast.error('Failed to update role'); }
  };

  const filteredMembers = members.filter(m => {
    const query = search.toLowerCase();
    return (m.name || '').toLowerCase().includes(query) ||
           (m.email || '').toLowerCase().includes(query) ||
           (m.branch || '').toLowerCase().includes(query) ||
           (m.batch || '').toString().includes(query);
  });

  if (loading) return <SectionLoader text="Loading registered club members..." />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="font-display text-xl font-bold text-white">Member Directory &amp; Registration</h2>
          <p className="text-[#666] font-dosis text-xs">Manage students who have joined the CodeWithBPMCE community.</p>
        </div>
        <span className="font-mono text-xs text-[#888] bg-[#111] border border-[#1f1f1f] px-3 py-1 rounded-lg">
          {members.length} Registered Members
        </span>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search member by name, email, branch (CSE/ECE), or batch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111] border border-[#1f1f1f] rounded-xl px-4 py-2.5 text-white text-sm font-dosis focus:border-red-500 outline-none"
        />
      </div>

      {filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
          <Users className="w-10 h-10 text-[#444] mx-auto mb-2" />
          <p className="text-[#666] font-dosis">No matching club members found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMembers.map(m => (
            <div key={m._id} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 min-w-0">
                {m.avatar ? (
                  <img src={m.avatar} alt={m.name} className="w-11 h-11 rounded-full object-cover border border-[#2a2a2a] flex-shrink-0 mt-0.5" />
                ) : (
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold font-mono text-base border flex-shrink-0 mt-0.5 ${
                    m.role === 'admin' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-[#FF6B00]/10 border-[#FF6B00]/30 text-[#FF6B00]'
                  }`}>{m.name?.[0]?.toUpperCase()}</div>
                )}
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/profile/${m._id}`} className="text-white font-dosis font-bold text-base hover:text-[#FF6B00] transition-colors">
                      {m.name}
                    </Link>
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded border uppercase ${
                      m.role === 'admin' ? 'text-red-400 bg-red-500/10 border-red-500/30' : 'text-[#888] bg-[#141414] border-[#222]'
                    }`}>{m.role}</span>
                  </div>
                  <p className="text-[#666] font-mono text-xs">{m.email}</p>

                  <div className="flex items-center gap-3 text-xs font-dosis text-[#888] flex-wrap pt-1">
                    {m.branch && <span>🎓 Branch: <strong className="text-white">{m.branch}</strong></span>}
                    {m.batch && <span>📅 Batch: <strong className="text-white">{m.batch}</strong></span>}
                    <span>⚡ Points: <strong className="text-[#FF6B00]">{m.points || 0} XP</strong></span>
                    {m.createdAt && <span>🗓 Joined: <strong className="text-[#aaa]">{new Date(m.createdAt).toLocaleDateString()}</strong></span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                <Link
                  href={`/profile/${m._id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1c1c1c] border border-[#2a2a2a] text-[#ccc] hover:text-white font-dosis text-xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#FF6B00]" /> View Full Profile
                </Link>
                <button
                  onClick={() => handleRoleToggle(m)}
                  className={`text-xs font-mono px-3 py-1.5 rounded border transition-colors ${
                    m.role === 'admin'
                      ? 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10'
                      : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                  }`}
                >
                  {m.role === 'admin' ? 'Demote to Student' : 'Make Admin'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 2. Project Approvals ──────────────────────────────────────────────────
function ProjectsApprovalPanel({ onViewDetail }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(() => {
    setLoading(true);
    projectsAPI.getAll().then(({ data }) => setProjects(data.data || []))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const approve = async (id) => {
    try {
      await projectsAPI.approve(id);
      setProjects(prev => prev.map(p => p._id === id ? { ...p, isFeatured: true } : p));
      toast.success('Project approved for showcase! 🚀');
    } catch { toast.error('Failed to approve project'); }
  };

  const remove = async (id) => {
    try {
      await projectsAPI.delete(id);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch { toast.error('Failed to delete project'); }
  };

  if (loading) return <SectionLoader text="Loading project submissions..." />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-white">Project Approvals</h2>
        <span className="font-mono text-xs text-[#555]">{projects.length} total projects</span>
      </div>
      {projects.length === 0 ? (
        <p className="text-[#666] font-dosis text-center py-12">No projects submitted yet.</p>
      ) : (
        projects.map(p => (
          <div key={p._id} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white font-dosis font-bold text-base">{p.title}</p>
                {p.isFeatured ? (
                  <span className="font-mono text-[9px] text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded uppercase">Approved / Featured</span>
                ) : (
                  <span className="font-mono text-[9px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 rounded uppercase">Pending Review</span>
                )}
              </div>
              <p className="text-[#888] font-dosis text-xs line-clamp-2">{p.description}</p>
              <p className="text-[#555] font-mono text-[10px]">Submitted by: {p.addedBy?.name || 'Student'}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => onViewDetail && onViewDetail(p, 'project')} className="p-2 rounded bg-[#1a1a1a] text-[#FF6B00] hover:text-white transition-colors" title="View Full Details">
                <Eye className="w-4 h-4" />
              </button>
              {!p.isFeatured && (
                <button onClick={() => approve(p._id)} className="flex items-center gap-1 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 px-3 py-1.5 rounded text-xs font-dosis font-bold transition-colors">
                  <Check className="w-3.5 h-3.5" /> Approve
                </button>
              )}
              <button onClick={() => remove(p._id)} className="w-8 h-8 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── 3. Achievements Verification ──────────────────────────────────────────
function AchievementsPanel({ onViewDetail }) {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    achievementsAPI.getAll({ verified: false }).then(({ data }) => setAchievements(data.data || []))
      .catch(() => toast.error('Failed to load achievements'))
      .finally(() => setLoading(false));
  }, []);

  const verify = async (id) => {
    try {
      await achievementsAPI.verify(id);
      setAchievements(prev => prev.filter(a => a._id !== id));
      toast.success('Achievement verified! ✓');
    } catch { toast.error('Failed to verify'); }
  };

  const reject = async (id) => {
    try {
      await achievementsAPI.reject(id);
      setAchievements(prev => prev.filter(a => a._id !== id));
      toast.success('Achievement rejected');
    } catch { toast.error('Failed to reject'); }
  };

  if (loading) return <SectionLoader text="Loading pending achievements..." />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-white">Pending Achievements Verification</h2>
        <span className="font-mono text-xs text-[#555]">{achievements.length} pending</span>
      </div>
      {achievements.length === 0 ? (
        <div className="text-center py-16">
          <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
          <p className="text-[#666] font-dosis">No pending achievement requests!</p>
        </div>
      ) : (
        achievements.map(a => (
          <div key={a._id} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4 flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-[9px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded uppercase">{a.type}</span>
              <p className="text-white font-dosis font-bold text-base mt-1">{a.title}</p>
              <p className="text-[#888] font-dosis text-xs">{a.description}</p>
              <p className="text-[#555] font-mono text-[10px] mt-1">Submitted by: {a.user?.name || 'Student'}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/achievements/${a._id}`} className="p-2 rounded bg-[#1a1a1a] text-[#FF6B00] hover:text-white transition-colors" title="View Full Achievement Details Page">
                <Eye className="w-4 h-4" />
              </Link>
              <button onClick={() => verify(a._id)} className="w-8 h-8 rounded bg-green-500/10 border border-green-500/30 text-green-400 flex items-center justify-center hover:bg-green-500/20 transition-colors">
                <CheckCircle className="w-4 h-4" />
              </button>
              <button onClick={() => reject(a._id)} className="w-8 h-8 rounded bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── 4. Add Roadmap Panel ──────────────────────────────────────────────────
function AddRoadmapPanel() {
  const [form, setForm] = useState({
    title: '', slug: '', description: '', category: 'web-dev', difficulty: 'Beginner', estimatedTime: '3 months', color: '#FF6B00'
  });
  const [nodes, setNodes] = useState([]);
  const [nodeInput, setNodeInput] = useState({ title: '', description: '' });
  const [resourceInput, setResourceInput] = useState({ title: '', url: '', type: 'article' });
  const [editingNodeIdx, setEditingNodeIdx] = useState(null);
  const [addingResourceToIdx, setAddingResourceToIdx] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingRoadmaps, setExistingRoadmaps] = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(true);

  useEffect(() => {
    roadmapsAPI.getAll()
      .then(({ data }) => setExistingRoadmaps(data.data || []))
      .catch(() => {})
      .finally(() => setLoadingExisting(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (nodes.length === 0) { toast.error('Add at least one step/node to the roadmap'); return; }
    setLoading(true);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const nodesWithOrder = nodes.map((n, i) => ({ ...n, order: i }));
      await roadmapsAPI.create({ ...form, slug, nodes: nodesWithOrder });
      toast.success('🗺️ Roadmap created with ' + nodes.length + ' steps!');
      setForm({ title: '', slug: '', description: '', category: 'web-dev', difficulty: 'Beginner', estimatedTime: '3 months', color: '#FF6B00' });
      setNodes([]);
      // Refresh list
      roadmapsAPI.getAll().then(({ data }) => setExistingRoadmaps(data.data || []));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create roadmap');
    } finally { setLoading(false); }
  };

  const addNode = () => {
    if (!nodeInput.title.trim()) { toast.error('Step title is required'); return; }
    setNodes(prev => [...prev, { ...nodeInput, resources: [] }]);
    setNodeInput({ title: '', description: '' });
  };

  const removeNode = (idx) => setNodes(prev => prev.filter((_, i) => i !== idx));

  const moveNode = (idx, dir) => {
    setNodes(prev => {
      const arr = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= arr.length) return arr;
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return arr;
    });
  };

  const addResource = (nodeIdx) => {
    if (!resourceInput.title || !resourceInput.url) { toast.error('Resource title and URL required'); return; }
    setNodes(prev => prev.map((n, i) => i === nodeIdx
      ? { ...n, resources: [...n.resources, { ...resourceInput }] }
      : n
    ));
    setResourceInput({ title: '', url: '', type: 'article' });
    setAddingResourceToIdx(null);
  };

  const removeResource = (nodeIdx, resIdx) => {
    setNodes(prev => prev.map((n, i) => i === nodeIdx
      ? { ...n, resources: n.resources.filter((_, ri) => ri !== resIdx) }
      : n
    ));
  };

  const deleteRoadmap = async (id) => {
    try {
      await roadmapsAPI.delete(id);
      setExistingRoadmaps(prev => prev.filter(r => r._id !== id));
      toast.success('Roadmap deleted');
    } catch { toast.error('Failed to delete roadmap'); }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">Learning Roadmap Manager</h2>
        <span className="font-mono text-xs text-[#555]">{existingRoadmaps.length} roadmaps published</span>
      </div>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 space-y-6">
        <h3 className="font-dosis font-bold text-base text-red-400 uppercase tracking-wider border-b border-[#1f1f1f] pb-3">Create New Roadmap</h3>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-red-400/70 font-mono text-[10px] uppercase block mb-1">Roadmap Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="e.g. Full-Stack Web Development 2025" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-red-500 outline-none" />
          </div>
          <div>
            <label className="text-red-400/70 font-mono text-[10px] uppercase block mb-1">Category *</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-red-500 outline-none">
              {[['web-dev','Web Development'],['dsa','DSA & Algorithms'],['ai-ml','AI & Machine Learning'],['genai','Generative AI'],['web3','Web3 & Blockchain'],['app-dev','App Development'],['cyber-security','Cyber Security'],['devops','DevOps & Cloud'],['cloud','Cloud Computing']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-red-400/70 font-mono text-[10px] uppercase block mb-1">Description *</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={3} placeholder="What will students learn? Who is this for?" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-red-500 outline-none resize-none" />
          </div>
          <div>
            <label className="text-red-400/70 font-mono text-[10px] uppercase block mb-1">Difficulty</label>
            <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-red-500 outline-none">
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </div>
          <div>
            <label className="text-red-400/70 font-mono text-[10px] uppercase block mb-1">Estimated Time</label>
            <input type="text" value={form.estimatedTime} onChange={e => setForm({...form, estimatedTime: e.target.value})} placeholder="e.g. 3 months, 6 weeks" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-red-500 outline-none" />
          </div>
          <div>
            <label className="text-red-400/70 font-mono text-[10px] uppercase block mb-1">Theme Color</label>
            <div className="flex gap-2">
              <input type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} className="h-10 w-10 rounded border border-[#1f1f1f] bg-[#0d0d0d] cursor-pointer" />
              <input type="text" value={form.color} onChange={e => setForm({...form, color: e.target.value})} placeholder="#FF6B00" className="flex-1 bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-red-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="text-red-400/70 font-mono text-[10px] uppercase block mb-1">Custom Slug (auto-generated if blank)</label>
            <input type="text" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="full-stack-web-dev-2025" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-mono focus:border-red-500 outline-none" />
          </div>
        </div>

        {/* Nodes / Steps Builder */}
        <div className="border-t border-[#1f1f1f] pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-dosis font-bold text-white text-sm">
              Roadmap Steps / Nodes
              <span className="ml-2 font-mono text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded">{nodes.length} added</span>
            </h4>
            <span className="font-mono text-[10px] text-[#555]">Drag to reorder • Add resources per step</span>
          </div>

          {/* Existing Nodes */}
          {nodes.length > 0 && (
            <div className="space-y-3">
              {nodes.map((node, idx) => (
                <div key={idx} className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-mono text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded font-bold">{idx + 1}</span>
                      <div className="flex flex-col gap-0.5">
                        <button type="button" onClick={() => moveNode(idx, -1)} disabled={idx === 0} className="text-[#555] hover:text-white disabled:opacity-20 text-xs leading-none">▲</button>
                        <button type="button" onClick={() => moveNode(idx, 1)} disabled={idx === nodes.length - 1} className="text-[#555] hover:text-white disabled:opacity-20 text-xs leading-none">▼</button>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-dosis font-bold text-sm">{node.title}</p>
                      {node.description && <p className="text-[#777] font-dosis text-xs mt-0.5 line-clamp-2">{node.description}</p>}
                      {/* Resources */}
                      {node.resources.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {node.resources.map((r, ri) => (
                            <div key={ri} className="flex items-center gap-1 bg-[#141414] border border-[#2a2a2a] px-2 py-0.5 rounded text-[#aaa] font-mono text-[9px]">
                              <span className="text-[#FF6B00]">{r.type}</span>
                              <span>{r.title}</span>
                              <button type="button" onClick={() => removeResource(idx, ri)} className="text-red-400/60 hover:text-red-400 ml-0.5">×</button>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Add Resource Toggle */}
                      {addingResourceToIdx === idx ? (
                        <div className="mt-2 bg-[#111] border border-[#2a2a2a] rounded-lg p-3 space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            <input type="text" placeholder="Resource title" value={resourceInput.title} onChange={e => setResourceInput({...resourceInput, title: e.target.value})} className="col-span-2 bg-[#0d0d0d] border border-[#1f1f1f] rounded px-3 py-1.5 text-white text-xs font-dosis outline-none focus:border-red-500" />
                            <select value={resourceInput.type} onChange={e => setResourceInput({...resourceInput, type: e.target.value})} className="bg-[#0d0d0d] border border-[#1f1f1f] rounded px-3 py-1.5 text-white text-xs font-dosis outline-none">
                              <option value="article">Article</option>
                              <option value="video">Video</option>
                              <option value="course">Course</option>
                              <option value="docs">Docs</option>
                              <option value="github">GitHub</option>
                            </select>
                          </div>
                          <input type="url" placeholder="https://..." value={resourceInput.url} onChange={e => setResourceInput({...resourceInput, url: e.target.value})} className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-3 py-1.5 text-white text-xs font-mono outline-none focus:border-red-500" />
                          <div className="flex gap-2">
                            <button type="button" onClick={() => addResource(idx)} className="flex-1 py-1.5 rounded bg-red-500/20 border border-red-500/30 text-red-400 font-dosis text-xs font-bold hover:bg-red-500/30 transition-colors">Add Resource</button>
                            <button type="button" onClick={() => { setAddingResourceToIdx(null); setResourceInput({ title: '', url: '', type: 'article' }); }} className="px-3 py-1.5 rounded bg-[#1f1f1f] text-[#666] font-dosis text-xs hover:text-white transition-colors">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button type="button" onClick={() => setAddingResourceToIdx(idx)} className="mt-2 text-[10px] font-mono text-[#555] hover:text-[#FF6B00] transition-colors">+ Add resource link</button>
                      )}
                    </div>
                    <button type="button" onClick={() => removeNode(idx)} className="text-[#555] hover:text-red-400 p-1 transition-colors flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Node */}
          <div className="bg-[#0a0a0a] border border-dashed border-[#2a2a2a] rounded-xl p-4 space-y-3">
            <p className="text-[#555] font-mono text-[10px] uppercase">Add Step / Node</p>
            <input type="text" placeholder="Step title (e.g. Learn HTML Basics)" value={nodeInput.title} onChange={e => setNodeInput({...nodeInput, title: e.target.value})} className="w-full bg-[#111] border border-[#1f1f1f] rounded px-3 py-2 text-white text-sm font-dosis outline-none focus:border-red-500" />
            <textarea placeholder="Brief description of what this step covers..." value={nodeInput.description} onChange={e => setNodeInput({...nodeInput, description: e.target.value})} rows={2} className="w-full bg-[#111] border border-[#1f1f1f] rounded px-3 py-2 text-white text-sm font-dosis outline-none focus:border-red-500 resize-none" />
            <button type="button" onClick={addNode} className="flex items-center gap-2 px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white rounded font-dosis text-xs font-semibold transition-colors">
              <Plus className="w-3.5 h-3.5 text-red-400" /> Add Step
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary py-3 px-6 text-sm w-full font-dosis font-bold">
          {loading ? <ButtonLoader text="Creating Roadmap..." /> : <><Plus className="w-4 h-4" /> Create Roadmap ({nodes.length} steps)</>}
        </button>
      </form>

      {/* Existing Roadmaps List */}
      <div className="space-y-3">
        <h3 className="font-dosis font-bold text-base text-white">Published Roadmaps</h3>
        {loadingExisting ? (
          <SectionLoader text="Loading published roadmaps..." />
        ) : existingRoadmaps.length === 0 ? (
          <p className="text-[#555] font-dosis text-sm text-center py-8">No roadmaps created yet.</p>
        ) : (
          existingRoadmaps.map(r => (
            <div key={r._id} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color || '#FF6B00' }} />
                  <p className="text-white font-dosis font-bold text-sm">{r.title}</p>
                  <span className="font-mono text-[9px] text-[#555] bg-[#1a1a1a] border border-[#2a2a2a] px-2 py-0.5 rounded">{r.category}</span>
                  <span className="font-mono text-[9px] text-[#555] bg-[#1a1a1a] border border-[#2a2a2a] px-2 py-0.5 rounded">{r.difficulty}</span>
                </div>
                <p className="text-[#777] font-dosis text-xs line-clamp-1">{r.description}</p>
                <p className="text-[#555] font-mono text-[10px] mt-1">{r.nodes?.length || 0} steps • {r.estimatedTime}</p>
              </div>
              <button onClick={() => deleteRoadmap(r._id)} className="w-8 h-8 flex items-center justify-center rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors flex-shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── 5. Add Event Panel ─────────────────────────────────────────────────────
function CreateEventPanel() {
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', type: 'workshop', capacity: 50 });
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await eventsAPI.create(form);
      toast.success('Event scheduled successfully!');
      setForm({ title: '', description: '', date: '', location: '', type: 'workshop', capacity: 50 });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create event'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-white mb-4">Schedule Club Event</h2>
      <form onSubmit={handleCreate} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 space-y-4">
        <div>
          <label className="text-red-400/70 font-mono text-[10px] uppercase block mb-1">Event Title</label>
          <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="e.g. Web Dev Workshop 2025" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-red-500 outline-none" />
        </div>
        <div>
          <label className="text-red-400/70 font-mono text-[10px] uppercase block mb-1">Description</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={3} placeholder="Event description..." className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-red-500 outline-none resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-red-400/70 font-mono text-[10px] uppercase block mb-1">Location</label>
            <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required placeholder="Room 101 / Google Meet" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-red-500 outline-none" />
          </div>
          <div>
            <label className="text-red-400/70 font-mono text-[10px] uppercase block mb-1">Date</label>
            <input type="datetime-local" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-red-500 outline-none" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded bg-red-500 hover:bg-red-600 text-white font-dosis font-bold transition-all shadow-lg shadow-red-900/20">
          {loading ? <ButtonLoader text="Scheduling Event..." /> : <><Plus className="w-4 h-4" /> Schedule Event</>}
        </button>
      </form>
    </div>
  );
}

// ─── 5.5 Add Resource Panel ──────────────────────────────────────────────────
function AddResourcePanel() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    url: '',
    type: 'doc',
    category: 'web-dev',
  });
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  const fetchResources = useCallback(() => {
    setLoadingList(true);
    resourcesAPI.getAll()
      .then(({ data }) => setResources(data.data || []))
      .catch(() => toast.error('Failed to load resources'))
      .finally(() => setLoadingList(false));
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.url) {
      toast.error('Resource Title and URL are required');
      return;
    }
    setLoading(true);
    try {
      await resourcesAPI.create(form);
      toast.success('Resource added to Dev Library! 📚');
      setForm({ title: '', description: '', url: '', type: 'doc', category: 'web-dev' });
      fetchResources();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add resource');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await resourcesAPI.delete(id);
      setResources(prev => prev.filter(r => r._id !== id));
      toast.success('Resource deleted from Dev Library');
    } catch {
      toast.error('Failed to delete resource');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-bold text-white mb-2">Dev Library Resource Manager</h2>
        <p className="text-[#666] font-dosis text-xs">Add books, courses, docs, sheets, tools, and repos to the public /resources library.</p>
      </div>

      {/* Add Form */}
      <form onSubmit={handleCreate} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 space-y-4">
        <h3 className="font-dosis font-bold text-base text-red-400 uppercase tracking-wider border-b border-[#1f1f1f] pb-3">Add New Resource</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-red-400/70 font-mono text-[10px] uppercase block mb-1">Resource Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              required
              placeholder="e.g. React Official Documentation"
              className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-red-500 outline-none"
            />
          </div>
          <div>
            <label className="text-red-400/70 font-mono text-[10px] uppercase block mb-1">Resource Link / URL *</label>
            <input
              type="url"
              value={form.url}
              onChange={e => setForm({...form, url: e.target.value})}
              required
              placeholder="https://..."
              className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-red-500 outline-none"
            />
          </div>
          <div>
            <label className="text-red-400/70 font-mono text-[10px] uppercase block mb-1">Resource Type</label>
            <select
              value={form.type}
              onChange={e => setForm({...form, type: e.target.value})}
              className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-red-500 outline-none"
            >
              <option value="doc">Documentation (doc)</option>
              <option value="book">Book</option>
              <option value="course">Course</option>
              <option value="github">GitHub Repo</option>
              <option value="youtube">YouTube Playlist / Video</option>
              <option value="sheet">Coding Sheet (sheet)</option>
              <option value="tool">Developer Tool</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-red-400/70 font-mono text-[10px] uppercase block mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => setForm({...form, category: e.target.value})}
              className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-red-500 outline-none"
            >
              <option value="web-dev">Web Development</option>
              <option value="dsa">DSA &amp; Algorithms</option>
              <option value="ai-ml">AI &amp; Machine Learning</option>
              <option value="genai">Generative AI</option>
              <option value="web3">Web3</option>
              <option value="app-dev">App Development</option>
              <option value="cyber-security">Cyber Security</option>
              <option value="devops">DevOps</option>
              <option value="cloud">Cloud</option>
              <option value="general">General Dev</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-red-400/70 font-mono text-[10px] uppercase block mb-1">Short Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            rows={2}
            placeholder="Brief explanation of what students will get from this resource..."
            className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-red-500 outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded bg-red-500 hover:bg-red-600 text-white font-dosis font-bold transition-all shadow-lg shadow-red-900/20"
        >
          {loading ? <ButtonLoader text="Adding Resource..." /> : <><Plus className="w-4 h-4" /> Add Resource to Library</>}
        </button>
      </form>

      {/* Resource List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-dosis font-bold text-white text-base">Published Resources in Library</h3>
          <span className="font-mono text-xs text-[#555]">{resources.length} total resources</span>
        </div>

        {loadingList ? (
          <SectionLoader text="Loading library resources..." />
        ) : resources.length === 0 ? (
          <div className="text-center py-12 bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
            <BookOpen className="w-10 h-10 text-[#444] mx-auto mb-2" />
            <p className="text-[#666] font-dosis">No resources published in Dev Library yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map(r => (
              <div key={r._id} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2 py-0.5 rounded uppercase">{r.type}</span>
                    <span className="font-mono text-[9px] text-[#888] bg-[#141414] border border-[#1f1f1f] px-2 py-0.5 rounded uppercase">{r.category}</span>
                  </div>
                  <h4 className="text-white font-dosis font-bold text-base pt-0.5 truncate">{r.title}</h4>
                  <p className="text-[#666] font-dosis text-xs truncate">{r.description || r.url}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-[#1a1a1a] text-[#FF6B00] hover:text-white transition-colors" title="Open Link">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button onClick={() => handleDelete(r._id)} className="p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors" title="Delete Resource">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 6. Blogs Management Panel ──────────────────────────────────────────────
function BlogsManagementPanel({ onViewDetail }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogsAPI.getAll({ all: 'true' })
      .then(({ data }) => setBlogs(data.data || []))
      .catch(() => toast.error('Failed to load blogs'))
      .finally(() => setLoading(false));
  }, []);

  const handleTogglePublish = async (blog) => {
    const newStatus = !blog.isPublished;
    try {
      await blogsAPI.update(blog._id, { isPublished: newStatus });
      setBlogs(prev => prev.map(b => b._id === blog._id ? { ...b, isPublished: newStatus } : b));
      toast.success(newStatus ? 'Blog post published live! 📝' : 'Blog post unpublished');
    } catch {
      toast.error('Failed to update blog status');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await blogsAPI.delete(id);
      setBlogs(prev => prev.filter(b => b._id !== id));
      toast.success('Blog post deleted');
    } catch {
      toast.error('Failed to delete blog');
    }
  };

  if (loading) return <SectionLoader text="Loading blog articles..." />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-white">Blog &amp; Articles Manager</h2>
        <span className="font-mono text-xs text-[#555]">{blogs.length} total articles</span>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-16 bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
          <PenTool className="w-10 h-10 text-[#444] mx-auto mb-2" />
          <p className="text-[#666] font-dosis">No blog articles found!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map(b => (
            <div key={b._id} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2 py-0.5 rounded uppercase">{b.category || 'tech'}</span>
                  {b.isPublished ? (
                    <span className="font-mono text-[9px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">✓ Published Live</span>
                  ) : (
                    <span className="font-mono text-[9px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">Draft / Unpublished</span>
                  )}
                </div>
                <h3 className="text-white font-dosis font-bold text-base pt-0.5">{b.title}</h3>
                <p className="text-[#666] font-mono text-xs">by {b.author?.name || 'Author'} · {b.readTime || 5} min read</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/blogs/${b._id}`} className="p-2 rounded bg-[#1a1a1a] text-[#FF6B00] hover:text-white transition-colors" title="View Full Article Page">
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleTogglePublish(b)}
                  className={`px-3 py-1.5 rounded font-dosis font-bold text-xs transition-colors border ${
                    b.isPublished
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
                      : 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                  }`}
                >
                  {b.isPublished ? 'Unpublish' : 'Publish Live'}
                </button>
                <button
                  onClick={() => handleDeleteBlog(b._id)}
                  className="p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Delete Article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 7. Applications Management Panel ────────────────────────────────────────
function ApplicationsManagementPanel() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    applicationsAPI.getAll()
      .then(({ data }) => setApplications(data.data || []))
      .catch(() => toast.error('Failed to load club applications'))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await applicationsAPI.updateStatus(id, status);
      setApplications(prev => prev.map(a => a._id === id ? { ...a, status } : a));
      toast.success(`Application marked as ${status}!`);
    } catch {
      toast.error('Failed to update application status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      await applicationsAPI.delete(id);
      setApplications(prev => prev.filter(a => a._id !== id));
      toast.success('Application deleted');
    } catch {
      toast.error('Failed to delete application');
    }
  };

  const filteredApps = applications.filter(a => filterStatus === 'all' || a.status === filterStatus);

  if (loading) return <SectionLoader text="Loading club join applications..." />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="font-display text-xl font-bold text-white">Club Join Applications</h2>
          <p className="text-[#666] font-dosis text-xs">Review students applying to join CodeWithBPMCE domain teams.</p>
        </div>
        <div className="flex items-center gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`font-mono text-[10px] uppercase px-2.5 py-1 rounded border transition-colors ${
                filterStatus === st ? 'bg-[#FF6B00] text-black border-[#FF6B00] font-bold' : 'text-[#888] border-[#1f1f1f] hover:border-[#FF6B00]/40'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <div className="text-center py-16 bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
          <UserPlus className="w-10 h-10 text-[#444] mx-auto mb-2" />
          <p className="text-[#666] font-dosis font-semibold">No club applications found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map(a => (
            <div key={a._id} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1f1f1f] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-dosis font-bold text-lg">{a.name}</h3>
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded border uppercase ${
                      a.status === 'approved'
                        ? 'text-green-400 bg-green-500/10 border-green-500/30'
                        : a.status === 'rejected'
                        ? 'text-red-400 bg-red-500/10 border-red-500/30'
                        : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
                    }`}>
                      {a.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-[#888] mt-1 flex-wrap">
                    <span>📧 {a.email}</span>
                    <span>📱 {a.phone}</span>
                    <span>🎓 {a.branch} ({a.year})</span>
                    {a.createdAt && <span>🗓 {new Date(a.createdAt).toLocaleDateString()}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {a.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(a._id, 'approved')}
                      className="px-3 py-1.5 rounded bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 font-dosis font-bold text-xs transition-colors"
                    >
                      Approve Member
                    </button>
                  )}
                  {a.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(a._id, 'rejected')}
                      className="px-3 py-1.5 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 font-dosis font-bold text-xs transition-colors"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Delete Application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tracks */}
              {a.tracks && a.tracks.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#666] font-mono text-[10px] uppercase">Interested Tracks:</span>
                  {a.tracks.map((t, idx) => (
                    <span key={idx} className="font-mono text-[10px] text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Motivation */}
              {a.motivation && (
                <div className="bg-[#0b0b0b] border border-[#1a1a1a] rounded-lg p-3 text-xs font-dosis text-[#aaa] leading-relaxed">
                  <span className="text-[#666] font-mono text-[10px] block uppercase mb-1">Motivation &amp; Goals:</span>
                  {a.motivation}
                </div>
              )}

              {/* GitHub */}
              {a.github && (
                <div className="pt-1">
                  <a
                    href={a.github.startsWith('http') ? a.github : `https://github.com/${a.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#888] hover:text-[#FF6B00] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> GitHub Profile: {a.github}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN ADMIN DASHBOARD ───────────────────────────────────────────────────
export default function AdminPage() {
  const [activeTab, setActiveTabState] = useState('overview');
  const [stats, setStats] = useState({ members: 0, achievements: 0, projects: 0, events: 0, blogs: 0, applications: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Sync activeTab with URL query parameter & localStorage for refresh persistence
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab');
      const savedTab = localStorage.getItem('cwb_admin_tab');
      const tabToUse = urlTab || savedTab || 'overview';
      setActiveTabState(tabToUse);
    }
  }, []);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cwb_admin_tab', tab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Detail Modal State
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [modalType, setModalType] = useState('project');

  const handleViewDetail = (data, type) => {
    setSelectedDetail(data);
    setModalType(type);
  };

  const { user, isAdmin, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) router.push('/login');
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (!isAdmin) return;
    Promise.allSettled([
      usersAPI.getLeaderboard(),
      achievementsAPI.getAll({ verified: false }),
      projectsAPI.getAll({ featured: 'true' }),
      eventsAPI.getAll(),
      blogsAPI.getAll({ all: 'true' }),
      applicationsAPI.getAll(),
    ]).then(([u, a, p, e, b, appRes]) => {
      const allBlogs = b.value?.data?.data || [];
      const pendingBlogs = allBlogs.filter(item => !item.isPublished).length;
      const allApps = appRes.value?.data?.data || [];
      const pendingApps = allApps.filter(item => item.status === 'pending').length;

      setStats({
        members: u.value?.data?.data?.length ?? 0,
        achievements: a.value?.data?.data?.length ?? 0,
        projects: p.value?.data?.data?.length ?? 0,
        events: e.value?.data?.data?.length ?? 0,
        blogs: pendingBlogs,
        applications: pendingApps,
      });
    }).finally(() => setStatsLoading(false));
  }, [isAdmin]);

  if (authLoading || !user) {
    return <PageLoader text="Verifying admin credentials..." />;
  }

  const adminNav = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Club Applications', icon: UserPlus, badge: stats.applications },
    { id: 'projects', label: 'Approve Projects', icon: FolderGit2, badge: stats.projects },
    { id: 'achievements', label: 'Approve Achievements', icon: CheckCircle, badge: stats.achievements },
    { id: 'blogs', label: 'Manage Blogs', icon: PenTool, badge: stats.blogs },
    { id: 'members', label: 'Member Directory', icon: Users, badge: stats.members },
    { id: 'resources', label: 'Add Resource', icon: BookOpen },
    { id: 'roadmaps', label: 'Add Roadmap', icon: Compass },
    { id: 'events', label: 'Add Event', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16 flex flex-col md:flex-row">

      {/* Premium Sleek Admin Sidebar - Sticky on Desktop */}
      <aside className="w-full md:w-64 bg-[#0c0d10] border-r border-[#1e222d] p-4 flex flex-col flex-shrink-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] z-20">
        <div className="px-3.5 py-3 mb-2 rounded-xl bg-[#131620] border border-[#1e2330] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 font-mono font-bold text-xs flex items-center justify-center">
              A
            </div>
            <div>
              <p className="text-white font-dosis font-bold text-xs leading-tight">Admin Console</p>
              <p className="text-[#667085] font-mono text-[10px]">CodeWithBPMCE</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
        </div>

        {/* Sidebar Nav */}
        <nav className="space-y-1 flex-1 overflow-y-auto pr-0.5">
          {adminNav.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-dosis font-bold text-xs transition-all ${
                activeTab === id
                  ? 'bg-gradient-to-r from-red-500/20 to-orange-500/10 text-white border border-red-500/40 shadow-sm'
                  : 'text-[#8896ab] hover:text-white hover:bg-[#141824]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${activeTab === id ? 'text-red-400' : 'text-[#667085]'}`} />
                <span>{label}</span>
              </div>
              {badge !== undefined && badge > 0 && (
                <span className="font-mono text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="pt-3 border-t border-[#1e222d] mt-auto">
          <button onClick={logout} className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 font-dosis font-bold text-xs transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Sign Out Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-5xl overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-white">Admin Overview</h1>
                  <p className="text-[#666] font-dosis text-sm">System statistics and moderation queues.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatsCard label="Pending Applications" value={statsLoading ? '...' : stats.applications} icon={UserPlus} color="orange" />
                  <StatsCard label="Total Members" value={statsLoading ? '...' : stats.members} icon={Users} color="red" />
                  <StatsCard label="Pending Verifications" value={statsLoading ? '...' : stats.achievements} icon={CheckCircle} color="green" />
                  <StatsCard label="Active Events" value={statsLoading ? '...' : stats.events} icon={Calendar} color="blue" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div onClick={() => setActiveTab('applications')} className="bg-[#111] border border-[#1f1f1f] hover:border-red-500/40 rounded-xl p-5 cursor-pointer transition-all">
                    <UserPlus className="w-6 h-6 text-[#FF6B00] mb-2" />
                    <h3 className="text-white font-dosis font-bold text-base">Club Join Applications</h3>
                    <p className="text-[#666] font-dosis text-xs mt-1">Review student applications to join CodeWithBPMCE domain teams.</p>
                  </div>
                  <div onClick={() => setActiveTab('projects')} className="bg-[#111] border border-[#1f1f1f] hover:border-red-500/40 rounded-xl p-5 cursor-pointer transition-all">
                    <FolderGit2 className="w-6 h-6 text-red-400 mb-2" />
                    <h3 className="text-white font-dosis font-bold text-base">Approve Student Projects</h3>
                    <p className="text-[#666] font-dosis text-xs mt-1">Review student projects and feature them on the website showcase.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'applications' && <ApplicationsManagementPanel />}
            {activeTab === 'members' && <MembersPanel onViewDetail={handleViewDetail} />}
            {activeTab === 'projects' && <ProjectsApprovalPanel onViewDetail={handleViewDetail} />}
            {activeTab === 'achievements' && <AchievementsPanel onViewDetail={handleViewDetail} />}
            {activeTab === 'blogs' && <BlogsManagementPanel onViewDetail={handleViewDetail} />}
            {activeTab === 'resources' && <AddResourcePanel />}
            {activeTab === 'roadmaps' && <AdminRoadmapPanel />}
            {activeTab === 'events' && <CreateEventPanel />}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Detail Modal */}
      <DetailModal
        isOpen={!!selectedDetail}
        onClose={() => setSelectedDetail(null)}
        data={selectedDetail}
        type={modalType}
        onViewUser={(userObj) => {
          setSelectedDetail(null);
          router.push(`/profile/${userObj._id}`);
        }}
        onApprove={async (id) => {
          if (modalType === 'project') {
            await projectsAPI.approve(id);
            toast.success('Project approved for showcase! 🚀');
          } else if (modalType === 'achievement') {
            await achievementsAPI.verify(id);
            toast.success('Achievement verified! ✓');
          }
        }}
        onReject={async (id) => {
          if (modalType === 'project') {
            await projectsAPI.delete(id);
            toast.success('Project deleted');
          } else if (modalType === 'achievement') {
            await achievementsAPI.reject(id);
            toast.success('Achievement rejected');
          }
        }}
      />

    </div>
  );
}
