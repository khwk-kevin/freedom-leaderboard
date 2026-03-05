import Link from 'next/link';
import PlanetAvatar from './PlanetAvatar';

type Props = {
  rank: number;
  planetId: string;
  planetName: string;
  ownerLabel: string;
  metrics: { label: string; value: string; color: string }[];
  maxStat: number;
  stat: number;
  foodStat?: number;
  industrialStat?: number;
};

export default function PlanetRankRow({ rank, planetId, planetName, ownerLabel, metrics, maxStat, stat, foodStat, industrialStat }: Props) {
  const totalWidth = maxStat > 0 ? Math.max(5, (stat / maxStat) * 100) : 5;

  // Split bar: food (green) + industrial (orange)
  const hasSplit = foodStat !== undefined && industrialStat !== undefined && stat > 0;
  const foodPct = hasSplit ? (foodStat / stat) * totalWidth : 0;
  const industrialPct = hasSplit ? (industrialStat / stat) * totalWidth : 0;
  const isFDS = metrics[0]?.color === '#00FFB3' || metrics[0]?.color === '#00FF88';

  return (
    <Link
      href={`/leaderboards/planets/${planetId}`}
      className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 transition-colors hover:bg-white/[0.03] border-b cursor-pointer block"
      style={{ borderColor: 'rgba(255,255,255,0.04)' }}
    >
      {/* Rank */}
      <div className="shrink-0 w-8 sm:w-10 text-center">
        <span className="text-white font-black text-xs sm:text-sm">#{rank}</span>
      </div>

      {/* Planet avatar */}
      <PlanetAvatar planetId={planetId} planetName={planetName} size={36} />

      {/* Name + progress */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-1.5">
          <div className="min-w-0">
            <p className="text-white font-semibold text-xs sm:text-sm truncate">{planetName}</p>
            <p className="text-[10px] sm:text-[11px] truncate" style={{ color: '#7D8598' }}>{ownerLabel}</p>
          </div>
          <div className="shrink-0 text-right">
            {metrics.map((m, i) => (
              <div key={i} className="flex items-center gap-1.5 justify-end">
                <span className="text-[9px] sm:text-[10px]" style={{ color: '#7D8598' }}>{m.label}</span>
                <span className="text-[11px] sm:text-xs font-bold" style={{ color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Progress bar — split food/industrial for population mode */}
        <div className="mt-1 h-1.5 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.06)' }}>
          {hasSplit ? (
            <>
              <div
                className="h-full"
                style={{
                  width: `${foodPct}%`,
                  background: '#00FF88',
                  borderRadius: industrialPct > 0 ? '9999px 0 0 9999px' : '9999px',
                }}
              />
              <div
                className="h-full"
                style={{
                  width: `${industrialPct}%`,
                  background: '#E8913A',
                  borderRadius: foodPct > 0 ? '0 9999px 9999px 0' : '9999px',
                }}
              />
            </>
          ) : (
            <div
              className="h-full rounded-full"
              style={{
                width: `${totalWidth}%`,
                background: isFDS
                  ? 'linear-gradient(90deg, #00FF88, #00FFB3)'
                  : 'linear-gradient(90deg, #FF6B6B, #FF8888)',
              }}
            />
          )}
        </div>
      </div>
    </Link>
  );
}
