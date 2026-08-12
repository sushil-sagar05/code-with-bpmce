'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code2, Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const branches = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE','CSE(AI & ML)','3DAG', 'Other'];
const years = ['2023','2024', '2025', '2026', '2027', '2028'];

export default function RegisterPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', branch: '', batch: '' });
  const { register } = useAuth();
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const result = await register(form);
    if (!result.success) setError(result.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg pt-16 px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-[#FF6B00] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FF6B00]/30">
            <Code2 className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create Account</h1>
          <p className="text-[#6a6a6a] font-dosis text-sm mt-2">Join CodeWithBPMCE today</p>
        </div>

        <div className="card-dark p-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded p-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm font-dosis">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { k: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Your full name' },
              { k: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'you@bpmce.ac.in' },
            ].map(({ k, label, icon: Icon, type, placeholder }) => (
              <div key={k}>
                <label className="text-[#a0a0a0] font-dosis text-xs font-semibold mb-1.5 block uppercase tracking-wide">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a4a]" />
                  <input
                    type={type}
                    id={`register-${k}`}
                    required
                    value={form[k]}
                    onChange={(e) => update(k, e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 pl-10 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#4a4a4a]"
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="text-[#a0a0a0] font-dosis text-xs font-semibold mb-1.5 block uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a4a]" />
                <input
                  type={show ? 'text' : 'password'}
                  id="register-password"
                  required
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 pl-10 pr-10 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#4a4a4a]"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a4a] hover:text-white">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#a0a0a0] font-dosis text-xs font-semibold mb-1.5 block uppercase tracking-wide">Branch</label>
                <select value={form.branch} onChange={(e) => update('branch', e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00]">
                  <option value="">Branch</option>
                  {branches.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[#a0a0a0] font-dosis text-xs font-semibold mb-1.5 block uppercase tracking-wide">Batch</label>
                <select value={form.batch} onChange={(e) => update('batch', e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00]">
                  <option value="">Batch</option>
                  {years.map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" id="register-submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-[#6a6a6a] font-dosis text-sm mt-6 pt-4 border-t border-[#1f1f1f]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#FF6B00] hover:underline font-semibold">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
