'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Zap, Users, Code2, Trophy, Sparkles, CheckCircle2, Copy, Check, Play, Flame } from 'lucide-react';

export default function HeroSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('git clone https://github.com/bpmce/devbuddies.git');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-[#0a0a0a] grid-bg pt-28 pb-20 text-left border-b border-[#1f1f1f]"
    >
      {/* Signature Orange Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] bg-[#FF6B00]/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-[#FF8C00]/8 rounded-full blur-[130px] pointer-events-none" />

      <div className="container-custom relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Live Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 bg-[#111111] border border-[#1f1f1f] hover:border-[#FF6B00]/40 rounded-full px-4 py-1.5 backdrop-blur-md transition-colors mb-6 shadow-md"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]"></span>
              </span>
              <span className="text-[#FF6B00] text-xs font-mono font-semibold tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF8C00]" />
                BPMCE Premier Tech Community
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 font-sans"
            >
              Architecting the <br />
              <span className="text-gradient">
                Future Engineers
              </span>{' '}
              of Bihar.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#a0a0a0] text-lg sm:text-xl font-normal max-w-2xl leading-relaxed mb-8"
            >
              Join BP Mandal College of Engineering&apos;s flagship developer hub. Master Full-Stack Development, Data Structures, AI/ML, and Open Source through peer learning and real-world projects.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto"
            >
              <Link
                href="/join"
                className="btn-primary text-sm py-3.5 px-8 shadow-lg shadow-[#FF6B00]/20 rounded-lg group"
              >
                Join Community
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link
                href="/roadmaps"
                className="btn-outline text-sm py-3.5 px-7 rounded-lg group"
              >
                <Zap className="w-4 h-4 text-[#FF6B00]" />
                Explore Roadmaps
              </Link>
            </motion.div>

            {/* Quick Terminal Command */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full max-w-lg bg-[#111111] border border-[#1f1f1f] rounded-xl p-3.5 flex items-center justify-between text-xs font-mono text-[#a0a0a0] shadow-inner mb-8"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Terminal className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span className="text-[#FF8C00] shrink-0">$</span>
                <span className="truncate text-white">git clone https://github.com/bpmce/devbuddies.git</span>
              </div>
              <button
                onClick={handleCopyCommand}
                className="ml-2 shrink-0 p-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] text-[#a0a0a0] hover:text-[#FF6B00] border border-[#1f1f1f] transition-colors"
                title="Copy command"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#FF6B00]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-[#1f1f1f] w-full max-w-lg"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#FF6B00]" />
                  <span className="text-xl sm:text-2xl font-bold text-white font-display">500+</span>
                </div>
                <p className="text-xs text-[#6a6a6a] font-medium mt-0.5">Active Developers</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-[#FF8C00]" />
                  <span className="text-xl sm:text-2xl font-bold text-white font-display">80+</span>
                </div>
                <p className="text-xs text-[#6a6a6a] font-medium mt-0.5">Projects Shipped</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-[#FF6B00]" />
                  <span className="text-xl sm:text-2xl font-bold text-white font-display">120+</span>
                </div>
                <p className="text-xs text-[#6a6a6a] font-medium mt-0.5">Verified Badges</p>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Code Terminal & Visual Card */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            
            {/* Floating Decorative Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="w-full max-w-md relative"
            >
              {/* Code Window Container */}
              <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl shadow-2xl overflow-hidden relative z-10 hover:border-[#FF6B00]/40 transition-colors">
                
                {/* Header bar */}
                <div className="bg-[#141414] px-4 py-3 border-b border-[#1f1f1f] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF453A]" />
                    <div className="w-3 h-3 rounded-full bg-[#FF9F0A]" />
                    <div className="w-3 h-3 rounded-full bg-[#30D158]" />
                    <span className="text-xs font-mono text-[#6a6a6a] ml-2">bpmce_dev.js</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-0.5 rounded border border-[#FF6B00]/20">
                    <Play className="w-3 h-3 fill-current" /> Running
                  </div>
                </div>

                {/* Code body */}
                <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed text-[#f5f5f5] overflow-x-auto">
                  <div className="text-[#6a6a6a] comment mb-2">// DevBuddies Engineering Hub</div>
                  <div>
                    <span className="text-[#FF6B00]">const</span> <span className="text-white">community</span> = <span className="text-[#FF6B00]">new</span> <span className="text-[#FF8C00]">DevBuddies</span>({'{'}
                  </div>
                  <div className="pl-4">
                    <span className="text-[#a0a0a0]">college:</span> <span className="text-[#FFB347]">&apos;BPMCE Madhepura&apos;</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-[#a0a0a0]">tracks:</span> [<span className="text-[#FFB347]">&apos;FullStack&apos;</span>, <span className="text-[#FFB347]">&apos;DSA&apos;</span>, <span className="text-[#FFB347]">&apos;AI/ML&apos;</span>],
                  </div>
                  <div className="pl-4">
                    <span className="text-[#a0a0a0]">status:</span> <span className="text-[#FFB347]">&apos;Empowering Future Engineers&apos;</span>
                  </div>
                  <div>{'}'});</div>
                  <br />
                  <div>
                    <span className="text-[#FF6B00]">await</span> <span className="text-white">community</span>.<span className="text-[#FF8C00]">empowerEngineers</span>();
                  </div>
                  <div className="mt-4 text-[#FF6B00] flex items-center gap-1.5 bg-[#FF6B00]/10 p-2 rounded border border-[#FF6B00]/20 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Success: 500+ active members connected</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Top Right */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-5 -right-4 z-20 bg-[#111111]/95 border border-[#FF6B00]/30 backdrop-blur-md p-3.5 rounded-xl shadow-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/15 flex items-center justify-center text-[#FF6B00]">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Daily Leaderboard</div>
                  <div className="text-[11px] text-[#a0a0a0]">Updated Live</div>
                </div>
              </motion.div>

              {/* Floating Badge 2: Bottom Left */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-6 -left-4 z-20 bg-[#111111]/95 border border-[#FF6B00]/30 backdrop-blur-md p-3.5 rounded-xl shadow-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/15 flex items-center justify-center text-[#FF6B00]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Curated Syllabus</div>
                  <div className="text-[11px] text-[#a0a0a0]">AKU / BEU Aligned</div>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}



