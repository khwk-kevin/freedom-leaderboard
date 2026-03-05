'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { StructureEvent } from '@/lib/queries/planet-detail';

export default function PlanetStructureChart({ data }: { data: StructureEvent[] }) {
  const chartData = data.map(d => ({
    date: new Date(d.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    total: d.total_structure,
    food: d.total_food_structure,
    industrial: d.total_industrial_structure,
    name: d.structure_name,
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="gradFood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradIndustrial" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2529" />
          <XAxis dataKey="date" tick={{ fill: '#7A8A99', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#7A8A99', fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#0D1215', border: '1px solid #1E2529', borderRadius: 8, color: '#fff', fontSize: 12 }}
            formatter={(value: number | undefined, name: string | undefined) => [value ?? 0, name === 'food' ? '🌾 Food' : name === 'industrial' ? '⚙️ Industrial' : '📊 Total']}
            labelFormatter={(label) => `📅 ${label}`}
          />
          <Area type="monotone" dataKey="food" stroke="#10B981" fill="url(#gradFood)" strokeWidth={2} />
          <Area type="monotone" dataKey="industrial" stroke="#F59E0B" fill="url(#gradIndustrial)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
