'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Code2,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params?.token;

  const router = useRouter();

  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Token should come from:
    // /reset-password/:token
    if (!token) {
      setError('Invalid or missing password reset link.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { data } = await authAPI.resetPassword(token, {
        password: form.password,
      });

      if (!data.success) {
        throw new Error(
          data.message || 'Password reset failed'
        );
      }

      setSuccess(true);

      toast.success('Password reset successfully! 🎉');

      // Give user time to see success message
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch (err) {
      const status = err.response?.status;

      if (status === 429) {
        setError(
          'Too many attempts. Please try again later.'
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Password reset failed'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Success state
  // ─────────────────────────────────────────────

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg pt-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="card-dark p-8">
            <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>

            <h2 className="font-display text-2xl font-bold text-white mb-2">
              Password Reset!
            </h2>

            <p className="text-[#6a6a6a] font-dosis text-sm mb-6">
              Your password has been reset successfully.
              Redirecting to login...
            </p>

            <div className="w-5 h-5 border-2 border-white/20 border-t-[#FF6B00] rounded-full animate-spin mx-auto" />
          </div>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Reset password form
  // ─────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg pt-16 px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-[#FF6B00] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FF6B00]/30">
            <Lock
              className="w-8 h-8 text-black"
              strokeWidth={2.5}
            />
          </div>

          <h1 className="font-display text-3xl font-bold text-white">
            Reset Password
          </h1>

          <p className="text-[#6a6a6a] font-dosis text-sm mt-2">
            Enter your new password below
          </p>
        </div>

        <div className="card-dark p-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded p-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />

              <p className="text-red-400 text-sm font-dosis">
                {error}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* New Password */}
            <div>
              <label className="text-[#a0a0a0] font-dosis text-xs font-semibold mb-1.5 block uppercase tracking-wide">
                New Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a4a]" />

                <input
                  type={show ? 'text' : 'password'}
                  id="reset-password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  placeholder="Min. 6 characters"
                  className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-3 pl-10 pr-10 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#4a4a4a]"
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a4a] hover:text-white transition-colors"
                >
                  {show ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[#a0a0a0] font-dosis text-xs font-semibold mb-1.5 block uppercase tracking-wide">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a4a]" />

                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="reset-confirm-password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Re-enter password"
                  className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-3 pl-10 pr-10 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#4a4a4a]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a4a] hover:text-white transition-colors"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="reset-submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#1f1f1f] text-center">
            <Link
              href="/login"
              className="text-[#FF6B00] font-dosis text-sm font-semibold hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}