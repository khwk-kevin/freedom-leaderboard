import Link from 'next/link';
import { notFound } from 'next/navigation';
import PlanetAvatar from '@/components/PlanetAvatar';
import PlanetStructureChart from '@/components/PlanetStructureChart';
import PlanetActivityTimeline from '@/components/PlanetActivityTimeline';
import { getPlanetDetail, getPlanetStructureHistory, getPlanetWorkforceHistory } from '@/lib/queries/planet-detail';
import planetData from '@/lib/planet-data.json';

export const revalidate = 300;

const apiData = planetData as Record<string, {
  name: string; code: string; image: string; rarity: string; size: string;
  biome: string; biomeTier: number; mineralDensity: string;
  maxPopulation: number; currentPopulation: number; dailyFds: number; accumulatedFds: number;
}>;

const RARITY_COLORS: Record<string, string> = {
  Uncommon: '#9CA3AF',
  Rare: '#3B82F6',
  Epic: '#A855F7',
  Legendary: '#F59E0B',
};

const BIOME_ICONS: Record<string, string> = {
  Gaia: '🌍', Ocean: '🌊', Volcanic: '🌋', Frozen: '🧊', Desert: '🏜️',
  Irradion: '☢️', Cybertron: '🤖', Crystalis: '💎', Aetheria: '✨',
  Mycelium: '🍄', Bioluminescent: '💡', Stormworld: '⚡', Techorganic: '🔩', Shadow: '🌑',
};

function formatPopulation(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
  return String(n);
}

