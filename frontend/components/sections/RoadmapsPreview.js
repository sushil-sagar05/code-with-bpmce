'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Globe, Binary, Brain, Sparkles, Hexagon, Smartphone, Shield, Server, Cloud, Map } from 'lucide-react';
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

function RoadmapCard({ roadmap, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const slug = roadmap.slug || roadmap.category || 'web-dev';
  const Icon = iconMap[slug] || iconMap[roadmap.category] || Globe;
  const color = categoryColors[slug] || categoryColors[roadmap.category] || '#FF6B00';
  const time = roadmap.estimatedTime || '3 months';
  const chaptersCount = Array.isArray(roadmap.chapters) && roadmap.chapters.length > 0
    ? roadmap.chapters.length
    : Array.isArray(roadmap.nodes) ? roadmap.nodes.length : 0;
  const title = roadmap.title;
  const desc = roadmap.description || roadmap.desc;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <Link href={`/roadmaps/${slug}`} className="block h-full">
        <div 
          className="bg-[#0b0e17] border border-[#141a27] hover:border-[#1d263b] rounded-2xl p-6 h-full group cursor-pointer flex flex-col transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-2xl transform-gpu z-10"
          style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
        >
          {/* Top Glow Accent (SVG radial-gradient fallback approach to avoid Webkit CSS filter: blur bugs) */}
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
            {chaptersCount > 0 && (
              <span className="font-mono text-[9px] text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {chaptersCount} Chapters
              </span>
            )}
          </div>
          
          <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-[#FF6B00] transition-colors leading-snug">
            {title}
          </h3>
          
          <p className="text-[#8c9cb5] text-xs font-dosis leading-relaxed mb-4 flex-1 line-clamp-3">{desc}</p>
          
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#141a27]">
            <span className="font-mono text-[10px] text-[#8c9cb5] flex items-center gap-1.5 bg-[#0f1422] px-2.5 py-1 rounded-lg border border-[#1d263b]">⏱ {time}</span>
            <span className="text-xs font-mono font-bold text-[#FF6B00] group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
              Explore Track <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function RoadmapsPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
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
    <section ref={ref} className="section-padding relative">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="accent-line mb-4" />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="font-display text-4xl md:text-5xl font-bold text-white"
            >
              Learning <span className="text-gradient">Roadmaps</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-[#6a6a6a] mt-3 font-dosis text-lg max-w-lg"
            >
              Structured paths from zero to job-ready. Pick your track and start building.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <Link href="/roadmaps" className="btn-outline text-sm">
              View All Roadmaps <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        {loading ? (
          <SectionLoader text="Loading learning tracks..." />
        ) : roadmaps.length === 0 ? (
          <div className="text-center py-12 bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
            <Map className="w-10 h-10 text-[#444] mx-auto mb-2" />
            <p className="text-[#666] font-dosis">No roadmaps published in database yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roadmaps.map((r, i) => (
              <RoadmapCard key={r._id || r.slug || i} roadmap={r} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
