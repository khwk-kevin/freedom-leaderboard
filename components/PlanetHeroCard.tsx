'use client';

import { useRouter } from 'next/navigation';
import PlanetAvatar from './PlanetAvatar';

type Props = {
  rank: number;
  planetId: string;
  planetName: string;
  ownerLabel: string;
  metrics: { label: string; value: string; color: string }[];
  reversed?: boolean;
};

export default function PlanetHeroCard({ rank, planetId, planetName, ownerLabel, metrics, reversed }: Props) {
  const router = useRouter();
  const planetSize = rank === 1 ? 100 : rank <= 3 ? 80 : 64;

  return (
    <div
      onClick={() => router.push(`/leaderboards/planets/${planetId}`)}
      className={`flex items-center gap-3 sm:gap-4 rounded-2xl p-3 sm:p-5 transition-all hover:scale-[1.01] cursor-pointer ${reversed ? 'sm:flex-row-reverse flex-row' : 'flex-row'}`}
      style={{
        background: 'linear-gradient(135deg, rgba(15, 20, 40, 0.8), rgba(25, 15, 50, 0.6))',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Planet */}
      <div className="shrink-0">
        <PlanetAvatar planetId={planetId} planetName={planetName} size={planetSize} />
      </div>

      {/* Info */}
      <div className={`flex-1 min-w-0 ${reversed ? 'sm:text-right text-left' : 'text-left'}`}>
        {/* Rank badge */}
        <span
          className="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black text-white mb-1.5"
          style={{ background: '#C4524F' }}
        >
          #{rank}
        </span>

        {/* Planet name */}
        <h3 className="text-white font-bold text-base sm:text-xl truncate">{planetName}</h3>
        <p className="text-[11px] mt-0.5 truncate" style={{ color: '#7D8598' }}>{ownerLabel}</p>

        {/* Metrics */}
        <div className={`flex gap-3 sm:gap-4 mt-2 sm:mt-3 ${reversed ? 'sm:justify-end justify-start' : 'justify-start'}`}>
          {metrics.map((m, i) => (
            <div key={i}>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-wider" style={{ color: '#7D8598' }}>{m.label}</p>
              <p className="font-bold text-xs sm:text-sm" style={{ color: m.color }}>{m.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
