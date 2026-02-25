import StatCard from './StatCard';

type Props = {
  planets: { total_planets: number; total_structures: number; total_fds_earned: number } | null;
};

export default function PlanetStats({ planets }: Props) {
  if (!planets || Number(planets.total_planets) === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">
          <i className="fa-solid fa-earth-americas mr-2 text-[#3B82F6]"></i>
          Planet Stats
        </h2>
      </div>
      <div className="bg-[#0D1215] border border-[#1E2529] rounded-2xl p-5 shadow-card">
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Planets" value={Number(planets.total_planets)} color="#3B82F6" />
          <StatCard label="Structures" value={Number(planets.total_structures)} color="#A78BFA" />
          <StatCard label="FDS Earned" value={Number(planets.total_fds_earned).toFixed(2)} color="#FFD700" />
        </div>
      </div>
    </section>
  );
}
