interface PercentileBarProps {
  label: string;
  percentile: number;
  icon: string;
}

function getTierStyle(pct: number): { color: string; glow: string } {
  if (pct >= 95) return { color: '#FFD700', glow: '0px 0px 8px rgba(255, 215, 0, 0.5)' };
  if (pct >= 85) return { color: '#9D4EDD', glow: '0px 0px 8px rgba(157, 78, 221, 0.5)' };
  if (pct >= 70) return { color: '#3B82F6', glow: '0px 0px 8px rgba(59, 130, 246, 0.5)' };
  return { color: '#7A8A99', glow: 'none' };
}

export default function PercentileBar({ label, percentile, icon }: PercentileBarProps) {
  const topPct = Math.max(1, Math.round(100 - percentile));
  const tier = getTierStyle(percentile);

  return (
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm" style={{ color: '#B8C5D0' }}>{label}</span>
          <span className="text-sm font-bold" style={{ color: tier.color }}>Top {topPct}%</span>
        </div>
        <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${percentile}%`, background: tier.color, boxShadow: tier.glow }}
          />
        </div>
      </div>
    </div>
  );
}
