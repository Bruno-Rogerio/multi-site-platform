"use client";

type SkeletonProps = {
  className?: string;
};

function SkeletonBase({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/[0.06] ${className}`}
    />
  );
}

export function SkeletonText({ className = "" }: SkeletonProps) {
  return <SkeletonBase className={`h-4 w-3/4 ${className}`} />;
}

export function SkeletonCard({ className = "" }: SkeletonProps) {
  return (
    <div className={`rounded-xl border border-white/10 bg-[#12182B] p-5 ${className}`}>
      <SkeletonBase className="mb-3 h-3 w-1/3" />
      <SkeletonBase className="mb-2 h-8 w-1/2" />
      <SkeletonBase className="h-3 w-2/3" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#12182B] overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 border-b border-white/10 px-5 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBase key={`h-${i}`} className="h-3 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`r-${rowIndex}`}
          className="flex gap-4 border-b border-white/5 px-5 py-4"
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <SkeletonBase key={`c-${colIndex}`} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonMetricGrid({ count = 5 }: { count?: number }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
