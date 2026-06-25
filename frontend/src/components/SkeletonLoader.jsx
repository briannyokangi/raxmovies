const SkeletonLoader = ({ count = 6, variant = 'poster' }) => {
  if (variant === 'poster') {
    return (
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-lg bg-slate-800 animate-pulse aspect-[2/3]"
          >
            <div className="w-full h-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-slate-800 rounded-lg w-48 animate-pulse" />
        <div className="flex gap-3 overflow-x-hidden pb-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-40 h-60 rounded-lg bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
