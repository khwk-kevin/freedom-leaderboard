export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Hero skeleton */}
      <div className="text-center py-4">
        <div className="h-8 w-64 bg-white/5 rounded-lg mx-auto mb-2" />
        <div className="h-4 w-48 bg-white/5 rounded mx-auto mb-3" />
        <div className="h-10 w-72 bg-white/5 rounded-lg mx-auto" />
      </div>
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-white/5 rounded-xl" />
        ))}
      </div>
      {/* Content skeleton */}
      <div className="grid md:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 bg-white/5 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
