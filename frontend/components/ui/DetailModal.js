'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Briefcase, Award, CheckCircle2, Shield, User, Globe, Mail, Phone, MapPin, Check, Trash2, Eye } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiCodeforces, SiLeetcode } from 'react-icons/si';
import { SharedProfileComponent } from '@/app/profile/page';

export default function DetailModal({ isOpen, onClose, title, data, type, onApprove, onReject, onViewUser }) {
  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[120] overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center min-h-screen"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full ${type === 'member' ? 'max-w-4xl' : 'max-w-2xl'} bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 sm:p-8 max-h-[80vh] overflow-y-auto modal-scroll shadow-2xl space-y-6 my-auto shrink-0`}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#1f1f1f] pb-4">
            <div>
              <span className="font-mono text-[10px] text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/30 px-2.5 py-1 rounded uppercase tracking-wider">
                {type === 'member' ? 'Student Profile' : type || 'Details'}
              </span>
              <h2 className="font-display text-2xl font-bold text-white mt-2">{title || data.title || data.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#777] hover:text-white bg-[#1a1a1a] hover:bg-[#252525] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Member Profile Modal Content — Renders Full SharedProfileComponent */}
          {type === 'member' && (
            <div className="pt-2">
              <SharedProfileComponent embedded={true} targetUser={data} />
            </div>
          )}

          {/* Project Content */}
          {type === 'project' && (
            <div className="space-y-4">
              {data.coverImage && (
                <img src={data.coverImage} alt={data.title} className="w-full h-48 sm:h-64 object-cover rounded-xl border border-[#1f1f1f]" />
              )}
              <div>
                <h4 className="text-[#888] font-mono text-[10px] uppercase mb-1">Description</h4>
                <p className="text-[#ccc] font-dosis text-sm sm:text-base leading-relaxed whitespace-pre-line">{data.description}</p>
              </div>

              {data.tech && data.tech.length > 0 && (
                <div>
                  <h4 className="text-[#888] font-mono text-[10px] uppercase mb-2">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.tech.map((t, i) => (
                      <span key={i} className="bg-[#1a1a1a] text-[#FF6B00] border border-[#FF6B00]/20 font-mono text-xs px-3 py-1 rounded-md">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {data.addedBy && (
                <div 
                  onClick={() => onViewUser && onViewUser(data.addedBy)}
                  className="bg-[#0d0d0d] hover:bg-[#141414] p-3 rounded-xl border border-[#1f1f1f] hover:border-[#FF6B00]/30 flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    {data.addedBy.avatar ? (
                      <img src={data.addedBy.avatar} alt={data.addedBy.name} className="w-8 h-8 rounded-full object-cover border border-[#FF6B00]/30" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] font-bold font-mono flex items-center justify-center text-xs">
                        {data.addedBy.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <span className="text-[#777] font-dosis text-xs block">Submitted by: <strong className="text-white group-hover:text-[#FF6B00] transition-colors">{data.addedBy.name || 'Student'}</strong></span>
                      {data.addedBy.email && <span className="font-mono text-[10px] text-[#555]">{data.addedBy.email}</span>}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2 py-1 rounded flex items-center gap-1 group-hover:bg-[#FF6B00]/20 transition-colors">
                    <User className="w-3 h-3" /> View Member Profile
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#1f1f1f]">
                <div className="flex items-center gap-3">
                  {data.github && (
                    <a href={data.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 btn-outline text-xs py-2 px-4">
                      <FaGithub className="w-4 h-4" /> GitHub Repository
                    </a>
                  )}
                  {data.demo && (
                    <a href={data.demo} target="_blank" rel="noreferrer" className="flex items-center gap-2 btn-primary text-xs py-2 px-4">
                      <ExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                  )}
                </div>
                {onApprove && (
                  <div className="flex items-center gap-2 border-l border-[#1f1f1f] pl-3">
                    {!data.isFeatured && (
                      <button onClick={() => { onApprove(data._id); onClose(); }} className="flex items-center gap-1 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 px-3 py-2 rounded text-xs font-dosis font-bold transition-colors">
                        <Check className="w-4 h-4" /> Approve Project
                      </button>
                    )}
                    {onReject && (
                      <button onClick={() => { onReject(data._id); onClose(); }} className="flex items-center gap-1 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 px-3 py-2 rounded text-xs font-dosis font-bold transition-colors">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Achievement Content */}
          {type === 'achievement' && (
            <div className="space-y-4">
              {data.image && (
                <div className="rounded-xl overflow-hidden border border-[#1f1f1f] bg-[#0d0d0d]">
                  <img src={data.image} alt={data.title} className="w-full max-h-80 object-contain mx-auto" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {data.company && (
                  <div className="bg-[#0d0d0d] p-3 rounded-lg border border-[#1f1f1f]">
                    <span className="text-[#666] font-mono text-[10px] block">COMPANY / PLATFORM</span>
                    <span className="text-white font-dosis font-bold text-sm">{data.company}</span>
                  </div>
                )}
                <div className="bg-[#0d0d0d] p-3 rounded-lg border border-[#1f1f1f]">
                  <span className="text-[#666] font-mono text-[10px] block">STATUS</span>
                  <span className={`font-mono text-xs font-bold ${data.isVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                    {data.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>

              {data.description && (
                <div>
                  <h4 className="text-[#888] font-mono text-[10px] uppercase mb-1">Details & Highlights</h4>
                  <p className="text-[#ccc] font-dosis text-sm leading-relaxed whitespace-pre-line bg-[#0d0d0d] p-4 rounded-xl border border-[#1f1f1f]">{data.description}</p>
                </div>
              )}

              {data.user && (
                <div 
                  onClick={() => onViewUser && onViewUser(data.user)}
                  className="bg-[#0d0d0d] hover:bg-[#141414] p-3 rounded-xl border border-[#1f1f1f] hover:border-[#FF6B00]/30 flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    {data.user.avatar ? (
                      <img src={data.user.avatar} alt={data.user.name} className="w-8 h-8 rounded-full object-cover border border-[#FF6B00]/30" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] font-bold font-mono flex items-center justify-center text-xs">
                        {data.user.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <span className="text-[#777] font-dosis text-xs block">Achieved by: <strong className="text-white group-hover:text-[#FF6B00] transition-colors">{data.user.name || 'Student'}</strong></span>
                      {data.user.email && <span className="font-mono text-[10px] text-[#555]">{data.user.email}</span>}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2 py-1 rounded flex items-center gap-1 group-hover:bg-[#FF6B00]/20 transition-colors">
                    <User className="w-3 h-3" /> View Member Profile
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#1f1f1f]">
                {data.proof ? (
                  <a href={data.proof} target="_blank" rel="noreferrer" className="flex items-center gap-2 btn-primary text-xs py-2 px-4">
                    <ExternalLink className="w-4 h-4" /> View Verification Proof Link
                  </a>
                ) : <div />}
                {onApprove && (
                  <div className="flex items-center gap-2 border-l border-[#1f1f1f] pl-3">
                    {!data.isVerified && (
                      <button onClick={() => { onApprove(data._id); onClose(); }} className="flex items-center gap-1 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 px-3 py-2 rounded text-xs font-dosis font-bold transition-colors">
                        <Check className="w-4 h-4" /> Verify Achievement
                      </button>
                    )}
                    {onReject && (
                      <button onClick={() => { onReject(data._id); onClose(); }} className="flex items-center gap-1 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 px-3 py-2 rounded text-xs font-dosis font-bold transition-colors">
                        <X className="w-4 h-4" /> Reject
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Blog Content */}
          {type === 'blog' && (
            <div className="space-y-4">
              {data.coverImage && (
                <img src={data.coverImage} alt={data.title} className="w-full h-48 sm:h-64 object-cover rounded-xl border border-[#1f1f1f]" />
              )}
              {data.category && (
                <span className="font-mono text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded uppercase">
                  {data.category}
                </span>
              )}
              {data.excerpt && (
                <p className="text-[#aaa] font-dosis text-sm italic border-l-2 border-[#FF6B00] pl-3 py-1">{data.excerpt}</p>
              )}
              <div>
                <h4 className="text-[#888] font-mono text-[10px] uppercase mb-2">Content</h4>
                <div className="text-[#ddd] font-mono text-xs leading-relaxed bg-[#0d0d0d] p-5 rounded-xl border border-[#1f1f1f] whitespace-pre-line max-h-96 overflow-y-auto">
                  {data.content}
                </div>
              </div>
              {data.tags && data.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {data.tags.map((tag, idx) => (
                    <span key={idx} className="bg-[#1a1a1a] text-[#888] font-mono text-[10px] px-2.5 py-0.5 rounded">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
