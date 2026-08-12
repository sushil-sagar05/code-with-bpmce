'use client';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Binary, Brain, Sparkles, Hexagon, Smartphone, Shield, Server, Cloud,
  CheckCircle, ArrowLeft, Map, ChevronDown, ChevronRight, Video, FileText,
  BookOpen, ExternalLink, Code2, Check, Award
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { roadmapsAPI } from '@/lib/api';
import PageLoader from '@/components/ui/PageLoader';

const iconMap = {
  'web-dev': Globe,
  dsa: Binary,
  'ai-ml': Brain,
  genai: Sparkles,
  web3: Hexagon,
  'app-dev': Smartphone,
  'cyber-security': Shield,
  devops: Server,
  cloud: Cloud,
};

const categoryColors = {
  'web-dev': '#FF6B00',
  dsa: '#60a5fa',
  'ai-ml': '#a78bfa',
  genai: '#f59e0b',
  web3: '#34d399',
  'app-dev': '#f97316',
  'cyber-security': '#ef4444',
  devops: '#38bdf8',
  cloud: '#818cf8',
};

const resourceTypeIcons = {
  video: { icon: Video, label: 'Video', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  article: { icon: FileText, label: 'Article', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  docs: { icon: BookOpen, label: 'Docs', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  github: { icon: FaGithub, label: 'GitHub', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  external: { icon: ExternalLink, label: 'Link', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  question: { icon: Code2, label: 'Coding Question', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
};

const platformColors = {
  LeetCode: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  CodeChef: 'text-amber-600 bg-amber-700/10 border-amber-700/30',
  Codeforces: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  GFG: 'text-green-400 bg-green-500/10 border-green-500/30',
  HackerRank: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Other: 'text-gray-400 bg-gray-500/10 border-gray-500/30',
};

const difficultyColors = {
  Easy: 'text-green-400 bg-green-500/10 border-green-500/30',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  Hard: 'text-red-400 bg-red-500/10 border-red-500/30',
};

export default function RoadmapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [completedItems, setCompletedItems] = useState({});

  useEffect(() => {
    if (params?.slug) {
      setLoading(true);
      roadmapsAPI.getBySlug(params.slug)
        .then(({ data }) => {
          const fetchedRoadmap = data.data || null;
          setRoadmap(fetchedRoadmap);
          // Expand all chapters by default
          if (fetchedRoadmap) {
            const initialExpanded = {};
            const chapters = getNormalizedChapters(fetchedRoadmap);
            chapters.forEach((_, idx) => { initialExpanded[idx] = true; });
            setExpandedChapters(initialExpanded);
          }
        })
        .catch(() => setRoadmap(null))
        .finally(() => setLoading(false));

      // Load student completed progress from localStorage
      if (typeof window !== 'undefined') {
        try {
          const savedProgress = localStorage.getItem(`cwb_roadmap_progress_${params.slug}`);
          if (savedProgress) setCompletedItems(JSON.parse(savedProgress));
        } catch (_) {}
      }
    }
  }, [params?.slug]);

  const toggleItemCompletion = (itemId) => {
    setCompletedItems(prev => {
      const next = { ...prev, [itemId]: !prev[itemId] };
      if (typeof window !== 'undefined' && params?.slug) {
        localStorage.setItem(`cwb_roadmap_progress_${params.slug}`, JSON.stringify(next));
      }
      return next;
    });
  };

  const toggleChapterExpand = (idx) => {
    setExpandedChapters(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Helper to normalize backend format (chapters or legacy nodes) into uniform chapters structure
  function getNormalizedChapters(rm) {
    if (!rm) return [];
    if (Array.isArray(rm.chapters) && rm.chapters.length > 0) {
      return rm.chapters;
    }
    // Fallback: Convert legacy nodes to chapters format
    if (Array.isArray(rm.nodes) && rm.nodes.length > 0) {
      return rm.nodes.map((node, i) => ({
        _id: node._id || `legacy_node_${i}`,
        chapterNumber: i + 1,
        title: node.title,
        description: node.description || node.desc || '',
        resources: Array.isArray(node.resources) ? node.resources.map((res, ri) => ({
          _id: res._id || `legacy_res_${i}_${ri}`,
          title: res.title,
          url: res.url || '',
          type: res.type || 'article',
          questions: [],
        })) : [],
      }));
    }
    return [];
  }

  const chapters = useMemo(() => getNormalizedChapters(roadmap), [roadmap]);

  // Calculate stats per chapter and overall roadmap
  const { chapterStats, overallTotal, overallCompleted, overallPercent } = useMemo(() => {
    let totalCount = 0;
    let completedCount = 0;

    const stats = chapters.map((ch, chIdx) => {
      let chTotal = 0;
      let chCompleted = 0;

      (ch.resources || []).forEach((res, resIdx) => {
        const resId = res._id || `ch_${chIdx}_res_${resIdx}`;
        chTotal += 1;
        if (completedItems[resId]) chCompleted += 1;

        (res.questions || []).forEach((q, qIdx) => {
          const qId = q._id || `ch_${chIdx}_res_${resIdx}_q_${qIdx}`;
          chTotal += 1;
          if (completedItems[qId]) chCompleted += 1;
        });
      });

      (ch.questions || []).forEach((q, qIdx) => {
        const qId = q._id || `ch_${chIdx}_direct_q_${qIdx}`;
        chTotal += 1;
        if (completedItems[qId]) chCompleted += 1;
      });

      totalCount += chTotal;
      completedCount += chCompleted;

      const chPercent = chTotal > 0 ? Math.round((chCompleted / chTotal) * 100) : 0;
      return { total: chTotal, completed: chCompleted, percent: chPercent };
    });

    const overallPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    return { chapterStats: stats, overallTotal: totalCount, overallCompleted: completedCount, overallPercent: overallPct };
  }, [chapters, completedItems]);

  if (loading) return <PageLoader text="Loading learning path roadmap..." />;

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16 grid-bg">
        <div className="container-custom max-w-xl mx-auto text-center py-20">
          <Map className="w-12 h-12 text-[#444] mx-auto mb-3" />
          <h2 className="text-white font-dosis font-bold text-xl mb-2">Roadmap Not Found</h2>
          <p className="text-[#666] font-dosis text-sm mb-6">This learning track is not created yet or may have been deleted.</p>
          <button onClick={() => router.push('/roadmaps')} className="btn-primary text-xs py-2.5 px-6">
            Browse All Roadmaps
          </button>
        </div>
      </div>
    );
  }

  const Icon = iconMap[roadmap.slug] || iconMap[roadmap.category] || Globe;
  const color = categoryColors[roadmap.slug] || categoryColors[roadmap.category] || '#FF6B00';

  return (
    <div className="pt-20 min-h-screen bg-[#07090e] text-white">
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-[#141a27] py-16 bg-[#07090e] bg-gradient-to-b from-[#111625] to-[#07090e]">
        {/* Glow Accent Background blur (Hardware accelerated for WebKit/Safari) */}
        <div
          className="absolute top-0 right-1/4 w-80 h-80 rounded-full opacity-20 pointer-events-none transform-gpu [backface-visibility:hidden] [translate:z-0]"
          style={{ background: color, filter: 'blur(80px)', WebkitFilter: 'blur(80px)' }}
        />
        
        <div className="container-custom max-w-4xl mx-auto px-4 relative z-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 font-dosis font-bold text-xs text-[#8c9cb5] hover:text-white transition-colors bg-[#0f1420] border border-[#1d263b] px-4 py-2 rounded-xl mb-6 shadow-sm hover:border-[#FF6B00]/40"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6B00]" /> Back
          </button>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex flex-col md:flex-row md:items-center gap-5 mb-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                style={{ background: `${color}15`, border: `1px solid ${color}35` }}
              >
                <Icon className="w-9 h-9" style={{ color }} />
              </div>
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="bg-[#FF6B00]/10 border border-[#FF6B00]/25 text-[#FF6B00] font-mono text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                    Learning Path
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#8c9cb5] bg-[#0f1420] border border-[#1d263b] px-3 py-1 rounded-full font-bold">
                    {roadmap.difficulty || 'Beginner'} • {roadmap.estimatedTime || '3 months'}
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">{roadmap.title}</h1>
              </div>
            </div>
            
            <p className="text-[#8c9cb5] text-base sm:text-lg font-dosis max-w-3xl leading-relaxed mt-2">{roadmap.description}</p>

            {/* Overall Roadmap Progress Header */}
            {overallTotal > 0 && (
              <div className="mt-8 bg-[#0b0e17] border border-[#141a27] rounded-2xl p-6 shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between font-dosis text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#FF6B00]" />
                    <span className="text-white font-bold text-base">Overall Path Progress</span>
                  </div>
                  <div className="font-mono text-xs text-[#8c9cb5] bg-[#0f1420] border border-[#1d263b] px-3 py-1 rounded-lg">
                    <span className="text-[#FF6B00] font-bold">{overallCompleted}</span> / {overallTotal} completed ({overallPercent}%)
                  </div>
                </div>
                <div className="w-full bg-[#141a27] h-3 rounded-full overflow-hidden p-0.5 border border-[#1d263b]">
                  <div
                    className="bg-gradient-to-r from-[#FF6B00] to-[#ff8c3a] h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${overallPercent}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* NamasteDev Vertical Learning Path Timeline */}
      {/* NamasteDev Vertical Learning Path Timeline */}
      <section className="py-12 px-4">
        <div className="container-custom max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <span>Learning Path Timeline</span>
          </h2>

          {chapters.length === 0 ? (
            <div className="text-center py-16 bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
              <p className="text-[#666] font-dosis text-sm">No chapters added to this roadmap yet.</p>
            </div>
          ) : (
            <div className="relative pl-8 sm:pl-12 space-y-10">
              {/* Vertical Connecting Line */}
              <div className="absolute left-[19px] sm:left-[23px] top-6 bottom-6 w-[2px] bg-[#1f1f1f]" />

              {chapters.map((chapter, chIdx) => {
                const isExpanded = expandedChapters[chIdx] !== false;
                const stats = chapterStats[chIdx] || { total: 0, completed: 0, percent: 0 };
                const isChapterComplete = stats.total > 0 && stats.completed === stats.total;

                return (
                  <div key={chapter._id || chIdx} className="relative">
                    
                    {/* Circular Numbered Chapter Node */}
                    <div
                      onClick={() => toggleChapterExpand(chIdx)}
                      className={`absolute -left-[39px] sm:-left-[47px] top-4 w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs z-10 transition-all cursor-pointer shadow-lg ${
                        isChapterComplete
                          ? 'bg-green-500 text-black border-2 border-green-400'
                          : stats.completed > 0
                          ? 'bg-[#FF6B00] text-black border-2 border-[#FF6B00]'
                          : 'bg-[#111622] text-[#8c9cb5] border-2 border-[#1e2738] hover:border-[#FF6B00] hover:text-white'
                      }`}
                    >
                      {isChapterComplete ? <Check className="w-4 h-4 stroke-[3]" /> : (chapter.chapterNumber || chIdx + 1)}
                    </div>

                    {/* Chapter Accordion Card */}
                    <div className="bg-[#0b0e17] border border-[#141a27] hover:border-[#1d263b] rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
                      
                      {/* Chapter Header */}
                      <div
                        onClick={() => toggleChapterExpand(chIdx)}
                        className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#0f1422] transition-colors select-none"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] text-[#FF6B00] font-bold uppercase tracking-widest bg-[#FF6B00]/10 px-2.5 py-0.5 rounded border border-[#FF6B00]/20">
                              Chapter {chapter.chapterNumber || chIdx + 1}
                            </span>
                          </div>
                          <h3 className="font-display font-bold text-white text-lg sm:text-xl tracking-tight mt-1">{chapter.title}</h3>
                          {chapter.description && (
                            <p className="text-[#8c9cb5] font-dosis text-xs leading-relaxed mt-1">{chapter.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0 self-end sm:self-center">
                          {stats.total > 0 && (
                            <div className="text-right">
                              <span className="font-mono text-xs text-[#aaa] block">
                                <span className={stats.completed > 0 ? 'text-[#FF6B00] font-bold' : ''}>{stats.completed}</span>/{stats.total} completed
                              </span>
                              <span className="font-mono text-[10px] text-[#666] font-semibold">{stats.percent}%</span>
                            </div>
                          )}
                          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#888]">
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>

                      {/* Chapter Resources List */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-[#1f1f1f] bg-[#0d0d0d] p-4 sm:p-6 space-y-4"
                          >
                            {(!chapter.resources || chapter.resources.length === 0) && (!chapter.questions || chapter.questions.length === 0) ? (
                              <p className="text-[#555] font-dosis text-xs text-center py-4">No topics or questions added in this chapter yet.</p>
                            ) : (
                              <>
                                {(chapter.resources || []).map((res, resIdx) => {
                                  const resId = res._id || `ch_${chIdx}_res_${resIdx}`;
                                  const isResChecked = !!completedItems[resId];
                                  const typeMeta = resourceTypeIcons[res.type] || resourceTypeIcons.article;
                                  const TypeIcon = typeMeta.icon;

                                  return (
                                    <div key={resId} className="bg-[#121212] border border-[#1f1f1f] rounded-xl p-4 space-y-3">
                                      
                                      {/* Topic / Resource Row */}
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3 min-w-0 flex-1">
                                          
                                          {/* Completion Check Circle */}
                                          <button
                                            onClick={() => toggleItemCompletion(resId)}
                                            className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                                              isResChecked
                                                ? 'bg-green-500 border-green-400 text-black'
                                                : 'bg-[#1a1a1a] border-[#333] hover:border-[#FF6B00]'
                                            }`}
                                            title={isResChecked ? 'Mark as incomplete' : 'Mark as completed'}
                                          >
                                            {isResChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                          </button>

                                          <div className="space-y-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                              <span className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border uppercase ${typeMeta.color}`}>
                                                <TypeIcon className="w-3 h-3" /> {typeMeta.label}
                                              </span>
                                              {res.url ? (
                                                <a
                                                  href={res.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className={`font-dosis font-bold text-base hover:underline transition-colors flex items-center gap-1.5 ${
                                                    isResChecked ? 'text-[#888] line-through' : 'text-white hover:text-[#FF6B00]'
                                                  }`}
                                                >
                                                  {res.title} <ExternalLink className="w-3.5 h-3.5 text-[#666]" />
                                                </a>
                                              ) : (
                                                <span className={`font-dosis font-bold text-base ${isResChecked ? 'text-[#888] line-through' : 'text-white'}`}>
                                                  {res.title}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Coding Questions Attached to Topic */}
                                      {Array.isArray(res.questions) && res.questions.length > 0 && (
                                        <div className="pt-2 border-t border-[#1a1a1a] space-y-2 pl-8">
                                          <p className="text-[#666] font-mono text-[10px] uppercase tracking-wider">Practice Coding Questions:</p>
                                          <div className="space-y-1.5">
                                            {res.questions.map((q, qIdx) => {
                                              const qId = q._id || `ch_${chIdx}_res_${resIdx}_q_${qIdx}`;
                                              const isQChecked = !!completedItems[qId];
                                              const platformBadge = platformColors[q.platform] || platformColors.Other;
                                              const diffBadge = difficultyColors[q.difficulty] || difficultyColors.Easy;

                                              return (
                                                <div key={qId} className="flex items-center justify-between bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-2.5 text-xs font-dosis">
                                                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                    <button
                                                      onClick={() => toggleItemCompletion(qId)}
                                                      className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                                                        isQChecked
                                                          ? 'bg-green-500 border-green-400 text-black'
                                                          : 'bg-[#141414] border-[#333] hover:border-[#FF6B00]'
                                                      }`}
                                                    >
                                                      {isQChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                                    </button>

                                                    <a
                                                      href={q.url}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className={`font-semibold truncate hover:underline flex items-center gap-1 ${
                                                        isQChecked ? 'text-[#777] line-through' : 'text-white hover:text-[#FF6B00]'
                                                      }`}
                                                    >
                                                      {q.title} <ExternalLink className="w-3 h-3 text-[#555]" />
                                                    </a>
                                                  </div>

                                                  <div className="flex items-center gap-1.5 flex-shrink-0">
                                                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded border uppercase ${platformBadge}`}>
                                                      {q.platform || 'Problem'}
                                                    </span>
                                                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded border uppercase ${diffBadge}`}>
                                                      {q.difficulty || 'Easy'}
                                                    </span>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}

                                    </div>
                                  );
                                })}
                              </>
                            )}

                            {/* Standalone Direct Chapter Questions (when chapter has direct practice problems) */}
                            {Array.isArray(chapter.questions) && chapter.questions.length > 0 && (
                              <div className="pt-3 border-t border-[#1f1f1f] space-y-2">
                                <p className="text-[#666] font-mono text-[10px] uppercase tracking-wider">Direct Chapter Practice Questions:</p>
                                <div className="space-y-2">
                                  {chapter.questions.map((q, qIdx) => {
                                    const qId = q._id || `ch_${chIdx}_direct_q_${qIdx}`;
                                    const isQChecked = !!completedItems[qId];
                                    const platformBadge = platformColors[q.platform] || platformColors.Other;
                                    const diffBadge = difficultyColors[q.difficulty] || difficultyColors.Easy;

                                    return (
                                      <div key={qId} className="flex items-center justify-between bg-[#121212] border border-[#1f1f1f] rounded-xl p-3.5 text-xs font-dosis">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                          <button
                                            onClick={() => toggleItemCompletion(qId)}
                                            className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                                              isQChecked
                                                ? 'bg-green-500 border-green-400 text-black'
                                                : 'bg-[#1a1a1a] border-[#333] hover:border-[#FF6B00]'
                                            }`}
                                          >
                                            {isQChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                          </button>

                                          <a
                                            href={q.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`font-semibold text-sm truncate hover:underline flex items-center gap-1.5 ${
                                              isQChecked ? 'text-[#777] line-through' : 'text-white hover:text-[#FF6B00]'
                                            }`}
                                          >
                                            <Code2 className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                                            {q.title} <ExternalLink className="w-3 h-3 text-[#555]" />
                                          </a>
                                        </div>

                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                          <span className={`font-mono text-[9px] px-2 py-0.5 rounded border uppercase ${platformBadge}`}>
                                            {q.platform || 'Problem'}
                                          </span>
                                          <span className={`font-mono text-[9px] px-2 py-0.5 rounded border uppercase ${diffBadge}`}>
                                            {q.difficulty || 'Easy'}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
