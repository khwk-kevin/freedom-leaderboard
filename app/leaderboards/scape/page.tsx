import LeaderboardTable from '@/components/LeaderboardTable';
import TimeFilter from '@/components/TimeFilter';
import { type TimeFilter as TF, getTopPlayersByXP, getTopPlayersByKills, getTopPlayersByWins, getTopPlayersByWinRate, getMostActivePlayers, getTopPlayersByMaterials } from '@/lib/queries/leaderboards';
import { Suspense } from 'react';

export const revalidate = 300;

export const metadata = {
  title: 'The Scape Leaderboard — Freedom Player Hub',
  description: 'PvP arena rankings — kills, XP, wins, and more',
};

const tabs = [
  { key: 'kills', label: '🗡️ Slayers', statLabel: 'Kills' },
  { key: 'xp', label: '⭐ Level', statLabel: 'XP' },
  { key: 'wins', label: '🏆 Wins', statLabel: 'Wins' },
  { key: 'winrate', label: '🎯 Accuracy', statLabel: 'Win Rate %' },
  { key: 'active', label: '⚔️ Active', statLabel: 'Matches' },
  { key: 'materials', label: '💎 Materials', statLabel: 'Materials' },
];

async function getData(cat: string, time: TF) {
  switch (cat) {
    case 'kills': return (await getTopPlayersByKills(time)).map(e => ({ fdv_id: e.fdv_id ?? 0, avatar_name: e.avatar_name, stat: Number(e.total_kills) || 0, level: e.max_level }));
    case 'xp': return (await getTopPlayersByXP(time)).map(e => ({ fdv_id: e.fdv_id ?? 0, avatar_name: e.avatar_name, stat: Number(e.total_xp) || 0, level: e.max_level }));
    case 'wins': return (await getTopPlayersByWins(time)).map(e => ({ fdv_id: e.fdv_id ?? 0, avatar_name: e.avatar_name, stat: e.total_wins, level: e.max_level }));
    case 'winrate': return (await getTopPlayersByWinRate(time)).map(e => ({ fdv_id: e.fdv_id, avatar_name: e.avatar_name, stat: `${e.win_rate}%`, level: e.max_level }));
    case 'active': return (await getMostActivePlayers(time)).map(e => ({ fdv_id: e.fdv_id ?? 0, avatar_name: e.avatar_name, stat: e.total_matches, level: e.max_level }));
    case 'materials': return (await getTopPlayersByMaterials(time)).map(e => ({ fdv_id: e.fdv_id, avatar_name: e.avatar_name, stat: Number(e.total_materials) || 0, level: e.max_level }));
    default: return [];
  }
}

function TabButton({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0"
      style={active
        ? { background: '#00FF88', color: '#090D0F', boxShadow: '0 0 12px rgba(0, 255, 136, 0.3)' }
        : { background: '#1A1A2E', color: '#7A8A99', border: '1px solid #1E2529' }
      }
    >
      {children}
    </a>
  );
}

export default async function ScapeLeaderboardPage({ searchParams }: { searchParams: Promise<{ cat?: string; time?: string }> }) {
  const params = await searchParams;
  const cat = params.cat || 'kills';
  const time = (params.time || 'all-time') as TF;
  const currentTab = tabs.find(t => t.key === cat) || tabs[0];
  const data = await getData(cat, time);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>⚔️</span> The Scape
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: '#7A8A99' }}>PvP Arena Rankings</p>
        </div>
        <Suspense><TimeFilter /></Suspense>
      </div>

      {/* Sticky tabs */}
      <div className="sticky top-0 z-20 -mx-4 px-4 py-2 md:mx-0 md:px-0" style={{ background: 'rgba(10, 14, 16, 0.95)', backdropFilter: 'blur(8px)' }}>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map(t => (
            <TabButton key={t.key} href={`/leaderboards/scape?cat=${t.key}&time=${time}`} active={cat === t.key}>
              {t.label}
            </TabButton>
          ))}
        </div>
      </div>

      {/* Leaderboard content */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-2">
          <h2 className="text-base sm:text-lg font-bold text-white">{currentTab.label}</h2>
          <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: '#7A8A99' }}>Ranked by {currentTab.statLabel}</p>
        </div>
        <LeaderboardTable entries={data} statLabel={currentTab.statLabel} />
      </div>
    </div>
  );
}
