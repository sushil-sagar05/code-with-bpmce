'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Zap, Sparkles, CheckCircle2, Copy, Check, RotateCcw } from 'lucide-react';

const CODE_TOKENS = [
  // Line 1
  [
    { text: '// DevBuddies Engineering Hub', class: 'text-[#6A9955] italic' }
  ],
  // Line 2
  [
    { text: 'const ', class: 'text-[#569CD6]' },
    { text: 'community ', class: 'text-[#9CDCFE]' },
    { text: '= ', class: 'text-[#D4D4D4]' },
    { text: 'new ', class: 'text-[#569CD6]' },
    { text: 'DevBuddies', class: 'text-[#4EC9B0]' },
    { text: '({', class: 'text-[#FFD700]' }
  ],
  // Line 3
  [
    { text: '  college: ', class: 'text-[#9CDCFE]' },
    { text: "'BPMCE Madhepura'", class: 'text-[#CE9178]' },
    { text: ',', class: 'text-[#D4D4D4]' }
  ],
  // Line 4
  [
    { text: '  tracks: ', class: 'text-[#9CDCFE]' },
    { text: '[', class: 'text-[#DA70D6]' },
    { text: "'FullStack'", class: 'text-[#CE9178]' },
    { text: ', ', class: 'text-[#D4D4D4]' },
    { text: "'DSA'", class: 'text-[#CE9178]' },
    { text: ', ', class: 'text-[#D4D4D4]' },
    { text: "'AI/ML'", class: 'text-[#CE9178]' },
    { text: '],', class: 'text-[#DA70D6]' }
  ],
  // Line 5
  [
    { text: '  status: ', class: 'text-[#9CDCFE]' },
    { text: "'Empowering Engineers'", class: 'text-[#CE9178]' }
  ],
  // Line 6
  [
    { text: '});', class: 'text-[#FFD700]' }
  ],
  // Line 7
  [],
  // Line 8
  [
    { text: 'await ', class: 'text-[#C586C0]' },
    { text: 'community', class: 'text-[#9CDCFE]' },
    { text: '.', class: 'text-[#D4D4D4]' },
    { text: 'empowerEngineers', class: 'text-[#DCDCAA]' },
    { text: '();', class: 'text-[#DA70D6]' }
  ]
];

// Helper to calculate total line length for tokenized lines
const GET_LINE_TEXT = (tokens) => tokens.map(t => t.text).join('');

export default function HeroSection() {
  const [copied, setCopied] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const startTyping = () => {
    setLineIndex(0);
    setCharIndex(0);
    setIsTypingComplete(false);
  };

  useEffect(() => {
    if (lineIndex < CODE_TOKENS.length) {
      const lineText = GET_LINE_TEXT(CODE_TOKENS[lineIndex]);
      if (lineText.length === 0) {
        setLineIndex(prev => prev + 1);
        setCharIndex(0);
        return;
      }
      if (charIndex < lineText.length) {
        const timer = setTimeout(() => {
          setCharIndex(prev => prev + 1);
        }, 30);
        return () => clearTimeout(timer);
      } else {
        const lineTimer = setTimeout(() => {
          setLineIndex(prev => prev + 1);
          setCharIndex(0);
        }, 120);
        return () => clearTimeout(lineTimer);
      }
    } else {
      setIsTypingComplete(true);
    }
  }, [lineIndex, charIndex]);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('git clone https://github.com/bpmce/devbuddies.git');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render typed tokens for a specific line
  const renderLineTokens = (tokens, charCount) => {
    let remainingChars = charCount;
    return tokens.map((token, tIdx) => {
      if (remainingChars <= 0) return null;
      const textToRender = token.text.slice(0, remainingChars);
      remainingChars -= token.text.length;
      return (
        <span key={tIdx} className={token.class}>
          {textToRender}
        </span>
      );
    });
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
                <span className="truncate text-white">git clone https://github.com/rajnish032/code-with-bpmce</span>
              </div>
              <button
                onClick={handleCopyCommand}
                className="ml-2 shrink-0 p-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] text-[#a0a0a0] hover:text-[#FF6B00] border border-[#1f1f1f] transition-colors"
                title="Copy command"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#FF6B00]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </motion.div>

          </div>

          {/* Right Column: Code Terminal & Visual Card */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="w-full max-w-md relative"
            >
              {/* Code Window Container */}
              <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl shadow-2xl overflow-hidden relative z-10">
                
                {/* Header bar */}
                <div className="bg-[#141414] px-4 py-3 border-b border-[#1f1f1f] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF453A]" />
                    <div className="w-3 h-3 rounded-full bg-[#FF9F0A]" />
                    <div className="w-3 h-3 rounded-full bg-[#30D158]" />
                    <span className="text-xs font-mono text-[#6a6a6a] ml-2">bpmce_dev.js</span>
                  </div>
                  <button
                    onClick={startTyping}
                    className="flex items-center gap-1 text-[11px] font-mono text-[#a0a0a0] hover:text-[#FF6B00] bg-[#1a1a1a] hover:bg-[#222222] px-2 py-0.5 rounded border border-[#1f1f1f] transition-colors cursor-pointer"
                    title="Re-type code"
                  >
                    <RotateCcw className="w-3 h-3" /> Re-type
                  </button>
                </div>

                {/* Code body - Typing Animation with VS Code Syntax Highlighting */}
                <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[220px]">
                  {CODE_TOKENS.map((tokens, idx) => {
                    if (idx > lineIndex) return null;

                    const isCurrentLine = idx === lineIndex;
                    const maxCharsForLine = isCurrentLine ? charIndex : GET_LINE_TEXT(tokens).length;

                    return (
                      <div key={idx} className="min-h-[1.5rem] whitespace-pre flex items-center">
                        {renderLineTokens(tokens, maxCharsForLine)}
                        {isCurrentLine && (
                          <span className="inline-block w-2 h-4 bg-[#FF6B00] ml-0.5 align-middle animate-pulse" />
                        )}
                      </div>
                    );
                  })}

                  {/* Execution Badge when finished typing */}
                  {isTypingComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-[#FF6B00] flex items-center gap-1.5 bg-[#FF6B00]/10 p-2 rounded border border-[#FF6B00]/20 text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Ready: 500+ active members connected</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Clean integrated footer chip */}
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#a0a0a0] px-1">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Typing Interactive Demo
                </span>
                <span className="text-[#6a6a6a]">BEU / AKU Aligned</span>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}



