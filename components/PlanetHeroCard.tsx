'use client';

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
  const planetSize = rank === 1 ? 140 : rank <= 3 ? 110 : 90;

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl p-4 md:p-5 transition-all hover:scale-[1.01] ${reversed ? 'flex-row-reverse' : 'flex-row'}`}
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
      <div className={`flex-1 min-w-0 ${reversed ? 'text-right' : 'text-left'}`}>
        {/* Rank badge */}
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-black text-white mb-2"
          style={{ background: '#C4524F' }}
        >
          #{rank}
        </span>

        {/* Planet name */}
        <h3 className="text-white font-bold text-lg md:text-xl truncate">{planetName}</h3>
        <p className="text-xs mt-0.5 truncate" style={{ color: '#7D8598' }}>{ownerLabel}</p>

        {/* Metrics */}
        <div className={`flex gap-4 mt-3 ${reversed ? 'justify-end' : 'justify-start'}`}>
          {metrics.map((m, i) => (
            <div key={i}>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: '#7D8598' }}>{m.label}</p>
              <p className="font-bold text-sm" style={{ color: m.color }}>{m.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
