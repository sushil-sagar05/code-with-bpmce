'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserCheck, Search, Eye, Users, Shield, Sparkles, Trophy } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { applicationsAPI } from '@/lib/api';
import { SectionLoader } from '@/components/ui/PageLoader';

export default function ClubMembersPage() {
  const [approvedMembers, setApprovedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [trackFilter, setTrackFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    applicationsAPI.getAll({ status: 'approved' })
      .then(({ data }) => {
        const list = data.data || [];
        setApprovedMembers(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Extract all tracks
  const allTracks = Array.from(
    new Set(approvedMembers.flatMap((m) => m.tracks || []))
  );

  const filteredMembers = approvedMembers.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch =
      (m.name || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q) ||
      (m.branch || '').toLowerCase().includes(q) ||
      (m.year || '').toLowerCase().includes(q);

    const matchTrack =
      trackFilter === 'all' || (m.tracks && m.tracks.includes(trackFilter));

    return matchSearch && matchTrack;
  });

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <section className="section-padding grid-bg">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="tag-pill mb-4 inline-block">Official Members</div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
              Club <span className="text-gradient">Members</span>
            </h1>
            <p className="text-[#6a6a6a] text-xl font-dosis max-w-2xl">
              Meet the approved student developers and domain contributors of CodeWithBPMCE.
            </p>
          </motion.div>

          {/* Search & Track Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#555] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, branch, or year..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-xl px-4 py-2.5 pl-10 text-sm text-white font-dosis focus:outline-none focus:border-[#FF6B00]"
              />
            </div>
            {allTracks.length > 0 && (
              <div className="flex gap-2 flex-wrap items-center">
                <button
                  onClick={() => setTrackFilter('all')}
                  className={`font-mono text-[10px] uppercase tracking-wider px-3 py-2 rounded-xl border transition-all ${
                    trackFilter === 'all'
                      ? 'bg-[#FF6B00] text-black border-[#FF6B00] font-bold'
                      : 'text-[#6a6a6a] border-[#1f1f1f] hover:border-[#FF6B00]/40'
                  }`}
                >
                  All Tracks
                </button>
                {allTracks.map((tr) => (
                  <button
                    key={tr}
                    onClick={() => setTrackFilter(tr)}
                    className={`font-mono text-[10px] uppercase tracking-wider px-3 py-2 rounded-xl border transition-all ${
                      trackFilter === tr
                        ? 'bg-[#FF6B00] text-black border-[#FF6B00] font-bold'
                        : 'text-[#6a6a6a] border-[#1f1f1f] hover:border-[#FF6B00]/40'
                    }`}
                  >
                    {tr}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Member Cards Grid */}
      <section className="section-padding pt-6">
        <div className="container-custom">
          {loading ? (
            <SectionLoader text="Loading approved club members..." />
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-20 bg-[#111] border border-[#1f1f1f] rounded-2xl p-8 max-w-lg mx-auto">
              <UserCheck className="w-12 h-12 text-[#444] mx-auto mb-3" />
              <h3 className="text-white font-dosis font-bold text-lg mb-1">No Club Members Found</h3>
              <p className="text-[#666] font-dosis text-sm mb-6">
                No approved student applications matching your filter criteria.
              </p>
              <Link href="/join" className="btn-primary py-2.5 px-6 text-xs inline-flex items-center gap-2">
                Apply to Join Club
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((m, idx) => {
                const userObj = m.user;
                const userId = userObj?._id || userObj;
                return (
                  <motion.div
                    key={m._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="card-dark p-6 rounded-2xl flex flex-col justify-between group hover:border-[#FF6B00]/40 transition-all border border-[#1f1f1f]"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3.5">
                          {userObj?.avatar ? (
                            <img
                              src={userObj.avatar}
                              alt={m.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-[#FF6B00]/40 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-[#FF6B00]/10 border-2 border-[#FF6B00]/40 text-[#FF6B00] flex items-center justify-center font-bold font-mono text-lg flex-shrink-0">
                              {m.name?.[0]?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h3 className="font-display text-lg font-bold text-white group-hover:text-[#FF6B00] transition-colors leading-tight">
                              {m.name}
                            </h3>
                            <p className="text-[#666] font-mono text-xs mt-0.5">
                              {m.branch} • {m.year}
                            </p>
                          </div>
                        </div>

                        <span className="font-mono text-[9px] text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded-full flex-shrink-0">
                          ✓ Verified Member
                        </span>
                      </div>

                      {/* Tracks Badges */}
                      {m.tracks && m.tracks.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {m.tracks.map((t, ti) => (
                            <span
                              key={ti}
                              className="font-mono text-[9px] text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2 py-0.5 rounded uppercase"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Motivation excerpt */}
                      {m.motivation && (
                        <p className="text-[#888] font-dosis text-xs leading-relaxed line-clamp-3 mb-4 bg-[#0d0d0d] p-3 rounded-lg border border-[#1a1a1a]">
                          "{m.motivation}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#1f1f1f] flex items-center justify-between mt-auto">
                      {m.github ? (
                        <a
                          href={m.github.startsWith('http') ? m.github : `https://github.com/${m.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#888] hover:text-[#FF6B00] transition-colors"
                        >
                          <FaGithub className="w-3.5 h-3.5" /> {m.github.replace('https://github.com/', '')}
                        </a>
                      ) : (
                        <span className="text-[#444] font-mono text-xs">CodeWithBPMCE</span>
                      )}

                      {userId && (
                        <Link
                          href={`/profile/${userId}`}
                          className="inline-flex items-center gap-1 font-dosis font-semibold text-xs text-[#FF6B00] hover:underline"
                        >
                          Profile <Eye className="w-3.5 h-3.5" />
                        </Link>
                      )}
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
