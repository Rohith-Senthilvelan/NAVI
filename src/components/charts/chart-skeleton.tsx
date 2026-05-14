export function ChartSkeleton({ height = 240 }: { height?: number }) {
  return (
    <div
      className="w-full animate-pulse rounded-xl bg-white/[0.04]"
      style={{ height }}
      aria-hidden
    />
  );
}
