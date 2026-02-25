'use client';
import { useRouter, useSearchParams } from 'next/navigation';

const filters = [
  { key: 'all-time', label: 'All Time' },
  { key: 'month', label: 'This Month' },
  { key: 'week', label: 'This Week' },
  { key: 'today', label: 'Today' },
];

export default function TimeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('time') || 'all-time';

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('time', f.key);
            router.push(`?${params.toString()}`);
          }}
          className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
          style={current === f.key
            ? { background: '#00FF88', color: '#000000', boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)' }
            : { background: 'transparent', border: '1.5px solid #2A2A2A', color: '#7A8A99' }
          }
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
