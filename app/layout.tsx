import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Freedom Player Hub',
  description: 'Track your stats. Climb the ranks. Share your glory.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="min-h-screen flex flex-col md:flex-row overflow-x-hidden" style={{ background: '#0A0E10', color: '#FFFFFF', fontFamily: "'Inter', sans-serif" }} suppressHydrationWarning>
        <Sidebar />
        <main className="flex-1 md:pl-72 p-4 md:p-8 pt-20 md:pt-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
        <Script src="https://cdn.plot.ly/plotly-3.1.1.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
