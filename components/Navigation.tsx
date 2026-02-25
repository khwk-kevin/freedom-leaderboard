import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-sm" style={{ background: 'rgba(10, 14, 16, 0.85)', borderBottom: '1px solid #1E2529' }}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity" style={{ color: '#FFFFFF' }}>
          ⚔️ Freedom Player Hub
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/leaderboards" className="text-sm font-medium transition-colors hover:text-white" style={{ color: '#7A8A99' }}>
            🏆 Leaderboards
          </Link>
          <a href="https://freedom.world" target="_blank" rel="noopener noreferrer"
            className="text-sm px-4 py-2 rounded-lg font-bold transition-all hidden sm:block"
            style={{ background: '#00FF88', color: '#000000', boxShadow: '0px 4px 12px rgba(0, 255, 136, 0.4)' }}>
            Join Freedom World
          </a>
        </div>
      </div>
    </nav>
  );
}
