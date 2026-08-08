'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, Mail, Phone, Code2, Send, Check, ShieldCheck, Clock, AlertCircle, LogIn } from 'lucide-react';
import { applicationsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { ButtonLoader, SectionLoader } from '@/components/ui/PageLoader';
import { useAuth } from '@/context/AuthContext';

const tracks = ['Web Development', 'DSA & Algorithms', 'AI/ML', 'Generative AI', 'Web3', 'App Development', 'Cyber Security', 'DevOps', 'Cloud Computing'];
const branches = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'Other'];
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function JoinPage() {
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingApp, setFetchingApp] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [existingApp, setExistingApp] = useState(null);
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    year: '',
    tracks: [],
    motivation: '',
    github: '',
  });

  // Pre-fill user data and fetch existing application status
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: f.name || user.name || '',
        email: f.email || user.email || '',
        phone: f.phone || user.phone || '',
        branch: f.branch || user.branch || '',
        year: f.year || user.year || user.batch || '',
        github: f.github || user.github || '',
      }));

      applicationsAPI
        .getMyApplication()
        .then((res) => {
          if (res.data?.data) {
            setExistingApp(res.data.data);
          }
        })
        .catch(() => {})
        .finally(() => setFetchingApp(false));
    } else {
      setFetchingApp(false);
    }
  }, [user]);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const toggleTrack = (t) =>
    setForm((f) => ({
      ...f,
      tracks: f.tracks.includes(t) ? f.tracks.filter((x) => x !== t) : [...f.tracks, t],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.branch || !form.year || !form.motivation) {
      toast.error('Please complete all required fields');
      return;
    }
    setLoading(true);
    try {
      const res = await applicationsAPI.create(form);
      setSubmitted(true);
      setExistingApp(res.data.data);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetchingApp) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <SectionLoader text="Loading membership details..." />
      </div>
    );
  }

  // View 1: Not Logged In -> Require authentication to apply
  if (!user) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center grid-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-6 py-10 card-dark border-[#FF6B00]/30 w-full"
        >
          <div className="w-16 h-16 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-[#FF6B00]" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">Student Login Required</h2>
          <p className="text-[#a0a0a0] font-dosis text-sm leading-relaxed mb-6">
            You must be logged in with a student account to apply to CodeWithBPMCE so your membership is linked directly to your profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/login" className="btn-primary flex-1 justify-center py-2.5 text-sm">
              Log In to Apply
            </Link>
            <Link href="/register" className="btn-outline flex-1 justify-center py-2.5 text-sm">
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // View 2: Verified Club Member
  if (user?.isVerified) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center grid-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-6 py-10 card-dark border-emerald-500/30"
        >
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">You Are a Verified Member!</h2>
          <p className="text-[#a0a0a0] font-dosis text-base leading-relaxed mb-6">
            Welcome, <span className="text-white font-semibold">{user.name}</span>. You are already an official member of CodeWithBPMCE with verified club status.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/dashboard" className="btn-primary text-sm py-2.5 px-5">
              Go to Dashboard
            </Link>
            <Link href="/members" className="btn-outline text-sm py-2.5 px-5">
              View Club Members
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // View 3: Existing Application status
  if (existingApp && !submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center grid-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto px-6 py-10 card-dark border-[#FF6B00]/30 w-full"
        >
          {existingApp.status === 'pending' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-[#FF6B00] animate-pulse" />
              </div>
              <h2 className="font-display text-3xl font-bold text-white mb-2">Application Under Review</h2>
              <p className="text-[#a0a0a0] font-dosis text-sm leading-relaxed mb-6">
                Your application to join CodeWithBPMCE has been received and is currently being evaluated by administrators.
              </p>
              <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-4 text-left text-xs font-mono text-[#a0a0a0] space-y-2 mb-6">
                <div><span className="text-[#666]">Applicant:</span> {existingApp.name}</div>
                <div><span className="text-[#666]">Branch / Year:</span> {existingApp.branch} — {existingApp.year}</div>
                <div><span className="text-[#666]">Status:</span> <span className="text-[#FF6B00] uppercase font-bold">Pending Review</span></div>
                <div><span className="text-[#666]">Submitted:</span> {new Date(existingApp.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          )}

          {existingApp.status === 'approved' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="font-display text-3xl font-bold text-white mb-2">Application Approved! 🎉</h2>
              <p className="text-[#a0a0a0] font-dosis text-sm leading-relaxed mb-6">
                Congratulations! Your application has been approved. You are now an official club member.
              </p>
              <Link href="/dashboard" className="btn-primary w-full justify-center py-3">
                Go to Dashboard
              </Link>
            </div>
          )}

          {existingApp.status === 'rejected' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">Application Status: Rejected</h2>
              <p className="text-[#a0a0a0] font-dosis text-sm mb-6">
                Your previous application was not approved. You may update your information and submit a new application below.
              </p>
              <button
                onClick={() => setExistingApp(null)}
                className="btn-outline w-full justify-center py-2.5 text-sm"
              >
                Re-apply / New Application
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // View 4: Newly Submitted confirmation
  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="w-20 h-20 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-[#FF6B00]" />
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4">Application Received!</h2>
          <p className="text-[#6a6a6a] font-dosis text-lg leading-relaxed">
            Thank you for applying to CodeWithBPMCE! We&apos;ll review your application and reach out within 3-5 business days.
          </p>
          <div className="mt-8 code-block text-left text-xs">
            <span className="comment">// Your application status</span>{'\n'}
            <span className="variable">status</span>
            <span className="text-white"> = </span>
            <span className="string">&quot;under_review&quot;</span>
            <span className="text-white">;{'\n'}</span>
            <span className="variable">accountLinked</span>
            <span className="text-white"> = </span>
            <span className="string">true</span>
            <span className="text-white">;</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // View 5: Main Application Form (Logged-in Student)
  return (
    <div className="pt-20">
      <section className="section-padding grid-bg">
        <div className="container-custom max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="tag-pill mb-4 inline-block">Join the Club</div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
              Apply to <span className="text-gradient">CodeWithBPMCE</span>
            </h1>
            <p className="text-[#6a6a6a] text-lg font-dosis mb-6">
              Fill out the form below to join Bihar&apos;s most active coding community.
            </p>

            {/* Account attachment status banner */}
            <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-lg p-4 mb-8 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00] animate-pulse flex-shrink-0" />
              <div className="text-xs font-dosis">
                <span className="text-white font-semibold">Applying as logged in student:</span>{' '}
                <span className="text-[#FF6B00]">{user.name} ({user.email})</span>.
                <p className="text-[#a0a0a0] text-[11px] mt-0.5">
                  Upon approval by an admin, your student profile will automatically receive verified member status!
                </p>
              </div>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center gap-2 mb-10">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-all ${
                      step >= s ? 'bg-[#FF6B00] text-black' : 'bg-[#141414] text-[#4a4a4a] border border-[#1f1f1f]'
                    }`}
                  >
                    {step > s ? <Check className="w-4 h-4" /> : s}
                  </div>
                  {s < 3 && <div className={`h-px w-12 ${step > s ? 'bg-[#FF6B00]' : 'bg-[#1f1f1f]'}`} />}
                </div>
              ))}
              <span className="ml-3 text-[#4a4a4a] font-mono text-xs">Step {step} of 3</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <h2 className="font-display text-2xl font-bold text-white mb-6">Personal Details</h2>
                  {[
                    { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Your full name' },
                    { key: 'email', label: 'College Email', icon: Mail, type: 'email', placeholder: 'you@bpmce.ac.in' },
                    { key: 'phone', label: 'WhatsApp Number', icon: Phone, type: 'tel', placeholder: '+91 XXXXX XXXXX' },
                    { key: 'github', label: 'GitHub Username (Optional)', icon: Code2, type: 'text', placeholder: 'yourusername' },
                  ].map(({ key, label, icon: Icon, type, placeholder }) => (
                    <div key={key}>
                      <label className="text-[#a0a0a0] font-dosis text-sm font-semibold mb-1.5 block uppercase tracking-wide">
                        {label}
                      </label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a4a]" />
                        <input
                          type={type}
                          placeholder={placeholder}
                          value={form[key]}
                          onChange={(e) => update(key, e.target.value)}
                          className="w-full bg-[#141414] border border-[#1f1f1f] rounded px-4 py-3 pl-10 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#4a4a4a]"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      if (!form.name.trim()) { toast.error('Please enter your full name'); return; }
                      if (!form.email.trim()) { toast.error('Please enter your college email'); return; }
                      if (!form.phone.trim()) { toast.error('Please enter your WhatsApp number'); return; }
                      setStep(2);
                    }}
                    className="btn-primary w-full justify-center mt-4"
                  >
                    Continue →
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  <h2 className="font-display text-2xl font-bold text-white mb-6">Academic &amp; Interests</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#a0a0a0] font-dosis text-sm font-semibold mb-1.5 block uppercase tracking-wide">
                        Branch
                      </label>
                      <select
                        value={form.branch}
                        onChange={(e) => update('branch', e.target.value)}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded px-4 py-3 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] transition-colors"
                      >
                        <option value="">Select branch</option>
                        {branches.map((b) => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[#a0a0a0] font-dosis text-sm font-semibold mb-1.5 block uppercase tracking-wide">
                        Year
                      </label>
                      <select
                        value={form.year}
                        onChange={(e) => update('year', e.target.value)}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded px-4 py-3 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] transition-colors"
                      >
                        <option value="">Select year</option>
                        {years.map((y) => (
                          <option key={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[#a0a0a0] font-dosis text-sm font-semibold mb-3 block uppercase tracking-wide">
                      Interested Tracks (Pick up to 3)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {tracks.map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => toggleTrack(t)}
                          className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded border transition-all ${
                            form.tracks.includes(t)
                              ? 'bg-[#FF6B00] text-black border-[#FF6B00]'
                              : 'text-[#6a6a6a] border-[#1f1f1f] hover:border-[#FF6B00]/40'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1 justify-center">
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!form.branch) { toast.error('Please select your branch'); return; }
                        if (!form.year) { toast.error('Please select your year'); return; }
                        setStep(3);
                      }}
                      className="btn-primary flex-1 justify-center"
                    >
                      Continue →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  <h2 className="font-display text-2xl font-bold text-white mb-6">Why do you want to join?</h2>
                  <div>
                    <label className="text-[#a0a0a0] font-dosis text-sm font-semibold mb-1.5 block uppercase tracking-wide">
                      Your Motivation
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Tell us about your coding journey, what you hope to achieve, and what you can contribute to the community..."
                      value={form.motivation}
                      onChange={(e) => update('motivation', e.target.value)}
                      className="w-full bg-[#141414] border border-[#1f1f1f] rounded px-4 py-3 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#4a4a4a] resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} disabled={loading} className="btn-outline flex-1 justify-center">
                      ← Back
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                      {loading ? <ButtonLoader text="Submitting..." /> : <>Submit Application <Send className="w-4 h-4" /></>}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
