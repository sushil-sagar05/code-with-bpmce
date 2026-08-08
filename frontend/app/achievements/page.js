'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Briefcase, Code2, Star, GitBranch, Award, Users, Medal, ExternalLink } from 'lucide-react';
import { achievementsAPI } from '@/lib/api';
import { SectionLoader } from '@/components/ui/PageLoader';
import Link from 'next/link';

const types = ['all', 'INTERNSHIP', 'GSoC', 'SIH WINNER', 'HACKATHON', 'PPO', 'LEETCODE', 'OPEN SOURCE', 'CODEFORCES'];
const typeColors = {
  INTERNSHIP: '#4ade80', GSoC: '#60a5fa', 'SIH WINNER': '#f59e0b',
  HACKATHON: '#a78bfa', PPO: '#34d399', LEETCODE: '#f97316',
  'OPEN SOURCE': '#ec4899', CODEFORCES: '#38bdf8', OTHER: '#FF6B00',
};
const typeIcons = {
  INTERNSHIP: Briefcase, GSoC: Code2, 'SIH WINNER': Award,
  HACKATHON: Trophy, PPO: Star, LEETCODE: Medal,
  'OPEN SOURCE': GitBranch, CODEFORCES: Users, OTHER: Trophy,
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('all');

  useEffect(() => {
    setLoading(true);
    achievementsAPI.getAll({ verified: true })
      .then(({ data }) => {
        setAchievements(data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = achievements.filter((a) => {
    const aType = (a.type || 'OTHER').toUpperCase();
    return type === 'all' || aType === type.toUpperCase();
  });

  return (
    <div className="pt-20">
      <section className="section-padding grid-bg">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="tag-pill mb-4 inline-block font-mono">Hall of Fame</div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
              Student <span className="text-gradient">Achievements</span>
            </h1>
            <p className="text-[#6a6a6a] text-xl font-dosis max-w-2xl">
              Celebrating internships, GSoC selections, hackathon wins, and competitive programming milestones.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-2 mt-8">
            {types.map((t) => (
              <button key={t} onClick={() => setType(t)}
                className={`font-mono text-[10px] uppercase tracking-wider px-3.5 py-2 rounded border transition-all ${type === t ? 'bg-[#FF6B00] text-black border-[#FF6B00]' : 'text-[#6a6a6a] border-[#1f1f1f] hover:border-[#FF6B00]/40'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <SectionLoader text="Loading verified achievements..." />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
              <Trophy className="w-12 h-12 text-[#444] mx-auto mb-3" />
              <h3 className="text-white font-dosis font-bold text-lg mb-1">No Verified Achievements Found</h3>
              <p className="text-[#666] font-dosis text-sm">Submit your achievement certificate from your dashboard to get listed in the Hall of Fame!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((a, index) => {
                const aType = (a.type || 'OTHER').toUpperCase();
                const color = typeColors[aType] || '#FF6B00';
                const Icon = typeIcons[aType] || Trophy;
                const studentName = a.user?.name || a.name || 'Student';
                const detail = a.company || a.org || a.event || a.title || '';
                const desc = a.description || '';

                return (
                  <motion.div key={a._id || index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                    className="card-dark p-6 group hover:border-[#FF6B00]/30 transition-all flex flex-col">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-sm font-bold" style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}>
                            {aType}
                          </span>
                          <span className="font-mono text-[10px] text-green-400">Verified ✓</span>
                        </div>
                        <h3 className="font-display font-bold text-white text-lg mt-2">{studentName}</h3>
                        {detail && <p className="text-[#FF6B00] font-mono text-xs mt-0.5">@ {detail}</p>}
                        {desc && <p className="text-[#888] font-dosis text-sm mt-2 leading-relaxed line-clamp-3">{desc}</p>}
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-[#1f1f1f] flex items-center justify-between">
                      <Link href={`/achievements/${a._id}`} className="text-xs font-mono text-[#888] hover:text-[#FF6B00] transition-colors flex items-center gap-1">
                        View Details <ExternalLink className="w-3 h-3" />
                      </Link>
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
