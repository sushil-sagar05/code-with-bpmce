'use client';
import { motion } from 'framer-motion';
import { Code2, Target, Users, Zap, Heart, BookOpen } from 'lucide-react';

const values = [
  { icon: Code2, title: 'Open Source First', desc: 'We believe in sharing knowledge. All our resources, projects, and learning materials are open for everyone.' },
  { icon: Target, title: 'Outcome-Driven', desc: 'From internships to GSoC, we focus on real outcomes — jobs, projects, and measurable skills.' },
  { icon: Users, title: 'Community-Led', desc: 'Led by students, for students. Everyone is a mentor to someone at a different stage.' },
  { icon: Zap, title: 'Move Fast', desc: 'We ship, we iterate, we learn. Speed and execution are in our culture.' },
  { icon: Heart, title: 'Inclusive', desc: 'From beginners to experts. CS to non-CS. Everyone who wants to code belongs here.' },
  { icon: BookOpen, title: 'Lifelong Learning', desc: 'Technology evolves fast. We stay curious, keep learning, and adapt together.' },
];

const team = [
  { name: 'Aarav Shah', role: 'Club President', batch: '2024', branch: 'CSE' },
  { name: 'Neha Singh', role: 'Vice President', batch: '2024', branch: 'IT' },
  { name: 'Ravi Kumar', role: 'Tech Lead', batch: '2025', branch: 'CSE' },
  { name: 'Pooja Verma', role: 'Events Head', batch: '2025', branch: 'ECE' },
  { name: 'Amit Rai', role: 'DSA Lead', batch: '2026', branch: 'CSE' },
  { name: 'Suman Das', role: 'ML Lead', batch: '2026', branch: 'CSE' },
];

export default function AboutPage() {
  return (
    <div className="pt-20 pb-0">
      {/* Hero */}
      <section className="section-padding grid-bg relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <div className="accent-line mb-6" />
            <div className="tag-pill mb-4 inline-block">About Us</div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
              We Are <span className="text-gradient">CodeWithBPMCE</span>
            </h1>
            <p className="text-[#a0a0a0] text-xl font-dosis leading-relaxed max-w-3xl">
              Founded in 2021 at BP Mandal College of Engineering, Madhepura, we started as a small WhatsApp group 
              of students who wanted to learn together. Today we&apos;re 500+ strong — with alumni at Google, Microsoft, 
              Amazon, and top startups worldwide.
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
                ship real products, and launch real careers.
              </p>
              <p className="text-[#6a6a6a] text-lg font-dosis leading-relaxed">
                We believe that every student — regardless of branch, year, or background — 
                deserves access to quality mentorship, structured learning, and a community 
                that pushes them to be their best.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { year: '2021', event: 'Founded as a small Discord community' },
                { year: '2022', event: 'First hackathon — 80 participants, 20 projects' },
                { year: '2023', event: 'Launched structured roadmap program' },
                { year: '2024', event: '500+ members, 15 GSoC selections, SIH national winner' },
              ].map(({ year, event }) => (
                <div key={year} className="flex items-start gap-4">
                  <div className="font-mono text-[#FF6B00] text-sm font-bold w-12 flex-shrink-0">{year}</div>
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

      {/* Team */}
      <section className="section-padding bg-[#0d0d0d]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="accent-line mx-auto mb-4" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              The <span className="text-gradient">Team</span>
            </h2>
            <p className="text-[#6a6a6a] mt-3 font-dosis text-lg">Meet the students running CodeWithBPMCE.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {team.map(({ name, role, batch, branch }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-dark p-5 text-center group hover:border-[#FF6B00]/30 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF8C00] flex items-center justify-center mx-auto mb-3 font-display font-bold text-lg text-black">
                  {name[0]}
                </div>
                <p className="text-white font-dosis font-bold text-sm">{name}</p>
                <p className="text-[#FF6B00] font-mono text-[10px] uppercase tracking-wide mt-0.5">{role}</p>
                <p className="text-[#4a4a4a] font-mono text-[9px] mt-1">{branch} &apos;{batch}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
