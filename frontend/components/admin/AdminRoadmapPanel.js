'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit3, MoveUp, MoveDown, BookOpen, Video, FileText, ExternalLink, Code2, Save, X, ChevronDown, ChevronRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { roadmapsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { SectionLoader, ButtonLoader } from '@/components/ui/PageLoader';

export default function AdminRoadmapPanel() {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'web-dev',
    difficulty: 'Beginner',
    estimatedTime: '3 months',
    color: '#FF6B00',
  });

  // Start with 1 default Chapter if empty
  const [chapters, setChapters] = useState([
    { title: 'Chapter 1: Getting Started', description: '', resources: [], questions: [] }
  ]);
  const [editingRoadmapId, setEditingRoadmapId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingRoadmaps, setExistingRoadmaps] = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(true);

  // Input states for adding Resource / Question
  const [addingResourceToChapterIdx, setAddingResourceToChapterIdx] = useState(null);
  const [resourceInput, setResourceInput] = useState({ title: '', url: '', otherUrl: '', type: 'article' });
  const [addingQuestionTo, setAddingQuestionTo] = useState(null); // { chIdx, resIdx }
  const [questionInput, setQuestionInput] = useState({ title: '', platform: 'LeetCode', difficulty: 'Easy', url: '' });

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = () => {
    setLoadingExisting(true);
    roadmapsAPI.getAll()
      .then(({ data }) => setExistingRoadmaps(data.data || []))
      .catch(() => toast.error('Failed to load existing roadmaps'))
      .finally(() => setLoadingExisting(false));
  };

  const handleSaveRoadmap = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Roadmap title is required'); return; }
    if (chapters.length === 0) { toast.error('Add at least one chapter to the roadmap'); return; }

    setLoading(true);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const formattedChapters = chapters.map((ch, i) => ({
        chapterNumber: i + 1,
        title: ch.title || `Chapter ${i + 1}`,
        description: ch.description || '',
        order: i,
        resources: (ch.resources || []).map((res) => ({
          title: res.title,
          url: res.url || '',
          type: res.type || 'article',
          questions: Array.isArray(res.questions) ? res.questions : [],
        })),
        questions: Array.isArray(ch.questions) ? ch.questions : [],
      }));

      const payload = {
        ...form,
        slug,
        chapters: formattedChapters,
      };

      if (editingRoadmapId) {
        await roadmapsAPI.update(editingRoadmapId, payload);
        toast.success('🗺️ Roadmap updated successfully!');
      } else {
        await roadmapsAPI.create(payload);
        toast.success('🗺️ Roadmap published successfully!');
      }

      resetForm();
      fetchRoadmaps();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save roadmap');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: '', slug: '', description: '', category: 'web-dev', difficulty: 'Beginner', estimatedTime: '3 months', color: '#FF6B00' });
    setChapters([{ title: 'Chapter 1: Getting Started', description: '', resources: [], questions: [] }]);
    setEditingRoadmapId(null);
  };

  const handleEditClick = (rm) => {
    setEditingRoadmapId(rm._id);
    setForm({
      title: rm.title || '',
      slug: rm.slug || '',
      description: rm.description || rm.desc || '',
      category: rm.category || 'web-dev',
      difficulty: rm.difficulty || 'Beginner',
      estimatedTime: rm.estimatedTime || '3 months',
      color: rm.color || '#FF6B00',
    });

    if (Array.isArray(rm.chapters) && rm.chapters.length > 0) {
      setChapters(rm.chapters.map(ch => ({
        ...ch,
        resources: ch.resources || [],
        questions: ch.questions || []
      })));
    } else if (Array.isArray(rm.nodes) && rm.nodes.length > 0) {
      // Legacy conversion
      setChapters(rm.nodes.map((n, i) => ({
        chapterNumber: i + 1,
        title: n.title,
        description: n.description || n.desc || '',
        resources: (n.resources || []).map(r => ({ ...r, questions: [] })),
        questions: []
      })));
    } else {
      setChapters([{ title: 'Chapter 1: Getting Started', description: '', resources: [], questions: [] }]);
    }
  };

  // Chapter Operations: Click "+ Create New Chapter" instantly creates a new chapter card
  const addChapter = () => {
    setChapters(prev => [
      ...prev,
      { title: `Chapter ${prev.length + 1}`, description: '', resources: [], questions: [] }
    ]);
    toast.success(`Chapter ${chapters.length + 1} added!`);
  };

  const removeChapter = (cIdx) => setChapters(prev => prev.filter((_, i) => i !== cIdx));

  const moveChapter = (cIdx, dir) => {
    setChapters(prev => {
      const arr = [...prev];
      const target = cIdx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[cIdx], arr[target]] = [arr[target], arr[cIdx]];
      return arr;
    });
  };

  // Resource Operations
  const addResource = (cIdx) => {
    if (!resourceInput.title.trim()) { toast.error('Resource title is required'); return; }
    setChapters(prev => prev.map((ch, idx) => idx === cIdx ? {
      ...ch,
      resources: [...(ch.resources || []), { ...resourceInput, questions: [] }],
    } : ch));
    setResourceInput({ title: '', url: '', otherUrl: '', type: 'article' });
    setAddingResourceToChapterIdx(null);
  };

  const removeResource = (cIdx, rIdx) => {
    setChapters(prev => prev.map((ch, idx) => idx === cIdx ? {
      ...ch,
      resources: (ch.resources || []).filter((_, i) => i !== rIdx),
    } : ch));
  };

  // Question Operations (Nested under Topic)
  const addQuestion = (cIdx, rIdx) => {
    if (!questionInput.title.trim() || !questionInput.url.trim()) { toast.error('Question title and URL required'); return; }
    setChapters(prev => prev.map((ch, chI) => chI === cIdx ? {
      ...ch,
      resources: (ch.resources || []).map((res, resI) => resI === rIdx ? {
        ...res,
        questions: [...(res.questions || []), { ...questionInput }],
      } : res),
    } : ch));
    setQuestionInput({ title: '', platform: 'LeetCode', difficulty: 'Easy', url: '' });
    setAddingQuestionTo(null);
  };

  const removeQuestion = (cIdx, rIdx, qIdx) => {
    setChapters(prev => prev.map((ch, chI) => chI === cIdx ? {
      ...ch,
      resources: (ch.resources || []).map((res, resI) => resI === rIdx ? {
        ...res,
        questions: (res.questions || []).filter((_, qI) => qI !== qIdx),
      } : res),
    } : ch));
  };

  // Direct Chapter Question Operations
  const [addingDirectQuestionToChapterIdx, setAddingDirectQuestionToChapterIdx] = useState(null);
  const [directQuestionInput, setDirectQuestionInput] = useState({ title: '', platform: 'LeetCode', difficulty: 'Easy', url: '' });

  const addDirectChapterQuestion = (cIdx) => {
    if (!directQuestionInput.title.trim() || !directQuestionInput.url.trim()) { toast.error('Question title and URL required'); return; }
    setChapters(prev => prev.map((ch, idx) => idx === cIdx ? {
      ...ch,
      questions: [...(ch.questions || []), { ...directQuestionInput }],
    } : ch));
    setDirectQuestionInput({ title: '', platform: 'LeetCode', difficulty: 'Easy', url: '' });
    setAddingDirectQuestionToChapterIdx(null);
  };

  const removeDirectChapterQuestion = (cIdx, qIdx) => {
    setChapters(prev => prev.map((ch, idx) => idx === cIdx ? {
      ...ch,
      questions: (ch.questions || []).filter((_, i) => i !== qIdx),
    } : ch));
  };

  const deleteRoadmap = async (id) => {
    if (!confirm('Are you sure you want to delete this roadmap?')) return;
    try {
      await roadmapsAPI.delete(id);
      setExistingRoadmaps(prev => prev.filter(r => r._id !== id));
      toast.success('Roadmap deleted');
      if (editingRoadmapId === id) resetForm();
    } catch {
      toast.error('Failed to delete roadmap');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Learning Roadmap Manager</h2>
          <p className="text-[#666] font-dosis text-sm">Build NamasteDev style vertical learning tracks with Chapters, Resources, and Coding Questions.</p>
        </div>
        <span className="font-mono text-xs text-[#555]">{existingRoadmaps.length} roadmaps published</span>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSaveRoadmap} className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4">
          <h3 className="font-dosis font-bold text-lg text-white">
            {editingRoadmapId ? '✏️ Edit Roadmap' : '➕ Create New Roadmap'}
          </h3>
          {editingRoadmapId && (
            <button type="button" onClick={resetForm} className="text-xs font-dosis text-[#888] hover:text-white flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Cancel Edit Mode
            </button>
          )}
        </div>

        {/* Roadmap General Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Roadmap Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="e.g. Namaste React & Modern Web Dev" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
          </div>
          <div>
            <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Category *</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none">
              {[['web-dev','Web Development'],['dsa','DSA & Algorithms'],['ai-ml','AI & Machine Learning'],['genai','Generative AI'],['web3','Web3 & Blockchain'],['app-dev','App Development'],['cyber-security','Cyber Security'],['devops','DevOps & Cloud'],['cloud','Cloud Computing']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Description *</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={3} placeholder="Provide a detailed roadmap description..." className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none resize-none" />
          </div>
          <div>
            <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Difficulty</label>
            <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none">
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </div>
          <div>
            <label className="text-[#888] font-mono text-[10px] uppercase block mb-1">Estimated Time</label>
            <input type="text" value={form.estimatedTime} onChange={e => setForm({...form, estimatedTime: e.target.value})} placeholder="e.g. 3 months" className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:border-[#FF6B00] outline-none" />
          </div>
        </div>

        {/* Chapters Builder */}
        <div className="border-t border-[#1f1f1f] pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-dosis font-bold text-white text-base flex items-center gap-2">
              <span>Chapters Builder</span>
              <span className="font-mono text-[10px] text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2.5 py-0.5 rounded-full">{chapters.length} Chapters</span>
            </h4>
            <button type="button" onClick={addChapter} className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5 shadow-md">
              <Plus className="w-4 h-4" /> Add / Create Chapter
            </button>
          </div>

          {/* Chapter Cards List */}
          <div className="space-y-5 pt-2">
            {chapters.map((ch, cIdx) => (
              <div key={cIdx} className="bg-[#0d0d0d] border border-[#1f1f1f] hover:border-[#2a2a2a] rounded-2xl p-5 space-y-4 transition-all">
                
                {/* Chapter Editable Row Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#1a1a1a] pb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-8 h-8 rounded-full bg-[#FF6B00] text-black font-mono font-bold text-sm flex items-center justify-center flex-shrink-0 mt-1">
                      {cIdx + 1}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div>
                        <label className="text-[#888] font-mono text-[9px] uppercase block mb-1">Chapter Title *</label>
                        <input
                          type="text"
                          value={ch.title}
                          onChange={e => {
                            const newTitle = e.target.value;
                            setChapters(prev => prev.map((c, i) => i === cIdx ? { ...c, title: newTitle } : c));
                          }}
                          placeholder={`e.g. Chapter ${cIdx + 1}: React Fundamentals`}
                          className="w-full bg-[#121212] border border-[#222] rounded-lg px-3 py-2 text-white font-dosis font-bold text-base outline-none focus:border-[#FF6B00]"
                        />
                      </div>
                      <div>
                        <label className="text-[#888] font-mono text-[9px] uppercase block mb-1">Chapter Description (optional)</label>
                        <input
                          type="text"
                          value={ch.description || ''}
                          onChange={e => {
                            const newDesc = e.target.value;
                            setChapters(prev => prev.map((c, i) => i === cIdx ? { ...c, description: newDesc } : c));
                          }}
                          placeholder="Brief summary of what this chapter covers..."
                          className="w-full bg-[#121212] border border-[#222] rounded-lg px-3 py-1.5 text-white font-dosis text-xs outline-none focus:border-[#FF6B00]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-start">
                    <button type="button" onClick={() => moveChapter(cIdx, -1)} disabled={cIdx === 0} className="p-2 rounded-lg bg-[#141414] text-[#888] hover:text-white disabled:opacity-20 text-xs">▲</button>
                    <button type="button" onClick={() => moveChapter(cIdx, 1)} disabled={cIdx === chapters.length - 1} className="p-2 rounded-lg bg-[#141414] text-[#888] hover:text-white disabled:opacity-20 text-xs">▼</button>
                    <button type="button" onClick={() => removeChapter(cIdx)} disabled={chapters.length <= 1} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-30 text-xs" title="Delete Chapter">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Chapter Content Options Header */}
                <div className="space-y-3 pl-4 sm:pl-8 border-l border-[#1a1a1a]">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[#777] font-mono text-[10px] uppercase">
                      Chapter Content ({(ch.resources || []).length} Topics, {(ch.questions || []).length} Direct Questions)
                    </span>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setAddingResourceToChapterIdx(cIdx)} className="text-[#FF6B00] hover:underline font-dosis font-semibold text-xs flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Topic / Resource
                      </button>
                      <button type="button" onClick={() => setAddingDirectQuestionToChapterIdx(cIdx)} className="text-amber-400 hover:underline font-dosis font-semibold text-xs flex items-center gap-1">
                        <Code2 className="w-3 h-3" /> Add Direct Question
                      </button>
                    </div>
                  </div>

                  {/* Add Direct Question Form Box */}
                  {addingDirectQuestionToChapterIdx === cIdx && (
                    <div className="bg-[#141414] border border-[#222] rounded-xl p-4 space-y-3">
                      <p className="text-amber-400 font-mono text-[10px] uppercase font-bold">Add Direct Chapter Question</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input type="text" placeholder="Question Title (e.g. Two Sum)" value={directQuestionInput.title} onChange={e => setDirectQuestionInput({...directQuestionInput, title: e.target.value})} className="bg-[#0a0a0a] border border-[#222] rounded px-3 py-1.5 text-white text-xs font-dosis outline-none focus:border-amber-400" />
                        <select value={directQuestionInput.platform} onChange={e => setDirectQuestionInput({...directQuestionInput, platform: e.target.value})} className="bg-[#0a0a0a] border border-[#222] rounded px-3 py-1.5 text-white text-xs font-dosis outline-none">
                          <option>LeetCode</option>
                          <option>CodeChef</option>
                          <option>Codeforces</option>
                          <option>GFG</option>
                          <option>HackerRank</option>
                          <option>Other</option>
                        </select>
                        <select value={directQuestionInput.difficulty} onChange={e => setDirectQuestionInput({...directQuestionInput, difficulty: e.target.value})} className="bg-[#0a0a0a] border border-[#222] rounded px-3 py-1.5 text-white text-xs font-dosis outline-none">
                          <option>Easy</option>
                          <option>Medium</option>
                          <option>Hard</option>
                        </select>
                      </div>
                      <input type="url" placeholder="Question URL (e.g. https://leetcode.com/problems/two-sum)" value={directQuestionInput.url} onChange={e => setDirectQuestionInput({...directQuestionInput, url: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#222] rounded px-3 py-1.5 text-white text-xs font-mono outline-none focus:border-amber-400" />
                      <div className="flex gap-2 pt-1">
                        <button type="button" onClick={() => addDirectChapterQuestion(cIdx)} className="btn-primary text-xs py-1.5 px-4 bg-amber-500 hover:bg-amber-400 text-black border-none font-bold">
                          Save Question
                        </button>
                        <button type="button" onClick={() => setAddingDirectQuestionToChapterIdx(null)} className="text-xs text-[#666] hover:text-white px-2">Cancel</button>
                      </div>
                    </div>
                  )}

                  {/* Add Resource Form Box */}
                  {addingResourceToChapterIdx === cIdx && (
                    <div className="bg-[#141414] border border-[#222] rounded-xl p-4 space-y-3">
                      <p className="text-[#FF6B00] font-mono text-[10px] uppercase font-bold">Add Topic & Resource Links</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-[#888] font-mono text-[9px] uppercase block mb-1">Resource / Topic Title *</label>
                          <input type="text" placeholder="e.g. Why React & JSX Deep Dive" value={resourceInput.title} onChange={e => setResourceInput({...resourceInput, title: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#222] rounded px-3 py-2 text-white text-xs font-dosis outline-none focus:border-[#FF6B00]" />
                        </div>
                        <div>
                          <label className="text-[#888] font-mono text-[9px] uppercase block mb-1">Type</label>
                          <select value={resourceInput.type} onChange={e => setResourceInput({...resourceInput, type: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#222] rounded px-3 py-2 text-white text-xs font-dosis outline-none">
                            <option value="video">Video (🎥)</option>
                            <option value="article">Article (📄)</option>
                            <option value="docs">Docs (📚)</option>
                            <option value="github">GitHub (🐙)</option>
                            <option value="external">External Link (🔗)</option>
                            <option value="question">Coding Question (🧩)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[#888] font-mono text-[9px] uppercase block mb-1">Primary Resource URL</label>
                          <input type="url" placeholder="https://youtube.com/watch?v=... or https://docs..." value={resourceInput.url} onChange={e => setResourceInput({...resourceInput, url: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#222] rounded px-3 py-2 text-white text-xs font-mono outline-none focus:border-[#FF6B00]" />
                        </div>
                        <div>
                          <label className="text-[#888] font-mono text-[9px] uppercase block mb-1">Other / Additional Link URL (optional)</label>
                          <input type="url" placeholder="https://github.com/... or reference article" value={resourceInput.otherUrl || ''} onChange={e => setResourceInput({...resourceInput, otherUrl: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#222] rounded px-3 py-2 text-white text-xs font-mono outline-none focus:border-[#FF6B00]" />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button type="button" onClick={() => addResource(cIdx)} className="btn-primary text-xs py-1.5 px-4">
                          <Plus className="w-3.5 h-3.5 inline mr-1" /> Add Topic / Resource
                        </button>
                        <button type="button" onClick={() => setAddingResourceToChapterIdx(null)} className="text-xs text-[#666] hover:text-white px-2">Cancel</button>
                      </div>
                    </div>
                  )}

                  {/* Existing Resources */}
                  {(ch.resources || []).map((res, rIdx) => (
                    <div key={rIdx} className="bg-[#121212] border border-[#1a1a1a] rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2 py-0.5 rounded uppercase">{res.type}</span>
                          <span className="text-white font-dosis font-bold text-sm">{res.title}</span>
                          {res.url && <a href={res.url} target="_blank" rel="noreferrer" className="text-[#666] hover:text-white text-xs"><ExternalLink className="w-3 h-3" /></a>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setAddingQuestionTo({ chIdx: cIdx, resIdx: rIdx })} className="text-xs text-[#FF6B00] hover:underline font-mono">
                            + Add Question
                          </button>
                          <button type="button" onClick={() => removeResource(cIdx, rIdx)} className="text-red-400/60 hover:text-red-400 text-xs">×</button>
                        </div>
                      </div>

                      {/* Add Question Form Box */}
                      {addingQuestionTo?.chIdx === cIdx && addingQuestionTo?.resIdx === rIdx && (
                        <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded p-3 space-y-2">
                          <p className="text-[#888] font-mono text-[10px] uppercase">Attach Coding Question</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input type="text" placeholder="Question Title (e.g. Two Sum)" value={questionInput.title} onChange={e => setQuestionInput({...questionInput, title: e.target.value})} className="bg-[#121212] border border-[#222] rounded px-2.5 py-1 text-white text-xs font-dosis outline-none" />
                            <select value={questionInput.platform} onChange={e => setQuestionInput({...questionInput, platform: e.target.value})} className="bg-[#121212] border border-[#222] rounded px-2.5 py-1 text-white text-xs font-dosis outline-none">
                              <option>LeetCode</option>
                              <option>CodeChef</option>
                              <option>Codeforces</option>
                              <option>GFG</option>
                              <option>HackerRank</option>
                              <option>Other</option>
                            </select>
                            <select value={questionInput.difficulty} onChange={e => setQuestionInput({...questionInput, difficulty: e.target.value})} className="bg-[#121212] border border-[#222] rounded px-2.5 py-1 text-white text-xs font-dosis outline-none">
                              <option>Easy</option>
                              <option>Medium</option>
                              <option>Hard</option>
                            </select>
                          </div>
                          <input type="url" placeholder="Question URL (e.g. https://leetcode.com/problems/two-sum)" value={questionInput.url} onChange={e => setQuestionInput({...questionInput, url: e.target.value})} className="w-full bg-[#121212] border border-[#222] rounded px-2.5 py-1 text-white text-xs font-mono outline-none" />
                          <div className="flex gap-2">
                            <button type="button" onClick={() => addQuestion(cIdx, rIdx)} className="btn-primary text-[10px] py-1 px-3">Save Question</button>
                            <button type="button" onClick={() => setAddingQuestionTo(null)} className="text-[10px] text-[#666] hover:text-white">Cancel</button>
                          </div>
                        </div>
                      )}

                      {/* List Attached Coding Questions */}
                      {Array.isArray(res.questions) && res.questions.length > 0 && (
                        <div className="pl-4 space-y-1.5 pt-1">
                          {res.questions.map((q, qIdx) => (
                            <div key={qIdx} className="flex items-center justify-between bg-[#0a0a0a] px-3 py-1.5 rounded text-xs font-dosis border border-[#1a1a1a]">
                              <div className="flex items-center gap-2">
                                <Code2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                                <span className="text-white font-semibold">{q.title}</span>
                                <span className="font-mono text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">{q.platform}</span>
                                <span className="font-mono text-[9px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">{q.difficulty}</span>
                              </div>
                              <button type="button" onClick={() => removeQuestion(cIdx, rIdx, qIdx)} className="text-red-400/60 hover:text-red-400 text-xs">×</button>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  ))}
                  {/* List Direct Chapter Questions */}
                  {Array.isArray(ch.questions) && ch.questions.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-amber-400 font-mono text-[10px] uppercase font-bold">Direct Practice Questions ({ch.questions.length}):</p>
                      <div className="space-y-1.5">
                        {ch.questions.map((q, qIdx) => (
                          <div key={qIdx} className="flex items-center justify-between bg-[#121212] border border-[#222] px-3.5 py-2 rounded-lg text-xs font-dosis">
                            <div className="flex items-center gap-2.5">
                              <Code2 className="w-4 h-4 text-amber-400" />
                              <span className="text-white font-bold">{q.title}</span>
                              <span className="font-mono text-[9px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">{q.platform}</span>
                              <span className="font-mono text-[9px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">{q.difficulty}</span>
                            </div>
                            <button type="button" onClick={() => removeDirectChapterQuestion(cIdx, qIdx)} className="text-red-400/60 hover:text-red-400 p-1 text-xs">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>

        </div>

        <button type="submit" disabled={loading} className="btn-primary py-3 px-8 text-sm">
          {loading ? <ButtonLoader text="Saving Roadmap..." /> : <><Save className="w-4 h-4" /> {editingRoadmapId ? 'Update Roadmap' : 'Publish Roadmap'}</>}
        </button>
      </form>

      {/* Existing Roadmaps List */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-xl text-white">Existing Published Roadmaps</h3>
        {loadingExisting ? (
          <SectionLoader text="Loading roadmaps..." />
        ) : existingRoadmaps.length === 0 ? (
          <p className="text-[#666] font-dosis text-sm">No roadmaps created yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {existingRoadmaps.map((rm) => (
              <div key={rm._id} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[9px] text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2 py-0.5 rounded uppercase">{rm.category}</span>
                    <span className="font-mono text-[9px] text-[#888]">{rm.chapters?.length || rm.nodes?.length || 0} Chapters</span>
                  </div>
                  <h4 className="text-white font-dosis font-bold text-base">{rm.title}</h4>
                  <p className="text-[#666] font-dosis text-xs line-clamp-1">{rm.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleEditClick(rm)} className="p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#FF6B00] hover:text-white transition-colors" title="Edit Roadmap">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteRoadmap(rm._id)} className="p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 hover:bg-red-500/20 transition-colors" title="Delete Roadmap">
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
