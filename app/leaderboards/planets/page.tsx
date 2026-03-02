import PlanetLeaderboard from '@/components/PlanetLeaderboard';
import { getTopPlanetsByStructures, getTopUsersByFDS, getPlanetGlobalStats } from '@/lib/queries/planet-leaderboards';

export const revalidate = 300;

export const metadata = {
  title: 'Planet Leaderboard — Freedom Player Hub',
  description: 'See which planets dominate Freedom World',
};

export default async function PlanetLeaderboardPage() {
  const [popData, fdsData, stats] = await Promise.all([
    getTopPlanetsByStructures('all-time'),
    getTopUsersByFDS('all-time'),
    getPlanetGlobalStats(),
  ]);

  return (
    <div
      className="min-h-screen -m-4 md:-m-8 p-4 md:p-8"
      style={{
        background: 'linear-gradient(180deg, #0A0E10 0%, #0D1B2A 20%, #1B1040 50%, #0D1B2A 80%, #0A0E10 100%)',
      }}
    >
      {/* Nebula overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(88, 28, 135, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(59, 7, 100, 0.1) 0%, transparent 50%)',
          zIndex: 0,
        }}
      />

      {/* Stars overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(1px 1px at 20px 30px, white, transparent),
            radial-gradient(1px 1px at 40px 70px, white, transparent),
            radial-gradient(1px 1px at 50px 160px, white, transparent),
            radial-gradient(1px 1px at 90px 40px, white, transparent),
            radial-gradient(1.5px 1.5px at 130px 80px, white, transparent),
            radial-gradient(1px 1px at 160px 120px, white, transparent),
            radial-gradient(1px 1px at 200px 50px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 250px 190px, white, transparent),
            radial-gradient(1px 1px at 300px 100px, white, transparent),
            radial-gradient(1.5px 1.5px at 350px 150px, white, transparent)`,
          backgroundSize: '400px 250px',
          zIndex: 0,
        }}
      />

      <div className="relative z-10">
        <PlanetLeaderboard
          initialMode="population"
          initialTime="all-time"
          initialPopData={popData}
          initialFdsData={fdsData}
          stats={stats}
        />
      </div>
    </div>
  );
}
