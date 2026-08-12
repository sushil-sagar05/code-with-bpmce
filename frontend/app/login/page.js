'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code2, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.email, form.password);
    if (!result.success) {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg pt-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-[#FF6B00] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FF6B00]/30">
            <Code2 className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-[#6a6a6a] font-dosis text-sm mt-2">Sign in to your CodeWithBPMCE account</p>
        </div>

        <div className="card-dark p-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded p-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm font-dosis">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[#a0a0a0] font-dosis text-xs font-semibold mb-1.5 block uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a4a]" />
                <input
                  type="email"
                  id="login-email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@bpmce.ac.in"
                  className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-3 pl-10 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#4a4a4a]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[#a0a0a0] font-dosis text-xs font-semibold uppercase tracking-wide">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a4a]" />
                <input
                  type={show ? 'text' : 'password'}
                  id="login-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-3 pl-10 pr-10 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#4a4a4a]"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a4a] hover:text-white transition-colors">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#1f1f1f] text-center">
            <p className="text-[#6a6a6a] font-dosis text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#FF6B00] hover:underline font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
