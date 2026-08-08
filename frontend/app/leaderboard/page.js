'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, User as UserIcon } from 'lucide-react';
import { usersAPI } from '@/lib/api';
import { SectionLoader } from '@/components/ui/PageLoader';
import Link from 'next/link';

const rankIcons = { 1: Crown, 2: Medal, 3: Trophy };
const rankColors = { 1: '#f59e0b', 2: '#9ca3af', 3: '#f97316' };

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    usersAPI.getLeaderboard()
      .then(({ data }) => {
        setUsers(data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const topThree = users.length >= 3 ? [users[1], users[0], users[2]] : users;

  return (
    <div className="pt-20">
      <section className="section-padding grid-bg">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="tag-pill mb-4 inline-block">Rankings</div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
              Club <span className="text-gradient">Leaderboard</span>
            </h1>
            <p className="text-[#6a6a6a] text-xl font-dosis max-w-2xl">
              Top performers ranked by combined achievements, coding ratings, and contributions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Top 3 podium */}
      {!loading && users.length >= 3 && (
        <section className="py-12 bg-[#0d0d0d]">
          <div className="container-custom">
            <div className="flex justify-center items-end gap-4 md:gap-8">
              {topThree.map((user, i) => {
                const rankNum = i === 0 ? 2 : i === 1 ? 1 : 3;
                const Icon = rankIcons[rankNum];
                const color = rankColors[rankNum];
                const points = user.points || 0;
                return (
                  <motion.div
                    key={user._id || rankNum}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative mb-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#FF6B00]" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF8C00] flex items-center justify-center font-display font-bold text-2xl text-black">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      {Icon && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#141414] border flex items-center justify-center" style={{ borderColor: color }}>
                          <Icon className="w-3.5 h-3.5" style={{ color }} />
                        </div>
                      )}
                    </div>
                    <Link href={`/profile/${user._id}`} className="font-display font-bold text-white text-center hover:text-[#FF6B00] transition-colors">
                      {user.name}
                    </Link>
                    <span className="font-mono text-xs text-[#FF6B00] mt-1">{points} pts</span>
                    <div
                      className={`w-28 md:w-36 mt-4 rounded-t-lg bg-[#141414] border border-[#1f1f1f] border-b-0 flex items-center justify-center font-display font-bold text-2xl text-[#4a4a4a] ${
                        rankNum === 1 ? 'h-36' : rankNum === 2 ? 'h-28' : 'h-24'
                      }`}
                    >
                      #{rankNum}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Full Leaderboard Table */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          {loading ? (
            <SectionLoader text="Loading leaderboard rankings..." />
          ) : users.length === 0 ? (
            <div className="text-center py-16 bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
              <UserIcon className="w-12 h-12 text-[#444] mx-auto mb-3" />
              <h3 className="text-white font-dosis font-bold text-lg mb-1">No Members Ranked Yet</h3>
              <p className="text-[#666] font-dosis text-sm">Create user accounts or register as a student to join the leaderboard.</p>
            </div>
          ) : (
            <div className="card-dark overflow-hidden p-0 rounded-2xl border border-[#1f1f1f]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1f1f1f] bg-[#0d0d0d] font-mono text-[11px] text-[#888] uppercase tracking-wider">
                      <th className="p-4 pl-6">Rank</th>
                      <th className="p-4">Member</th>
                      <th className="p-4">Branch / Batch</th>
                      <th className="p-4 text-center">LeetCode</th>
                      <th className="p-4 text-center">Codeforces</th>
                      <th className="p-4 text-right pr-6">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1f1f] font-dosis text-sm">
                    {users.map((u, i) => {
                      const rankNum = i + 1;
                      const Icon = rankIcons[rankNum];
                      const color = rankColors[rankNum];
                      return (
                        <tr key={u._id || i} className="hover:bg-[#161616] transition-colors group">
                          <td className="p-4 pl-6 font-mono text-sm font-bold">
                            <div className="flex items-center gap-2">
                              {Icon ? (
                                <Icon className="w-4 h-4" style={{ color }} />
                              ) : (
                                <span className="text-[#666]">{rankNum}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 font-bold text-white">
                            <Link href={`/profile/${u._id}`} className="flex items-center gap-3 hover:text-[#FF6B00] transition-colors">
                              {u.avatar ? (
                                <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-[#FF6B00]/30" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-[#1f1f1f] border border-[#333] text-[#888] flex items-center justify-center font-bold text-xs">
                                  {u.name?.[0]?.toUpperCase()}
                                </div>
                              )}
                              <span>{u.name}</span>
                            </Link>
                          </td>
                          <td className="p-4 text-[#888] font-mono text-xs">
                            {u.branch || 'CSE'} {u.batch ? `'${u.batch.slice(-2)}` : ''}
                          </td>
                          <td className="p-4 text-center font-mono text-xs text-[#aaa]">
                            {u.leetcode || '—'}
                          </td>
                          <td className="p-4 text-center font-mono text-xs text-[#aaa]">
                            {u.codeforces || '—'}
                          </td>
                          <td className="p-4 text-right pr-6 font-mono text-sm font-bold text-[#FF6B00]">
                            {u.points || 0} pts
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
