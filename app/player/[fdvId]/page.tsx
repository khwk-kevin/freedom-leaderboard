import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import HeroHeader from '@/components/HeroHeader';
import StatCard from '@/components/StatCard';
import RadarChart from '@/components/RadarChart';
import MatchHistory from '@/components/MatchHistory';
import EquipmentLoadout from '@/components/EquipmentLoadout';
import MaterialsNFTs from '@/components/MaterialsNFTs';
import NexusStats from '@/components/NexusStats';
import BuildIdentity from '@/components/BuildIdentity';
import PlanetStats from '@/components/PlanetStats';
import {
  getPlayerInfo, getPlayerScapeSummary, getPlayerMaterials, getPlayerEquipment,
  getPlayerMatchHistory, getPlayerPlanetSummary, getPlayerCombatStats, getTotalNFTs,
  getPlayerNexusStats, getPlayerWinStreak, getPlayerDominantRole,
  getPlayerRadarStats, getPlayerCombatRating, getCombatRatingPercentile,
} from '@/lib/queries/player';

export const revalidate = 600;

type Props = { params: Promise<{ fdvId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { fdvId } = await params;
  const player = await getPlayerInfo(Number(fdvId));
  if (!player) return { title: 'Player Not Found' };
  const summary = await getPlayerScapeSummary(Number(fdvId));
  const name = player.avatar_name || `#FDW${fdvId}`;
  return {
    title: `${name} — Level ${summary?.max_level || '?'} | Freedom Player Hub`,
    description: `${summary?.wins || 0}W / ${summary?.losses || 0}L · ${summary?.total_kills || 0} monsters slain · Win rate ${summary?.win_rate || 0}%`,
    openGraph: { title: `${name} — Freedom Player Hub`, description: `${summary?.wins || 0} wins · ${summary?.total_kills || 0} kills` },
  };
}

export default async function PlayerPage({ params }: Props) {
  const { fdvId } = await params;
  const id = Number(fdvId);
  if (isNaN(id)) notFound();
  const player = await getPlayerInfo(id);
  if (!player) notFound();

  const [summary, materials, equipment, history, planets, combat, nfts, nexus, winStreak, dominantRole, radar, combatRating, combatPercentile] = await Promise.all([
    getPlayerScapeSummary(id), getPlayerMaterials(id), getPlayerEquipment(id),
    getPlayerMatchHistory(id), getPlayerPlanetSummary(id), getPlayerCombatStats(id),
    getTotalNFTs(id), getPlayerNexusStats(id), getPlayerWinStreak(id),
    getPlayerDominantRole(id), getPlayerRadarStats(id),
    getPlayerCombatRating(id), getCombatRatingPercentile(id),
  ]);

  const name = player.avatar_name || `#FDW${fdvId}`;
  const s = summary as Record<string, number> | null;
  const winPct = s ? (s.total_matches > 0 ? ((s.wins / s.total_matches) * 100) : 0) : 0;

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-[#A0AEC0] mb-3 sm:mb-6">
        <a href="/" className="hover:text-white transition-colors">Home</a>
        <i className="fa-solid fa-chevron-right text-[8px]"></i>
        <a href="/leaderboards/scape" className="hover:text-white transition-colors">Players</a>
        <i className="fa-solid fa-chevron-right text-[8px]"></i>
        <span className="text-white font-medium truncate">{name}</span>
      </div>

      {/* Hero Header */}
      <HeroHeader
        name={name}
        fdvId={id}
        level={s?.max_level || 0}
        totalXp={s?.max_total_xp || 0}
        firstMatch={s?.first_match ? String(s.first_match) : null}
        combatRating={(combatRating as Record<string, number>)?.combat_rating ?? null}
        combatPercentile={combatPercentile as number}
        dominantRole={dominantRole as { primary: { name: string; icon: string }; secondary: { name: string; icon: string } } | null}
      />

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Column (2/3) */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Battle Performance Stats */}
          {s && s.total_matches > 0 && (
            <section>
              <h2 className="text-sm sm:text-xl font-bold text-white mb-2 sm:mb-4">
                <i className="fa-solid fa-swords mr-1.5 text-[#00FF88]"></i>
                Battle Performance
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                <StatCard
                  label="Win Rate"
                  value={`${s.win_rate}%`}
                  color="#00FF88"
                  barPercent={Number(s.win_rate)}
                />
                <StatCard
                  label="Matches"
                  value={s.total_matches}
                  color="#FFFFFF"
                  subtext={`${s.wins} Won · ${s.losses} Lost`}
                  barPercent={winPct}
                />
                <StatCard
                  label="Monsters Killed"
                  value={s.total_kills}
                  color="#FF6B6B"
                />
                <StatCard
                  label="Total XP"
                  value={Number(s.total_xp_earned).toLocaleString()}
                  color="#A78BFA"
                />
              </div>
            </section>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Radar Chart */}
            <div className="bg-[#0D1215] border border-[#1E2529] rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-card">
              <h3 className="text-sm sm:text-base font-bold text-white mb-2 sm:mb-4">Class Mastery</h3>
              <RadarChart stats={radar as { might_pct: number; vitality_pct: number; spirit_pct: number; precision_pct: number; lethality_pct: number; nexus_pct: number } | null} />
            </div>

            {/* Combat Stats */}
            {combat && (
              <div className="bg-[#0D1215] border border-[#1E2529] rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-card">
                <h3 className="text-sm sm:text-base font-bold text-white mb-2 sm:mb-4">Peak Combat Stats</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Max Damage', value: (combat as Record<string, number>).max_damage, color: '#FF6B6B', icon: '⚡' },
                    { label: 'Max Block', value: (combat as Record<string, number>).max_block, color: '#00FF88', icon: '🛡️' },
                    { label: 'Max Heal', value: (combat as Record<string, number>).max_heal, color: '#A78BFA', icon: '💚' },
                  ].map(({ label, value, color, icon }) => {
                    const max = Math.max((combat as Record<string, number>).max_damage, (combat as Record<string, number>).max_block, (combat as Record<string, number>).max_heal, 1);
                    return (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#A0AEC0] font-bold">{icon} {label}</span>
                          <span className="font-bold" style={{ color }}>{value.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}66` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Nexus Stats */}
          <NexusStats nexus={nexus as { nexus_total: number; nexus_wins: number; nexus_losses: number; nexus_win_rate: number; nexus_avg_kills: number } | null} />

          {/* Match History */}
          <MatchHistory matches={(history || []) as Array<{ timestamp?: string; match_result?: string; monsters_killed: number; xp_earned: number; level: number }>} />
        </div>

        {/* Side Column (1/3) */}
        <div className="space-y-4 sm:space-y-6">
          {/* Build Identity */}
          <BuildIdentity
            dominantRole={dominantRole as { primary: { name: string; icon: string; value: number }; secondary: { name: string; icon: string; value: number }; stats: { peak_damage: number; peak_block: number; peak_heal: number } } | null}
            winStreak={winStreak as { bestStreak: number; currentStreak: number } | null}
          />

          {/* Equipment */}
          <EquipmentLoadout equipment={equipment as Record<string, string | null> | null} />

          {/* Materials & NFTs */}
          <MaterialsNFTs materials={materials as Record<string, number> | null} nfts={nfts} />

          {/* Planet Stats */}
          <PlanetStats planets={planets as { total_planets: number; total_structures: number; total_fds_earned: number } | null} />

          {/* CTA */}
          <section className="text-center py-3 sm:py-6">
            <div className="bg-gradient-to-r from-[#00FF88]/10 to-transparent border border-[#00FF88]/20 rounded-xl p-4 sm:p-6">
              <p className="text-[#B8C5D0] text-sm mb-3">Want stats like these?</p>
              <a href="https://freedom.world" target="_blank" rel="noopener noreferrer"
                className="inline-block px-6 py-2.5 bg-[#00FF88] text-black rounded-xl text-sm sm:text-lg font-bold shadow-[0_4px_12px_rgba(0,255,136,0.4)] hover:bg-[#00FFB8] transition-all">
                Join Freedom World
              </a>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 sm:mt-12 pt-4 sm:pt-8 border-t border-[#1E2529] text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-[#00FF88] to-green-600 flex items-center justify-center text-black font-bold text-xs">F</div>
              <span className="font-bold text-white text-sm tracking-wide">FREEDOM WORLD</span>
            </div>
            <p className="text-xs text-[#A0AEC0]">© 2024 The Scape Game. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm text-[#B8C5D0]">
            <a href="https://freedom.world" className="hover:text-[#00FF88] transition-colors">Freedom World</a>
            <a href="#" className="hover:text-[#00FF88] transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </>
  );
}
