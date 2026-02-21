import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white hover:text-purple-400 transition-colors">
          ⚔️ Freedom Player Hub
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/leaderboards" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
            🏆 Leaderboards
          </Link>
          <a href="https://freedom.world" target="_blank" rel="noopener noreferrer"
            className="text-sm px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white transition-colors hidden sm:block">
            Join Freedom World
          </a>
        </div>
      </div>
    </nav>
  );
}
