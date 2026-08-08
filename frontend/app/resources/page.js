'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Video, Wrench, ArrowUpRight, Star, List, Layers } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { resourcesAPI } from '@/lib/api';
import { SectionLoader } from '@/components/ui/PageLoader';

const typeIcons = { book: BookOpen, doc: FileText, course: Wrench, youtube: Video, github: FaGithub, sheet: List, tool: Wrench, other: FileText };
const typeColors = {
  book: '#f59e0b', doc: '#60a5fa', course: '#a78bfa',
  youtube: '#ef4444', github: '#ffffff', sheet: '#34d399', tool: '#FF6B00', other: '#888888',
};
const categories = ['all', 'web-dev', 'dsa', 'ai-ml', 'general'];
const types = ['all', 'book', 'doc', 'course', 'youtube', 'github', 'sheet', 'tool'];

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('all');
  const [type, setType] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    resourcesAPI.getAll()
      .then(({ data }) => {
        setResources(data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = resources.filter((r) => {
    const matchCat = cat === 'all' || r.category === cat;
    const matchType = type === 'all' || r.type === type;
    const matchSearch = (r.title || '').toLowerCase().includes(search.toLowerCase()) || 
                        (r.description || r.desc || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchType && matchSearch;
  });

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding grid-bg">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="tag-pill mb-4 inline-block">Learning Resources</div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
              The Dev <span className="text-gradient">Library</span>
            </h1>
            <p className="text-[#6a6a6a] text-xl font-dosis max-w-2xl">
              Curated books, courses, docs, GitHub repos, YouTube playlists, and coding sheets — all in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-[#0d0d0d] border-y border-[#1f1f1f] sticky top-16 z-30">
        <div className="container-custom flex flex-col md:flex-row gap-4 items-start md:items-center">
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#141414] border border-[#1f1f1f] rounded px-4 py-2 text-sm text-white font-dosis focus:outline-none focus:border-[#FF6B00] w-full md:w-64"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded border transition-all ${cat === c ? 'bg-[#FF6B00] text-black border-[#FF6B00]' : 'text-[#6a6a6a] border-[#1f1f1f] hover:border-[#FF6B00]/40'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button key={t} onClick={() => setType(t)}
                className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded border transition-all ${type === t ? 'bg-[#1a1a1a] text-[#FF6B00] border-[#FF6B00]/50' : 'text-[#4a4a4a] border-[#1f1f1f] hover:border-[#1f1f1f]'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <SectionLoader text="Fetching resources from library..." />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
              <Layers className="w-12 h-12 text-[#444] mx-auto mb-3" />
              <h3 className="text-white font-dosis font-bold text-lg mb-1">No Resources Found</h3>
              <p className="text-[#666] font-dosis text-sm">Try tweaking your search filters or add a new resource from Admin panel.</p>
            </div>
          ) : (
            <>
              <p className="text-[#4a4a4a] font-mono text-xs mb-6 uppercase tracking-wider">
                {filtered.length} resources found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((r, i) => {
                  const Icon = typeIcons[r.type] || FileText;
                  const color = typeColors[r.type] || '#FF6B00';
                  const upvoteCount = Array.isArray(r.upvotes) ? r.upvotes.length : (r.upvotes || 0);
                  const desc = r.description || r.desc || '';
                  return (
                    <motion.a
                      key={r._id || i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="card-dark p-5 flex flex-col group hover:border-[#FF6B00]/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                          <Icon className="w-5 h-5" style={{ color }} />
                        </div>
                        <div className="flex items-center gap-1 text-[#4a4a4a] text-xs font-mono">
                          <Star className="w-3 h-3 text-[#FF6B00]" />{upvoteCount}
                        </div>
                      </div>
                      <h3 className="font-display font-bold text-white text-base mb-2 group-hover:text-[#FF6B00] transition-colors leading-tight flex-1">
                        {r.title}
                      </h3>
                      <p className="text-[#6a6a6a] text-xs font-dosis leading-relaxed mb-4 line-clamp-3">{desc}</p>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#1f1f1f]">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#4a4a4a] bg-[#141414] border border-[#1f1f1f] px-2 py-0.5 rounded">{r.type}</span>
                        <ArrowUpRight className="w-4 h-4 text-[#4a4a4a] group-hover:text-[#FF6B00] transition-colors" />
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
