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
    <div className="space-y-5 sm:space-y-8">
      {/* Hero — compact on mobile */}
      <section className="text-center py-5 sm:py-10 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 rounded-full opacity-[0.08] pointer-events-none" style={{ background: 'radial-gradient(circle, #00FF88, transparent)' }} />
        <h1 className="text-3xl sm:text-5xl font-black mb-2 sm:mb-4 relative z-10 text-glow-primary" style={{ color: '#00FF88' }}>
          Freedom Player Hub
        </h1>
        <p className="text-sm sm:text-xl mb-4 sm:mb-6 relative z-10" style={{ color: '#7A8A99' }}>Track your stats. Climb the ranks. Share your glory.</p>
        <div className="flex justify-center relative z-10 px-2"><SearchBar placeholder="Search by player name or ID..." /></div>
      </section>

      {/* Global Stats — 2x2 grid, tight on mobile */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <StatCard label="Total Players" value={stats?.total_players || 0} icon="👥" color="#00FF88" />
        <StatCard label="Total Matches" value={stats?.total_matches || 0} icon="⚔️" color="#FFFFFF" />
        <StatCard label="Planet Owners" value={stats?.total_planet_users || 0} icon="🌍" color="#3B82F6" />
        <StatCard label="Planets Created" value={stats?.total_planets || 0} icon="🪐" color="#A78BFA" />
      </section>

      {/* Top 5 Previews — stack on mobile */}
      <section className="grid md:grid-cols-3 gap-4 sm:gap-6">
        <div className="card !p-3 sm:!p-4">
          <h3 className="text-sm sm:text-lg font-bold mb-2 sm:mb-4 flex items-center gap-2">🗡️ Top Slayers</h3>
          <LeaderboardTable entries={killEntries} statLabel="Kills" />
        </div>
        <div className="card !p-3 sm:!p-4">
          <h3 className="text-sm sm:text-lg font-bold mb-2 sm:mb-4 flex items-center gap-2">⭐ Highest Level</h3>
          <LeaderboardTable entries={xpEntries} statLabel="XP" />
        </div>
        <div className="card !p-3 sm:!p-4">
          <h3 className="text-sm sm:text-lg font-bold mb-2 sm:mb-4 flex items-center gap-2">🏆 Win Masters</h3>
          <LeaderboardTable entries={winEntries} statLabel="Wins" />
        </div>
      </section>

      {/* CTA — stack buttons on mobile */}
      <section className="text-center py-4 sm:py-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/leaderboards/scape"
          className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 rounded-[10px] text-sm sm:text-lg font-bold transition-all w-full sm:w-auto"
          style={{ background: 'transparent', border: '1.5px solid #2A2A2A', color: '#FFFFFF' }}>
          View Full Leaderboards
        </Link>
        <a href="https://freedom.world" target="_blank" rel="noopener noreferrer"
          className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 rounded-[10px] text-sm sm:text-lg font-bold transition-all transform hover:-translate-y-0.5 w-full sm:w-auto"
          style={{ background: '#00FF88', color: '#000000', boxShadow: '0px 4px 12px rgba(0, 255, 136, 0.4)' }}>
          Join Freedom World
        </a>
      </section>
    </div>
  );
}
