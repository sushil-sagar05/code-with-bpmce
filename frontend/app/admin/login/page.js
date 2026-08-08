'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Terminal } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(form.email, form.password);
      if (!result.success) {
        setError(result.message);
      } else if (result.user?.role !== 'admin') {
        // Logged in but not admin — show error and log them out
        setError('Access denied. This account does not have administrator privileges.');
      }
      // If admin, redirect is handled inside AuthContext → router.push('/admin')
    } catch (_) {
      setError('An unexpected error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'radial-gradient(ellipse at center, #1a0000 0%, #0a0a0a 60%)' }}>
      {/* Red ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-red-900/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Restricted tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="font-chiller text-lg text-red-400 uppercase tracking-widest">Restricted Zone</span>
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-500/10 border-2 border-red-500/40 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-900/30">
            <Shield className="w-9 h-9 text-red-400" />
          </div>
          <h1 className="font-chiller text-5xl sm:text-6xl font-bold tracking-wider text-white">
            Admin <span style={{ color: '#ef4444' }}>Portal</span>
          </h1>
          <p className="text-[#6a6a6a] font-dosis text-sm mt-2">CodeWithBPMCE Control Center</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Terminal className="w-3 h-3 text-red-400" />
            <span className="font-mono text-[10px] text-red-400/70 uppercase tracking-widest">Authorized Personnel Only</span>
          </div>
        </div>

        <div className="border border-red-500/20 bg-[#0d0d0d] rounded-xl p-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded p-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm font-dosis">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-red-400/70 font-mono text-[10px] font-semibold mb-2 block uppercase tracking-widest">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400/40" />
                <input
                  type="email"
                  id="admin-email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@bpmce.ac.in"
                  className="w-full bg-[#0a0a0a] border border-red-500/20 rounded px-4 py-3 pl-10 text-white text-sm font-dosis focus:outline-none focus:border-red-500/60 transition-colors placeholder-[#4a4a4a]"
                />
              </div>
            </div>

            <div>
              <label className="text-red-400/70 font-mono text-[10px] font-semibold mb-2 block uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400/40" />
                <input
                  type={show ? 'text' : 'password'}
                  id="admin-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#0a0a0a] border border-red-500/20 rounded px-4 py-3 pl-10 pr-10 text-white text-sm font-dosis focus:outline-none focus:border-red-500/60 transition-colors placeholder-[#4a4a4a]"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400/40 hover:text-red-400 transition-colors">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="admin-login-submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded bg-red-500 hover:bg-red-600 text-white font-dosis font-bold transition-all shadow-lg shadow-red-900/30 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Access Admin Panel
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-red-500/10 text-center">
            <Link href="/login" className="text-[#4a4a4a] font-mono text-xs hover:text-[#6a6a6a] transition-colors">
              ← Back to regular login
            </Link>
          </div>
        </div>

        {/* Security note */}
        <p className="text-center text-[#333333] font-mono text-[9px] mt-4 uppercase tracking-widest">
          All access attempts are logged and monitored
        </p>
      </motion.div>
    </div>
  );
}
