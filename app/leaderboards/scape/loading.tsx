export default function Loading() {
  return (
    <div className="space-y-0 animate-pulse">
      <div className="pt-2 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="h-5 w-32 bg-white/5 rounded" />
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => <div key={i} className="h-6 w-10 bg-white/5 rounded-md" />)}
          </div>
        </div>
        <div className="flex gap-1.5">
          {[...Array(6)].map((_, i) => <div key={i} className="h-7 w-20 bg-white/5 rounded-full" />)}
        </div>
      </div>
      {/* Podium skeleton */}
      <div className="grid grid-cols-3 gap-1.5 py-3 px-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-36 bg-white/5 rounded-xl" />
        ))}
      </div>
      {/* Rows skeleton */}
      {[...Array(10)].map((_, i) => (
        <div key={i} className="h-14 border-b border-white/5 flex items-center px-3 gap-3">
          <div className="w-7 h-5 bg-white/5 rounded" />
          <div className="w-9 h-9 bg-white/5 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-32 bg-white/5 rounded" />
            <div className="h-1.5 bg-white/5 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
