'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export type TimeFilterValue = '7d' | '30d' | '90d' | 'all';

type Props = {
  value?: TimeFilterValue;
  onChange?: (value: TimeFilterValue) => void;
};

const options: { value: TimeFilterValue; label: string }[] = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: 'all', label: 'All' },
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
    <div className="flex gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleChange(opt.value)}
          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
            current === opt.value
              ? 'bg-[#00FF88] text-black'
              : 'text-[#7A8A99] hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
