import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Freedom Player Hub',
  description: 'Track your stats. Climb the ranks. Share your glory.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen" style={{ background: '#0A0E10', color: '#FFFFFF' }}>
        <Navigation />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
