'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ placeholder = 'Search players...' }: { placeholder?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ fdv_id: number; avatar_name: string | null }>>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) setResults(await res.json());
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <input
        type="text" value={query} placeholder={placeholder}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        className="w-full px-4 py-3 rounded-xl text-white transition-all focus:outline-none"
        style={{ background: '#1A1A1A', border: '1px solid #1E2529', color: '#FFFFFF' }}
      />
      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-xl overflow-hidden shadow-xl z-50"
          style={{ background: '#0D1215', border: '1px solid #1E2529' }}>
          {results.map((r) => (
            <button key={r.fdv_id} className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left hover:bg-white/[0.03]"
              onClick={() => { router.push(`/player/${r.fdv_id}`); setOpen(false); setQuery(''); }}>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(r.avatar_name || '')}&background=0D1215&color=00FF88&size=24`}
                alt="" className="w-6 h-6 rounded-full" width={24} height={24}
                style={{ border: '1px solid #1E2529' }} />
              <span className="text-white">{r.avatar_name || `#FDW${r.fdv_id}`}</span>
              <span className="text-sm ml-auto" style={{ color: '#7A8A99' }}>#{r.fdv_id}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
