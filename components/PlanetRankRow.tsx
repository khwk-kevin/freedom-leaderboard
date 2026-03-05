'use client';

import { useRouter } from 'next/navigation';
import PlanetAvatar from './PlanetAvatar';

type Props = {
  rank: number;
  planetId: string;
  planetName: string;
  ownerLabel: string;
  metrics: { label: string; value: string; color: string }[];
  maxStat: number;
  stat: number;
};

export default function PlanetRankRow({ rank, planetId, planetName, ownerLabel, metrics, maxStat, stat }: Props) {
  const router = useRouter();
  const progress = maxStat > 0 ? Math.max(5, (stat / maxStat) * 100) : 5;

  return (
    <div
      onClick={() => router.push(`/leaderboards/planets/${planetId}`)}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03] border-b cursor-pointer"
      style={{ borderColor: 'rgba(255,255,255,0.04)' }}
    >
      {/* Rank */}
      <div className="shrink-0 w-10 sm:w-12 text-center">
        <span className="text-white font-black text-sm sm:text-base">#{rank}</span>
      </div>

      {/* Planet avatar */}
      <PlanetAvatar planetId={planetId} planetName={planetName} size={38} />

      {/* Name + progress */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{planetName}</p>
            <p className="text-[11px] truncate" style={{ color: '#7D8598' }}>{ownerLabel}</p>
          </div>
          <div className="shrink-0 text-right">
            {metrics.map((m, i) => (
              <div key={i} className="flex items-center gap-2 justify-end">
                <span className="text-[10px]" style={{ color: '#7D8598' }}>{m.label}</span>
                <span className="text-xs font-bold" style={{ color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: metrics[0]?.color === '#FF6B6B'
                ? 'linear-gradient(90deg, #FF6B6B, #FF8888)'
                : 'linear-gradient(90deg, #00FF88, #00FFB3)',
              boxShadow: metrics[0]?.color === '#FF6B6B'
                ? '0 0 6px rgba(255, 107, 107, 0.4)'
                : '0 0 6px rgba(0, 255, 136, 0.4)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
