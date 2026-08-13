import './globals.css';
import { Dosis, JetBrains_Mono, Lobster_Two } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LenisProvider from '@/components/providers/LenisProvider';
import { AuthProvider } from '@/context/AuthContext';

const dosis = Dosis({
  subsets: ['latin'],
  variable: '--font-dosis',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const lobsterTwo = Lobster_Two({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://www.devbuddies.in'),
  title: {
    default: 'DevBuddies — Official Coding & Roadmap Platform | BPMCE & BEU Bihar',
    template: '%s | DevBuddies BPMCE',

    verification: {
    google: 'rrIYk1Sve3VpUmVraRdIR5gcDvSKhtZL_AThqMD3TT0',
  },
  },
  description:
    'DevBuddies is the official coding club & technical platform of BP Mandal College of Engineering (BPMCE), Madhepura & Bihar Engineering University (BEU). Access curated engineering roadmaps, student projects, achievements, coding events, and resources in Bihar.',
  keywords: [
    'DevBuddies',
    'DevBuddies BPMCE',
    'BPMCE coding club',
    'BPMCE programming community',
    'BP Mandal College of Engineering',
    'BEU coding community',
    'Bihar Engineering University coding',
    'coding community Bihar',
    'coding resources for engineering students',
    'DSA roadmaps BEU',
    'Web Development roadmap Bihar',
    'AI ML roadmap engineering',
    'hackathons in Bihar',
    'coding events Madhepura',
    'BPMCE student projects',
    'BPMCE student achievements',
  ],
  alternates: {
    canonical: 'https://www.devbuddies.in',
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'DevBuddies — Official Coding & Roadmap Platform | BPMCE & BEU Bihar',
    description:
      'The premier tech community of BP Mandal College of Engineering (BPMCE), Madhepura. Master Full-Stack, DSA, AI/ML with BEU-aligned roadmaps and student projects.',
    url: 'https://www.devbuddies.in',
    siteName: 'DevBuddies BPMCE',
    images: [
      {
        url: '/icon.svg',
        width: 800,
        height: 600,
        alt: 'DevBuddies BPMCE Coding Community',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevBuddies — Official Coding & Roadmap Platform | BPMCE & BEU Bihar',
    description:
      'Bihar\'s premier engineering student tech community, BEU-aligned learning roadmaps, and coding events at BPMCE Madhepura.',
    images: ['/icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'DevBuddies',
    alternateName: 'DevBuddies BPMCE',
    url: 'https://www.devbuddies.in',
    logo: 'https://www.devbuddies.in/icon.svg',
    description:
      'Official coding & developer community of BP Mandal College of Engineering (BPMCE), Madhepura, Bihar.',
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: 'BP Mandal College of Engineering, Madhepura',
      url: 'https://www.bpmce.ac.in',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Madhepura',
      addressRegion: 'Bihar',
      addressCountry: 'IN',
    },
  };

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DevBuddies',
    url: 'https://www.devbuddies.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.devbuddies.in/roadmaps?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className={`${dosis.variable} ${jetbrainsMono.variable} ${lobsterTwo.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="bg-[#0a0a0a] text-white font-sans antialiased overflow-x-hidden">
        <AuthProvider>
          <LenisProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#141414',
                  color: '#fff',
                  border: '1px solid #1f1f1f',
                  fontFamily: 'Dosis, sans-serif',
                },
                success: { iconTheme: { primary: '#FF6B00', secondary: '#0a0a0a' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#0a0a0a' } },
              }}
            />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </LenisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
