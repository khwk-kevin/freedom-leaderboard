import Link from 'next/link';
import AvatarImage from './AvatarImage';

type PodiumEntry = {
  fdv_id?: number;
  fdv_user_id?: number;
  avatar_name?: string | null;
  stat: string | number;
  level?: number | null;
};

const medalColors = {
  1: { ring: '#FFD700', badge: 'bg-gradient-to-br from-yellow-400 to-orange-500', glow: 'shadow-[0_0_20px_rgba(255,215,0,0.4)]' },
  2: { ring: '#C0C0C0', badge: 'bg-gradient-to-br from-gray-300 to-gray-500', glow: 'shadow-[0_0_15px_rgba(192,192,192,0.3)]' },
  3: { ring: '#CD7F32', badge: 'bg-gradient-to-br from-amber-600 to-amber-800', glow: 'shadow-[0_0_15px_rgba(205,127,50,0.3)]' },
} as const;

function PodiumCard({ entry, rank, statLabel }: { entry: PodiumEntry; rank: 1 | 2 | 3; statLabel: string }) {
  const id = entry.fdv_id ?? entry.fdv_user_id ?? 0;
  const name = entry.avatar_name || `#FDW${id}`;
  const medal = medalColors[rank];
  const isFirst = rank === 1;

  return (
    <Link href={`/player/${id}`} className="block group">
      <div
        className={`relative flex flex-col items-center rounded-2xl border border-white/10 px-2 sm:px-4 py-4 sm:py-5 transition-all hover:border-white/20 hover:scale-[1.02] ${isFirst ? 'bg-[#14142E]/80 shadow-[0_0_30px_rgba(16,244,139,0.1)]' : 'bg-[#14142E]/50'}`}
        style={{ marginTop: isFirst ? 0 : 16 }}
      >
        {/* Avatar with ring and rank badge */}
        <div className="relative mb-2">
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: `2px solid ${medal.ring}`, padding: 1 }}
          >
            <AvatarImage fdvId={id} name={name} size={isFirst ? 64 : 48} className="rounded-lg" />
          </div>
          {/* Rank badge */}
          <div
            className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg"
            style={{ background: '#10F48B', color: '#090D0F' }}
          >
            {rank}
          </div>
        </div>

        {/* Name */}
        <p className="text-white font-bold text-xs sm:text-sm text-center truncate w-full max-w-[100px] sm:max-w-[120px] group-hover:text-[#00FFB3] transition-colors">
          {name}
        </p>

        {/* Stat label */}
        <p className="text-[10px] sm:text-[11px] mt-0.5" style={{ color: '#A0A0B0' }}>{statLabel}</p>

        {/* Stat value */}
        <p className="font-black mt-0.5" style={{ color: '#00FFB3', fontSize: isFirst ? 18 : 15 }}>
          {typeof entry.stat === 'number' ? entry.stat.toLocaleString() : entry.stat}
        </p>

        {/* Star badge — smaller on mobile */}
        <div className={`mt-2 rounded-full flex items-center justify-center ${medal.badge} ${medal.glow}`}
          style={{ width: isFirst ? 40 : 32, height: isFirst ? 40 : 32 }}
        >
          <svg width={isFirst ? 20 : 16} height={isFirst ? 20 : 16} viewBox="0 0 24 24" fill="white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function Podium({ entries, statLabel }: { entries: PodiumEntry[]; statLabel: string }) {
  if (entries.length < 3) return null;

  return (
    <div className="flex items-end justify-center gap-2 sm:gap-3 px-2 sm:px-4 py-4 sm:py-6">
      {/* 2nd place */}
      <div className="flex-1 max-w-[130px] sm:max-w-[160px]">
        <PodiumCard entry={entries[1]} rank={2} statLabel={statLabel} />
      </div>
      {/* 1st place */}
      <div className="flex-1 max-w-[140px] sm:max-w-[180px]">
        <PodiumCard entry={entries[0]} rank={1} statLabel={statLabel} />
      </div>
      {/* 3rd place */}
      <div className="flex-1 max-w-[130px] sm:max-w-[160px]">
        <PodiumCard entry={entries[2]} rank={3} statLabel={statLabel} />
      </div>
    </div>
  );
}
