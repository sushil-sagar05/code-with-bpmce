'use client';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';

export default function PageLoader({ text = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-[#0a0a0a]">
      {/* Central Glowing Ambient Light */}
      <div className="absolute w-72 h-72 bg-[#FF6B00]/15 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative flex flex-col items-center gap-6"
      >
        {/* Animated Logo Container */}
        <div className="relative">
          {/* Outer Pulsing Glow Ring */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-3 bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#FF6B00] rounded-2xl blur-lg opacity-60"
          />

          {/* Logo Box */}
          <div className="relative w-16 h-16 bg-[#0d0d0d] border border-[#FF6B00]/40 rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF6B00]/20">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Code2 className="w-9 h-9 text-[#FF6B00]" strokeWidth={2.5} />
            </motion.div>
          </div>
        </div>

        {/* Branding & Subtext */}
        <div className="text-center space-y-1 z-10">
          <div className="flex items-center gap-1 font-display text-white text-xl font-bold">
            Code<span className="text-[#FF6B00]">With</span><span className="font-mono text-xs text-[#888] tracking-widest uppercase ml-1">BPMCE</span>
          </div>
          <p className="font-mono text-xs text-[#666] tracking-wider animate-pulse">{text}</p>
        </div>

        {/* Shimmering Progress Bar */}
        <div className="w-40 h-1 bg-[#1a1a1a] rounded-full overflow-hidden relative border border-[#2a2a2a]">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent"
          />
        </div>
      </motion.div>
    </div>
  );
}

export function SectionLoader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 w-full">
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -inset-2 bg-[#FF6B00]/30 rounded-xl blur-md"
        />
        <div className="relative w-10 h-10 bg-[#0d0d0d] border border-[#FF6B00]/40 rounded-xl flex items-center justify-center shadow-lg">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Code2 className="w-5 h-5 text-[#FF6B00]" strokeWidth={2.5} />
          </motion.div>
        </div>
      </div>
      <p className="font-mono text-xs text-[#666] animate-pulse">{text}</p>
    </div>
  );
}

export function ButtonLoader({ text = 'Loading...' }) {
  return (
    <div className="inline-flex items-center gap-2">
      <motion.div
        animate={{ rotate: [0, 20, -20, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-4 h-4 rounded bg-[#FF6B00]/20 border border-[#FF6B00]/40 flex items-center justify-center"
      >
        <Code2 className="w-3 h-3 text-[#FF6B00]" strokeWidth={3} />
      </motion.div>
      <span>{text}</span>
    </div>
  );
}

export function LogoOverlayLoader() {
  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[#FF6B00]/40 rounded-lg blur-sm"
      />
      <div className="relative w-6 h-6 bg-[#0d0d0d] border border-[#FF6B00]/50 rounded-md flex items-center justify-center shadow-sm">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Code2 className="w-3.5 h-3.5 text-[#FF6B00]" strokeWidth={2.5} />
        </motion.div>
      </div>
    </div>
  );
}
