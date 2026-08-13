'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, ArrowRight, Star, FolderGit2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { projectsAPI } from '@/lib/api';
import { SectionLoader } from '@/components/ui/PageLoader';

const categoryColors = {
  'AI/ML': '#a78bfa',
  'Web3': '#60a5fa',
  'Web Dev': '#FF6B00',
  'web': '#FF6B00',
  'app': '#34d399',
  'other': '#f59e0b',
};

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const title = project.title;
  const desc = project.description || project.desc;
  const tech = Array.isArray(project.tech) ? project.tech : (project.tech ? project.tech.split(',') : []);
  const github = project.github || '#';
  const demo = project.demo || '#';
  const authorName = project.addedBy?.name || project.user?.name || project.author || 'Student';
  const category = project.category || 'Web Dev';
  const color = categoryColors[category] || '#FF6B00';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <div 
        className="bg-[#0b0e17] border border-[#141a27] hover:border-[#FF6B00]/40 rounded-2xl p-6 h-full flex flex-col group transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-2xl z-10"
        style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
      >
        {/* Top Glow Accent Gradient */}
        <div
          className="absolute -top-16 -right-16 w-36 h-36 pointer-events-none z-0 rounded-full transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle, ${color} 0%, rgba(11, 14, 23, 0) 70%)`,
            opacity: 0.2
          }}
        />

        <div className="flex items-center justify-between mb-4 z-10">
          <span
            className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md font-bold"
            style={{
              color: color,
              background: `${color}15`,
              border: `1px solid ${color}30`,
            }}
          >
            {category}
          </span>
          <div className="flex items-center gap-1 text-[#6a6a6a] text-xs font-mono">
            <Star className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Approved</span>
          </div>
        </div>

        <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-[#FF6B00] transition-colors z-10">
          {title}
        </h3>
        <p className="text-[#888] text-sm font-dosis leading-relaxed mb-5 flex-1 line-clamp-3 z-10">{desc}</p>

        {tech.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5 z-10">
            {tech.map((t, idx) => (
              <span key={idx} className="tag-pill text-[9px]">{t.trim()}</span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[#1f1f1f] pt-4 mt-auto z-10">
          <div className="text-[#666] text-xs font-mono truncate max-w-[140px]">
            by {authorName}
          </div>
          <div className="flex items-center gap-2">
            {github && github !== '#' && (
              <a href={github} target="_blank" rel="noreferrer" className="text-[#6a6a6a] hover:text-white transition-colors" aria-label="GitHub">
                <FaGithub className="w-4 h-4" />
              </a>
            )}
            {demo && demo !== '#' && (
              <a href={demo} target="_blank" rel="noreferrer" className="text-[#6a6a6a] hover:text-[#FF6B00] transition-colors" aria-label="Demo">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsAPI.getAll({ featured: 'true' })
      .then(({ data }) => {
        const fetched = data.data || [];
        setProjectList(fetched.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section ref={ref} className="section-padding">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="accent-line mb-4" />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="font-display text-4xl md:text-5xl font-bold text-white"
            >
              Student <span className="text-gradient">Projects</span>
            </motion.h2>
            <p className="text-[#6a6a6a] mt-3 font-dosis text-lg">
              Real projects built by BPMCE students that ship to production.
            </p>
          </div>
          <Link href="/projects" className="btn-outline text-sm">
            All Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <SectionLoader text="Fetching real projects from backend..." />
        ) : projectList.length === 0 ? (
          <div className="text-center py-12 bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
            <FolderGit2 className="w-10 h-10 text-[#444] mx-auto mb-2" />
            <p className="text-[#666] font-dosis">No approved student projects submitted yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectList.map((p, i) => (
              <ProjectCard key={p._id || p.title} project={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
