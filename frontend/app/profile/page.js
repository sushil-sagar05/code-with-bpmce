'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, BookOpen, Calendar, Edit3, Save, Shield, Award,
  Code2, ExternalLink, Loader2, CheckCircle2, Star, MapPin, Hash,
  Globe, Terminal, Sparkles, FolderGit2, Briefcase, Camera, Plus, Trash2,
  X
} from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { SiCodeforces, SiLeetcode } from 'react-icons/si';
import { useAuth } from '@/context/AuthContext';
import { usersAPI, achievementsAPI, projectsAPI, uploadAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import PageLoader, { SectionLoader, ButtonLoader, LogoOverlayLoader } from '@/components/ui/PageLoader';

export function SharedProfileComponent({ embedded = false, targetUser = null }) {
  const { user: currentUser, isAdmin, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();

  // Determine user to display (either passed targetUser or logged in user)
  const user = targetUser || currentUser;
  const isSelf = !targetUser || (currentUser && targetUser._id === currentUser._id);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    avatar: '',
    branch: '',
    batch: '',
    rollNumber: '',
    phone: '',
    bio: '',
    skills: '',
    portfolio: '',
    location: '',
    github: '',
    linkedin: '',
    leetcode: '',
    codeforces: '',
    experience: [],
  });

  const [expInput, setExpInput] = useState({ role: '', company: '', duration: '', description: '' });

  const [myProjects, setMyProjects] = useState([]);
  const [myAchievements, setMyAchievements] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !currentUser && !targetUser) router.push('/login');
  }, [currentUser, targetUser, authLoading, router]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        avatar: user.avatar || '',
        branch: user.branch || '',
        batch: user.batch || '',
        rollNumber: user.rollNumber || '',
        phone: user.phone || '',
        bio: user.bio || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : user.skills || '',
        portfolio: user.portfolio || '',
        location: user.location || 'Madhepura, Bihar',
        github: user.github || '',
        linkedin: user.linkedin || '',
        leetcode: user.leetcode || '',
        codeforces: user.codeforces || '',
        experience: Array.isArray(user.experience) ? user.experience : [],
      });

      setLoadingData(true);
      Promise.allSettled([
        projectsAPI.getAll({ addedBy: user._id }),
        achievementsAPI.getAll({ user: user._id }),
      ]).then(([p, a]) => {
        if (p.value?.data?.data) setMyProjects(p.value.data.data.filter(x => x.addedBy?._id === user._id || x.addedBy === user._id));
        if (a.value?.data?.data) setMyAchievements(a.value.data.data);
      }).finally(() => setLoadingData(false));
    }
  }, [user]);

  const addExperienceItem = () => {
    if (!expInput.role || !expInput.company) {
      toast.error('Please specify both role and company name');
      return;
    }
    setForm(prev => ({
      ...prev,
      experience: [...prev.experience, expInput],
    }));
    setExpInput({ role: '', company: '', duration: '', description: '' });
  };

  const removeExperienceItem = (index) => {
    setForm(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setAvatarUploading(true);
    try {
      const { data } = await uploadAPI.uploadImage(file);
      setForm(prev => ({ ...prev, avatar: data.url }));
      toast.success('Profile picture uploaded!');
    } catch (err) {
      toast.error('Failed to upload image. Try again.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      };
      await usersAPI.update(user._id, payload);
      await refreshUser();
      setIsEditing(false);
      toast.success('Profile updated successfully! ✨');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return <PageLoader text="Loading profile details..." />;
  }

  const skillsList = Array.isArray(user.skills) ? user.skills : (user.skills ? user.skills.split(',') : []);

  return (
    <div className="space-y-6">

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 sm:p-8 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B00]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* Avatar Pic / Initial — shows form.avatar live while editing */}
            <div className="relative group">
              {(isEditing ? form.avatar : user.avatar) ? (
                <img src={isEditing ? form.avatar : user.avatar} alt={user.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-[#FF6B00]/30 shadow-xl flex-shrink-0" />
              ) : (
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-3xl font-bold font-display border shadow-xl flex-shrink-0 ${
                  isAdmin ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-[#FF6B00]/10 border-[#FF6B00]/30 text-[#FF6B00]'
                }`}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
              )}
              {avatarUploading && (
                <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                  <LogoOverlayLoader />
                </div>
              )}
            </div>

            {/* Main Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{user.name}</h1>
                {isAdmin && (
                  <span className="font-chiller text-base text-red-400 bg-red-500/10 border border-red-500/30 px-2.5 py-0.5 rounded uppercase tracking-wider">
                    ADMIN
                  </span>
                )}
                {user.isVerified && (
                  <span className="font-mono text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Student
                  </span>
                )}
              </div>

              <p className="text-[#777] font-dosis text-sm">{user.email}</p>

              <div className="flex items-center gap-2 pt-1 flex-wrap font-mono text-xs text-[#666]">
                {user.rollNumber && <span className="bg-[#1a1a1a] border border-[#2a2a2a] px-2.5 py-0.5 rounded text-[#aaa]">Roll: {user.rollNumber}</span>}
                {user.branch && <span className="bg-[#1a1a1a] border border-[#2a2a2a] px-2.5 py-0.5 rounded text-[#aaa]">{user.branch}</span>}
                {user.batch && <span className="bg-[#1a1a1a] border border-[#2a2a2a] px-2.5 py-0.5 rounded text-[#aaa]">Batch {user.batch}</span>}
                <span className="text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2.5 py-0.5 rounded font-bold">
                  {user.points || 0} Club Points
                </span>
              </div>
            </div>
          </div>

          {/* Edit Action Button — only shown when viewing own profile */}
          {isSelf && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-dosis font-bold text-sm transition-all shadow-lg ${
                isEditing
                  ? 'bg-[#1f1f1f] text-[#888] hover:text-white border border-[#2a2a2a]'
                  : 'btn-primary'
              }`}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" /> Cancel Edit
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" /> Edit Full Profile
                </>
              )}
            </button>
          )}
        </div>

        {/* Bio */}
        {user.bio && !isEditing && (
          <p className="mt-6 pt-6 border-t border-[#1f1f1f] text-[#999] font-dosis text-base leading-relaxed">
            {user.bio}
          </p>
        )}
      </motion.div>

      {/* Edit Form */}
      {isEditing ? (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4">
            <h2 className="font-display text-xl font-bold text-white">Edit Profile Details</h2>
            <span className="font-mono text-xs text-[#555]">All fields synced with your student account</span>
          </div>

          {/* Profile Picture Upload */}
          <div>
            <h3 className="text-[#FF6B00] font-dosis font-bold text-sm mb-3 uppercase tracking-wider">Profile Picture</h3>
            <div className="flex items-center gap-5">
              {/* Preview */}
              <div className="relative flex-shrink-0">
                {form.avatar ? (
                  <img src={form.avatar} alt="Avatar Preview" className="w-20 h-20 rounded-2xl object-cover border border-[#FF6B00]/40 shadow-lg" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/30 flex items-center justify-center text-3xl font-bold font-display text-[#FF6B00]">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                )}
                {avatarUploading && (
                  <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                    <LogoOverlayLoader />
                  </div>
                )}
              </div>
              {/* Upload Button */}
              <div className="flex-1">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#FF6B00]/40 text-[#FF6B00] font-dosis font-semibold text-sm hover:bg-[#FF6B00]/10 transition-all disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                  {avatarUploading ? 'Uploading...' : form.avatar ? 'Change Photo' : 'Upload Photo'}
                </button>
                <p className="text-[#555] font-mono text-[10px] mt-2">JPG, PNG, WEBP — max 5MB. Auto-compressed.</p>
                {form.avatar && (
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, avatar: '' }))}
                    className="mt-1 text-red-400/70 hover:text-red-400 font-mono text-[10px] underline"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div>
            <h3 className="text-[#FF6B00] font-dosis font-bold text-sm mb-3 uppercase tracking-wider">Academic & Personal Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
              </div>
              <div>
                <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">College Roll Number</label>
                <input type="text" value={form.rollNumber} onChange={e => setForm({...form, rollNumber: e.target.value})} placeholder="e.g. 21105123001" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
              </div>
              <div>
                <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Branch</label>
                <input type="text" value={form.branch} onChange={e => setForm({...form, branch: e.target.value})} placeholder="e.g. Computer Science & Engineering" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
              </div>
              <div>
                <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Batch Year</label>
                <input type="text" value={form.batch} onChange={e => setForm({...form, batch: e.target.value})} placeholder="e.g. 2025" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
              </div>
              <div>
                <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 9876543210" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
              </div>
              <div>
                <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Location</label>
                <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Madhepura, Bihar" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
              </div>
            </div>
          </div>

          {/* Technical Skills & Bio */}
          <div>
            <h3 className="text-[#FF6B00] font-dosis font-bold text-sm mb-3 uppercase tracking-wider">Skills & About</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Technical Skills (comma separated)</label>
                <input type="text" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder="React, Node.js, Python, C++, Data Structures, Tailwind" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
              </div>
              <div>
                <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Short Bio</label>
                <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={3} placeholder="Tell the club about your passions and coding goals..." className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none resize-none" />
              </div>
            </div>
          </div>

          {/* Work / Internship Experience */}
          <div>
            <h3 className="text-[#FF6B00] font-dosis font-bold text-sm mb-3 uppercase tracking-wider">Work / Internship Experience</h3>
            <div className="space-y-3">
              {form.experience.map((exp, i) => (
                <div key={i} className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-white font-dosis font-bold text-sm">{exp.role} <span className="text-[#FF6B00]">@ {exp.company}</span></p>
                    <p className="text-[#777] font-mono text-[10px]">{exp.duration}</p>
                    {exp.description && <p className="text-[#888] font-dosis text-xs mt-1">{exp.description}</p>}
                  </div>
                  <button type="button" onClick={() => removeExperienceItem(i)} className="text-[#666] hover:text-red-400 p-1 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-4 space-y-3">
                <p className="text-white font-dosis font-semibold text-xs">Add Experience Item</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input type="text" placeholder="Role (e.g. SDE Intern)" value={expInput.role} onChange={e => setExpInput({...expInput, role: e.target.value})} className="bg-[#111] border border-[#1f1f1f] rounded px-3 py-1.5 text-white text-xs font-dosis outline-none focus:border-[#FF6B00]" />
                  <input type="text" placeholder="Company (e.g. Microsoft)" value={expInput.company} onChange={e => setExpInput({...expInput, company: e.target.value})} className="bg-[#111] border border-[#1f1f1f] rounded px-3 py-1.5 text-white text-xs font-dosis outline-none focus:border-[#FF6B00]" />
                  <input type="text" placeholder="Duration (e.g. May - Jul 2024)" value={expInput.duration} onChange={e => setExpInput({...expInput, duration: e.target.value})} className="bg-[#111] border border-[#1f1f1f] rounded px-3 py-1.5 text-white text-xs font-dosis outline-none focus:border-[#FF6B00]" />
                </div>
                <input type="text" placeholder="Short description of work..." value={expInput.description} onChange={e => setExpInput({...expInput, description: e.target.value})} className="w-full bg-[#111] border border-[#1f1f1f] rounded px-3 py-1.5 text-white text-xs font-dosis outline-none focus:border-[#FF6B00]" />
                <button type="button" onClick={addExperienceItem} className="flex items-center gap-1 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-[#ddd] px-3 py-1.5 rounded text-xs font-dosis font-semibold transition-colors">
                  <Plus className="w-3.5 h-3.5 text-[#FF6B00]" /> Add Experience
                </button>
              </div>
            </div>
          </div>

          {/* Social & Coding Handles */}
          <div>
            <h3 className="text-[#FF6B00] font-dosis font-bold text-sm mb-3 uppercase tracking-wider">Portfolio & Social Profiles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Personal Portfolio URL</label>
                <input type="url" value={form.portfolio} onChange={e => setForm({...form, portfolio: e.target.value})} placeholder="https://myportfolio.dev" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
              </div>
              <div>
                <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">GitHub Profile URL</label>
                <input type="url" value={form.github} onChange={e => setForm({...form, github: e.target.value})} placeholder="https://github.com/username" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
              </div>
              <div>
                <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">LinkedIn Profile URL</label>
                <input type="url" value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} placeholder="https://linkedin.com/in/username" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
              </div>
              <div>
                <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">LeetCode Username</label>
                <input type="text" value={form.leetcode} onChange={e => setForm({...form, leetcode: e.target.value})} placeholder="username" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
              </div>
              <div>
                <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Codeforces Handle</label>
                <input type="text" value={form.codeforces} onChange={e => setForm({...form, codeforces: e.target.value})} placeholder="handle" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-[#1f1f1f]">
            <button type="submit" disabled={saving} className="btn-primary py-3 px-8 text-sm">
              {saving ? <ButtonLoader text="Saving Profile..." /> : <><Save className="w-4 h-4" /> Save Profile</>}
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl border border-[#2a2a2a] text-[#888] hover:text-white font-dosis font-semibold text-sm transition-colors">
              Cancel
            </button>
          </div>
        </motion.form>
      ) : (
        <div className="space-y-6">

          {/* Overview Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
              <p className="text-[#555] font-mono text-[10px] uppercase">Roll Number</p>
              <p className="text-white font-dosis font-bold text-base mt-0.5">{user.rollNumber || 'Not set'}</p>
            </div>
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
              <p className="text-[#555] font-mono text-[10px] uppercase">Phone</p>
              <p className="text-white font-dosis font-bold text-base mt-0.5">{user.phone || 'Not set'}</p>
            </div>
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
              <p className="text-[#555] font-mono text-[10px] uppercase">Location</p>
              <p className="text-white font-dosis font-bold text-base mt-0.5">{user.location || 'Madhepura, Bihar'}</p>
            </div>
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4">
              <p className="text-[#555] font-mono text-[10px] uppercase">Portfolio</p>
              {user.portfolio ? (
                <a href={user.portfolio} target="_blank" rel="noopener noreferrer" className="text-[#FF6B00] font-dosis font-bold text-base hover:underline flex items-center gap-1 mt-0.5 truncate block">
                  Link <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <p className="text-[#444] font-dosis font-bold text-base mt-0.5">Not set</p>
              )}
            </div>
          </div>

          {/* Work Experience Section */}
          {user.experience && user.experience.length > 0 && (
            <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#FF6B00]" /> Work & Internship Experience
              </h2>
              <div className="space-y-4">
                {user.experience.map((exp, idx) => (
                  <div key={idx} className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-dosis font-bold text-base">{exp.role} <span className="text-[#FF6B00]">@ {exp.company}</span></h3>
                      <span className="font-mono text-xs text-[#666]">{exp.duration}</span>
                    </div>
                    {exp.description && <p className="text-[#888] font-dosis text-xs mt-2">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Skills */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
            <h2 className="font-display text-lg font-bold text-white mb-3">Skills & Tech Stack</h2>
            {skillsList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skillsList.map((s, i) => (
                  <span key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#ddd] font-mono text-xs px-3 py-1 rounded-md">
                    {s.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[#555] font-dosis text-sm">No skills added yet. Click &quot;Edit Full Profile&quot; to add skills.</p>
            )}
          </div>

          {/* Social & Competitive Programming Handles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-5 flex items-center gap-3">
              <FaGithub className="w-5 h-5 text-white flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[#555] font-mono text-[10px] uppercase">GitHub</p>
                {user.github ? (
                  <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-[#FF6B00] font-dosis font-semibold text-sm hover:underline flex items-center gap-1 truncate block">
                    Profile <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                ) : <p className="text-[#444] font-dosis text-sm">Not connected</p>}
              </div>
            </div>

            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-5 flex items-center gap-3">
              <FaLinkedin className="w-5 h-5 text-[#0077b5] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[#555] font-mono text-[10px] uppercase">LinkedIn</p>
                {user.linkedin ? (
                  <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#FF6B00] font-dosis font-semibold text-sm hover:underline flex items-center gap-1 truncate block">
                    Profile <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                ) : <p className="text-[#444] font-dosis text-sm">Not connected</p>}
              </div>
            </div>

            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-5 flex items-center gap-3">
              <SiLeetcode className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[#555] font-mono text-[10px] uppercase">LeetCode</p>
                {user.leetcode ? <p className="text-white font-dosis font-semibold text-sm truncate">@{user.leetcode}</p> : <p className="text-[#444] font-dosis text-sm">Not connected</p>}
              </div>
            </div>

            <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-5 flex items-center gap-3">
              <SiCodeforces className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[#555] font-mono text-[10px] uppercase">Codeforces</p>
                {user.codeforces ? <p className="text-white font-dosis font-semibold text-sm truncate">@{user.codeforces}</p> : <p className="text-[#444] font-dosis text-sm">Not connected</p>}
              </div>
            </div>
          </div>

          {/* My Submitted Projects */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-white">My Projects</h2>
              <span className="font-mono text-xs text-[#555]">{myProjects.length} projects</span>
            </div>
            {loadingData ? (
              <SectionLoader text="Loading submitted projects..." />
            ) : myProjects.length === 0 ? (
              <p className="text-[#555] font-dosis text-center py-8">No projects submitted yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myProjects.map((p) => (
                  <div key={p._id} className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-dosis font-bold text-base">{p.title}</h3>
                      {p.isFeatured ? (
                        <span className="font-mono text-[9px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">Approved</span>
                      ) : (
                        <span className="font-mono text-[9px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">Pending Approval</span>
                      )}
                    </div>
                    <p className="text-[#777] font-dosis text-xs line-clamp-2">{p.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Achievements */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-white">My Achievements</h2>
              <span className="font-mono text-xs text-[#555]">{myAchievements.length} total</span>
            </div>
            {loadingData ? (
              <SectionLoader text="Loading achievements..." />
            ) : myAchievements.length === 0 ? (
              <p className="text-[#555] font-dosis text-center py-8">No achievements submitted yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myAchievements.map((a) => (
                  <div key={a._id} className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2 py-0.5 rounded uppercase">{a.type}</span>
                      {a.isVerified ? (
                        <span className="font-mono text-[9px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">✓ Verified</span>
                      ) : (
                        <span className="font-mono text-[9px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">Pending Verification</span>
                      )}
                    </div>
                    <p className="text-white font-dosis font-bold text-base pt-1">{a.title}</p>
                    <p className="text-[#777] font-dosis text-xs">{a.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16 grid-bg">
      <div className="container-custom max-w-4xl mx-auto">
        <SharedProfileComponent />
      </div>
    </div>
  );
}
