'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Mail, ExternalLink, Users, Calendar, PenTool, Award, FolderGit2 } from 'lucide-react';
import { FaGithub, FaYoutube, FaTwitter } from 'react-icons/fa';
import { usersAPI, eventsAPI, blogsAPI, projectsAPI } from '@/lib/api';
import Link from 'next/link';

const channels = [
  { icon: MessageSquare, name: 'Discord', desc: 'Main hub for discussions, help, events, and networking.', href: '#', label: 'Join Discord Server', color: '#5865F2' },
  { icon: Send, name: 'Telegram', desc: 'Quick updates, announcements, and resource sharing.', href: '#', label: 'Join Telegram Group', color: '#2AABEE' },
  { icon: FaGithub, name: 'GitHub Org', desc: 'Collaborate on club projects, contribute to open source.', href: 'https://github.com', label: 'View Organization', color: '#ffffff' },
  { icon: FaYoutube, name: 'YouTube', desc: 'Workshop recordings, tutorials, and event highlights.', href: 'https://youtube.com', label: 'Subscribe Channel', color: '#ef4444' },
];

export default function CommunityPage() {
  const [stats, setStats] = useState({
    members: 0,
    events: 0,
    blogs: 0,
    projects: 0,
  });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      usersAPI.getLeaderboard(),
      eventsAPI.getAll(),
      blogsAPI.getAll(),
      projectsAPI.getAll(),
    ]).then(([usersRes, eventsRes, blogsRes, projectsRes]) => {
      const uList = usersRes.value?.data?.data || [];
      const eList = eventsRes.value?.data?.data || [];
      const bList = blogsRes.value?.data?.data || [];
      const pList = projectsRes.value?.data?.data || [];

      setStats({
        members: uList.length,
        events: eList.length,
        blogs: bList.length,
        projects: pList.length,
      });

      setRecentBlogs(bList.slice(0, 3));
      setRecentEvents(eList.slice(0, 3));
    }).catch(() => {});
  }, []);

  return (
    <div className="pt-20">
      <section className="section-padding grid-bg">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="tag-pill mb-4 inline-block">Community</div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
              Join the <span className="text-gradient">Community</span>
            </h1>
            <p className="text-[#6a6a6a] text-xl font-dosis max-w-2xl">
              Connect with {stats.members > 0 ? stats.members : ''} developers at BPMCE. Ask questions, share projects, find collaborators, and grow together.
            </p>
          </motion.div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="card-dark p-4 flex items-center gap-3">
              <Users className="w-6 h-6 text-[#FF6B00]" />
              <div>
                <div className="font-display font-bold text-xl text-white">{stats.members}</div>
                <div className="font-dosis text-xs text-[#888]">Active Members</div>
              </div>
            </div>
            <div className="card-dark p-4 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-400" />
              <div>
                <div className="font-display font-bold text-xl text-white">{stats.events}</div>
                <div className="font-dosis text-xs text-[#888]">Club Events</div>
              </div>
            </div>
            <div className="card-dark p-4 flex items-center gap-3">
              <PenTool className="w-6 h-6 text-green-400" />
              <div>
                <div className="font-display font-bold text-xl text-white">{stats.blogs}</div>
                <div className="font-dosis text-xs text-[#888]">Tech Articles</div>
              </div>
            </div>
            <div className="card-dark p-4 flex items-center gap-3">
              <FolderGit2 className="w-6 h-6 text-purple-400" />
              <div>
                <div className="font-display font-bold text-xl text-white">{stats.projects}</div>
                <div className="font-dosis text-xs text-[#888]">Student Projects</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="accent-line mb-4" />
          <h2 className="font-display text-4xl font-bold text-white mb-10">Connect <span className="text-gradient">With Us</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {channels.map(({ icon: Icon, name, desc, color, href, label }, i) => (
              <motion.a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-dark p-6 group hover:border-[#FF6B00]/30 transition-all flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="font-display font-bold text-white text-xl mb-2 group-hover:text-[#FF6B00] transition-colors">{name}</h3>
                <p className="text-[#6a6a6a] text-sm font-dosis leading-relaxed flex-1 mb-5">{desc}</p>
                <div className="flex items-center gap-2 text-[#FF6B00] text-xs font-mono font-bold mt-auto pt-2">
                  {label} <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Real Recent Discussions from Database */}
      <section className="section-padding bg-[#0d0d0d]">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="accent-line mb-4" />
          <h2 className="font-display text-4xl font-bold text-white mb-8">Recent Community <span className="text-gradient">Discussions &amp; Articles</span></h2>
          
          <div className="space-y-3">
            {recentBlogs.map((b) => (
              <Link key={b._id} href={`/blogs/${b._id}`}>
                <div className="card-dark p-5 flex items-center justify-between group hover:border-[#FF6B00]/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <PenTool className="w-5 h-5 text-[#FF6B00]" />
                    <div>
                      <h4 className="text-white font-dosis font-bold text-base group-hover:text-[#FF6B00] transition-colors">{b.title}</h4>
                      <p className="text-[#666] font-mono text-xs mt-0.5">by {b.author?.name || 'Student Author'} · {b.category || 'General'}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#444] group-hover:text-[#FF6B00] transition-colors" />
                </div>
              </Link>
            ))}

            {recentEvents.map((e) => (
              <Link key={e._id} href="/events">
                <div className="card-dark p-5 flex items-center justify-between group hover:border-blue-500/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <div>
                      <h4 className="text-white font-dosis font-bold text-base group-hover:text-blue-400 transition-colors">{e.title}</h4>
                      <p className="text-[#666] font-mono text-xs mt-0.5">{new Date(e.date).toLocaleDateString()} · {e.venue || 'BPMCE Campus'}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#444] group-hover:text-blue-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
