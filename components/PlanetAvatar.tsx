'use client';

import { useState } from 'react';
import planetImages from '@/lib/planet-images.json';

const imageMap = planetImages as Record<string, string>;

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
  ['#1a6b4a', '#2dd4bf', '#065f46'],
  ['#7c3aed', '#c084fc', '#4c1d95'],
  ['#dc2626', '#f97316', '#7f1d1d'],
  ['#2563eb', '#38bdf8', '#1e3a5f'],
  ['#d97706', '#fbbf24', '#78350f'],
  ['#059669', '#34d399', '#064e3b'],
  ['#9333ea', '#f472b6', '#581c87'],
  ['#0891b2', '#22d3ee', '#164e63'],
  ['#b91c1c', '#fca5a5', '#450a0a'],
  ['#4f46e5', '#818cf8', '#312e81'],
  ['#15803d', '#86efac', '#14532d'],
  ['#a16207', '#fde68a', '#713f12'],
];

export default function PlanetAvatar({ planetId, planetName, size = 64 }: { planetId: string; planetName?: string; size?: number }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = imageMap[planetId];

  // If we have a real planet image from the CDN, use it
  if (imageUrl && !imgError) {
    return (
      <div
        className="rounded-full relative overflow-hidden shrink-0"
        style={{
          width: size,
          height: size,
          boxShadow: `0 0 ${size * 0.3}px rgba(100, 120, 255, 0.2)`,
        }}
        title={planetName || planetId}
      >
        <img
          src={imageUrl}
          alt={planetName || planetId}
          width={size}
          height={size}
          className="w-full h-full object-cover rounded-full"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        {/* Atmosphere glow overlay */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.12) 0%, transparent 50%)',
          }}
        />
      </div>
    );
  }

  // Fallback: gradient circle
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
      <div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: `conic-gradient(from ${rotation}deg, transparent 0%, ${palette[1]}40 25%, transparent 50%, ${palette[0]}30 75%, transparent 100%)`,
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.25) 0%, transparent 50%)`,
        }}
      />
    </div>
  );
}
