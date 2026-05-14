"use client";

import { Button } from "@/components/ui/button";
import { ChartSkeleton } from "@/components/charts/chart-skeleton";
import { Switch } from "@/components/ui/switch";
import {
  generateSignatureDigs,
  getCategoryBreakdown,
  getCategoryTrend,
  getHeatmapMax,
  getSavingsStreakWeeks,
  getSpendingHeatmap,
  getTopCategories,
  type DigAction,
  type SignatureDig,
} from "@/lib/insights";
import { useAdvisorStore, useUIStore } from "@/lib/store";
import { cn, formatAED } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Calendar,
  Flame,
  Mail,
  Receipt,
  Repeat,
  Sparkles,
  Store,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const InsightsCategoryPie = dynamic(
  () =>
    import("@/components/charts/insights-charts").then(
      (m) => m.InsightsCategoryPie
    ),
  { ssr: false, loading: () => <ChartSkeleton height={240} /> }
);

const InsightsTrendLine = dynamic(
  () =>
    import("@/components/charts/insights-charts").then((m) => m.InsightsTrendLine),
  { ssr: false, loading: () => <ChartSkeleton height={260} /> }
);

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ICON_MAP: Record<SignatureDig["icon"], LucideIcon> = {
  utensils: Utensils,
  store: Store,
  receipt: Receipt,
  repeat: Repeat,
  calendar: Calendar,
  flame: Flame,
};

const SEVERITY_RIBBON: Record<
  SignatureDig["severity"],
  { bg: string; text: string; border: string }
> = {
  info: {
    bg: "bg-blue-500/15",
    text: "text-blue-300",
    border: "border-blue-500/30",
  },
  warning: {
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    border: "border-amber-500/30",
  },
  critical: {
    bg: "bg-red-500/15",
    text: "text-red-300",
    border: "border-red-500/30",
  },
  positive: {
    bg: "bg-accent/15",
    text: "text-accent",
    border: "border-accent/30",
  },
};

function handleDigAction(
  action: DigAction,
  router: ReturnType<typeof useRouter>,
  openAdvisor: (msg: string) => void
) {
  switch (action.type) {
    case "cap":
      router.push("/budget");
      break;
    case "subscriptions":
      router.push("/subscriptions");
      break;
    case "savings":
      router.push("/savings");
      break;
    case "advisor":
      openAdvisor(action.payload ?? action.label);
      break;
  }
}

