'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Code2, Send, Check } from 'lucide-react';
import { applicationsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { ButtonLoader } from '@/components/ui/PageLoader';

const tracks = ['Web Development', 'DSA & Algorithms', 'AI/ML', 'Generative AI', 'Web3', 'App Development', 'Cyber Security', 'DevOps', 'Cloud Computing'];
const branches = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'Other'];
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', branch: '', year: '', tracks: [], motivation: '', github: '' });

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const toggleTrack = (t) => setForm((f) => ({
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
      await applicationsAPI.create(form);
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

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
            <span className="string">"under_review"</span>
            <span className="text-white">;{'\n'}</span>
            <span className="variable">expectedResponse</span>
            <span className="text-white"> = </span>
            <span className="string">"3-5 business days"</span>
            <span className="text-white">;</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="section-padding grid-bg">
        <div className="container-custom max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="tag-pill mb-4 inline-block">Join the Club</div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
              Apply to <span className="text-gradient">CodeWithBPMCE</span>
            </h1>
            <p className="text-[#6a6a6a] text-lg font-dosis mb-10">
              Fill out the form below to join Bihar&apos;s most active coding community.
            </p>

            {/* Steps */}
            <div className="flex items-center gap-2 mb-10">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-all ${step >= s ? 'bg-[#FF6B00] text-black' : 'bg-[#141414] text-[#4a4a4a] border border-[#1f1f1f]'}`}>
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
                      <label className="text-[#a0a0a0] font-dosis text-sm font-semibold mb-1.5 block uppercase tracking-wide">{label}</label>
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
                  <button type="button" onClick={() => {
                    if (!form.name.trim()) { toast.error('Please enter your full name'); return; }
                    if (!form.email.trim()) { toast.error('Please enter your college email'); return; }
                    if (!form.phone.trim()) { toast.error('Please enter your WhatsApp number'); return; }
                    setStep(2);
                  }} className="btn-primary w-full justify-center mt-4">
                    Continue →
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  <h2 className="font-display text-2xl font-bold text-white mb-6">Academic &amp; Interests</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#a0a0a0] font-dosis text-sm font-semibold mb-1.5 block uppercase tracking-wide">Branch</label>
                      <select value={form.branch} onChange={(e) => update('branch', e.target.value)}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded px-4 py-3 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] transition-colors">
                        <option value="">Select branch</option>
                        {branches.map((b) => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[#a0a0a0] font-dosis text-sm font-semibold mb-1.5 block uppercase tracking-wide">Year</label>
                      <select value={form.year} onChange={(e) => update('year', e.target.value)}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded px-4 py-3 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] transition-colors">
                        <option value="">Select year</option>
                        {years.map((y) => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[#a0a0a0] font-dosis text-sm font-semibold mb-3 block uppercase tracking-wide">Interested Tracks (Pick up to 3)</label>
                    <div className="flex flex-wrap gap-2">
                      {tracks.map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => toggleTrack(t)}
                          className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded border transition-all ${form.tracks.includes(t) ? 'bg-[#FF6B00] text-black border-[#FF6B00]' : 'text-[#6a6a6a] border-[#1f1f1f] hover:border-[#FF6B00]/40'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1 justify-center">← Back</button>
                    <button type="button" onClick={() => {
                      if (!form.branch) { toast.error('Please select your branch'); return; }
                      if (!form.year) { toast.error('Please select your year'); return; }
                      setStep(3);
                    }} className="btn-primary flex-1 justify-center">Continue →</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  <h2 className="font-display text-2xl font-bold text-white mb-6">Why do you want to join?</h2>
                  <div>
                    <label className="text-[#a0a0a0] font-dosis text-sm font-semibold mb-1.5 block uppercase tracking-wide">Your Motivation</label>
                    <textarea
                      rows={6}
                      placeholder="Tell us about your coding journey, what you hope to achieve, and what you can contribute to the community..."
                      value={form.motivation}
                      onChange={(e) => update('motivation', e.target.value)}
                      className="w-full bg-[#141414] border border-[#1f1f1f] rounded px-4 py-3 text-white text-sm font-dosis focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-[#4a4a4a] resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} disabled={loading} className="btn-outline flex-1 justify-center">← Back</button>
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
