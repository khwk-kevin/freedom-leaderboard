'use client';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

const PLANET_PALETTES = [
  ['#1a6b4a', '#2dd4bf', '#065f46'],   // Green earth-like
  ['#7c3aed', '#c084fc', '#4c1d95'],   // Purple nebula
  ['#dc2626', '#f97316', '#7f1d1d'],   // Red volcanic
  ['#2563eb', '#38bdf8', '#1e3a5f'],   // Blue ocean
  ['#d97706', '#fbbf24', '#78350f'],   // Gold desert
  ['#059669', '#34d399', '#064e3b'],   // Emerald
  ['#9333ea', '#f472b6', '#581c87'],   // Pink/purple
  ['#0891b2', '#22d3ee', '#164e63'],   // Cyan ice
  ['#b91c1c', '#fca5a5', '#450a0a'],   // Crimson
  ['#4f46e5', '#818cf8', '#312e81'],   // Indigo
  ['#15803d', '#86efac', '#14532d'],   // Forest
  ['#a16207', '#fde68a', '#713f12'],   // Amber
];

export default function PlanetAvatar({ planetId, planetName, size = 64 }: { planetId: string; planetName?: string; size?: number }) {
  const hash = hashString(planetId);
  const palette = PLANET_PALETTES[hash % PLANET_PALETTES.length];
  const rotation = (hash % 360);
  
  return (
    <div
      className="rounded-full relative overflow-hidden shrink-0"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 35%, ${palette[1]}, ${palette[0]} 50%, ${palette[2]} 100%)`,
        boxShadow: `0 0 ${size * 0.25}px ${palette[0]}60, inset 0 -${size * 0.1}px ${size * 0.2}px ${palette[2]}80`,
      }}
      title={planetName || planetId}
    >
      {/* Surface detail overlay */}
      <div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: `conic-gradient(from ${rotation}deg, transparent 0%, ${palette[1]}40 25%, transparent 50%, ${palette[0]}30 75%, transparent 100%)`,
        }}
      />
      {/* Atmosphere glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.25) 0%, transparent 50%)`,
        }}
      />
    </div>
  );
}