export default async function PlanetDetailPage({ params }: { params: Promise<{ planetId: string }> }) {
  const { planetId } = await params;

  const [detail, structureHistory, workforceHistory] = await Promise.all([
    getPlanetDetail(planetId),
    getPlanetStructureHistory(planetId),
    getPlanetWorkforceHistory(planetId),
  ]);

  if (!detail) notFound();

  const api = apiData[planetId];
  const rarityColor = api ? RARITY_COLORS[api.rarity] || '#9CA3AF' : '#9CA3AF';
  const biomeIcon = api ? BIOME_ICONS[api.biome] || '🪐' : '🪐';
  const populationPct = api ? ((api.currentPopulation / api.maxPopulation) * 100).toFixed(1) : null;

  // Calculate growth rate (structures per day)
  const firstEvent = structureHistory[0];
  const lastEvent = structureHistory[structureHistory.length - 1];
  const daysDiff = firstEvent && lastEvent
    ? (new Date(lastEvent.timestamp).getTime() - new Date(firstEvent.timestamp).getTime()) / (1000 * 60 * 60 * 24)
    : 1;
  const growthRate = daysDiff > 0 ? ((lastEvent?.total_structure || 0) / daysDiff).toFixed(1) : '0';

  // Unique structure types built
  const uniqueStructures = [...new Set(structureHistory.map(s => s.structure_name))];

  return (
    <div
      className="min-h-screen -m-4 md:-m-8 p-4 md:p-8"
      style={{ background: 'linear-gradient(180deg, #0A0E10 0%, #0D1B2A 20%, #1B1040 50%, #0D1B2A 80%, #0A0E10 100%)' }}
    >
      {/* Nebula overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(88, 28, 135, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(59, 7, 100, 0.1) 0%, transparent 50%)', zIndex: 0 }} />

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        {/* Back link */}
        <Link href="/leaderboards/planets" className="inline-flex items-center gap-2 text-sm hover:text-white transition-colors" style={{ color: '#7A8A99' }}>
          ← Back to Planet Leaderboard
        </Link>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 rounded-2xl p-6 md:p-8" style={{ background: 'linear-gradient(135deg, rgba(15, 20, 40, 0.85), rgba(25, 15, 50, 0.65))', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
          <PlanetAvatar planetId={planetId} planetName={detail.planet_name} size={180} />
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black text-white" style={{ background: '#C4524F' }}>
                Rank #{detail.rank}
              </span>
              {api && (
                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: `${rarityColor}20`, color: rarityColor, border: `1px solid ${rarityColor}40` }}>
                  {api.rarity}
                </span>
              )}
              {api && (
                <span className="px-2 py-1 rounded-full text-[10px] font-bold" style={{ background: 'rgba(255,255,255,0.06)', color: '#B8C5D0' }}>
                  {biomeIcon} {api.biome}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">{detail.planet_name}</h1>
            <p className="text-sm mt-1" style={{ color: '#7A8A99' }}>
              Owned by <span className="text-white font-semibold">{detail.owner_name || `#FDW${detail.fdv_user_id}`}</span>
              {api && <span> · {api.size} · {api.mineralDensity} minerals</span>}
            </p>
            {api && (
              <p className="text-xs mt-1" style={{ color: '#7A8A99' }}>
                Code: {api.code}
              </p>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Structures', value: String(detail.total_structure), icon: '🏗️', color: '#FF6B6B' },
            { label: 'Food Structures', value: String(detail.total_food_structure), icon: '🌾', color: '#10B981' },
            { label: 'Industrial', value: String(detail.total_industrial_structure), icon: '⚙️', color: '#F59E0B' },
            { label: 'Growth Rate', value: `${growthRate}/day`, icon: '📈', color: '#3B82F6' },
            ...(api ? [
              { label: 'Population', value: formatPopulation(api.currentPopulation), icon: '👥', color: '#A855F7' },
              { label: 'Capacity', value: `${populationPct}%`, icon: '📊', color: populationPct && parseFloat(populationPct) > 50 ? '#10B981' : '#F59E0B' },
              { label: 'Daily FDS', value: api.dailyFds.toFixed(4), icon: '💰', color: '#00FFB3' },
              { label: 'Accumulated FDS', value: api.accumulatedFds.toFixed(4), icon: '🏦', color: '#00FF88' },
            ] : []),
            { label: 'Owner Total FDS', value: Number(detail.total_owner_fds).toFixed(1), icon: '💎', color: '#00FFB3' },
            { label: 'FDS Claims', value: String(detail.owner_fds_claims), icon: '🎁', color: '#EC4899' },
            { label: 'Owner Planets', value: String(detail.total_owner_planets), icon: '🪐', color: '#8B5CF6' },
            { label: 'Build Events', value: String(structureHistory.length), icon: '📋', color: '#6366F1' },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(15, 20, 40, 0.7)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{stat.icon}</span>
                <span className="text-[10px] uppercase tracking-wider" style={{ color: '#7A8A99' }}>{stat.label}</span>
              </div>
              <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Population Bar (if API data) */}
        {api && (
          <div className="rounded-xl p-5" style={{ background: 'rgba(15, 20, 40, 0.7)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-white">👥 Population Capacity</span>
              <span className="text-xs" style={{ color: '#7A8A99' }}>
                {formatPopulation(api.currentPopulation)} / {formatPopulation(api.maxPopulation)}
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${populationPct}%`,
                  background: `linear-gradient(90deg, #A855F7, #EC4899)`,
                  boxShadow: '0 0 8px rgba(168, 85, 247, 0.4)',
                }}
              />
            </div>
          </div>
        )}

        {/* Structure Growth Chart */}
        {structureHistory.length > 1 && (
          <div className="rounded-xl p-5" style={{ background: 'rgba(15, 20, 40, 0.7)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <h2 className="text-white font-bold text-base mb-4">📈 Structure Growth Over Time</h2>
            <PlanetStructureChart data={structureHistory} />
          </div>
        )}

        {/* Workforce & Structures Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Unique Structures */}
          <div className="rounded-xl p-5" style={{ background: 'rgba(15, 20, 40, 0.7)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <h2 className="text-white font-bold text-base mb-3">🏗️ Structures Built</h2>
            <div className="space-y-2">
              {uniqueStructures.map((name, i) => {
                const events = structureHistory.filter(e => e.structure_name === name);
                const type = events[0]?.structure_type;
                return (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex items-center gap-2">
                      <span>{type === 'food' ? '🌾' : '⚙️'}</span>
                      <span className="text-white text-sm">{name}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: type === 'food' ? '#10B981' : '#F59E0B' }}>
                      {events.length} built
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Workforce */}
          <div className="rounded-xl p-5" style={{ background: 'rgba(15, 20, 40, 0.7)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <h2 className="text-white font-bold text-base mb-3">👷 Workforce Allocation</h2>
            {workforceHistory.length > 0 ? (
              <div className="space-y-4">
                {(() => {
                  const latest = workforceHistory[workforceHistory.length - 1];
                  const total = latest.food_workforce + latest.industrial_workforce + latest.available_workforce;
                  return (
                    <>
                      {[
                        { label: 'Food Workers', value: latest.food_workforce, color: '#10B981', icon: '🌾' },
                        { label: 'Industrial Workers', value: latest.industrial_workforce, color: '#F59E0B', icon: '⚙️' },
                        { label: 'Available', value: latest.available_workforce, color: '#6366F1', icon: '💤' },
                      ].map((w, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span style={{ color: '#B8C5D0' }}>{w.icon} {w.label}</span>
                            <span className="font-bold" style={{ color: w.color }}>{w.value}</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full" style={{ width: `${total > 0 ? (w.value / total) * 100 : 0}%`, background: w.color }} />
                          </div>
                        </div>
                      ))}
                    </>
                  );
                })()}
              </div>
            ) : (
              <p className="text-sm" style={{ color: '#7A8A99' }}>No workforce data available</p>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="rounded-xl p-5" style={{ background: 'rgba(15, 20, 40, 0.7)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <h2 className="text-white font-bold text-base mb-3">📋 Recent Activity</h2>
          <PlanetActivityTimeline events={structureHistory} />
        </div>
      </div>
    </div>
  );
}
