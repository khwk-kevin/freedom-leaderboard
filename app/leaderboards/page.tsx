import LeaderboardTable from '@/components/LeaderboardTable';
import TimeFilter from '@/components/TimeFilter';
import { type TimeFilter as TF, getTopPlayersByXP, getTopPlayersByKills, getTopPlayersByWins, getTopPlayersByWinRate, getMostActivePlayers, getTopPlayersByMaterials, getTopEmpireBuilders, getTopPlanetLords, getTopEarners } from '@/lib/queries/leaderboards';
import { Suspense } from 'react';

export const revalidate = 300;

const scapeTabs = [
  { key: 'kills', label: '🗡️ Top Slayers', statLabel: 'Kills' },
  { key: 'xp', label: '⭐ Highest Level', statLabel: 'XP' },
  { key: 'wins', label: '🏆 Win Masters', statLabel: 'Wins' },
  { key: 'winrate', label: '🎯 Sharpshooters', statLabel: 'Win Rate %' },
  { key: 'active', label: '⚔️ Most Active', statLabel: 'Matches' },
  { key: 'materials', label: '💎 Material Tycoons', statLabel: 'Materials' },
];

const planetTabs = [
  { key: 'builders', label: '🏗️ Empire Builders', statLabel: 'Structures' },
  { key: 'lords', label: '🌍 Planet Lords', statLabel: 'Planets' },
  { key: 'earners', label: '💰 Top Earners', statLabel: 'FDS Earned' },
];

async function getLeaderboardData(cat: string, time: TF) {
  switch (cat) {
    case 'kills': return (await getTopPlayersByKills(time)).map(e => ({ fdv_id: e.fdv_id ?? 0, avatar_name: e.avatar_name, stat: Number(e.total_kills) || 0, level: e.max_level }));
    case 'xp': return (await getTopPlayersByXP(time)).map(e => ({ fdv_id: e.fdv_id ?? 0, avatar_name: e.avatar_name, stat: Number(e.total_xp) || 0, level: e.max_level }));
    case 'wins': return (await getTopPlayersByWins(time)).map(e => ({ fdv_id: e.fdv_id ?? 0, avatar_name: e.avatar_name, stat: e.total_wins, level: e.max_level }));
    case 'winrate': return (await getTopPlayersByWinRate(time)).map(e => ({ fdv_id: e.fdv_id, avatar_name: e.avatar_name, stat: `${e.win_rate}%`, level: e.max_level }));
    case 'active': return (await getMostActivePlayers(time)).map(e => ({ fdv_id: e.fdv_id ?? 0, avatar_name: e.avatar_name, stat: e.total_matches, level: e.max_level }));
    case 'materials': return (await getTopPlayersByMaterials(time)).map(e => ({ fdv_id: e.fdv_id, avatar_name: e.avatar_name, stat: Number(e.total_materials) || 0, level: e.max_level }));
    case 'builders': return (await getTopEmpireBuilders(time)).map(e => ({ fdv_user_id: e.fdv_user_id, stat: e.total_structures }));
    case 'lords': return (await getTopPlanetLords(time)).map(e => ({ fdv_user_id: e.fdv_user_id, stat: e.planet_count }));
    case 'earners': return (await getTopEarners(time)).map(e => ({ fdv_user_id: e.fdv_user_id, stat: Number(e.total_fds) || 0 }));
    default: return [];
  }
}

function TabButton({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap"
      style={active
        ? { background: '#00FF88', color: '#090D0F', boxShadow: '0 0 12px rgba(0, 255, 136, 0.3)' }
        : { background: '#1A1A2E', color: '#7A8A99', border: '1px solid #1E2529' }
      }
    >
      {children}
    </a>
  );
}

export default async function LeaderboardsPage({ searchParams }: { searchParams: Promise<{ cat?: string; time?: string }> }) {
  const params = await searchParams;
  const cat = params.cat || 'kills';
  const time = (params.time || 'all-time') as TF;
  const allTabs = [...scapeTabs, ...planetTabs];
  const currentTab = allTabs.find(t => t.key === cat) || scapeTabs[0];
  const data = await getLeaderboardData(cat, time);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Leaderboard</h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: '#7A8A99' }}>See who dominates Freedom World</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/leaderboards/planets"
            className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #1B1040, #0D1B2A)', color: '#00FFB3', border: '1px solid rgba(0, 255, 179, 0.2)', boxShadow: '0 0 12px rgba(0, 255, 136, 0.15)' }}
          >
            🪐 Planets
          </a>
          <Suspense><TimeFilter /></Suspense>
        </div>
      </div>

      {/* Category tabs */}
      <div className="space-y-3">
        <div>
          <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#7A8A99' }}>The Scape</h2>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-hide">
            {scapeTabs.map(t => (
              <TabButton key={t.key} href={`/leaderboards?cat=${t.key}&time=${time}`} active={cat === t.key}>
                {t.label}
              </TabButton>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#7A8A99' }}>Planets</h2>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-hide">
            {planetTabs.map(t => (
              <TabButton key={t.key} href={`/leaderboards?cat=${t.key}&time=${time}`} active={cat === t.key}>
                {t.label}
              </TabButton>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard content */}
      <div className="card !p-0 overflow-hidden">
        {/* Active category header */}
        <div className="px-6 pt-5 pb-2">
          <h2 className="text-lg font-bold text-white">{currentTab.label}</h2>
          <p className="text-xs mt-0.5" style={{ color: '#7A8A99' }}>Ranked by {currentTab.statLabel}</p>
        </div>

        <LeaderboardTable entries={data} statLabel={currentTab.statLabel} />
      </div>
    </div>
  );
}
