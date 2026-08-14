import './globals.css';
import { Dosis, JetBrains_Mono, Lobster_Two } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';
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
  },

  verification: {
    google: 'rrIYk1Sve3VpUmVraRdIR5gcDvSKhtZL_AThqMD3TT0',
  },

  description:
    'DevBuddies is the official coding club & technical platform of BP Mandal College of Engineering (BPMCE), Madhepura & Bihar Engineering University (BEU). Access curated engineering roadmaps, student projects, achievements, coding events, and resources in Bihar.',

  keywords: [
    'DevBuddies',
    'best coding club in Bihar',
    'BPMCE coding platform',
    'BP Mandal College of Engineering',
    'Bihar engineering college coding',
    'BEU syllabus roadmaps',
    'AKU Bihar coding resources',
    'Madhepura programming club',
    'Bihar tech community',
    'learn programming Bihar',
    'engineering roadmaps Bihar',
    'devbuddies.in',
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
    title: 'DevBuddies — Best Engineering Coding Club & Roadmap Hub in Bihar',
    description:
      'Structured AKU/BEU engineering learning roadmaps, coding resources, and student community guidance in Bihar.',
    url: 'https://devbuddies.in',
    siteName: 'DevBuddies',
    type: 'website',
    locale: 'en_IN',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'DevBuddies — Best Coding Club & Roadmap Hub in Bihar',
    description:
      "Bihar's premier engineering student tech community and roadmap platform.",
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
    <html
      lang="en"
      className={`${dosis.variable} ${jetbrainsMono.variable} ${lobsterTwo.variable}`}
    >
      <body className="bg-[#0a0a0a] text-white font-sans antialiased overflow-x-hidden">
        {/* Google Identity Services */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />

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
                success: {
                  iconTheme: {
                    primary: '#FF6B00',
                    secondary: '#0a0a0a',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#0a0a0a',
                  },
                },
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