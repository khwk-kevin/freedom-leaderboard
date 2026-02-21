import Link from 'next/link';

export default function PlayerNotFound() {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-3xl font-bold mb-2">Player Not Found</h1>
      <p className="text-gray-400 mb-8">This adventurer hasn&apos;t been spotted yet.</p>
      <div className="flex gap-4 justify-center">
        <Link href="/leaderboards" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold transition-colors">
          View Leaderboards
        </Link>
        <a href="https://freedom.world" target="_blank" rel="noopener noreferrer"
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition-colors">
          Join Freedom World
        </a>
      </div>
    </div>
  );
}
