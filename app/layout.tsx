import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Freedom Player Hub',
  description: 'Track your stats. Climb the ranks. Share your glory.',
  other: {
    'stylesheet': 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <head suppressHydrationWarning>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="min-h-screen flex flex-col md:flex-row overflow-x-hidden" style={{ background: '#0A0E10', color: '#FFFFFF', fontFamily: "var(--font-inter), 'Inter', sans-serif" }} suppressHydrationWarning>
        <Sidebar />
        <main className="flex-1 md:pl-72 p-4 md:p-8 pt-20 md:pt-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
        <Script src="https://cdn.plot.ly/plotly-3.1.1.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
