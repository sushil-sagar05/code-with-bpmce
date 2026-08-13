'use client';
import { motion } from 'framer-motion';
import { Code2, Target, Users, Zap, Heart, BookOpen } from 'lucide-react';

import Link from 'next/link';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { Eye, Award, Code, Sparkles, ExternalLink } from 'lucide-react';

const values = [
  { icon: Code2, title: 'Open Source First', desc: 'We believe in sharing knowledge. All our resources, projects, and learning materials are open for everyone.' },
  { icon: Target, title: 'Outcome-Driven', desc: 'From internships to GSoC, we focus on real outcomes — jobs, projects, and measurable skills.' },
  { icon: Users, title: 'Community-Led', desc: 'Led by students, for students. Everyone is a mentor to someone at a different stage.' },
  { icon: Zap, title: 'Move Fast', desc: 'We ship, we iterate, we learn. Speed and execution are in our culture.' },
  { icon: Heart, title: 'Inclusive', desc: 'From beginners to experts. CS to non-CS. Everyone who wants to code belongs here.' },
  { icon: BookOpen, title: 'Lifelong Learning', desc: 'Technology evolves fast. We stay curious, keep learning, and adapt together.' },
];

const team = [
  
  {
    name: 'SUJEET KUMAR',
    role: 'Founder',
    branch: 'Assistant Professor CSE',
    bio: 'PhD researcher at IIT Kharagpur working on NLP, Sanskrit language processing, machine translation, and speech recognition using AI and machine learning.',
    avatar: 'https://res.cloudinary.com/dz3yaj24a/image/upload/v1786648230/my_pic_gen_AI_1_1_iugk0k.jpg',
    github: 'https://github.com/SujeetNlp ',
    email: 'ksujeet.cs@gmail.com',
    skills: [ 'AI/ML', 'NLP', 'Speech Processing', 'Machine Translation' ],
  },
  {
    name: 'Rajnish Maurya',
    role: 'Club Head',
    batch: '2023',
    branch: 'CSE (AI & ML)',
    bio: 'Full-Stack Developer at Aero2Astro & Community Builder. Passionate about AI, Open Source, and scaling student dev communities.',
    avatar: 'https://res.cloudinary.com/dz3yaj24a/image/upload/v1786593249/vishnu_sp3gnz.jpg',
    github: 'https://github.com/rajnish032',
    linkedin: 'https://www.linkedin.com/in/rajnishkuma/',
    email: 'rajnishmaurya250@gmail.com',
    skills: ['Full Stack', 'Gen Ai', 'Devops'],
    achievements: 'GSoC Contributor • Hackfest Winner 2025'
  },
  
   {
    name: 'Sushil Sagar',
    role: 'Tech Lead',
    batch: '2023',
    branch: 'Computer Science',
    bio: 'Full-Stack AI Developer focused on building intelligent, scalable, and AI-powered applications.',
    avatar: 'https://res.cloudinary.com/dz3yaj24a/image/upload/v1786650730/WhatsApp_Image_2026-08-14_at_01.20.14_y62tth.jpg',
    github: 'https://github.com/sushil-sagar05',
    linkedin: 'https://www.linkedin.com/in/sushil-sagar09/',
    email: 'sagarsushil1403@gmail.com',
    skills: ['RAG','LangChain','LangGraph','MCP','FastAPI','MERN'],
    achievements: 'Open Source Contributor'
  },
  {
    name: 'Prem Kishor',
    role: 'Content Moderator & Maintainer ',
    batch: '2023',
    branch: 'CSE',
    bio: 'Website Content Moderator & Maintainer focused on content management, moderation, and improving digital communities for students and developers.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
    github: 'https://github.com/the-thing-arch',
    linkedin: 'https://linkedin.com',
    email: 'kishorsupremo95@gmail.com',
    skills: ['Full Stack', 'AI/ML'],
  },
  
];

