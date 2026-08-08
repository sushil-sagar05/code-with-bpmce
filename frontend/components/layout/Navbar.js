'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2, ChevronDown, Shield, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Club Members', href: '/members' },
  {
    label: 'Learn',
    href: '#',
    children: [
      { label: 'Roadmaps', href: '/roadmaps' },
      { label: 'Resources', href: '/resources' },
    ],
  },
  {
    label: 'Community',
    href: '#',
    children: [
      { label: 'Projects', href: '/projects' },
      { label: 'Achievements', href: '/achievements' },
      { label: 'Leaderboard', href: '/leaderboard' },
      { label: 'Community', href: '/community' },
    ],
  },
  { label: 'Events', href: '/events' },
  { label: 'Blogs', href: '/blogs' },
];

function UserMenu({ user, isAdmin, logout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 group">
        {/* Avatar — shows photo if available */}
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className={`w-8 h-8 rounded-full object-cover border-2 transition-all ${
              isAdmin ? 'border-red-500/50 group-hover:border-red-400' : 'border-[#FF6B00]/50 group-hover:border-[#FF6B00]'
            }`}
          />
        ) : (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono border-2 transition-all ${
            isAdmin
              ? 'bg-red-500/10 border-red-500/40 text-red-400 group-hover:border-red-400'
              : 'bg-[#FF6B00]/10 border-[#FF6B00]/40 text-[#FF6B00] group-hover:border-[#FF6B00]'
          }`}>
            {user.name?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        {/* Admin badge */}
        {isAdmin && (
          <span className="font-mono text-[9px] text-red-400 border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 rounded uppercase tracking-widest">
            ADMIN
          </span>
        )}
        <ChevronDown className={`w-3 h-3 text-[#6a6a6a] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full right-0 mt-3 w-60 bg-[#111111] border rounded-xl py-2 shadow-2xl z-50 ${
              isAdmin ? 'border-red-500/20' : 'border-[#1f1f1f]'
            }`}
          >
            {/* Profile header with photo */}
            <div className="px-4 py-3 border-b border-[#1f1f1f] mb-1">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className={`w-11 h-11 rounded-xl object-cover border flex-shrink-0 ${
                      isAdmin ? 'border-red-500/30' : 'border-[#FF6B00]/30'
                    }`}
                  />
                ) : (
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold font-display border flex-shrink-0 ${
                    isAdmin
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : 'bg-[#FF6B00]/10 border-[#FF6B00]/30 text-[#FF6B00]'
                  }`}>
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-white font-dosis font-bold text-sm truncate">{user.name}</p>
                  <p className="text-[#555555] font-mono text-[10px] truncate">{user.email}</p>
                  {isAdmin && (
                    <div className="flex items-center gap-1 mt-1">
                      <Shield className="w-2.5 h-2.5 text-red-400" />
                      <span className="font-mono text-[9px] text-red-400 uppercase tracking-widest">Administrator</span>
                    </div>
                  )}
                  {user.branch && (
                    <p className="font-mono text-[9px] text-[#444] mt-0.5 truncate">{user.branch} {user.batch && `• ${user.batch}`}</p>
                  )}
                </div>
              </div>
              {/* Club points */}
              {(user.points > 0) && (
                <div className="mt-2.5 flex items-center gap-1.5 bg-[#FF6B00]/5 border border-[#FF6B00]/15 px-3 py-1.5 rounded-lg">
                  <span className="text-[#FF6B00] font-bold font-mono text-xs">{user.points}</span>
                  <span className="text-[#666] font-mono text-[10px]">Club Points</span>
                </div>
              )}
            </div>

            {isAdmin && (
              <Link href="/admin" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 font-dosis font-semibold transition-colors">
                <Shield className="w-4 h-4" />Admin Panel
              </Link>
            )}

            <Link href="/dashboard" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] font-dosis font-semibold transition-colors">
              <LayoutDashboard className="w-4 h-4" />Dashboard
            </Link>
            <Link href="/profile" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] font-dosis font-semibold transition-colors">
              <User className="w-4 h-4" />My Profile
            </Link>

            <div className="border-t border-[#1f1f1f] mt-1 pt-1">
              <button onClick={() => { setOpen(false); logout(); }}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6a6a6a] hover:text-red-400 hover:bg-red-500/5 font-dosis font-semibold transition-colors w-full text-left">
                <LogOut className="w-4 h-4" />Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const { user, isAdmin, logout, loading } = useAuth();

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1f1f1f]/50 transition-all duration-300">
      <nav className="container-custom flex items-center justify-between h-16 md:h-18">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8">
            <div className="w-8 h-8 bg-[#FF6B00] rounded flex items-center justify-center">
              <Code2 className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div className="absolute inset-0 bg-[#FF6B00]/30 rounded blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="leading-none">
            <span className="font-display text-white text-lg font-bold block">
              Code<span className="text-[#FF6B00]">With</span>
            </span>
            <span className="font-mono text-[9px] text-[#6a6a6a] tracking-[0.18em] uppercase">BPMCE</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6" ref={dropdownRef}>
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="relative">
                <button
                  className="nav-link animated-underline flex items-center gap-1"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                  onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                >
                  {link.label}
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-3 w-48 bg-[#111111] border border-[#1f1f1f] rounded-lg py-2 shadow-xl"
                      onMouseEnter={() => setActiveDropdown(link.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {link.children.map((child) => (
                        <Link key={child.href} href={child.href}
                          className="flex items-center px-4 py-2.5 text-sm text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] font-dosis font-semibold uppercase tracking-wide transition-colors">
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link key={link.href} href={link.href}
                className={`nav-link animated-underline ${pathname === link.href ? 'active' : ''}`}>
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* CTA / Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-6 h-6 border-2 border-[#1f1f1f] border-t-[#FF6B00] rounded-full animate-spin" />
          ) : user ? (
            <UserMenu user={user} isAdmin={isAdmin} logout={logout} />
          ) : (
            <>
              <Link href="/login" className="btn-outline text-sm py-2 px-5">Login</Link>
              <Link href="/join" className="btn-primary text-sm py-2 px-5">Join Club</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" id="mobile-menu-btn">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0d0d0d] border-b border-[#1f1f1f] overflow-hidden"
          >
            <div className="container-custom py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.children ? (
                    <>
                      <span className="nav-link block mb-2">{link.label}</span>
                      <div className="pl-4 flex flex-col gap-2 border-l border-[#1f1f1f]">
                        {link.children.map((child) => (
                          <Link key={child.href} href={child.href} className="nav-link block">{child.label}</Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link href={link.href} className="nav-link block">{link.label}</Link>
                  )}
                </div>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-[#1f1f1f]">
                {user ? (
                  <>
                    {/* Mobile User Card */}
                    <div className="flex items-center gap-3 p-3 bg-[#111] border border-[#1f1f1f] rounded-xl">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover border border-[#FF6B00]/30 flex-shrink-0" />
                      ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold font-display border flex-shrink-0 ${
                          isAdmin ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-[#FF6B00]/10 border-[#FF6B00]/30 text-[#FF6B00]'
                        }`}>
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-white font-dosis font-bold text-sm truncate">{user.name}</p>
                        <p className="text-[#555] font-mono text-[10px] truncate">{user.email}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-2 text-red-400 font-dosis font-bold text-sm px-3 py-2 border border-red-500/30 rounded bg-red-500/10">
                        <Shield className="w-4 h-4" />Admin Panel
                        <span className="ml-auto font-mono text-[9px] text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded uppercase">ADMIN</span>
                      </Link>
                    )}
                    <Link href="/dashboard" className="btn-outline text-center">Dashboard</Link>
                    <Link href="/profile" className="flex items-center justify-center gap-2 text-[#a0a0a0] hover:text-white font-dosis font-semibold text-sm transition-colors py-2">
                      <User className="w-4 h-4" />My Profile
                    </Link>
                    <button onClick={logout} className="text-[#6a6a6a] hover:text-red-400 font-dosis text-sm font-semibold text-center transition-colors">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="btn-outline text-center">Login</Link>
                    <Link href="/join" className="btn-primary text-center justify-center">Join Club</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
