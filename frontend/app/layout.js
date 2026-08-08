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
  title: 'CodeWithBPMCE — Premier Coding Club | BP Mandal College of Engineering',
  description:
    'CodeWithBPMCE is the official coding club of BP Mandal College of Engineering, Madhepura. Join us for roadmaps, hackathons, DSA, AI/ML, Web Dev and more.',
  keywords: ['coding club', 'BPMCE', 'BP Mandal', 'Madhepura', 'programming', 'web development', 'DSA', 'hackathon'],
  authors: [{ name: 'CodeWithBPMCE' }],
  openGraph: {
    title: 'CodeWithBPMCE — Premier Coding Club',
    description: 'Learn. Build. Innovate. The official coding club of BPMCE, Madhepura.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeWithBPMCE',
    description: 'Learn. Build. Innovate.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dosis.variable} ${jetbrainsMono.variable} ${lobsterTwo.variable}`}>
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
