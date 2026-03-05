export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse max-w-5xl mx-auto">
      <div className="h-4 w-16 bg-white/5 rounded" />
      <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'rgba(15, 20, 40, 0.5)' }}>
        <div className="w-20 h-20 bg-white/5 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex gap-1.5">{[...Array(3)].map((_, i) => <div key={i} className="h-5 w-14 bg-white/5 rounded-full" />)}</div>
          <div className="h-6 w-40 bg-white/5 rounded" />
          <div className="h-3 w-32 bg-white/5 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {[...Array(8)].map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-xl" />)}
      </div>
      <div className="h-48 bg-white/5 rounded-xl" />
    </div>
  );
}
