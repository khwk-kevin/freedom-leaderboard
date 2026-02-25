'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Plotly: {
      newPlot: (el: HTMLElement, data: unknown[], layout: unknown, config: unknown) => void;
    };
  }
}

type Props = {
  stats: {
    might_pct: number;
    vitality_pct: number;
    spirit_pct: number;
    precision_pct: number;
    lethality_pct: number;
    nexus_pct: number;
  } | null;
};

export default function RadarChart({ stats }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stats || !ref.current || !window.Plotly) return;

    const data = [{
      type: 'scatterpolar' as const,
      r: [stats.might_pct, stats.vitality_pct, stats.spirit_pct, stats.precision_pct, stats.lethality_pct, stats.nexus_pct, stats.might_pct],
      theta: ['Might', 'Vitality', 'Spirit', 'Precision', 'Lethality', 'Nexus', 'Might'],
      fill: 'toself',
      fillcolor: 'rgba(139, 92, 246, 0.25)',
      line: { color: '#8B5CF6', width: 2 },
      marker: { color: '#00FF88', size: 4 },
    }];

    const layout = {
      polar: {
        radialaxis: {
          visible: true,
          range: [0, 100],
          tickfont: { size: 8, color: '#7A8A99' },
          linecolor: '#1E2529',
          gridcolor: '#1E2529',
        },
        angularaxis: {
          tickfont: { size: 10, color: '#B8C5D0', weight: 700 },
          linecolor: '#1E2529',
          gridcolor: '#1E2529',
        },
        bgcolor: 'rgba(0,0,0,0)',
      },
      margin: { t: 20, r: 40, b: 20, l: 40 },
      paper_bgcolor: 'transparent',
      showlegend: false,
      height: 250,
    };

    window.Plotly.newPlot(ref.current, data, layout, { displayModeBar: false, responsive: true });
  }, [stats]);

  if (!stats) return <div className="text-[#A0AEC0] text-sm text-center py-8">Not enough data for radar chart (min 10 matches)</div>;

  return <div ref={ref} className="w-full h-64 flex items-center justify-center"></div>;
}
