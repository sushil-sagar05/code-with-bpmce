'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, Search, FolderGit2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { projectsAPI } from '@/lib/api';
import { SectionLoader } from '@/components/ui/PageLoader';

const categories = ['all', 'Web Dev', 'AI/ML', 'Web3', 'App Dev', 'Other'];
const categoryColors = { 'Web Dev': '#FF6B00', 'AI/ML': '#a78bfa', 'Web3': '#60a5fa', 'App Dev': '#f97316', 'Other': '#888888' };

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    projectsAPI.getAll({ featured: 'true' })
      .then(({ data }) => {
        setProjects(data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter((p) => {
    const pCategory = p.category || 'Web Dev';
    const matchCat = cat === 'all' || pCategory.toLowerCase() === cat.toLowerCase();
    const matchSearch = (p.title || '').toLowerCase().includes(search.toLowerCase()) || 
                        (p.description || p.desc || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-20">
      <section className="section-padding grid-bg">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="tag-pill mb-4 inline-block">Projects</div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
              Student <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-[#6a6a6a] text-xl font-dosis max-w-2xl">
              Real apps built by BPMCE students that ship to production and solve real problems.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a4a]" />
              <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="bg-[#141414] border border-[#1f1f1f] rounded px-4 py-2 pl-10 text-sm text-white font-dosis focus:outline-none focus:border-[#FF6B00] w-full md:w-64" />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c} onClick={() => setCat(c)}
                  className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded border transition-all ${cat === c ? 'bg-[#FF6B00] text-black border-[#FF6B00]' : 'text-[#6a6a6a] border-[#1f1f1f] hover:border-[#FF6B00]/40'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <SectionLoader text="Loading approved student projects..." />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
              <FolderGit2 className="w-12 h-12 text-[#444] mx-auto mb-3" />
              <h3 className="text-white font-dosis font-bold text-lg mb-1">No Projects Found</h3>
              <p className="text-[#666] font-dosis text-sm">Be the first to submit your project from the student dashboard!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p, i) => {
                const category = p.category || 'Web Dev';
                const tech = Array.isArray(p.tech) ? p.tech : (p.tech ? p.tech.split(',') : []);
                const authorName = p.addedBy?.name || p.user?.name || p.author || 'Student';
                const desc = p.description || p.desc || '';
                return (
                  <motion.div key={p._id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="card-dark p-6 flex flex-col group hover:border-[#FF6B00]/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-sm font-bold"
                        style={{ color: categoryColors[category] || '#FF6B00', background: `${categoryColors[category] || '#FF6B00'}15`, border: `1px solid ${categoryColors[category] || '#FF6B00'}30` }}>
                        {category}
                      </span>
                      <div className="flex items-center gap-1 text-[#4a4a4a] text-xs font-mono">
                        <Star className="w-3.5 h-3.5 text-[#FF6B00]" /> Approved
                      </div>
                    </div>
                    <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-[#FF6B00] transition-colors">{p.title}</h3>
                    <p className="text-[#6a6a6a] text-sm font-dosis leading-relaxed mb-5 flex-1 line-clamp-3">{desc}</p>
                    {tech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {tech.map((t, idx) => <span key={idx} className="tag-pill text-[9px]">{t.trim()}</span>)}
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-[#1f1f1f] pt-4 mt-auto">
                      <span className="text-[#4a4a4a] text-xs font-mono">by {authorName}</span>
                      <div className="flex items-center gap-2">
                        {p.github && p.github !== '#' && (
                          <a href={p.github} target="_blank" rel="noreferrer" className="text-[#4a4a4a] hover:text-white transition-colors" aria-label="GitHub">
                            <FaGithub className="w-4 h-4" />
                          </a>
                        )}
                        {p.demo && p.demo !== '#' && (
                          <a href={p.demo} target="_blank" rel="noreferrer" className="text-[#4a4a4a] hover:text-[#FF6B00] transition-colors" aria-label="Demo">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
