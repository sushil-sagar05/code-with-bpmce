'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { MessageSquare, ArrowRight, Users, Zap } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const communityLinks = [
  {
    icon: MessageSquare,
    platform: 'Discord',
    desc: 'Join our Discord for real-time help, events, and discussions.',
    count: '500+ members',
    href: '#',
    color: '#5865F2',
    label: 'Join Discord',
  },
  {
    icon: FaGithub,
    platform: 'GitHub Org',
    desc: 'Collaborate on open source projects and contribute to our repos.',
    count: '80+ repositories',
    href: '#',
    color: '#ffffff',
    label: 'View GitHub',
  },
];

export default function CommunityCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="section-padding relative">
      <div className="container-custom">
        {/* Full-width CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-xl border border-[#FF6B00]/20 bg-[#0d0d0d] p-12 md:p-16 text-center"
        >
          {/* Background dot grid */}
          <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 bg-[#FF6B00]/8 blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <div className="tag-pill mb-6 inline-block">Join the community</div>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Ready to <span className="text-gradient">Level Up</span>?
            </h2>
            <p className="text-[#6a6a6a] text-xl font-dosis max-w-2xl mx-auto mb-10 leading-relaxed">
              Become part of a community of driven developers. Get mentorship, work on real projects, 
              and build your career at BPMCE's premier coding club.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/join" className="btn-primary text-base py-3.5 px-8">
                Apply to Join Club <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/community" className="btn-outline text-base py-3.5 px-8">
                Explore Community <Users className="w-5 h-5" />
              </Link>
            </div>

            {/* Community cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {communityLinks.map(({ icon: Icon, platform, desc, count, href, color, label }) => (
                <a
                  key={platform}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-dark p-5 flex items-center gap-4 group hover:border-[#FF6B00]/40 transition-all text-left"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-dosis font-bold text-sm">{platform}</span>
                      <span className="font-mono text-[10px] text-[#4a4a4a]">{count}</span>
                    </div>
                    <p className="text-[#6a6a6a] text-xs font-dosis mt-0.5">{desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#4a4a4a] group-hover:text-[#FF6B00] transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
