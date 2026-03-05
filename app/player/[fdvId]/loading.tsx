export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-1.5 text-xs mb-3">
        <div className="h-3 w-10 bg-white/5 rounded" />
        <div className="h-3 w-14 bg-white/5 rounded" />
        <div className="h-3 w-20 bg-white/5 rounded" />
      </div>
      {/* Hero skeleton */}
      <div className="bg-white/5 rounded-xl p-4 mb-4">
        <div className="flex gap-4 items-center">
          <div className="w-[72px] h-[72px] bg-white/10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-40 bg-white/10 rounded" />
            <div className="h-4 w-28 bg-white/10 rounded" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-white/10 rounded" />
              <div className="h-6 w-20 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </div>
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-xl" />)}
      </div>
      {/* Charts skeleton */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="h-48 bg-white/5 rounded-xl" />
        <div className="h-48 bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}
