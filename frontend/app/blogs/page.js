'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, User, Eye, Heart, PenTool } from 'lucide-react';
import { blogsAPI } from '@/lib/api';
import { SectionLoader } from '@/components/ui/PageLoader';

const categories = ['all', 'technical', 'dsa', 'ai', 'career'];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    blogsAPI.getAll()
      .then(({ data }) => {
        setBlogs(data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = blogs.filter((b) => {
    const bCat = b.category || 'technical';
    const matchCat = cat === 'all' || bCat.toLowerCase() === cat.toLowerCase();
    const matchSearch = (b.title || '').toLowerCase().includes(search.toLowerCase()) || 
                        (b.excerpt || b.content || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-20">
      <section className="section-padding grid-bg">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="tag-pill mb-4 inline-block">Blog</div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
              Developer <span className="text-gradient">Blogs</span>
            </h1>
            <p className="text-[#6a6a6a] text-xl font-dosis max-w-2xl">
              Tutorials, experiences, and insights from BPMCE students and alumni.
            </p>
          </motion.div>
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <input type="text" placeholder="Search blogs..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-[#141414] border border-[#1f1f1f] rounded px-4 py-2 text-sm text-white font-dosis focus:outline-none focus:border-[#FF6B00] w-full md:w-64" />
            <div className="flex gap-2 flex-wrap">
              {categories.map((c) => (
                <button key={c} onClick={() => setCat(c)}
                  className={`font-mono text-[10px] uppercase tracking-wider px-3 py-2 rounded border transition-all ${cat === c ? 'bg-[#FF6B00] text-black border-[#FF6B00]' : 'text-[#6a6a6a] border-[#1f1f1f] hover:border-[#FF6B00]/40'}`}>
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
            <SectionLoader text="Loading blog posts from database..." />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
              <PenTool className="w-12 h-12 text-[#444] mx-auto mb-3" />
              <h3 className="text-white font-dosis font-bold text-lg mb-1">No Blog Posts Found</h3>
              <p className="text-[#666] font-dosis text-sm">Publish an article from your student dashboard to be featured here!</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {filtered.length > 0 && (
                <Link href={`/blogs/${filtered[0]._id}`}>
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="card-dark p-8 mb-6 group hover:border-[#FF6B00]/30 transition-all cursor-pointer">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="tag-pill">Featured</span>
                          <span className="font-mono text-[#4a4a4a] text-xs">
                            {filtered[0].createdAt ? new Date(filtered[0].createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        <h2 className="font-display text-3xl font-bold text-white mb-3 group-hover:text-[#FF6B00] transition-colors leading-tight">{filtered[0].title}</h2>
                        <p className="text-[#6a6a6a] font-dosis leading-relaxed mb-5 line-clamp-3">{filtered[0].excerpt || filtered[0].content?.slice(0, 150)}</p>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-[#4a4a4a] text-xs font-mono"><User className="w-3 h-3" />{filtered[0].author?.name || 'Author'}</div>
                          <div className="flex items-center gap-2 text-[#4a4a4a] text-xs font-mono"><Clock className="w-3 h-3" />{filtered[0].readTime || 5} min</div>
                          <div className="flex items-center gap-2 text-[#4a4a4a] text-xs font-mono"><Eye className="w-3 h-3" />{filtered[0].views || 1}</div>
                          <div className="flex items-center gap-2 text-[#4a4a4a] text-xs font-mono"><Heart className="w-3 h-3 text-red-500" />{filtered[0].likes || 0}</div>
                        </div>
                      </div>
                      <div className="h-48 bg-gradient-to-br from-[#FF6B00]/10 to-transparent border border-[#1f1f1f] rounded-lg flex items-center justify-center">
                        {filtered[0].coverImage ? (
                          <img src={filtered[0].coverImage} alt={filtered[0].title} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="font-display text-6xl text-[#FF6B00]/20">01</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.slice(1).map((blog, i) => {
                  const authorName = blog.author?.name || 'Author';
                  const dateStr = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Recent';
                  const tags = Array.isArray(blog.tags) ? blog.tags : (blog.tags ? blog.tags.split(',') : []);
                  return (
                    <Link key={blog._id} href={`/blogs/${blog._id}`}>
                      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                        className="card-dark p-5 flex flex-col group hover:border-[#FF6B00]/30 transition-all cursor-pointer h-full">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-mono text-[#4a4a4a] text-[10px]">{dateStr}</span>
                        </div>
                        <h3 className="font-display text-lg font-bold text-white mb-3 group-hover:text-[#FF6B00] transition-colors leading-tight flex-1">{blog.title}</h3>
                        <p className="text-[#6a6a6a] font-dosis text-sm leading-relaxed mb-4 line-clamp-2">{blog.excerpt || blog.content?.slice(0, 120)}</p>
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {tags.slice(0, 2).map((t, idx) => <span key={idx} className="font-mono text-[9px] text-[#4a4a4a] bg-[#141414] border border-[#1f1f1f] px-2 py-0.5 rounded uppercase">{t.trim()}</span>)}
                          </div>
                        )}
                        <div className="flex items-center gap-4 border-t border-[#1f1f1f] pt-3 mt-auto">
                          <span className="text-[#4a4a4a] text-xs font-mono flex-1">{authorName}</span>
                          <div className="flex items-center gap-3 text-[#4a4a4a] text-xs font-mono">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime || 5}m</span>
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{blog.likes || 0}</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
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
