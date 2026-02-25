'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from './SearchBar';

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Navigation Trigger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0D1215] border-b border-[#1E2529] px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/freedom-logo.png" alt="Freedom World" width={120} height={32} className="h-8 w-auto" />
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-2">
          <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${mobileOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-72 bg-[#0D1215] border-r border-[#1E2529] fixed h-full z-40 overflow-y-auto top-[60px] md:top-0`}>
        {/* Logo */}
        <div className="p-6 flex items-center justify-center mb-4">
          <Image src="/freedom-logo.png" alt="Freedom World" width={180} height={48} className="h-12 w-auto" priority />
        </div>

        {/* Search */}
        <div className="px-4 mb-6">
          <SearchBar />
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20">
            <i className="fa-solid fa-user-astronaut w-5"></i>
            <span className="font-medium text-sm">Player Hub</span>
          </Link>
          <Link href="/leaderboards" className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#B8C5D0] hover:bg-white/5 hover:text-white transition-colors group">
            <i className="fa-solid fa-trophy w-5 group-hover:text-[#00FF88] transition-colors"></i>
            <span className="font-medium text-sm">Leaderboards</span>
          </Link>
          <a href="https://freedom.world" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#B8C5D0] hover:bg-white/5 hover:text-white transition-colors group">
            <i className="fa-solid fa-globe w-5 group-hover:text-[#00FF88] transition-colors"></i>
            <span className="font-medium text-sm">Freedom World</span>
          </a>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E2529]">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-[#1A1A1A] border border-[#1E2529]">
            <Image src="/freedom-logo.png" alt="Freedom World" width={24} height={24} className="w-6 h-6 object-contain" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Freedom World</p>
              <p className="text-[10px] text-[#00FF88] truncate">Player Hub</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
