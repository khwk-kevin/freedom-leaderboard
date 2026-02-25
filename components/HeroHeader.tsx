import AvatarImage from './AvatarImage';
import CombatRating from './CombatRating';
import ShareButton from './ShareButton';

type Props = {
  name: string;
  fdvId: number;
  level: number;
  totalXp: number;
  firstMatch: string | null;
  combatRating: number | null;
  combatPercentile: number;
  dominantRole: { primary: { name: string; icon: string }; secondary: { name: string; icon: string } } | null;
};

function getRatingTier(rating: number): { label: string; color: string } {
  if (rating >= 80) return { label: 'Legendary', color: '#FFD700' };
  if (rating >= 60) return { label: 'Epic', color: '#9D4EDD' };
  if (rating >= 40) return { label: 'Rare', color: '#3B82F6' };
  if (rating >= 20) return { label: 'Uncommon', color: '#00FF88' };
  return { label: 'Common', color: '#B8C5D0' };
}

export default function HeroHeader({ name, fdvId, level, totalXp, firstMatch, combatRating, combatPercentile, dominantRole }: Props) {
  const tier = combatRating ? getRatingTier(combatRating) : null;

  return (
    <section className="mb-8">
      <div className="bg-[#0D1215] border border-[#1E2529] rounded-[16px] p-6 shadow-card relative overflow-hidden group">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#9D4EDD]/10 to-transparent pointer-events-none"></div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start relative z-10">
          {/* LEFT: Avatar */}
          <div className="flex-shrink-0 relative">
            <div className="relative p-[3px] rounded-[16px] bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-[0_0_15px_rgba(255,215,0,0.2)]">
              <AvatarImage fdvId={fdvId} name={name} size={96} className="rounded-[13px] bg-[#1A1A1A]" />
            </div>
            {/* Level Badge */}
            <div className="absolute -top-3 -left-3 bg-[#1A1A1A] border border-[#FFD700] rounded px-2 py-0.5 shadow-md flex items-center gap-1">
              <span className="text-[10px] font-bold text-white tracking-wider">LVL</span>
              <span className="text-sm font-bold text-white">{level}</span>
            </div>
          </div>

          {/* CENTER: Info */}
          <div className="flex-1 text-center md:text-left flex flex-col justify-center min-w-0">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
              <h1 className="text-[28px] font-bold text-white leading-tight">{name}</h1>
            </div>

            <div className="mb-2 text-base font-medium text-[#A78BFA]">
              Level {level} <span className="mx-1 text-[#A0AEC0]">·</span> {Number(totalXp).toLocaleString()} XP
            </div>

            {dominantRole && (
              <div className="mb-3 text-sm text-[#B8C5D0] flex items-center justify-center md:justify-start gap-3 flex-wrap">
                <span className="flex items-center gap-1.5 bg-[#1A1A1A]/50 px-2 py-1 rounded border border-[#1E2529]">
                  <span className="text-[#FF6B6B]">{dominantRole.primary.icon}</span> {dominantRole.primary.name} Main
                </span>
                <span className="flex items-center gap-1.5 bg-[#1A1A1A]/50 px-2 py-1 rounded border border-[#1E2529]">
                  <span className="text-[#3B82F6]">{dominantRole.secondary.icon}</span> {dominantRole.secondary.name} Secondary
                </span>
              </div>
            )}

            {firstMatch && (
              <div className="text-xs text-[#A0AEC0] flex items-center justify-center md:justify-start gap-2">
                <i className="fa-regular fa-calendar-check"></i> Playing since {new Date(firstMatch).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            )}

            <div className="mt-5 flex gap-3 justify-center md:justify-start">
              <ShareButton />
              <a href="https://freedom.world" target="_blank" rel="noopener noreferrer"
                className="bg-[#00FF88] text-black font-bold text-sm px-6 py-2.5 rounded-[10px] shadow-[0_4px_12px_rgba(0,255,136,0.4)] hover:bg-[#00FFB8] transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                Join Freedom
              </a>
            </div>
          </div>

          {/* RIGHT: Combat Rating */}
          {combatRating !== null && tier && (
            <CombatRating rating={combatRating} tier={tier.label} tierColor={tier.color} percentile={combatPercentile} />
          )}
        </div>
      </div>
    </section>
  );
}
