import Podium from './Podium';
import RankRow from './RankRow';

type Entry = { fdv_id?: number; fdv_user_id?: number; avatar_name?: string | null; stat: string | number; level?: number | null };

export default function LeaderboardTable({ entries, statLabel }: { entries: Entry[]; statLabel: string }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm" style={{ color: '#7A8A99' }}>No data available for this period.</p>
      </div>
    );
  }

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  const maxStat = rest.length > 0
    ? Math.max(...rest.map(e => typeof e.stat === 'number' ? e.stat : parseFloat(String(e.stat)) || 0))
    : 1;

  return (
    <div>
      {top3.length >= 3 && <Podium entries={top3} statLabel={statLabel} />}

      <div className="rounded-xl overflow-hidden" style={{ background: '#090D0F' }}>
        {rest.map((entry, i) => (
          <RankRow key={i} entry={entry} rank={i + 4} maxStat={maxStat} />
        ))}
      </div>
    </div>
  );
}
