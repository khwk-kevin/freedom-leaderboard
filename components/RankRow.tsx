import Link from 'next/link';
import AvatarImage from './AvatarImage';

type Entry = {
  fdv_id?: number;
  fdv_user_id?: number;
  avatar_name?: string | null;
  stat: string | number;
  level?: number | null;
};

export default function RankRow({ entry, rank, maxStat }: { entry: Entry; rank: number; maxStat: number }) {
  const id = entry.fdv_id ?? entry.fdv_user_id ?? 0;
  const name = entry.avatar_name || `#FDW${id}`;
  const numStat = typeof entry.stat === 'number' ? entry.stat : parseFloat(String(entry.stat)) || 0;
  const progress = maxStat > 0 ? Math.max(5, (numStat / maxStat) * 100) : 5;

  return (
    <Link href={`/player/${id}`} className="block">
      <div className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-white/[0.03] transition-colors border-b" style={{ borderColor: '#1A1D25' }}>
        {/* Rank */}
        <span className="w-7 sm:w-8 text-center font-black text-sm sm:text-base shrink-0" style={{ color: '#00FFB3' }}>
          {rank}
        </span>

        {/* Avatar */}
        <div className="shrink-0 rounded-lg overflow-hidden" style={{ border: '1.5px solid #2A2A50' }}>
          <AvatarImage fdvId={id} name={name} size={36} className="rounded-lg" />
        </div>

        {/* Name + stat + progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-1.5">
            <span className="text-white font-semibold text-xs sm:text-sm truncate">{name}</span>
            <span className="text-[11px] sm:text-xs font-bold shrink-0" style={{ color: '#00FFB3' }}>
              {typeof entry.stat === 'number' ? entry.stat.toLocaleString() : entry.stat}
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#1A1D25' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #00FF88, #00FFB3)',
                boxShadow: '0 0 6px rgba(0, 255, 136, 0.4)',
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
