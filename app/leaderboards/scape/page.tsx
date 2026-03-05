import LeaderboardTable from '@/components/LeaderboardTable';
import { type TimeFilter as TF, getTopPlayersByXP, getTopPlayersByKills, getTopPlayersByWins, getTopPlayersByWinRate, getMostActivePlayers, getTopPlayersByMaterials } from '@/lib/queries/leaderboards';

export const revalidate = 300;

export const metadata = {
  title: 'The Scape Leaderboard — Freedom Player Hub',
  description: 'PvP arena rankings — kills, XP, wins, and more',
};

const tabs = [
  { key: 'kills', label: 'Slayers', statLabel: 'Kills' },
  { key: 'xp', label: 'Level', statLabel: 'XP' },
  { key: 'wins', label: 'Wins', statLabel: 'Wins' },
  { key: 'winrate', label: 'Accuracy', statLabel: 'Win Rate %' },
  { key: 'active', label: 'Active', statLabel: 'Matches' },
  { key: 'materials', label: 'Materials', statLabel: 'Materials' },
];

const timeOptions = [
  { value: 'week', label: '7D' },
  { value: 'month', label: '30D' },
  { value: 'all-time', label: 'All' },
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

export default async function ScapeLeaderboardPage({ searchParams }: { searchParams: Promise<{ cat?: string; time?: string }> }) {
  const params = await searchParams;
  const cat = params.cat || 'kills';
  const time = (params.time || 'all-time') as TF;
  const currentTab = tabs.find(t => t.key === cat) || tabs[0];
  const data = await getData(cat, time);

  return (
    <div className="space-y-0">
      {/* Sticky header: title + time + tabs all in one compact block */}
      <div className="sticky top-0 z-20 -mx-4 px-4 pt-2 pb-2 md:mx-0 md:px-0" style={{ background: 'rgba(10, 14, 16, 0.97)', backdropFilter: 'blur(8px)' }}>
        {/* Row 1: Title + Time filter */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight">⚔️ The Scape</h1>
          <div className="flex gap-1">
            {timeOptions.map(opt => (
              <a
                key={opt.value}
                href={`/leaderboards/scape?cat=${cat}&time=${opt.value}`}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  time === opt.value
                    ? 'bg-[#00FF88] text-black'
                    : 'text-[#7A8A99] hover:text-white'
                }`}
              >
                {opt.label}
              </a>
            ))}
          </div>
        </div>
        {/* Row 2: Category tabs */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {tabs.map(t => (
            <a
              key={t.key}
              href={`/leaderboards/scape?cat=${t.key}&time=${time}`}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                cat === t.key
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-[#7A8A99] hover:text-white'
              }`}
            >
              {t.label}
            </a>
          ))}
        </div>
      </div>

      {/* Leaderboard content — no redundant header */}
      <LeaderboardTable entries={data} statLabel={currentTab.statLabel} />
    </div>
  );
}
