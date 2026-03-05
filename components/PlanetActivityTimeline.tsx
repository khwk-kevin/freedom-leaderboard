'use client';

import type { StructureEvent } from '@/lib/queries/planet-detail';

function timeAgo(date: string): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function PlanetActivityTimeline({ events }: { events: StructureEvent[] }) {
  // Show last 20 events, newest first
  const recent = [...events].reverse().slice(0, 20);

  return (
    <div className="space-y-1">
      {recent.map((e, i) => (
        <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
            style={{
              background: e.structure_type === 'food' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: e.structure_type === 'food' ? '#10B981' : '#F59E0B',
            }}
          >
            {e.structure_type === 'food' ? '🌾' : '⚙️'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">Built {e.structure_name}</p>
            <p className="text-[11px]" style={{ color: '#7A8A99' }}>
              Total: {e.total_structure} structures ({e.total_food_structure}F / {e.total_industrial_structure}I)
            </p>
          </div>
          <span className="text-[10px] shrink-0" style={{ color: '#7A8A99' }}>{timeAgo(e.timestamp)}</span>
        </div>
      ))}
    </div>
  );
}
