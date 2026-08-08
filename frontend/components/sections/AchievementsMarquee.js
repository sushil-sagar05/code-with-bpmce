'use client';
import { useState, useEffect } from 'react';
import { achievementsAPI } from '@/lib/api';
import { SectionLoader } from '@/components/ui/PageLoader';

const typeColors = {
  INTERNSHIP: '#4ade80',
  GSoC: '#60a5fa',
  'SIH WINNER': '#f59e0b',
  HACKATHON: '#a78bfa',
  PPO: '#34d399',
  LEETCODE: '#f97316',
  'OPEN SOURCE': '#ec4899',
  CODEFORCES: '#38bdf8',
  OTHER: '#FF6B00',
};

function AchievementChip({ achievement }) {
  const type = (achievement.type || 'ACHIEVEMENT').toUpperCase();
  const name = achievement.user?.name || achievement.name || 'Student';
  const color = typeColors[type] || '#FF6B00';
  const detail = achievement.company || achievement.org || achievement.event || achievement.stats || achievement.title || '';

  return (
    <div className="inline-flex items-center gap-3 card-dark px-5 py-3 mx-3 flex-shrink-0 group hover:border-[#FF6B00]/30 transition-colors">
      <span
        className="font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm font-bold"
        style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}
      >
        {type}
      </span>
      <span className="text-white font-dosis font-semibold text-sm">{name}</span>
      {detail && (
        <span className="text-[#6a6a6a] font-mono text-xs max-w-[180px] truncate">@ {detail}</span>
      )}
    </div>
  );
}

export default function AchievementsMarquee() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    achievementsAPI.getAll({ verified: true })
      .then(({ data }) => {
        setList(data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (list.length === 0) return null;

  const doubled = [...list, ...list, ...list];

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B00]/20 to-transparent" />

      <div className="container-custom mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="accent-line mb-3" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              Student <span className="text-gradient">Achievements</span>
            </h2>
            <p className="text-[#6a6a6a] mt-2 font-dosis text-lg">
              Our members are crushing it — across internships, hackathons, and competitive programming.
            </p>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden py-3">
          <div className="marquee-track">
            {doubled.map((item, i) => (
              <AchievementChip key={i} achievement={item} />
            ))}
          </div>
        </div>

        {/* Second row reversed */}
        <div className="overflow-hidden py-3">
          <div className="marquee-track" style={{ animationDirection: 'reverse', animationDuration: '35s' }}>
            {doubled.slice().reverse().map((item, i) => (
              <AchievementChip key={`r-${i}`} achievement={item} />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1f1f1f] to-transparent" />
    </section>
  );
}
