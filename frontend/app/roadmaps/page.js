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
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding grid-bg relative">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="tag-pill mb-4 inline-block">Learning Tracks</div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Curated <span className="text-gradient">Roadmaps</span>
            </h1>
            <p className="text-[#6a6a6a] text-xl font-dosis max-w-2xl mx-auto">
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
                const time = r.estimatedTime || '4 months';
                const stepsCount = Array.isArray(r.nodes) ? r.nodes.length : 0;

                return (
                  <motion.div
                    key={r._id || r.slug || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link href={`/roadmaps/${r.slug}`} className="block h-full">
                      <div className="card-dark p-6 h-full flex flex-col group hover:border-[#FF6B00]/30 transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                            style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                          >
                            <Icon className="w-6 h-6" style={{ color }} />
                          </div>
                          <span className="font-mono text-[10px] text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded">
                            {stepsCount} Steps
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-[#FF6B00] transition-colors">
                          {r.title}
                        </h3>

                        <p className="text-[#6a6a6a] text-sm font-dosis leading-relaxed mb-6 flex-1 line-clamp-3">
                          {r.description || r.desc}
                        </p>

                        <div className="flex items-center justify-between border-t border-[#1f1f1f] pt-4 mt-auto">
                          <span className="font-mono text-xs text-[#888]">⏱ {time}</span>
                          <span className="text-xs font-mono text-[#FF6B00] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            Explore <ArrowRight className="w-3.5 h-3.5" />
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
