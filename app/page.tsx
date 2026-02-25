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
      <section className="text-center py-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-[0.08] pointer-events-none" style={{ background: 'radial-gradient(circle, #00FF88, transparent)' }} />
        <h1 className="text-5xl font-black mb-4 relative z-10 text-glow-primary" style={{ color: '#00FF88' }}>
          Freedom Player Hub
        </h1>
        <p className="text-xl mb-8 relative z-10" style={{ color: '#7A8A99' }}>Track your stats. Climb the ranks. Share your glory.</p>
        <div className="flex justify-center relative z-10"><SearchBar placeholder="Search by player name or ID..." /></div>
      </section>

      {/* Global Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Players" value={stats?.total_players || 0} icon="👥" color="#00FF88" />
        <StatCard label="Total Matches" value={stats?.total_matches || 0} icon="⚔️" color="#FFFFFF" />
        <StatCard label="Planet Owners" value={stats?.total_planet_users || 0} icon="🌍" color="#3B82F6" />
        <StatCard label="Planets Created" value={stats?.total_planets || 0} icon="🪐" color="#A78BFA" />
      </section>

      {/* Top 5 Previews */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">🗡️ Top Slayers</h3>
          <LeaderboardTable entries={killEntries} statLabel="Kills" />
        </div>
        <div className="card">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">⭐ Highest Level</h3>
          <LeaderboardTable entries={xpEntries} statLabel="XP" />
        </div>
        <div className="card">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">🏆 Win Masters</h3>
          <LeaderboardTable entries={winEntries} statLabel="Wins" />
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-8">
        <Link href="/leaderboards"
          className="inline-block px-8 py-3 rounded-[10px] text-lg font-bold transition-all mr-4"
          style={{ background: 'transparent', border: '1.5px solid #2A2A2A', color: '#FFFFFF' }}>
          View Full Leaderboards
        </Link>
        <a href="https://freedom.world" target="_blank" rel="noopener noreferrer"
          className="inline-block px-8 py-3 rounded-[10px] text-lg font-bold transition-all transform hover:-translate-y-0.5"
          style={{ background: '#00FF88', color: '#000000', boxShadow: '0px 4px 12px rgba(0, 255, 136, 0.4)' }}>
          Join Freedom World
        </a>
      </section>
    </div>
  );
}
