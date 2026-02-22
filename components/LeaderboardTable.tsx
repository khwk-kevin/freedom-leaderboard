import Link from 'next/link';
import AvatarImage from './AvatarImage';

type Entry = { fdv_id?: number; fdv_user_id?: number; avatar_name?: string | null; stat: string | number; level?: number | null };

export default function LeaderboardTable({ entries, statLabel }: { entries: Entry[]; statLabel: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 text-sm border-b border-gray-800">
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
            return (
              <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors">
                <td className="py-3 px-2 text-gray-500 font-mono">{i + 1}</td>
                <td className="py-3 px-2">
                  <Link href={`/player/${id}`} className="flex items-center gap-3 hover:text-purple-400 transition-colors">
                    <AvatarImage fdvId={id} name={name} size={32} />
                    <span className="font-medium truncate max-w-[200px]">{name}</span>
                  </Link>
                </td>
                <td className="py-3 px-2 text-right font-bold text-purple-400">
                  {typeof e.stat === 'number' ? e.stat.toLocaleString() : e.stat}
                </td>
                <td className="py-3 px-2 text-right text-gray-400 hidden sm:table-cell">{e.level ?? '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {entries.length === 0 && <p className="text-center text-gray-500 py-8">No data available for this period.</p>}
    </div>
  );
}
