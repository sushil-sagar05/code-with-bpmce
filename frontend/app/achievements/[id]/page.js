'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { achievementsAPI } from '@/lib/api';
import { Loader2, ArrowLeft, CheckCircle, ExternalLink, Award, User, Calendar, Building } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import PageLoader, { ButtonLoader } from '@/components/ui/PageLoader';

export default function AchievementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (params?.id) {
      setLoading(true);
      Promise.allSettled([
        achievementsAPI.getAll({ verified: false }),
        achievementsAPI.getAll({ verified: true }),
      ]).then(([unverifiedRes, verifiedRes]) => {
        const unverifiedList = unverifiedRes.value?.data?.data || [];
        const verifiedList = verifiedRes.value?.data?.data || [];
        const found = [...unverifiedList, ...verifiedList].find(a => a._id === params.id);
        setAchievement(found || null);
      }).catch(() => {
        toast.error('Failed to load achievement');
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [params?.id]);

  const handleVerify = async () => {
    if (!achievement) return;
    setActionLoading(true);
    try {
      await achievementsAPI.verify(achievement._id);
      toast.success('Achievement verified successfully! ✓');
      router.push('/admin');
    } catch {
      toast.error('Failed to verify achievement');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!achievement) return;
    setActionLoading(true);
    try {
      await achievementsAPI.reject(achievement._id);
      toast.success('Achievement rejected and removed');
      router.push('/admin');
    } catch {
      toast.error('Failed to reject achievement');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <PageLoader text="Fetching achievement details..." />;
  }

  if (!achievement) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16 grid-bg">
        <div className="container-custom max-w-3xl mx-auto text-center py-20">
          <Award className="w-12 h-12 text-[#444] mx-auto mb-3" />
          <h2 className="text-white font-dosis font-bold text-xl mb-2">Achievement Not Found</h2>
          <p className="text-[#666] font-dosis text-sm mb-6">This achievement may have already been verified or deleted.</p>
          <button onClick={() => router.back()} className="btn-primary text-xs py-2.5 px-6">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16 grid-bg">
      <div className="container-custom max-w-4xl mx-auto space-y-6">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 font-dosis font-semibold text-sm text-[#888] hover:text-white transition-colors bg-[#111] border border-[#1f1f1f] px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6B00]" /> Back
          </button>

          <span className={`font-mono text-xs px-3 py-1 rounded-full border font-bold uppercase ${
            achievement.isVerified ? 'text-green-400 bg-green-500/10 border-green-500/30' : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
          }`}>
            {achievement.isVerified ? '✓ Verified' : 'Pending Review'}
          </span>
        </div>

        {/* Main Card — Two Column Layout starting from Title Level */}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-6 sm:p-8 space-y-6">
          
          {/* Grid: Header + Details on Left, Image on Right */}
          <div className={`grid grid-cols-1 ${achievement.image ? 'lg:grid-cols-12' : ''} gap-8 items-start`}>
            
            {/* Left Side (col-span-7): Header, Description, Student, Proof */}
            <div className={`${achievement.image ? 'lg:col-span-7' : ''} space-y-6`}>
              
              {/* Header */}
              <div className="border-b border-[#1f1f1f] pb-5 space-y-2">
                <span className="font-mono text-xs text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/30 px-3 py-1 rounded-md uppercase tracking-wider">
                  {achievement.type || 'Achievement'}
                </span>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-white pt-1 leading-tight">{achievement.title}</h1>
                {achievement.company && (
                  <p className="text-[#aaa] font-dosis text-base flex items-center gap-2 pt-1">
                    <Building className="w-4 h-4 text-[#FF6B00]" /> {achievement.company}
                  </p>
                )}
              </div>

              {/* Description & Highlights */}
              {achievement.description && (
                <div className="space-y-2">
                  <h3 className="text-[#888] font-mono text-xs uppercase tracking-wider">Details & Key Highlights</h3>
                  <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-5 text-[#ddd] font-dosis text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {achievement.description}
                  </div>
                </div>
              )}

              {/* Submitter Student Info Box */}
              {achievement.user && (
                <div className="space-y-2">
                  <h3 className="text-[#888] font-mono text-xs uppercase tracking-wider">Submitted By Student</h3>
                  <Link
                    href={`/profile/${achievement.user._id}`}
                    className="bg-[#0d0d0d] hover:bg-[#141414] border border-[#1f1f1f] hover:border-[#FF6B00]/40 rounded-xl p-4 flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      {achievement.user.avatar ? (
                        <img src={achievement.user.avatar} alt={achievement.user.name} className="w-10 h-10 rounded-full object-cover border border-[#FF6B00]/30" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] font-bold font-display text-base flex items-center justify-center">
                          {achievement.user.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="text-white font-dosis font-bold text-sm group-hover:text-[#FF6B00] transition-colors">{achievement.user.name}</h4>
                        <p className="text-[#666] font-mono text-[10px]">{achievement.user.email}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2.5 py-1 rounded-lg flex items-center gap-1 group-hover:bg-[#FF6B00]/20 transition-colors">
                      <User className="w-3 h-3" /> Profile
                    </span>
                  </Link>
                </div>
              )}

              {/* Proof URL Link */}
              {achievement.proof && (
                <div>
                  <a
                    href={achievement.proof}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 btn-primary text-xs py-2.5 px-5"
                  >
                    <ExternalLink className="w-4 h-4" /> View Proof Document Link
                  </a>
                </div>
              )}
            </div>

            {/* Right Side (col-span-5): Certificate / Proof Image Preview on Title Level */}
            {achievement.image && (
              <div className="lg:col-span-5 space-y-2 lg:sticky lg:top-24">
                <h3 className="text-[#888] font-mono text-xs uppercase tracking-wider">Proof Certificate Image</h3>
                <div className="rounded-xl overflow-hidden border border-[#1f1f1f] bg-[#0d0d0d] p-3 flex flex-col items-center">
                  <a href={achievement.image} target="_blank" rel="noreferrer" className="block relative group w-full">
                    <img
                      src={achievement.image}
                      alt={achievement.title}
                      className="w-full max-h-[420px] object-contain rounded-lg transition-transform group-hover:scale-[1.01]"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white font-dosis font-bold text-xs gap-1.5 backdrop-blur-[2px]">
                      <ExternalLink className="w-4 h-4" /> Click to view full resolution
                    </div>
                  </a>
                </div>
              </div>
            )}

          </div>

          {/* Admin Review Action Bar */}
          {!achievement.isVerified && (
            <div className="pt-6 border-t border-[#1f1f1f] flex items-center justify-end gap-3">
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-dosis font-bold text-sm transition-colors flex items-center gap-2"
              >
                {actionLoading ? <ButtonLoader text="Rejecting..." /> : 'Reject Achievement'}
              </button>
              <button
                onClick={handleVerify}
                disabled={actionLoading}
                className="px-6 py-3 rounded-xl bg-green-500 border border-green-400 text-black font-dosis font-bold text-sm hover:bg-green-400 transition-colors flex items-center gap-2 shadow-lg shadow-green-900/20"
              >
                {actionLoading ? <ButtonLoader text="Verifying..." /> : <><CheckCircle className="w-4 h-4" /> Verify Achievement</>}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
