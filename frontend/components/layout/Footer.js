'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code2, Mail, MapPin } from 'lucide-react';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';

const footerLinks = {
  Learn: [
    { label: 'Roadmaps', href: '/roadmaps' },
    { label: 'Resources', href: '/resources' },
    { label: 'Blogs', href: '/blogs' },
  ],
  Community: [
    { label: 'Projects', href: '/projects' },
    { label: 'Achievements', href: '/achievements' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Events', href: '/events' },
  ],
  Club: [
    { label: 'About', href: '/about' },
    { label: 'Join Club', href: '/join' },
    { label: 'Community', href: '/community' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
};

const socials = [
  { icon: FaGithub, href: 'https://github.com/codewithbpmce', label: 'GitHub' },
  { icon: FaTwitter, href: 'https://twitter.com/codewithbpmce', label: 'Twitter' },
  { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaYoutube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on full-page application views like dashboard & admin panel
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#0d0d0d] border-t border-[#1f1f1f]">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group w-fit">
              <div className="w-9 h-9 bg-[#FF6B00] rounded flex items-center justify-center">
                <Code2 className="w-5 h-5 text-black" strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-display text-white text-xl font-bold">
                  Code<span className="text-[#FF6B00]">With</span>BPMCE
                </span>
              </div>
            </Link>
            <p className="text-[#6a6a6a] text-sm font-dosis leading-relaxed mb-6 max-w-xs">
              The official coding club of BP Mandal College of Engineering, Madhepura. 
              Building tomorrow's engineers, one commit at a time.
            </p>
            <div className="flex items-center gap-1.5 text-[#4a4a4a] text-xs mb-2">
              <MapPin className="w-3 h-3 text-[#FF6B00]" />
              <span>BP Mandal College of Engineering, Madhepura, Bihar 852113</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#4a4a4a] text-xs">
              <Mail className="w-3 h-3 text-[#FF6B00]" />
              <span>codewithbpmce@gmail.com</span>
            </div>
            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center border border-[#1f1f1f] rounded text-[#6a6a6a] hover:text-[#FF6B00] hover:border-[#FF6B00]/40 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-mono text-[10px] text-[#FF6B00] uppercase tracking-[0.18em] mb-4">
                {category}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[#6a6a6a] hover:text-white text-sm font-dosis font-medium transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider my-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#4a4a4a] text-xs font-mono">
            © 2024 CodeWithBPMCE. Built with ❤️ by BPMCE students.
          </p>
          <div className="flex items-center gap-2">
            <div className="pulse-dot" />
            <span className="text-[#4a4a4a] text-xs font-mono">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
