import { cn } from "@/lib/utils";

export function ChartSkeleton({
  height = 240,
  className,
}: {
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03]",
        className
      )}
      style={{ height }}
      aria-hidden
    >
      <div className="skeleton-shimmer h-full w-full rounded-xl" />
    </div>
  );
}
