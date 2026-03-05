export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 w-28 bg-white/5 rounded" />
        <div className="flex gap-1.5">{[...Array(4)].map((_, i) => <div key={i} className="h-6 w-14 bg-white/5 rounded-lg" />)}</div>
      </div>
      <div className="flex justify-center"><div className="h-10 w-56 bg-white/5 rounded-full" /></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-24 bg-white/5 rounded-2xl" />
      ))}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-14 border-b border-white/5 flex items-center px-3 gap-3">
          <div className="w-8 h-5 bg-white/5 rounded" />
          <div className="w-9 h-9 bg-white/5 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-28 bg-white/5 rounded" />
            <div className="h-1.5 bg-white/5 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
