type Props = {
  dominantRole: {
    primary: { name: string; icon: string; value: number };
    secondary: { name: string; icon: string; value: number };
    stats: { peak_damage: number; peak_block: number; peak_heal: number };
  } | null;
  winStreak: { bestStreak: number; currentStreak: number } | null;
};

const ROLE_COLORS: Record<string, string> = {
  DPS: '#FF6B6B',
  Tank: '#00FF88',
  Healer: '#A78BFA',
};

export default function BuildIdentity({ dominantRole, winStreak }: Props) {
  if (!dominantRole) return null;

  const maxStat = Math.max(dominantRole.stats.peak_damage, dominantRole.stats.peak_block, dominantRole.stats.peak_heal, 1);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">
          <i className="fa-solid fa-fingerprint mr-2 text-[#FFD700]"></i>
          Build Identity
        </h2>
      </div>

      <div className="bg-[#0D1215] border border-[#1E2529] rounded-2xl p-5 shadow-card">
        {/* Dominant Role */}
        <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-[#1A1A1A]/50 border border-[#1E2529]">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl border"
            style={{
              backgroundColor: `${ROLE_COLORS[dominantRole.primary.name] || '#B8C5D0'}15`,
              borderColor: `${ROLE_COLORS[dominantRole.primary.name] || '#B8C5D0'}40`,
            }}
          >
            {dominantRole.primary.icon}
          </div>
          <div>
            <div className="text-lg font-bold text-white">{dominantRole.primary.name} Main</div>
            <div className="text-sm text-[#B8C5D0]">
              Secondary: <span style={{ color: ROLE_COLORS[dominantRole.secondary.name] }}>{dominantRole.secondary.icon} {dominantRole.secondary.name}</span>
            </div>
          </div>
        </div>

        {/* Peak Stats */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#A0AEC0] font-bold">⚔️ Peak Damage</span>
              <span className="text-[#FF6B6B] font-bold">{dominantRole.stats.peak_damage.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div className="h-full bg-[#FF6B6B] rounded-full" style={{ width: `${(dominantRole.stats.peak_damage / maxStat) * 100}%`, boxShadow: '0 0 8px rgba(255,107,107,0.4)' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#A0AEC0] font-bold">🛡️ Peak Block</span>
              <span className="text-[#00FF88] font-bold">{dominantRole.stats.peak_block.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div className="h-full bg-[#00FF88] rounded-full" style={{ width: `${(dominantRole.stats.peak_block / maxStat) * 100}%`, boxShadow: '0 0 8px rgba(0,255,136,0.4)' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#A0AEC0] font-bold">💚 Peak Heal</span>
              <span className="text-[#A78BFA] font-bold">{dominantRole.stats.peak_heal.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div className="h-full bg-[#A78BFA] rounded-full" style={{ width: `${(dominantRole.stats.peak_heal / maxStat) * 100}%`, boxShadow: '0 0 8px rgba(167,139,250,0.4)' }}></div>
            </div>
          </div>
        </div>

        {/* Win Streak */}
        {winStreak && (winStreak.bestStreak > 0 || winStreak.currentStreak > 0) && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-[#1A1A1A]/50 border border-[#1E2529] rounded-xl p-3 text-center">
              <div className="text-xs text-[#A0AEC0] font-bold uppercase mb-1">Best Streak</div>
              <div className="text-2xl font-bold text-[#FFD700]" style={{ textShadow: '0 0 8px rgba(255,215,0,0.4)' }}>
                {winStreak.bestStreak}
                <i className="fa-solid fa-fire ml-1 text-sm"></i>
              </div>
            </div>
            <div className="bg-[#1A1A1A]/50 border border-[#1E2529] rounded-xl p-3 text-center">
              <div className="text-xs text-[#A0AEC0] font-bold uppercase mb-1">Current Streak</div>
              <div className="text-2xl font-bold text-[#00FF88]" style={{ textShadow: '0 0 8px rgba(0,255,136,0.4)' }}>
                {winStreak.currentStreak}
                <i className="fa-solid fa-fire ml-1 text-sm"></i>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
