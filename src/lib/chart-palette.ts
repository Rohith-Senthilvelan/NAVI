/** Shared Recharts / dashboard chart palette */
export const CHART_PALETTE = [
  "#6E56FF",
  "#4FD1FF",
  "#F5C453",
  "#FF6FB5",
  "#9B7BFF",
  "#4F46FF",
  "#8B6FFF",
  "#2A1F6E",
  "#6B7099",
] as const;

export const BRAND_PRIMARY = "#6E56FF";
export const BRAND_AMBER = "#F5C453";
export const BRAND_PINK = "#FF6FB5";

/** Progress bar Tailwind classes: indigo <70%, amber 70–100%, pink >100% */
export function progressBarClass(pct: number): string {
  if (pct > 100) return "bg-[#FF6FB5]";
  if (pct >= 70) return "bg-gold";
  return "bg-accent";
}

/** Text color for progress percentage labels */
export function progressTextClass(pct: number): string {
  if (pct > 100) return "text-[#FF6FB5]";
  if (pct >= 70) return "text-gold";
  return "text-accent";
}

/** Map category index to palette color */
export function paletteColor(index: number): string {
  return CHART_PALETTE[index % CHART_PALETTE.length];
}
