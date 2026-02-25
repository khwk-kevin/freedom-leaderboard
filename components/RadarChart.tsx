'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface RadarDataPoint {
  stat: string;
  value: number;
  fullMark: number;
}

export default function PlayerRadarChart({ data }: { data: RadarDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="#1E2529" strokeDasharray="3 3" />
        <PolarAngleAxis dataKey="stat" tick={{ fill: '#7A8A99', fontSize: 12, fontWeight: 600 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="Stats"
          dataKey="value"
          stroke="#8B5CF6"
          fill="#8B5CF6"
          fillOpacity={0.2}
          strokeWidth={2}
          dot={{ r: 4, fill: '#A78BFA', stroke: '#8B5CF6', strokeWidth: 2 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
