'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Code2,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  const handleOtpChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, '')
      .slice(0, 6);

    setOtp(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (!email) {
      setError(
        'Email address is missing. Please register again.'
      );
      return;
    }

    if (otp.length !== 6) {
      setError(
        'Please enter the 6-digit verification code.'
      );
      return;
    }

    setLoading(true);

    try {
      const { data } = await authAPI.verifyEmail({
        email,
        otp,
      });

      if (!data.success) {
        throw new Error(
          data.message || 'Email verification failed'
        );
      }

      setVerified(true);

      toast.success(
        data.message || 'Email verified successfully!'
      );

      setTimeout(() => {
        router.push('/login');
      }, 1200);
    } catch (err) {
      const status = err.response?.status;

      const message =
        err.response?.data?.message ||
        err.message ||
        'Email verification failed';

      if (status === 429) {
        setError(
          'Too many verification attempts. Please try again later.'
        );

        toast.error(
          'Too many verification attempts'
        );
      } else {
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');

    if (!email) {
      setError(
        'Email address is missing. Please register again.'
      );
      return;
    }

    setResending(true);

    try {
      const { data } =
        await authAPI.resendVerificationEmail({
          email,
        });

      if (!data.success) {
        throw new Error(
          data.message ||
            'Unable to resend verification code'
        );
      }

      toast.success(
        data.message ||
          'A new verification code has been sent to your email'
      );

      setOtp('');
    } catch (err) {
      const status = err.response?.status;

      const message =
        err.response?.data?.message ||
        err.message ||
        'Unable to resend verification code';

      if (status === 429) {
        setError(
          'Too many requests. Please try again later.'
        );

        toast.error(
          'Too many requests. Please try again later.'
        );
      } else {
        setError(message);
        toast.error(message);
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg pt-16 px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-[#FF6B00] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FF6B00]/30">
            <Code2
              className="w-8 h-8 text-black"
              strokeWidth={2.5}
            />
          </div>

          <h1 className="font-display text-3xl font-bold text-white">
            Verify Your Email
          </h1>

          <p className="text-[#6a6a6a] font-dosis text-sm mt-2">
            Enter the verification code sent to your email
          </p>
        </div>

        {/* Card */}
        <div className="card-dark p-8">
          {verified ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>

              <h2 className="text-white font-display text-xl font-bold mb-2">
                Email Verified!
              </h2>

              <p className="text-[#6a6a6a] font-dosis text-sm">
                Your email has been verified successfully.
              </p>

              <p className="text-[#4a4a4a] font-dosis text-xs mt-3">
                Redirecting you to login...
              </p>
            </div>
          ) : (
            <>
              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded p-3 mb-5">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />

                  <p className="text-red-400 text-sm font-dosis">
                    {error}
                  </p>
                </div>
              )}

              {/* Email information */}
              <div className="flex items-center gap-3 bg-[#0d0d0d] border border-[#1f1f1f] rounded p-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#FF6B00]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[#6a6a6a] font-dosis text-xs">
                    Verification code sent to
                  </p>

                  <p className="text-white font-dosis text-sm font-semibold truncate">
                    {email || 'your email address'}
                  </p>
                </div>
              </div>

              {/* OTP form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="verification-otp"
                    className="text-[#a0a0a0] font-dosis text-xs font-semibold mb-2 block uppercase tracking-wide"
                  >
                    Verification Code
                  </label>

                  <input
                    id="verification-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                    autoFocus
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter 6-digit code"
                    className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-3 text-white text-center text-xl tracking-[0.5em] font-dosis focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#4a4a4a] placeholder:text-sm placeholder:tracking-normal"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    resending ||
                    otp.length !== 6
                  }
                  className="btn-primary w-full justify-center py-3"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      Verify Email
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Resend */}
              <div className="text-center mt-6">
                <p className="text-[#6a6a6a] font-dosis text-sm">
                  Didn't receive the code?
                </p>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || loading}
                  className="inline-flex items-center gap-2 text-[#FF6B00] font-dosis text-sm font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                >
                  {resending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#FF6B00]/30 border-t-[#FF6B00] rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      Resend verification code
                    </>
                  )}
                </button>

                <p className="text-[#4a4a4a] font-dosis text-xs mt-2">
                  Check your spam folder if you don't see it.
                </p>
              </div>
            </>
          )}

          {/* Login link */}
          {!verified && (
            <p className="text-center text-[#6a6a6a] font-dosis text-sm mt-6 pt-4 border-t border-[#1f1f1f]">
              Already verified?{' '}
              <Link
                href="/login"
                className="text-[#FF6B00] hover:underline font-semibold"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center grid-bg">
          <div className="text-white font-dosis">
            Loading...
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}