import StatCard from '@/components/StatCard';
import SearchBar from '@/components/SearchBar';
import LeaderboardTable from '@/components/LeaderboardTable';
import PlanetHeroCard from '@/components/PlanetHeroCard';
import Link from 'next/link';
import { getGlobalStats, getTopPlayersByKills, getTopPlayersByXP, getTopPlayersByWins } from '@/lib/queries/leaderboards';
import { getTopPlanetsByStructures, getTopUsersByFDS, getPlanetGlobalStats } from '@/lib/queries/planet-leaderboards';
import { unstable_cache } from 'next/cache';

export const revalidate = 600; // 10 min ISR — home page data doesn't change fast

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

export default async function HomePage() {
  // All home page data cached for 10 minutes — single cache key
  const getHomeData = unstable_cache(
    async () => {
      const [stats, topKills, topXP, topWins, topPlanets, topFDS, planetStats] = await Promise.all([
        getGlobalStats(),
        getTopPlayersByKills('all-time'),
        getTopPlayersByXP('all-time'),
        getTopPlayersByWins('all-time'),
        getTopPlanetsByStructures('all-time'),
        getTopUsersByFDS('all-time'),
        getPlanetGlobalStats(),
      ]);
      return { stats, topKills, topXP, topWins, topPlanets, topFDS, planetStats };
    },
    ['home-page-data'],
    { revalidate: 600 }
  );
  const { stats, topKills, topXP, topWins, topPlanets, topFDS, planetStats } = await getHomeData();

  const killEntries = topKills.slice(0, 5).map(e => ({ fdv_id: e.fdv_id ?? 0, avatar_name: e.avatar_name, stat: Number(e.total_kills) || 0, level: e.max_level }));
  const xpEntries = topXP.slice(0, 5).map(e => ({ fdv_id: e.fdv_id ?? 0, avatar_name: e.avatar_name, stat: Number(e.total_xp) || 0, level: e.max_level }));
  const winEntries = topWins.slice(0, 5).map(e => ({ fdv_id: e.fdv_id ?? 0, avatar_name: e.avatar_name, stat: e.total_wins, level: e.max_level }));

  const topPlanet3 = topPlanets.slice(0, 3);
  const topFDS3 = topFDS.slice(0, 3);

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Hero — compact on mobile */}
      <section className="text-center py-4 sm:py-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 rounded-full opacity-[0.08] pointer-events-none" style={{ background: 'radial-gradient(circle, #00FF88, transparent)' }} />
        <h1 className="text-2xl sm:text-4xl font-black mb-1.5 sm:mb-3 relative z-10" style={{ color: '#00FF88' }}>
          Freedom Player Hub
        </h1>
        <p className="text-xs sm:text-base mb-3 sm:mb-5 relative z-10" style={{ color: '#7A8A99' }}>Track your stats. Climb the ranks. Share your glory.</p>
        <div className="flex justify-center relative z-10 px-2"><SearchBar placeholder="Search by player name or ID..." /></div>
      </section>

      {/* Global Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <StatCard label="Total Players" value={stats?.total_players || 0} icon="👥" color="#00FF88" />
        <StatCard label="Total Matches" value={stats?.total_matches || 0} icon="⚔️" color="#FFFFFF" />
        <StatCard label="Planet Owners" value={planetStats?.total_users || 0} icon="🌍" color="#3B82F6" />
        <StatCard label="Planets" value={planetStats?.total_planets || 0} icon="🪐" color="#A78BFA" />
      </section>

      {/* ⚔️ THE SCAPE SECTION */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">⚔️ The Scape</h2>
          <Link href="/leaderboards/scape" className="text-[11px] sm:text-xs font-semibold" style={{ color: '#00FF88' }}>View All →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4">
          <div className="card !p-3 sm:!p-4">
            <h3 className="text-xs sm:text-sm font-bold mb-2 flex items-center gap-1.5 text-[#B8C5D0]">🗡️ Top Slayers</h3>
            <LeaderboardTable entries={killEntries} statLabel="Kills" />
          </div>
          <div className="card !p-3 sm:!p-4">
            <h3 className="text-xs sm:text-sm font-bold mb-2 flex items-center gap-1.5 text-[#B8C5D0]">⭐ Highest Level</h3>
            <LeaderboardTable entries={xpEntries} statLabel="XP" />
          </div>
          <div className="card !p-3 sm:!p-4">
            <h3 className="text-xs sm:text-sm font-bold mb-2 flex items-center gap-1.5 text-[#B8C5D0]">🏆 Win Masters</h3>
            <LeaderboardTable entries={winEntries} statLabel="Wins" />
          </div>
        </div>
      </section>

      {/* 🪐 PLANETS SECTION */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">🪐 Planets</h2>
          <Link href="/leaderboards/planets" className="text-[11px] sm:text-xs font-semibold" style={{ color: '#A78BFA' }}>View All →</Link>
        </div>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
          {/* Top Planets by Structures */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#B8C5D0] px-1">🏗️ Most Built</h3>
            {topPlanet3.map((p, i) => (
              <PlanetHeroCard
                key={p.planet_id}
                rank={i + 1}
                planetId={p.planet_id}
                planetName={p.planet_name || 'Unknown'}
                ownerLabel={p.owner_name || `#FDW${p.fdv_user_id}`}
                metrics={[
                  { label: 'Structures', value: formatNumber(p.total_structure), color: '#FF6B6B' },
                ]}
                reversed={false}
              />
            ))}
          </div>

          {/* Top FDS Earners */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#B8C5D0] px-1">💰 Top FDS Earners</h3>
            {topFDS3.map((e, i) => (
              <PlanetHeroCard
                key={e.fdv_user_id}
                rank={i + 1}
                planetId={e.top_planet_id || String(e.fdv_user_id)}
                planetName={e.owner_name || `#FDW${e.fdv_user_id}`}
                ownerLabel={e.top_planet_name ? `${e.top_planet_name} + ${e.planet_count - 1} more` : `${e.planet_count} planets`}
                metrics={[
                  { label: 'FDS', value: Number(e.total_fds).toFixed(1), color: '#00FFB3' },
                ]}
                reversed={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-3 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
        <a href="https://freedom.world" target="_blank" rel="noopener noreferrer"
          className="inline-block px-6 sm:px-8 py-2.5 rounded-lg text-sm font-bold w-full sm:w-auto"
          style={{ background: '#00FF88', color: '#000000' }}>
          Join Freedom World
        </a>
      </section>
    </div>
  );
}