export default function InsightsPage() {
  const router = useRouter();
  const { setAdvisorDrawerOpen } = useUIStore();
  const { addMessage } = useAdvisorStore();
  const [monthlyDigest, setMonthlyDigest] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    amount: number;
  } | null>(null);

  const breakdown = useMemo(() => getCategoryBreakdown(), []);
  const trend = useMemo(() => getCategoryTrend(), []);
  const topCategories = useMemo(() => getTopCategories(4), []);
  const digs = useMemo(() => generateSignatureDigs(), []);
  const heatmap = useMemo(() => getSpendingHeatmap(), []);
  const heatmapMax = useMemo(() => getHeatmapMax(heatmap), [heatmap]);
  const streakWeeks = getSavingsStreakWeeks();

  const totalSpent = breakdown.reduce((s, c) => s + c.value, 0);

  const openAdvisor = (msg: string) => {
    addMessage("user", msg);
    setAdvisorDrawerOpen(true);
  };

  return (
    <motion.div
      className="space-y-8 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent/80">
          Pattern intelligence
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-text-high">
          Signature Digs
        </h1>
        <p className="mt-1 text-sm text-text-mid">
          May 2026 · Navi surfaces what matters in your spend
        </p>
      </div>

      {/* Top charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-high">
              Monthly Spending
            </h2>
            <span className="font-mono text-xs text-text-mid">
              {formatAED(totalSpent)}
            </span>
          </div>
          <motion.div className="relative h-[240px] min-h-[240px]">
            <InsightsCategoryPie data={breakdown} totalSpent={totalSpent} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase tracking-wider text-text-mid">
                Total
              </span>
              <span className="font-mono text-base font-semibold text-text-high">
                {formatAED(totalSpent)}
              </span>
            </div>
          </motion.div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {breakdown.slice(0, 6).map((c) => (
              <span
                key={c.category}
                className="flex items-center gap-1.5 text-[11px] text-text-mid"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                {c.category}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-high">
              Category Trends
            </h2>
            <span className="text-[11px] text-text-mid">Last 3 months</span>
          </div>
          <div className="h-[260px] min-h-[260px]">
            <InsightsTrendLine data={trend} categories={topCategories} />
          </div>
        </motion.div>
      </div>

      {/* Feed + right rail */}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px]">
        {/* Signature Digs feed */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-text-high">
            Signature Digs Feed
          </h2>
          <div className="space-y-4" data-tour="insights-feed">
            {digs.map((dig, i) => {
              const Icon = ICON_MAP[dig.icon];
              const ribbon = SEVERITY_RIBBON[dig.severity];
              return (
                <motion.article
                  key={dig.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.45 }}
                  className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl"
                >
                  <div
                    className={cn(
                      "flex items-center gap-2 border-b px-5 py-2 text-[10px] font-semibold uppercase tracking-wider",
                      ribbon.bg,
                      ribbon.text,
                      ribbon.border
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {dig.severity}
                  </div>
                  <div className="p-5">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                        <Icon className="h-4 w-4 text-accent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold leading-snug text-text-high">
                          {dig.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-text-mid">
                          {dig.body}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-white/10 text-xs hover:border-accent/30 hover:bg-accent/5"
                            onClick={() =>
                              handleDigAction(dig.primaryAction, router, openAdvisor)
                            }
                          >
                            {dig.primaryAction.label}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs text-accent hover:bg-accent/10 hover:text-accent"
                            onClick={() =>
                              handleDigAction(
                                dig.secondaryAction,
                                router,
                                openAdvisor
                              )
                            }
                          >
                            <Sparkles className="mr-1.5 h-3 w-3" />
                            {dig.secondaryAction.label}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {/* Heatmap */}
          <motion.div
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-sm font-semibold text-text-high">
              Spending Heatmap
            </h2>
            <p className="mt-1 text-[11px] text-text-mid">May 2026 · AED / day</p>

            <div className="mt-4 grid grid-cols-7 gap-1">
              {DAY_LABELS.map((d) => (
                <div
                  key={d}
                  className="text-center text-[9px] font-medium text-text-mid"
                >
                  {d}
                </div>
              ))}
              {heatmap.map((cell, idx) => {
                const intensity =
                  cell.amount > 0 ? cell.amount / heatmapMax : 0;
                const isHovered = hoveredCell?.date === cell.date;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "aspect-square rounded-sm transition-all",
                      cell.date === null && "bg-transparent",
                      cell.date !== null && "cursor-default",
                      isHovered && "ring-1 ring-accent"
                    )}
                    style={
                      cell.date
                        ? {
                            backgroundColor: `rgba(0, 224, 184, ${0.08 + intensity * 0.72})`,
                          }
                        : undefined
                    }
                    onMouseEnter={() =>
                      cell.date &&
                      setHoveredCell({ date: cell.date, amount: cell.amount })
                    }
                    onMouseLeave={() => setHoveredCell(null)}
                    title={
                      cell.date
                        ? `${cell.date}: ${formatAED(cell.amount)}`
                        : undefined
                    }
                  />
                );
              })}
            </div>

            {hoveredCell && (
              <p className="mt-3 text-center font-mono text-xs text-accent">
                {hoveredCell.date}: {formatAED(hoveredCell.amount)}
              </p>
            )}
            {!hoveredCell && (
              <p className="mt-3 text-center text-[11px] text-text-mid">
                Hover a day for spend
              </p>
            )}

            <div className="mt-3 flex items-center justify-between text-[10px] text-text-mid">
              <span>Less</span>
              <motion.div className="flex gap-0.5">
                {[0.1, 0.3, 0.5, 0.7, 0.9].map((o) => (
                  <div
                    key={o}
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: `rgba(0, 224, 184, ${o})` }}
                  />
                ))}
              </motion.div>
              <span>More</span>
            </div>
          </motion.div>

          {/* Streaks */}
          <motion.div
            className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-accent/10 to-transparent p-5 backdrop-blur-xl"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10">
                <Flame className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-high">Streaks</p>
                <p className="text-xs text-text-mid">
                  You&apos;ve saved for{" "}
                  <span className="font-medium text-amber-300">
                    {streakWeeks} weeks
                  </span>{" "}
                  straight!
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-1">
              {Array.from({ length: streakWeeks }).map((_, i) => (
                <div
                  key={i}
                  className="h-2 flex-1 rounded-full bg-amber-400/80"
                />
              ))}
              {Array.from({ length: 7 - streakWeeks }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="h-2 flex-1 rounded-full bg-white/[0.06]"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl sm:flex-row sm:items-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
            <Mail className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-high">
              Want Navi to write you a monthly money letter?
            </p>
            <p className="mt-1 text-sm text-text-mid">
              Enable monthly digest for a personalized recap on the 1st of each
              month.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-mid">Monthly digest</span>
          <Switch
            checked={monthlyDigest}
            onCheckedChange={setMonthlyDigest}
            aria-label="Enable monthly digest"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
