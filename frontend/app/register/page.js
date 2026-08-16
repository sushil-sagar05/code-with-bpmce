'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Code2,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const branches = [
  'CSE',
  'IT',
  'ECE',
  'EE',
  'ME',
  'CE',
  'CSE(AI & ML)',
  '3DAG',
  'Other',
];

const years = [
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
  '2026',
];

export default function RegisterPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
    batch: '',
  });

  const { register, googleLogin } = useAuth();
  const router = useRouter();

  const googleButtonRef = useRef(null);

  const update = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  // ---------------------------------------------------------------------------
  // Google Identity Services
  // ---------------------------------------------------------------------------

  useEffect(() => {
    let intervalId;

    const initializeGoogle = () => {
      if (
        !window.google ||
        !window.google.accounts ||
        !window.google.accounts.id ||
        !googleButtonRef.current
      ) {
        return false;
      }

      const clientId =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      if (!clientId) {
        console.error(
          'NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured'
        );

        setError(
          'Google authentication is not configured'
        );

        return true;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,

        callback: async (response) => {
          if (!response?.credential) {
            setError('Google authentication failed');
            return;
          }

          setError('');
          setGoogleLoading(true);

          try {
            const result = await googleLogin(
              response.credential,
              form.branch,
              form.batch
            );

            if (!result?.success) {
              setError(
                result?.message ||
                  'Google authentication failed'
              );

              setGoogleLoading(false);
            }
          } catch (err) {
            console.error(
              'Google registration error:',
              err
            );

            setError(
              err?.response?.data?.message ||
                err?.message ||
                'Google authentication failed'
            );

            setGoogleLoading(false);
          }
        },
      });

      googleButtonRef.current.innerHTML = '';

      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          type: 'standard',
          theme: 'filled_black',
          size: 'large',
          text: 'signup_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 352,
        }
      );

      return true;
    };

    if (!initializeGoogle()) {
      intervalId = setInterval(() => {
        if (initializeGoogle()) {
          clearInterval(intervalId);
        }
      }, 100);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [googleLogin, form.branch, form.batch]);

  // ---------------------------------------------------------------------------
  // Email registration
  // ---------------------------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || googleLoading) {
      return;
    }

    setError('');

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email || !form.password) {
      setError(
        'Name, email and password are required'
      );
      return;
    }

    if (form.password.length < 6) {
      setError(
        'Password must be at least 6 characters'
      );
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        ...form,
        name,
        email,
      });

      if (result?.success) {
        /*
         * Backend has now:
         *
         * 1. Created the user
         * 2. Generated the OTP
         * 3. Sent the verification email
         *
         * Move the user to the OTP verification page.
         */
        router.push(
          `/verify-email?email=${encodeURIComponent(email)}`
        );

        return;
      }

      setError(
        result?.message ||
          'Unable to create your account'
      );
    } catch (err) {
      console.error(
        'Registration error:',
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to create your account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg pt-16 px-4 pb-16">
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
            Create Account
          </h1>

          <p className="text-[#6a6a6a] font-dosis text-sm mt-2">
            Join CodeWithBPMCE today
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

          {/* Google Sign Up */}
          <div className="flex flex-col items-center">
            <div
              ref={googleButtonRef}
              className="min-h-[44px] flex items-center justify-center"
            />

            {googleLoading && (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />

                <span className="text-[#6a6a6a] text-xs font-dosis">
                  Creating your account...
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-[#1f1f1f]" />

            <span className="text-[#4a4a4a] text-xs font-dosis uppercase">
              Or register with email
            </span>

            <div className="h-px flex-1 bg-[#1f1f1f]" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Name + Email */}
            {[
              {
                k: 'name',
                label: 'Full Name',
                icon: User,
                type: 'text',
                placeholder: 'Your full name',
              },
              {
                k: 'email',
                label: 'Email',
                icon: Mail,
                type: 'email',
                placeholder: 'you@bpmce.ac.in',
              },
            ].map(
              ({
                k,
                label,
                icon: Icon,
                type,
                placeholder,
              }) => (
                <div key={k}>
                  <label className="text-[#a0a0a0] font-dosis text-xs font-semibold mb-1.5 block uppercase tracking-wide">
                    {label}
                  </label>

                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a4a]" />

                    <input
                      type={type}
                      id={`register-${k}`}
                      required
                      value={form[k]}
                      onChange={(e) =>
                        update(k, e.target.value)
                      }
                      placeholder={placeholder}
                      disabled={loading || googleLoading}
                      autoComplete={
                        k === 'email'
                          ? 'email'
                          : 'name'
                      }
                      className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 pl-10 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#4a4a4a] disabled:opacity-60"
                    />
                  </div>
                </div>
              )
            )}

            {/* Password */}
            <div>
              <label className="text-[#a0a0a0] font-dosis text-xs font-semibold mb-1.5 block uppercase tracking-wide">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a4a]" />

                <input
                  type={
                    show ? 'text' : 'password'
                  }
                  id="register-password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    update(
                      'password',
                      e.target.value
                    )
                  }
                  placeholder="Min. 6 characters"
                  disabled={loading || googleLoading}
                  autoComplete="new-password"
                  className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 pl-10 pr-10 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#4a4a4a] disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  disabled={loading || googleLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a4a] hover:text-white disabled:opacity-50"
                >
                  {show ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Branch + Batch */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#a0a0a0] font-dosis text-xs font-semibold mb-1.5 block uppercase tracking-wide">
                  Branch
                </label>

                <select
                  value={form.branch}
                  onChange={(e) =>
                    update(
                      'branch',
                      e.target.value
                    )
                  }
                  disabled={loading || googleLoading}
                  className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] disabled:opacity-60"
                >
                  <option value="">
                    Branch
                  </option>

                  {branches.map((branch) => (
                    <option key={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#a0a0a0] font-dosis text-xs font-semibold mb-1.5 block uppercase tracking-wide">
                  Batch
                </label>

                <select
                  value={form.batch}
                  onChange={(e) =>
                    update(
                      'batch',
                      e.target.value
                    )
                  }
                  disabled={loading || googleLoading}
                  className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded px-4 py-2.5 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] disabled:opacity-60"
                >
                  <option value="">
                    Batch
                  </option>

                  {years.map((year) => (
                    <option key={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="register-submit"
              disabled={
                loading || googleLoading
              }
              className="btn-primary w-full justify-center py-3 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />

                  <span>
                    Creating account...
                  </span>
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[#6a6a6a] font-dosis text-sm mt-6 pt-4 border-t border-[#1f1f1f]">
            Already have an account?{' '}

            <Link
              href="/login"
              className="text-[#FF6B00] hover:underline font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}