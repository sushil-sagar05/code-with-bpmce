'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usersAPI } from '@/lib/api';
import { SharedProfileComponent } from '@/app/profile/page';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import PageLoader from '@/components/ui/PageLoader';

export default function MemberProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      usersAPI.getLeaderboard()
        .then(({ data }) => {
          const found = (data.data || []).find(u => u._id === params.id);
          if (found) {
            setMember(found);
          } else {
            // Fallback fetch
            setMember({ _id: params.id, name: 'Student Member' });
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [params?.id]);

  if (loading) {
    return <PageLoader text="Loading member profile..." />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16 grid-bg">
      <div className="container-custom max-w-4xl mx-auto space-y-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 font-dosis font-semibold text-sm text-[#888] hover:text-white transition-colors bg-[#111] border border-[#1f1f1f] px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF6B00]" /> Back
        </button>

        {member ? (
          <SharedProfileComponent targetUser={member} />
        ) : (
          <div className="text-center py-16 text-[#666] font-dosis">Member not found.</div>
        )}
      </div>
    </div>
  );
}
