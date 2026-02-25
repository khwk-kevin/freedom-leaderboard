import StatCard from './StatCard';

type Props = {
  nexus: {
    nexus_total: number;
    nexus_wins: number;
    nexus_losses: number;
    nexus_win_rate: number;
    nexus_avg_kills: number;
  } | null;
};

export default function NexusStats({ nexus }: Props) {
  if (!nexus || nexus.nexus_total === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">
          <i className="fa-solid fa-dungeon mr-2 text-[#9D4EDD]"></i>
          Nexus Performance
        </h2>
        <span className="text-xs text-[#A0AEC0] bg-[#9D4EDD]/10 border border-[#9D4EDD]/20 px-2 py-1 rounded font-bold">
          {nexus.nexus_total} Runs
        </span>
      </div>

      <div className="bg-[#0D1215] border border-[#1E2529] rounded-2xl p-5 shadow-card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Nexus Wins" value={nexus.nexus_wins} color="#00FF88" barPercent={nexus.nexus_total > 0 ? (nexus.nexus_wins / nexus.nexus_total) * 100 : 0} />
          <StatCard label="Nexus Losses" value={nexus.nexus_losses} color="#FF6B6B" />
          <StatCard label="Win Rate" value={`${nexus.nexus_win_rate}%`} color="#9D4EDD" barPercent={Number(nexus.nexus_win_rate)} />
          <StatCard label="Avg Kills" value={nexus.nexus_avg_kills} color="#A78BFA" />
        </div>
      </div>
    </section>
  );
}
