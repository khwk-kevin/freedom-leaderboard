import StatCard from '@/components/StatCard';
import SearchBar from '@/components/SearchBar';
import LeaderboardTable from '@/components/LeaderboardTable';
import Link from 'next/link';
import { getGlobalStats, getTopPlayersByKills, getTopPlayersByXP, getTopPlayersByWins } from '@/lib/queries/leaderboards';

export const revalidate = 300;

export default async function HomePage() {
  const [stats, topKills, topXP, topWins] = await Promise.all([
    getGlobalStats(),
    getTopPlayersByKills('all-time'),
    getTopPlayersByXP('all-time'),
    getTopPlayersByWins('all-time'),
  ]);

  const killEntries = topKills.slice(0, 5).map(e => ({ fdv_id: e.fdv_id ?? 0, avatar_name: e.avatar_name, stat: Number(e.total_kills) || 0, level: e.max_level }));
  const xpEntries = topXP.slice(0, 5).map(e => ({ fdv_id: e.fdv_id ?? 0, avatar_name: e.avatar_name, stat: Number(e.total_xp) || 0, level: e.max_level }));
  const winEntries = topWins.slice(0, 5).map(e => ({ fdv_id: e.fdv_id ?? 0, avatar_name: e.avatar_name, stat: e.total_wins, level: e.max_level }));

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Freedom Player Hub
        </h1>
        <p className="text-xl text-gray-400 mb-8">Track your stats. Climb the ranks. Share your glory.</p>
        <div className="flex justify-center"><SearchBar placeholder="Search by player name or ID..." /></div>
      </section>

      {/* Global Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Players" value={stats?.total_players || 0} icon="👥" />
        <StatCard label="Total Matches" value={stats?.total_matches || 0} icon="⚔️" />
        <StatCard label="Planet Owners" value={stats?.total_planet_users || 0} icon="🌍" />
        <StatCard label="Planets Created" value={stats?.total_planets || 0} icon="🪐" />
      </section>

      {/* Top 5 Previews */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">🗡️ Top Slayers</h3>
          <LeaderboardTable entries={killEntries} statLabel="Kills" />
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">⭐ Highest Level</h3>
          <LeaderboardTable entries={xpEntries} statLabel="XP" />
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">🏆 Win Masters</h3>
          <LeaderboardTable entries={winEntries} statLabel="Wins" />
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-8">
        <Link href="/leaderboards" className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-lg font-bold transition-colors mr-4">
          View Full Leaderboards
        </Link>
        <a href="https://freedom.world" target="_blank" rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-lg font-bold transition-colors">
          Join Freedom World
        </a>
      </section>
    </div>
  );
}
