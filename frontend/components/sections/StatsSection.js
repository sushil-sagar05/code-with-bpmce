'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Code2, Trophy, Calendar, Star, GitBranch } from 'lucide-react';
import { usersAPI, projectsAPI, achievementsAPI, eventsAPI, roadmapsAPI } from '@/lib/api';

function CountUpNumber({ target }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.span
        initial={0}
        animate={target}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        {target}
      </motion.span>
    </motion.span>
  );
}

function AnimatedCounter({ value, suffix }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      className="font-display text-4xl sm:text-5xl font-bold stat-glow text-[#FF6B00]"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        {isInView ? <CountUpNumber target={value} /> : '0'}
      </motion.span>
      {suffix}
    </motion.span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [counts, setCounts] = useState({
    members: 0,
    projects: 0,
    achievements: 0,
    events: 0,
    roadmaps: 0,
    openSource: 0,
  });

  useEffect(() => {
    Promise.allSettled([
      usersAPI.getCount(),
      projectsAPI.getAll(),
      achievementsAPI.getAll({ verified: true }),
      eventsAPI.getAll(),
      roadmapsAPI.getAll(),
      achievementsAPI.getAll({ verified: true }), // Query open source type achievements
    ]).then(([usersRes, projectsRes, achievementsRes, eventsRes, roadmapsRes, osRes]) => {
      const allAchievements = osRes.value?.data?.data || [];
      const osCount = allAchievements.filter(a => (a.type || '').toUpperCase() === 'OPEN SOURCE' || (a.type || '').toUpperCase() === 'GSOC').length;

      setCounts({
        members: usersRes.value?.data?.count || 0,
        projects: projectsRes.value?.data?.data?.length || 0,
        achievements: achievementsRes.value?.data?.data?.length || 0,
        events: eventsRes.value?.data?.data?.length || 0,
        roadmaps: roadmapsRes.value?.data?.data?.length || 0,
        openSource: osCount,
      });
    }).catch(() => {});
  }, []);

  const statsData = [
    { icon: Users, value: counts.members, suffix: counts.members > 0 ? '+' : '', label: 'Active Members', color: '#FF6B00' },
    { icon: Code2, value: counts.projects, suffix: counts.projects > 0 ? '+' : '', label: 'Student Projects', color: '#FF8C00' },
    { icon: Trophy, value: counts.achievements, suffix: counts.achievements > 0 ? '+' : '', label: 'Verified Achievements', color: '#FF6B00' },
    { icon: Calendar, value: counts.events, suffix: counts.events > 0 ? '+' : '', label: 'Events Hosted', color: '#FF8C00' },
    { icon: Star, value: counts.roadmaps, suffix: counts.roadmaps > 0 ? '+' : '', label: 'Learning Tracks', color: '#FF6B00' },
    { icon: GitBranch, value: counts.openSource, suffix: counts.openSource > 0 ? '+' : '', label: 'Open Source Contribs', color: '#FF8C00' },
  ];

  return (
    <section className="py-20 relative bg-[#0a0a0a]" ref={ref}>
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="tag-pill mb-3 inline-block">By the Numbers</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            Our Real <span className="text-gradient">Impact</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {statsData.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card-dark p-6 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-[#FF6B00]/40 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <p className="text-[#888] font-dosis font-semibold text-xs sm:text-sm mt-2">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
