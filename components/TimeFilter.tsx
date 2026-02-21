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
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            current === f.key
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
