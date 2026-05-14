"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CardSkeleton({
  rows = 3,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl",
        className
      )}
    >
      <Skeleton className="mb-4 h-4 w-1/3 bg-white/10" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full bg-white/[0.06]" />
        ))}
      </div>
    </div>
  );
}

export function GridCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} rows={4} />
      ))}
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 bg-white/10" />
        <Skeleton className="h-4 w-72 bg-white/[0.06]" />
      </div>
      <GridCardSkeleton count={3} />
    </div>
  );
}
