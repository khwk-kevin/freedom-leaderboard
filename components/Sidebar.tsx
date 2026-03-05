'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import SearchBar from './SearchBar';

const navLinks = [
  { href: '/', label: 'Player Hub', icon: 'fa-user-astronaut' },
  { href: '/leaderboards/scape', label: 'Scape Leaderboards', icon: 'fa-trophy' },
  { href: '/leaderboards/planets', label: 'Planet Leaderboards', icon: 'fa-earth-americas' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex flex-col w-72 bg-[#0D1215] border-r border-[#1E2529] fixed h-full z-40 overflow-y-auto top-0">
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
          {navLinks.map(link => {
            const active = link.href === '/'
              ? pathname === '/' || pathname.startsWith('/player/')
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20'
                    : 'text-[#B8C5D0] hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <i className={`fa-solid ${link.icon} w-5 ${active ? '' : 'group-hover:text-[#00FF88]'} transition-colors`}></i>
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            );
          })}
          <a href="https://freedom.world" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#B8C5D0] hover:bg-white/5 hover:text-white transition-colors group border border-transparent">
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

