'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Zap, Users, Code2, Award, ChevronDown, Sparkles, ShieldCheck } from 'lucide-react';

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[88vh] flex flex-col justify-center items-center overflow-hidden grid-bg pt-28 pb-16 text-center"
    >
      {/* Central glowing ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-[#FF6B00]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle vertical grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#1f1f1f]/50 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#1f1f1f]/50 to-transparent" />
      </div>

      <div className="container-custom relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Announcement Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 bg-[#111111] border border-[#1f1f1f] hover:border-[#FF6B00]/40 rounded-full px-5 py-2 transition-colors mb-6"
        >
          <div className="tag-pill flex items-center gap-1.5 border-none bg-[#FF6B00]/15 text-[#FF6B00] py-0.5 px-2.5 text-[10px]">
            <Terminal className="w-3 h-3" />
            BPMCE Official
          </div>
          <span className="text-[#a0a0a0] text-xs font-dosis font-semibold tracking-wide">
            Premier Coding Club of Madhepura
          </span>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse ml-1" />
        </motion.div>

        {/* Main Headline — Each word gets its own font & color */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <h1 className="font-bold tracking-widest leading-[1.05] text-center flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {/* CODE. — Chiller (horror/drip) — Fiery Orange */}
            <span
              className="text-6xl sm:text-8xl md:text-9xl drop-shadow-[0_0_20px_rgba(255,107,0,0.6)]"
              style={{ fontFamily: "'Creepster', cursive", color: '#FF6B00', letterSpacing: '0.08em' }}
            >
              CODE.
            </span>
            {/* BUILD. — Cinzel Decorative (Birhuk Lord / bold Roman) — Electric Cyan */}
            <span
              className="text-5xl sm:text-7xl md:text-8xl drop-shadow-[0_0_25px_rgba(0,220,255,0.55)]"
              style={{ fontFamily: "'Cinzel Decorative', serif", color: '#00DCFF', fontWeight: 900, letterSpacing: '0.04em' }}
            >
              BUILD.
            </span>
            {/* INNOVATE. — Pirata One (Bladus / gothic) — Neon Purple */}
            <span
              className="text-5xl sm:text-7xl md:text-8xl drop-shadow-[0_0_25px_rgba(180,0,255,0.5)]"
              style={{ fontFamily: "'Pirata One', cursive", color: '#C060FF', letterSpacing: '0.05em' }}
            >
              INNOVATE.
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#888888] text-lg sm:text-xl md:text-2xl font-dosis font-medium max-w-2xl leading-relaxed mb-8 text-center"
        >
          Empowering engineers at BP Mandal College of Engineering. 
          Master Full-Stack Dev, DSA, AI/ML, and Open-Source with curated roadmaps and hands-on projects.
        </motion.p>

        {/* Centered CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <Link href="/join" className="btn-primary text-sm py-4 px-9 shadow-xl shadow-[#FF6B00]/25 group">
            Join Club
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/roadmaps" className="btn-outline text-sm py-4 px-8 group">
            Explore Roadmaps
            <Zap className="w-4 h-4 text-[#FF6B00]" />
          </Link>
        </motion.div>

        {/* Highlights Stat Bar */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-2xl pt-8 border-t border-[#1f1f1f]/80 grid grid-cols-3 gap-6 text-center"
        >
          {[
            { icon: Users, value: '500+', label: 'Active Members' },
            { icon: Code2, value: '80+', label: 'Projects Built' },
            { icon: Award, value: '120+', label: 'Achievements' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Icon className="w-4 h-4 text-[#FF6B00]" />
                <span className="text-white font-display font-bold text-2xl sm:text-3xl leading-none">
                  {value}
                </span>
              </div>
              <p className="text-[#555555] text-xs font-mono uppercase tracking-wider">
                {label}
              </p>
            </div>
          ))}
        </motion.div>

      </div>

      {/* Bottom Scroll Prompt */}
      <div className="pt-12">
        <div className="flex flex-col items-center gap-1.5 text-[#555555] hover:text-[#FF6B00] transition-colors cursor-pointer group">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Explore More</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#FF6B00]" />
        </div>
      </div>
    </section>
  );
}


