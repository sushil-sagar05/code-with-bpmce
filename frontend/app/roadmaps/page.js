'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, Binary, Brain, Sparkles, Hexagon, Smartphone, Shield, Server, Cloud, ArrowRight, Map } from 'lucide-react';
import { roadmapsAPI } from '@/lib/api';
import { SectionLoader } from '@/components/ui/PageLoader';

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

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    roadmapsAPI.getAll()
      .then(({ data }) => {
        setRoadmaps(data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-[#07090e] text-white">
      {/* Hero Banner with WebKit-compatible gradient and hardware accelerated blur light source */}
      <section className="relative overflow-hidden border-b border-[#141a27] py-20 bg-[#07090e] bg-gradient-to-b from-[#111625] to-[#07090e]">
        {/* Decorative ambient background glow (webkit-friendly) */}
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full opacity-15 bg-[#FF6B00] blur-[100px] pointer-events-none transform-gpu [backface-visibility:hidden] [translate:z-0]" />
        
        <div className="container-custom text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/25 text-[#FF6B00] font-mono text-[9px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full inline-block mb-4">
              Learning Tracks
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              Curated <span className="text-gradient">Roadmaps</span>
            </h1>
            <p className="text-[#8c9cb5] text-lg sm:text-xl font-dosis max-w-2xl mx-auto leading-relaxed">
              Curated, step-by-step learning paths built by experienced seniors and verified against industry standards.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <SectionLoader text="Loading learning roadmaps..." />
          ) : roadmaps.length === 0 ? (
            <div className="text-center py-16 bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
              <Map className="w-12 h-12 text-[#444] mx-auto mb-3" />
              <h3 className="text-white font-dosis font-bold text-lg mb-1">No Roadmaps Found</h3>
              <p className="text-[#666] font-dosis text-sm">Create learning roadmaps from the Admin panel to guide club members.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmaps.map((r, i) => {
                const Icon = iconMap[r.slug] || iconMap[r.category] || Globe;
                const color = categoryColors[r.slug] || categoryColors[r.category] || '#FF6B00';
                const time = r.estimatedTime || '3 months';
                const chaptersCount = Array.isArray(r.chapters) && r.chapters.length > 0
                  ? r.chapters.length
                  : Array.isArray(r.nodes) ? r.nodes.length : 0;
                const difficulty = r.difficulty || 'Beginner';

                return (
                  <motion.div
                    key={r._id || r.slug || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link href={`/roadmaps/${r.slug}`} className="block h-full">
                      <div 
                        className="bg-[#0b0e17] border border-[#141a27] hover:border-[#1d263b] rounded-2xl p-6 h-full flex flex-col group transition-all duration-300 shadow-lg hover:shadow-2xl relative overflow-hidden transform-gpu z-10"
                        style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
                      >
                        
                        {/* Glow Accent Background blur (SVG radial-gradient fallback approach to avoid Webkit CSS filter: blur bugs) */}
                        <div
                          className="absolute -top-16 -right-16 w-32 h-32 pointer-events-none transform-gpu z-0 rounded-full"
                          style={{
                            background: `radial-gradient(circle, ${color} 0%, rgba(11, 14, 23, 0) 70%)`,
                            opacity: 0.15
                          }}
                        />

                        <div className="flex items-start justify-between mb-5">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md"
                            style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                          >
                            <Icon className="w-5.5 h-5.5" style={{ color }} />
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="font-mono text-[9px] text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              {chaptersCount} Chapters
                            </span>
                            <span className="font-mono text-[9px] text-[#8c9cb5] bg-[#0f1422] border border-[#1d263b] px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                              {difficulty}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-[#FF6B00] transition-colors leading-snug">
                          {r.title}
                        </h3>

                        <p className="text-[#8c9cb5] text-xs font-dosis leading-relaxed mb-6 flex-1 line-clamp-3">
                          {r.description || r.desc}
                        </p>

                        <div className="flex items-center justify-between border-t border-[#141a27] pt-4 mt-auto">
                          <span className="font-mono text-xs text-[#8c9cb5] flex items-center gap-1.5 bg-[#0f1422] px-2.5 py-1 rounded-lg border border-[#1d263b]">
                            ⏱ {time}
                          </span>
                          <span className="text-xs font-mono font-bold text-[#FF6B00] group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                            Start Path <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
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