export default function AboutPage() {
  return (
    <div className="pt-16 pb-0">
      {/* Hero */}
      <section className="py-12 md:py-16 grid-bg relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <div className="accent-line mb-4" />
            <div className="tag-pill mb-3 inline-block">About Us</div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
              We Are <span className="text-gradient">DevBuddies</span>
            </h1>
            <p className="text-[#a0a0a0] text-xl font-dosis leading-relaxed max-w-3xl">
              We are a newly launched developer community at BP Mandal College of Engineering, Madhepura. 
              Starting from scratch, our goal is to build a vibrant tech ecosystem where students learn, build, 
              and grow together from day one.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1f1f1f] to-transparent" />
      </section>

      {/* Mission */}
      <section className="section-padding bg-[#0d0d0d]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="accent-line mb-4" />
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                Our <span className="text-gradient">Mission</span>
              </h2>
              <p className="text-[#6a6a6a] text-lg font-dosis leading-relaxed mb-6">
                To bridge the gap between academic curriculum and industry demands by creating a 
                hands-on, collaborative environment where BPMCE students can build real skills, 
                ship real products, and kickstart their developer journey together.
              </p>
              <p className="text-[#6a6a6a] text-lg font-dosis leading-relaxed">
                We believe that every student — regardless of branch, year, or background — 
                deserves access to quality peer mentorship, structured learning, and an encouraging 
                community right from the start.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { year: 'Phase 1', event: 'Official club launch & founding team onboarding' },
                { year: 'Phase 2', event: 'Initiating structured roadmap study groups & workshops' },
                { year: 'Phase 3', event: 'Building open-source projects & intra-college hackathons' },
                { year: 'Phase 4', event: 'Scaling industry mentorship & placement/internship preparation' },
              ].map(({ year, event }) => (
                <div key={year} className="flex items-start gap-4">
                  <div className="font-mono text-[#FF6B00] text-sm font-bold w-16 flex-shrink-0">{year}</div>
                  <div className="flex-1 border-l border-[#1f1f1f] pl-4 pb-4">
                    <p className="text-[#a0a0a0] font-dosis text-sm">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="accent-line mx-auto mb-4" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              Our <span className="text-gradient">Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-dark p-6"
              >
                <div className="w-10 h-10 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-[#6a6a6a] text-sm font-dosis leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expanded Team Details Section */}
      <section className="section-padding bg-[#0a0a0a] relative overflow-hidden">
        <div className="container-custom">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="accent-line mx-auto mb-4" />
            <div className="tag-pill mb-3 inline-block">Core Leadership</div>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white">
              Meet Our <span className="text-gradient">Leadership Team</span>
            </h2>
            <p className="text-[#888] mt-4 font-dosis text-lg">
              The passionate student leaders, core architects, and domain leads driving CodeWithBPMCE forward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center group p-6 rounded-3xl hover:bg-white/[0.02] transition-colors"
              >
                {/* Avatar with circular glow ring */}
                <div className="relative mb-5">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#FF6B00] to-[#FF8C00] blur-md opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="relative w-28 h-28 rounded-full object-cover border-2 border-[#FF6B00] shadow-2xl bg-[#141414] group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-0 right-1 w-7 h-7 rounded-full bg-[#FF6B00] text-black font-bold flex items-center justify-center text-xs shadow-lg ring-2 ring-black">
                    ★
                  </span>
                </div>

                {/* Name & Role */}
                <h3 className="font-display text-2xl font-bold text-white group-hover:text-[#FF6B00] transition-colors leading-tight mb-1">
                  {member.name}
                </h3>
                <p className="text-[#FF6B00] font-mono text-xs font-semibold uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" /> {member.role}
                </p>

                {/* Branch & Batch Badge */}
                {(member.branch || member.batch) && (
                  <div className="mb-3">
                    <span className="inline-block font-mono text-[10px] text-[#FF6B00] bg-[#FF6B00]/15 border border-[#FF6B00]/30 px-3 py-1 rounded-full uppercase font-bold backdrop-blur-md">
                      {[member.branch, member.batch ? `Batch '${member.batch}` : null].filter(Boolean).join(' • ')}
                    </span>
                  </div>
                )}

                {/* Bio Excerpt */}
                <p className="text-[#aaa] font-dosis text-sm leading-relaxed max-w-xs mb-4">
                  {member.bio}
                </p>

                {/* Skills Badges */}
                <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="font-mono text-[10px] text-[#ccc] bg-[#141414] border border-[#222] px-2.5 py-0.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Footer Social Actions */}
                <div className="flex items-center justify-center gap-3">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#141414] border border-[#222] text-[#aaa] hover:text-white hover:border-[#FF6B00] hover:bg-[#FF6B00]/20 flex items-center justify-center transition-all"
                    title="GitHub Profile"
                  >
                    <FaGithub className="w-4 h-4" />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#141414] border border-[#222] text-[#aaa] hover:text-[#0A66C2] hover:border-[#0A66C2] hover:bg-[#0A66C2]/20 flex items-center justify-center transition-all"
                    title="LinkedIn Profile"
                  >
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="w-9 h-9 rounded-full bg-[#141414] border border-[#222] text-[#aaa] hover:text-[#FF6B00] hover:border-[#FF6B00] hover:bg-[#FF6B00]/20 flex items-center justify-center transition-all"
                    title="Email Contact"
                  >
                    <FaEnvelope className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Callout to view all members */}
          <div className="mt-14 text-center">
            <Link
              href="/members"
              className="inline-flex items-center gap-2 font-dosis font-bold text-sm text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/30 hover:bg-[#FF6B00]/20 px-6 py-3 rounded-xl transition-all"
            >
              <span>Explore All 500+ Official Members & Alumni</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
