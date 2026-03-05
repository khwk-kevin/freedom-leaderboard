import LeaderboardTable from '@/components/LeaderboardTable';
import { type TimeFilter as TF, getTopPlayersByXP, getTopPlayersByKills, getTopPlayersByWins, getTopPlayersByWinRate, getMostActivePlayers, getTopPlayersByMaterials } from '@/lib/queries/leaderboards';
import { unstable_cache } from 'next/cache';

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
  const cachedQuery = (fn: () => Promise<unknown[]>) =>
    unstable_cache(fn, [`scape-${cat}-${time}`], { revalidate: 300 })();

  switch (cat) {
    case 'kills': return ((await cachedQuery(() => getTopPlayersByKills(time))) as Array<Record<string, unknown>>).map(e => ({ fdv_id: (e.fdv_id as number) ?? 0, avatar_name: e.avatar_name as string | null, stat: Number(e.total_kills) || 0, level: e.max_level as number }));
    case 'xp': return ((await cachedQuery(() => getTopPlayersByXP(time))) as Array<Record<string, unknown>>).map(e => ({ fdv_id: (e.fdv_id as number) ?? 0, avatar_name: e.avatar_name as string | null, stat: Number(e.total_xp) || 0, level: e.max_level as number }));
    case 'wins': return ((await cachedQuery(() => getTopPlayersByWins(time))) as Array<Record<string, unknown>>).map(e => ({ fdv_id: (e.fdv_id as number) ?? 0, avatar_name: e.avatar_name as string | null, stat: e.total_wins as number, level: e.max_level as number }));
    case 'winrate': return ((await cachedQuery(() => getTopPlayersByWinRate(time))) as Array<Record<string, unknown>>).map(e => ({ fdv_id: e.fdv_id as number, avatar_name: e.avatar_name as string | null, stat: `${e.win_rate}%`, level: e.max_level as number }));
    case 'active': return ((await cachedQuery(() => getMostActivePlayers(time))) as Array<Record<string, unknown>>).map(e => ({ fdv_id: (e.fdv_id as number) ?? 0, avatar_name: e.avatar_name as string | null, stat: e.total_matches as number, level: e.max_level as number }));
    case 'materials': return ((await cachedQuery(() => getTopPlayersByMaterials(time))) as Array<Record<string, unknown>>).map(e => ({ fdv_id: e.fdv_id as number, avatar_name: e.avatar_name as string | null, stat: Number(e.total_materials) || 0, level: e.max_level as number }));
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
