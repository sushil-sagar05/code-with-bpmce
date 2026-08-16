'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Code2,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError('Email is required');
      return;
    }

    setLoading(true);

    try {
      const { data } = await authAPI.forgotPassword({
        email: normalizedEmail,
      });

      if (!data.success) {
        throw new Error(
          data.message || 'Unable to send reset link'
        );
      }

      /*
       * Backend intentionally returns the same success message
       * whether or not the email exists.
       *
       * This prevents revealing registered email addresses.
       */
      setSent(true);

      toast.success('Reset link sent!');
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
            'Something went wrong'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Success state
  // ─────────────────────────────────────────────

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg pt-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-[#FF6B00] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FF6B00]/30">
              <Mail
                className="w-8 h-8 text-black"
                strokeWidth={2.5}
              />
            </div>

            <h1 className="font-display text-3xl font-bold text-white">
              Check Your Email
            </h1>
          </div>

          <div className="card-dark p-8">
            <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/30 rounded p-4 mb-6">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />

              <p className="text-green-300 text-sm font-dosis leading-relaxed">
                If an account exists with this email, a
                password reset link has been sent. Please
                check your inbox and spam folder.
              </p>
            </div>

            <p className="text-[#6a6a6a] font-dosis text-sm text-center mb-6">
              The reset link will expire in 15 minutes.
            </p>

            <Link
              href="/login"
              className="btn-primary w-full justify-center py-3"
            >
              Back to Sign In
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Forgot password form
  // ─────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg pt-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-[#FF6B00] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FF6B00]/30">
            <Code2
              className="w-8 h-8 text-black"
              strokeWidth={2.5}
            />
          </div>

          <h1 className="font-display text-3xl font-bold text-white">
            Forgot Password
          </h1>

          <p className="text-[#6a6a6a] font-dosis text-sm mt-2">
            Enter your email to receive a reset link
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
            <div>
              <label className="text-[#a0a0a0] font-dosis text-xs font-semibold mb-1.5 block uppercase tracking-wide">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a4a]" />

                <input
                  type="email"
                  id="forgot-email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="you@bpmce.ac.in"
                  className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-3 pl-10 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#4a4a4a]"
                />
              </div>
            </div>

            <button
              type="submit"
              id="forgot-submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#1f1f1f] text-center">
            <Link
              href="/login"
              className="text-[#6a6a6a] font-dosis text-sm hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}