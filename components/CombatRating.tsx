type Props = {
  rating: number;
  tier: string;
  tierColor: string;
  percentile: number;
};

export default function CombatRating({ rating, tier, tierColor, percentile }: Props) {
  return (
    <div className="flex-shrink-0 mt-2 md:mt-0">
      <div
        className="border rounded-[12px] p-5 flex flex-col items-center min-w-[140px] backdrop-blur-sm relative overflow-hidden"
        style={{
          background: `linear-gradient(to bottom, ${tierColor}15, #0D1215)`,
          borderColor: `${tierColor}50`,
          boxShadow: `0 0 20px ${tierColor}30`,
        }}
      >
        {/* Glow effect */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 blur-xl rounded-full pointer-events-none"
          style={{ backgroundColor: `${tierColor}30` }}
        ></div>

        <div
          className="text-[48px] font-black leading-none mb-1"
          style={{ color: tierColor, textShadow: `0 0 12px ${tierColor}99` }}
        >
          {rating}
        </div>
        <div className="text-sm font-bold text-[#A0AEC0] uppercase tracking-wide mb-2">Combat Rating</div>

        <div className="w-full h-[1px] mb-2" style={{ background: `linear-gradient(to right, transparent, ${tierColor}50, transparent)` }}></div>

        <div className="text-base font-bold mb-0.5" style={{ color: tierColor }}>
          {tier} Tier
        </div>
        <div className="text-xs font-medium text-[#A0AEC0]">
          Top {Math.max(1, Math.round(100 - percentile))}%
        </div>
      </div>
    </div>
  );
}
