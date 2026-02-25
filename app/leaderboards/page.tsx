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

export default async function LeaderboardsPage({ searchParams }: { searchParams: Promise<{ cat?: string; time?: string }> }) {
  const params = await searchParams;
  const cat = params.cat || 'kills';
  const time = (params.time || 'all-time') as TF;
  const allTabs = [...scapeTabs, ...planetTabs];
  const currentTab = allTabs.find(t => t.key === cat) || scapeTabs[0];
  const data = await getLeaderboardData(cat, time);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black mb-2">🏆 Leaderboards</h1>
        <p style={{ color: '#7A8A99' }}>See who dominates the Freedom World</p>
      </div>

      <Suspense><TimeFilter /></Suspense>

      {/* Scape tabs */}
      <div>
        <h2 className="text-lg font-semibold mb-3" style={{ color: '#B8C5D0' }}>The Scape</h2>
        <div className="flex gap-2 flex-wrap">
          {scapeTabs.map(t => (
            <a key={t.key} href={`/leaderboards?cat=${t.key}&time=${time}`}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={cat === t.key
                ? { background: '#00FF88', color: '#000000', boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)' }
                : { background: '#1A1A1A', color: '#7A8A99', border: '1px solid #1E2529' }
              }>
              {t.label}
            </a>
          ))}
        </div>
      </div>

      {/* Planet tabs */}
      <div>
        <h2 className="text-lg font-semibold mb-3" style={{ color: '#B8C5D0' }}>Planets</h2>
        <div className="flex gap-2 flex-wrap">
          {planetTabs.map(t => (
            <a key={t.key} href={`/leaderboards?cat=${t.key}&time=${time}`}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={cat === t.key
                ? { background: '#00FF88', color: '#000000', boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)' }
                : { background: '#1A1A1A', color: '#7A8A99', border: '1px solid #1E2529' }
              }>
              {t.label}
            </a>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">{currentTab.label}</h2>
        <LeaderboardTable entries={data} statLabel={currentTab.statLabel} />
      </div>
    </div>
  );
}
