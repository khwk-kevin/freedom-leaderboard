'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'Home', icon: 'fa-house', matchExact: true },
  { href: '/leaderboards/scape', label: 'Scape', icon: 'fa-khanda', matchPrefix: '/leaderboards/scape' },
  { href: '/leaderboards/planets', label: 'Planets', icon: 'fa-earth-americas', matchPrefix: '/leaderboards/planets' },
];

export default function BottomNav() {
  const pathname = usePathname();

  function isActive(tab: typeof tabs[0]) {
    if (tab.matchExact) return pathname === tab.href || pathname.startsWith('/player/');
    if (tab.matchPrefix) return pathname.startsWith(tab.matchPrefix);
    return false;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t" style={{ background: '#0D1215', borderColor: '#1E2529' }}>
      <div className="flex items-stretch">
        {tabs.map(tab => {
          const active = isActive(tab);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors relative"
              style={{ color: active ? '#00FF88' : '#7A8A99' }}
            >
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full" style={{ background: '#00FF88' }} />
              )}
              <i className={`fa-solid ${tab.icon} text-base`}></i>
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for phones with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" style={{ background: '#0D1215' }} />
    </nav>
  );
}
