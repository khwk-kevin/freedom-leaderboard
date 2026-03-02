'use client';

import { useState, useEffect } from 'react';
import PlanetHeroCard from './PlanetHeroCard';
import PlanetRankRow from './PlanetRankRow';
import type { PlanetStructureEntry, FDSEarnerEntry } from '@/lib/queries/planet-leaderboards';

type Mode = 'population' | 'fds';
type TimeFilter = 'all-time' | 'month' | 'week' | 'today';

type Props = {
  initialMode: Mode;
  initialTime: TimeFilter;
  initialPopData: PlanetStructureEntry[];
  initialFdsData: FDSEarnerEntry[];
  stats: { total_users: number; total_planets: number; total_structures: number; total_fds_earned: number };
};

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

function formatFDS(n: number): string {
  return n.toFixed(1);
}

export default function PlanetLeaderboard({ initialMode, initialTime, initialPopData, initialFdsData, stats }: Props) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [time, setTime] = useState<TimeFilter>(initialTime);
  const [popData, setPopData] = useState<PlanetStructureEntry[]>(initialPopData);
  const [fdsData, setFdsData] = useState<FDSEarnerEntry[]>(initialFdsData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Skip fetch if we already have initial data for all-time
    if (time === 'all-time' && mode === initialMode) return;
    
    setLoading(true);
    fetch(`/api/leaderboards/planets?mode=${mode}&time=${time}`)
      .then(r => r.json())
      .then(d => {
        if (mode === 'fds') setFdsData(d.data);
        else setPopData(d.data);
      })
      .finally(() => setLoading(false));
  }, [mode, time, initialMode]);

  const timeOptions: { value: TimeFilter; label: string }[] = [
    { value: 'all-time', label: 'All Time' },
    { value: 'month', label: '30 Days' },
    { value: 'week', label: '7 Days' },
    { value: 'today', label: 'Today' },
  ];

  // Build entries for rendering
  const entries = mode === 'population'
    ? popData.map(e => ({
        id: e.planet_id,
        name: e.planet_name || 'Unknown Planet',
        owner: `#FDW${e.fdv_user_id}`,
        stat: e.total_structure,
        metrics: [
          { label: 'Structures', value: formatNumber(e.total_structure), color: '#FF6B6B' },
          { label: 'Food / Industrial', value: `${e.total_food_structure} / ${e.total_industrial_structure}`, color: '#FF8888' },
        ],
      }))
    : fdsData.map(e => ({
        id: String(e.fdv_user_id),
        name: `#FDW${e.fdv_user_id}`,
        owner: `${e.planet_count} planet${e.planet_count !== 1 ? 's' : ''}`,
        stat: Number(e.total_fds),
        metrics: [
          { label: 'FDS Earned', value: formatFDS(Number(e.total_fds)), color: '#00FFB3' },
          { label: 'Claims', value: String(e.claims), color: '#00FF88' },
        ],
      }));

  const top5 = entries.slice(0, 5);
  const rest = entries.slice(5);
  const maxStat = rest.length > 0 ? Math.max(...rest.map(e => e.stat)) : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>🪐</span> Planet Leaderboard
          </h1>
          <p className="text-sm mt-1" style={{ color: '#7A8A99' }}>
            {stats.total_planets} planets · {stats.total_users} explorers · {formatNumber(stats.total_structures)} structures built
          </p>
        </div>

        {/* Time filter */}
        <div className="flex gap-2">
          {timeOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setTime(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                time === opt.value
                  ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20'
                  : 'text-[#A0AEC0] hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center">
        <div
          className="inline-flex rounded-full p-1 gap-1"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <button
            onClick={() => setMode('population')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
            style={mode === 'population'
              ? { background: '#FFFFFF', color: '#000000' }
              : { background: 'transparent', color: '#7D8598' }
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            Population
          </button>
          <button
            onClick={() => setMode('fds')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
            style={mode === 'fds'
              ? { background: '#FFFFFF', color: '#000000' }
              : { background: 'transparent', color: '#7D8598' }
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.94s4.18 1.36 4.18 3.85c0 1.89-1.44 2.98-3.12 3.19z"/></svg>
            FDS
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block w-6 h-6 border-2 border-white/20 border-t-[#00FF88] rounded-full animate-spin" />
        </div>
      )}

      {/* Top 5 Hero Cards */}
      {top5.length > 0 && (
        <div className="space-y-4">
          {top5.map((entry, i) => (
            <PlanetHeroCard
              key={entry.id}
              rank={i + 1}
              planetId={entry.id}
              planetName={entry.name}
              ownerLabel={entry.owner}
              metrics={entry.metrics}
              reversed={i % 2 === 1}
            />
          ))}
        </div>
      )}

      {/* Divider */}
      {rest.length > 0 && top5.length > 0 && (
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </div>
      )}

      {/* Your Ranks placeholder — future: detect logged-in user */}

      {/* Other Rankings */}
      {rest.length > 0 && (
        <div>
          <h2 className="text-white font-bold text-base mb-3">Other Rankings</h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(15, 20, 40, 0.6), rgba(10, 14, 16, 0.9))',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            {rest.map((entry, i) => (
              <PlanetRankRow
                key={entry.id}
                rank={i + 6}
                planetId={entry.id}
                planetName={entry.name}
                ownerLabel={entry.owner}
                metrics={entry.metrics}
                maxStat={maxStat}
                stat={entry.stat}
              />
            ))}
          </div>
        </div>
      )}

      {entries.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-lg" style={{ color: '#7A8A99' }}>No planet data available for this period.</p>
        </div>
      )}
    </div>
  );
}
