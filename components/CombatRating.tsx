interface CombatRatingProps {
  rating: number;
  percentile: number;
}

function getRatingTier(rating: number) {
  if (rating >= 85) return { label: 'Legendary', color: '#FFD700', glow: '0px 0px 20px rgba(255, 215, 0, 0.4)', bg: 'rgba(255, 215, 0, 0.06)', border: 'rgba(255, 215, 0, 0.3)' };
  if (rating >= 70) return { label: 'Epic', color: '#9D4EDD', glow: '0px 0px 20px rgba(157, 78, 221, 0.3)', bg: 'rgba(157, 78, 221, 0.06)', border: 'rgba(157, 78, 221, 0.3)' };
  if (rating >= 50) return { label: 'Rare', color: '#3B82F6', glow: '0px 0px 16px rgba(59, 130, 246, 0.3)', bg: 'rgba(59, 130, 246, 0.06)', border: 'rgba(59, 130, 246, 0.3)' };
  if (rating >= 30) return { label: 'Uncommon', color: '#00FF88', glow: '0px 0px 16px rgba(0, 255, 136, 0.3)', bg: 'rgba(0, 255, 136, 0.06)', border: 'rgba(0, 255, 136, 0.3)' };
  return { label: 'Common', color: '#7A8A99', glow: 'none', bg: 'rgba(122, 138, 153, 0.06)', border: 'rgba(122, 138, 153, 0.3)' };
}

export default function CombatRating({ rating, percentile }: CombatRatingProps) {
  const tier = getRatingTier(rating);
  const topPercent = Math.max(1, Math.round(100 - percentile));

  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl p-5"
      style={{
        background: tier.bg,
        border: `1px solid ${tier.border}`,
        boxShadow: tier.glow,
      }}
    >
      <div
        className="text-5xl font-black"
        style={{ color: tier.color, textShadow: `0px 0px 12px ${tier.border}` }}
      >
        {Math.round(rating)}
      </div>
      <div className="text-sm font-semibold mt-1" style={{ color: '#7A8A99' }}>Combat Rating</div>
      <div className="text-xs font-bold mt-1" style={{ color: tier.color }}>{tier.label}</div>
      <div className="text-xs mt-1" style={{ color: '#7A8A99' }}>Top {topPercent}%</div>
    </div>
  );
}
