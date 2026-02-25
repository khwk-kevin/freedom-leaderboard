'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export type TimeFilterValue = '7d' | '30d' | '90d' | 'all';

type Props = {
  value?: TimeFilterValue;
  onChange?: (value: TimeFilterValue) => void;
};

const options: { value: TimeFilterValue; label: string }[] = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: 'all', label: 'All Time' },
];

export default function TimeFilter({ value, onChange }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const current = value || (searchParams.get('time') as TimeFilterValue) || 'all';

  const handleChange = (v: TimeFilterValue) => {
    if (onChange) {
      onChange(v);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set('time', v);
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleChange(opt.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            current === opt.value
              ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20'
              : 'text-[#A0AEC0] hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
