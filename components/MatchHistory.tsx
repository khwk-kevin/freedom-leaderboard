type Match = {
  timestamp?: string;
  match_result?: string;
  monsters_killed: number;
  xp_earned: number;
  level: number;
};

type Props = {
  matches: Match[];
};

export default function MatchHistory({ matches }: Props) {
  if (!matches.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Recent Matches</h2>
        <span className="text-xs text-[#A0AEC0]">{matches.length} shown</span>
      </div>

      <div className="bg-[#0D1215] border border-[#1E2529] rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1A1A1A] border-b border-[#1E2529]">
                <th className="p-4 text-xs font-bold text-[#A0AEC0] uppercase tracking-wider">Result</th>
                <th className="p-4 text-xs font-bold text-[#A0AEC0] uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-[#A0AEC0] uppercase tracking-wider text-right">Kills</th>
                <th className="p-4 text-xs font-bold text-[#A0AEC0] uppercase tracking-wider text-right">XP Earned</th>
                <th className="p-4 text-xs font-bold text-[#A0AEC0] uppercase tracking-wider text-right">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2529]">
              {matches.map((m, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    {m.match_result === 'Win' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88] text-xs font-bold uppercase">
                        <i className="fa-solid fa-crown text-[10px]"></i> Victory
                      </span>
                    ) : m.match_result === 'Lose' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 text-[#FF6B6B] text-xs font-bold uppercase">
                        <i className="fa-solid fa-skull text-[10px]"></i> Defeat
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-xs font-bold uppercase">
                        <i className="fa-solid fa-door-open text-[10px]"></i> Abandon
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-[#B8C5D0]">
                    {m.timestamp ? new Date(m.timestamp).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-4 text-sm text-right text-white font-bold">{m.monsters_killed}</td>
                  <td className="p-4 text-sm text-right text-[#A78BFA] font-bold">{Number(m.xp_earned).toLocaleString()}</td>
                  <td className="p-4 text-sm text-right text-[#B8C5D0]">{m.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
