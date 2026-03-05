import Link from 'next/link';
import AvatarImage from './AvatarImage';

type PodiumEntry = {
  fdv_id?: number;
  fdv_user_id?: number;
  avatar_name?: string | null;
  stat: string | number;
  level?: number | null;
};

const ringColors: Record<number, string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };

function PodiumCard({ entry, rank, statLabel }: { entry: PodiumEntry; rank: 1 | 2 | 3; statLabel: string }) {
  const id = entry.fdv_id ?? entry.fdv_user_id ?? 0;
  const name = entry.avatar_name || `#FDW${id}`;
  const isFirst = rank === 1;

  return (
    <Link href={`/player/${id}`} className="block group">
      <div
        className={`relative flex flex-col items-center rounded-xl border border-white/10 px-1 sm:px-3 py-2.5 sm:py-4 transition-all hover:border-white/20 ${isFirst ? 'bg-[#14142E]/80' : 'bg-[#14142E]/50'}`}
        style={{ marginTop: isFirst ? 0 : 12 }}
      >
        {/* Avatar + rank badge */}
        <div className="relative mb-1.5">
          <div className="rounded-lg overflow-hidden" style={{ border: `2px solid ${ringColors[rank]}`, padding: 1 }}>
            <AvatarImage fdvId={id} name={name} size={isFirst ? 56 : 44} className="rounded-md" />
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
            style={{ background: '#10F48B', color: '#090D0F' }}
          >
            {rank}
          </div>
        </div>

        {/* Name */}
        <p className="text-white font-bold text-[10px] sm:text-xs text-center truncate w-full group-hover:text-[#00FFB3]">
          {name}
        </p>

        {/* Stat value */}
        <p className="font-black text-sm sm:text-base mt-0.5" style={{ color: '#00FFB3' }}>
          {typeof entry.stat === 'number' ? entry.stat.toLocaleString() : entry.stat}
        </p>

        {/* Stat label */}
        <p className="text-[9px] text-[#7A8A99]">{statLabel}</p>
      </div>
    </Link>
  );
}

export default function Podium({ entries, statLabel }: { entries: PodiumEntry[]; statLabel: string }) {
  if (entries.length < 3) return null;

  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3 px-1 sm:px-2 py-3 sm:py-4 items-end">
      <PodiumCard entry={entries[1]} rank={2} statLabel={statLabel} />
      <PodiumCard entry={entries[0]} rank={1} statLabel={statLabel} />
      <PodiumCard entry={entries[2]} rank={3} statLabel={statLabel} />
    </div>
  );
}
