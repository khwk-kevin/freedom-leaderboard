import Link from 'next/link';
import AvatarImage from './AvatarImage';

type Entry = { fdv_id?: number; fdv_user_id?: number; avatar_name?: string | null; stat: string | number; level?: number | null };

export default function LeaderboardTable({ entries, statLabel }: { entries: Entry[]; statLabel: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-sm border-b" style={{ color: '#7A8A99', borderColor: '#1E2529' }}>
            <th className="py-3 px-2 w-12">#</th>
            <th className="py-3 px-2">Player</th>
            <th className="py-3 px-2 text-right">{statLabel}</th>
            <th className="py-3 px-2 text-right hidden sm:table-cell">Level</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => {
            const id = e.fdv_id ?? e.fdv_user_id ?? 0;
            const name = e.avatar_name || `#FDW${id}`;
            const rankColor = i === 0 ? '#FFD700' : i === 1 ? '#B8C5D0' : i === 2 ? '#CD7F32' : '#7A8A99';
            return (
              <tr key={i} className="border-b transition-colors hover:bg-white/[0.02]" style={{ borderColor: 'rgba(30, 37, 41, 0.5)' }}>
                <td className="py-3 px-2 font-mono font-bold" style={{ color: rankColor }}>{i + 1}</td>
                <td className="py-3 px-2">
                  <Link href={`/player/${id}`} className="flex items-center gap-3 transition-colors" style={{ color: '#FFFFFF' }}>
                    <AvatarImage fdvId={id} name={name} size={32} />
                    <span className="font-medium truncate max-w-[200px]">{name}</span>
                  </Link>
                </td>
                <td className="py-3 px-2 text-right font-bold" style={{ color: '#00FF88' }}>
                  {typeof e.stat === 'number' ? e.stat.toLocaleString() : e.stat}
                </td>
                <td className="py-3 px-2 text-right hidden sm:table-cell" style={{ color: '#7A8A99' }}>{e.level ?? '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {entries.length === 0 && <p className="text-center py-8" style={{ color: '#7A8A99' }}>No data available for this period.</p>}
    </div>
  );
}
