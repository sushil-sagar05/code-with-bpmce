'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Globe, Binary, Brain, Sparkles, Hexagon, Smartphone, Shield, Server, Cloud, CheckCircle, ArrowLeft, Map } from 'lucide-react';
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

export default function RoadmapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.slug) {
      setLoading(true);
      roadmapsAPI.getBySlug(params.slug)
        .then(({ data }) => {
          setRoadmap(data.data || null);
        })
        .catch(() => {
          setRoadmap(null);
        })
        .finally(() => setLoading(false));
    }
  }, [params?.slug]);

  if (loading) {
    return <PageLoader text="Loading learning roadmap..." />;
  }

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
  const nodes = Array.isArray(roadmap.nodes) ? roadmap.nodes : [];

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <section className="section-padding grid-bg">
        <div className="container-custom">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 font-dosis font-semibold text-xs text-[#888] hover:text-white transition-colors bg-[#111] border border-[#1f1f1f] px-3.5 py-1.5 rounded-xl mb-6"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6B00]" /> Back
          </button>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon className="w-8 h-8" style={{ color }} />
              </div>
              <div>
                <div className="tag-pill mb-1 inline-block">Roadmap</div>
                <h1 className="font-display text-4xl md:text-6xl font-bold text-white">{roadmap.title}</h1>
              </div>
            </div>
            <p className="text-[#6a6a6a] text-xl font-dosis max-w-2xl">{roadmap.description || roadmap.desc}</p>
          </motion.div>
        </div>
      </section>

      {/* Roadmap tree */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          {nodes.length === 0 ? (
            <div className="text-center py-12 bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
              <p className="text-[#666] font-dosis text-sm">No steps added to this roadmap yet.</p>
            </div>
          ) : (
            <div className="space-y-4 border-l border-[#1f1f1f] pl-6 ml-4">
              {nodes.map((node, ni) => (
                <motion.div
                  key={node.id || ni}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: ni * 0.08 }}
                  className="card-dark p-5 group hover:border-[#FF6B00]/30 transition-all relative"
                >
                  <div className="absolute -left-[33px] top-6 w-4 h-4 rounded-full bg-[#0a0a0a] border-2 border-[#FF6B00]" />
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#FF6B00] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display font-bold text-white text-lg">{node.title}</h3>
                        <span className="font-mono text-[10px] text-[#888] bg-[#141414] border border-[#1f1f1f] px-2 py-0.5 rounded uppercase">
                          Step {ni + 1}
                        </span>
                      </div>
                      <p className="text-[#888] text-sm font-dosis mt-1.5 leading-relaxed">{node.desc || node.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
