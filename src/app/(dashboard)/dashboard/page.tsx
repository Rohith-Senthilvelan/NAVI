"use client";

import { KpiCard } from "@/components/dashboard/KpiCard";
import { GamificationWidget } from "@/components/dashboard/GamificationWidget";
import { ChartSkeleton } from "@/components/charts/chart-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  mockBudgets,
  mockGoals,
  mockInsights,
  mockSubscriptions,
  mockTransactions,
  type MockTransaction,
  type TransactionCategory,
} from "@/lib/mock-data";
import { useAdvisorStore, useUIStore } from "@/lib/store";
import { cn, formatAED } from "@/lib/utils";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Sparkles, TrendingUp, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const SpendPieChart = dynamic(
  () =>
    import("@/components/charts/spend-pie-chart").then((m) => m.SpendPieChart),
  { ssr: false, loading: () => <ChartSkeleton height={220} /> }
);

const DISPLAY = {
  balance: 12480.55,
  monthSpent: 4210,
  monthSavings: 620,
  roundUps: 87.4,
  weekChange: 2.3,
  monthlyBudget: 7200,
};

const BALANCE_SPARKLINE = [11820, 11940, 12010, 12150, 12200, 12380, 12480.55];
const SPENT_SPARKLINE = [980, 1640, 2180, 2890, 3320, 3780, 4210];
const SAVINGS_SPARKLINE = [120, 240, 310, 420, 510, 580, 620];
const ROUNDUP_SPARKLINE = [12, 28, 41, 55, 63, 78, 87.4];

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#00E0B8",
  Groceries: "#5BFFCC",
  Transport: "#6366F1",
  Shopping: "#D4AF37",
  Bills: "#F59E0B",
  Subscriptions: "#8B5CF6",
  Entertainment: "#EC4899",
  Health: "#10B981",
  Travel: "#3B82F6",
};

const SEVERITY_DOT: Record<string, string> = {
  info: "bg-blue-400",
  warning: "bg-amber-400",
  positive: "bg-accent",
  critical: "bg-red-500",
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: 0.15 + i * 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

function GlassCard({
  children,
  className,
  title,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl",
        className
      )}
    >
      {(title || action) && (
        <motion.div
          className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold tracking-tight text-text-high">
            {title}
          </h2>
          {action}
        </motion.div>
      )}
      {children}
    </motion.div>
  );
}

function ProgressRing({
  progress,
  color,
  label,
  amount,
  size = 88,
}: {
  progress: number;
  color: string;
  label: string;
  amount: string;
  size?: number;
}) {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-sm font-semibold text-text-high">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs font-medium text-text-high">{label}</p>
        <p className="text-[11px] text-text-mid">{amount}</p>
      </motion.div>
    </div>
  );
}

function budgetBarColor(pct: number) {
  if (pct > 100) return "bg-red-500";
  if (pct >= 70) return "bg-amber-400";
  return "bg-accent";
}

function categoryBadgeClass(category: string) {
  const colors: Record<string, string> = {
    Food: "border-accent/30 bg-accent/10 text-accent",
    Groceries: "border-accent-secondary/30 bg-accent-secondary/10 text-accent-secondary",
    Transport: "border-indigo-400/30 bg-indigo-400/10 text-indigo-300",
    Shopping: "border-gold/30 bg-gold/10 text-gold",
    Bills: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    Subscriptions: "border-violet-400/30 bg-violet-400/10 text-violet-300",
    Entertainment: "border-pink-400/30 bg-pink-400/10 text-pink-300",
    Health: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    Travel: "border-blue-400/30 bg-blue-400/10 text-blue-300",
    Other: "border-white/20 bg-white/5 text-text-mid",
  };
  return colors[category] ?? colors.Other;
}

export default function DashboardPage() {
  const { setAdvisorDrawerOpen } = useUIStore();
  const { addMessage } = useAdvisorStore();
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | null>(null);
  const [selectedTx, setSelectedTx] = useState<MockTransaction | null>(null);
  const [cancelledSubs, setCancelledSubs] = useState<Set<string>>(new Set());

  const categoryBreakdown = useMemo(() => {
    const totals: Partial<Record<TransactionCategory, number>> = {};
    for (const tx of mockTransactions) {
      if (tx.category === "Other") continue;
      totals[tx.category] = (totals[tx.category] ?? 0) + tx.amount;
    }
    const raw = Object.entries(totals).map(([category, amount]) => ({
      category: category as TransactionCategory,
      value: Math.round(amount * 100) / 100,
      color: CATEGORY_COLORS[category] ?? "#00E0B8",
    }));
    const total = raw.reduce((s, d) => s + d.value, 0);
    const scale = DISPLAY.monthSpent / total;
    return raw
      .map((d) => ({ ...d, value: Math.round(d.value * scale) }))
      .sort((a, b) => b.value - a.value);
  }, []);

  const topBudgets = useMemo(
    () =>
      [...mockBudgets]
        .map((b) => ({
          ...b,
          pct: Math.round((b.spent / b.budget) * 100),
        }))
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 6),
    []
  );

  const recentTransactions = useMemo(
    () =>
      [...mockTransactions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 10),
    []
  );

  const filteredTransactions = useMemo(() => {
    if (!selectedCategory) return recentTransactions;
    return recentTransactions.filter((t) => t.category === selectedCategory);
  }, [recentTransactions, selectedCategory]);

  const unusedSubs = useMemo(
    () =>
      mockSubscriptions
        .filter((s) => s.lastUsed.toLowerCase().includes("not used"))
        .slice(0, 3),
    []
  );

  const budgetConsumedPct = Math.round(
    (DISPLAY.monthSpent / DISPLAY.monthlyBudget) * 100
  );
  const savingsGoalPct = Math.round(
    (mockGoals.reduce((s, g) => s + g.current, 0) /
      mockGoals.reduce((s, g) => s + g.target, 0)) *
      100
  );

  const openAdvisor = (prompt: string) => {
    addMessage("user", prompt);
    setAdvisorDrawerOpen(true);
  };

  const handleFixBudget = (category: string, spent: number, budget: number) => {
    openAdvisor(
      `My ${category} budget is at ${formatAED(spent)} of ${formatAED(budget)}. What should I do to fix it?`
    );
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-1"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent/80">
          Overview
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-text-high">
          Financial command center
        </h1>
        <p className="text-sm text-text-mid">
          May 2026 · Live sync across all accounts
        </p>
      </motion.div>

      <GamificationWidget />

      {/* Row 1 — KPIs */}
      <div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        data-tour="dashboard-kpis"
      >
        <KpiCard
          label="Total Balance"
          value={DISPLAY.balance}
          decimals={2}
          sparklineData={BALANCE_SPARKLINE}
          delay={0}
          badge={
            <span className="inline-flex items-center gap-1 rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
              <TrendingUp className="h-3 w-3" />+{DISPLAY.weekChange}%
            </span>
          }
          footer={<span className="text-text-mid">vs last week</span>}
        />
        <KpiCard
          label="This Month Spent"
          value={DISPLAY.monthSpent}
          sparklineData={SPENT_SPARKLINE}
          sparklineColor="#F59E0B"
          delay={0.06}
          footer={
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-amber-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${budgetConsumedPct}%` }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className="shrink-0 font-mono text-[11px] text-amber-300">
                {budgetConsumedPct}% of budget
              </span>
            </div>
          }
        />
        <KpiCard
          label="Savings This Month"
          value={DISPLAY.monthSavings}
          sparklineData={SAVINGS_SPARKLINE}
          delay={0.12}
          footer={
            <div className="flex items-center gap-2">
              <motion.div
                className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]"
              >
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${savingsGoalPct}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </motion.div>
              <span className="shrink-0 text-[11px]">
                {savingsGoalPct}% toward goals
              </span>
            </div>
          }
        />
        <KpiCard
          label="Round-Ups This Month"
          value={DISPLAY.roundUps}
          decimals={2}
          sparklineData={ROUNDUP_SPARKLINE}
          sparklineColor="#5BFFCC"
          delay={0.18}
          badge={
            <span className="rounded-full border border-accent-secondary/25 bg-accent-secondary/10 px-2 py-0.5 text-[10px] font-medium text-accent-secondary">
              auto-saved
            </span>
          }
        />
      </div>

      {/* Row 2 — Spending + Budget */}
      <motion.div
        className="grid gap-4 lg:grid-cols-5"
        custom={0}
        initial="hidden"
        animate="visible"
        variants={rowVariants}
      >
        <GlassCard title="Spending Breakdown" className="lg:col-span-3">
          <div className="grid gap-6 p-5 md:grid-cols-[1fr_1.1fr]">
            <motion.div className="relative h-[220px] min-h-[220px] min-w-0">
              <SpendPieChart
                data={categoryBreakdown}
                monthSpent={DISPLAY.monthSpent}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) =>
                  setSelectedCategory(cat as TransactionCategory | null)
                }
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase tracking-wider text-text-mid">
                  Total
                </span>
                <span className="font-mono text-lg font-semibold text-text-high">
                  {formatAED(DISPLAY.monthSpent)}
                </span>
              </div>
            </motion.div>

            <div className="space-y-2">
              {categoryBreakdown.map((item) => {
                const pct = Math.round((item.value / DISPLAY.monthSpent) * 100);
                const active = selectedCategory === item.category;
                return (
                  <button
                    key={item.category}
                    type="button"
                    onClick={() =>
                      setSelectedCategory((prev) =>
                        prev === item.category ? null : item.category
                      )
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs transition-colors",
                      active
                        ? "bg-white/[0.06] ring-1 ring-accent/30"
                        : "hover:bg-white/[0.04]"
                    )}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="flex-1 font-medium text-text-high">
                      {item.category}
                    </span>
                    <span className="font-mono text-text-mid">{pct}%</span>
                    <span className="w-16 text-right font-mono text-text-high">
                      {formatAED(item.value)}
                    </span>
                  </button>
                );
              })}
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="mt-1 flex items-center gap-1 text-[11px] text-accent hover:underline"
                >
                  <X className="h-3 w-3" />
                  Clear filter
                </button>
              )}
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Budget Health" className="lg:col-span-2">
          <div className="space-y-4 p-5">
            {topBudgets.map((b) => (
              <div key={b.category} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-text-high">{b.category}</span>
                  <span className="font-mono text-text-mid">
                    {formatAED(b.spent)}{" "}
                    <span className="text-text-mid/60">/ {formatAED(b.budget)}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <motion.div
                    className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]"
                  >
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        budgetBarColor(b.pct)
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(b.pct, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </motion.div>
                  <span
                    className={cn(
                      "w-9 text-right font-mono text-[11px]",
                      b.pct > 100
                        ? "text-red-400"
                        : b.pct >= 70
                          ? "text-amber-300"
                          : "text-accent"
                    )}
                  >
                    {b.pct}%
                  </span>
                  {b.pct >= 70 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 shrink-0 px-2 text-[10px] text-accent hover:bg-accent/10 hover:text-accent"
                      onClick={() =>
                        handleFixBudget(b.category, b.spent, b.budget)
                      }
                    >
                      Fix it
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Row 3 — Goals, Insights, Subs */}
      <motion.div
        className="grid gap-4 md:grid-cols-3"
        custom={1}
        initial="hidden"
        animate="visible"
        variants={rowVariants}
      >
        <GlassCard title="Savings Goals">
          <div className="flex items-center justify-around gap-2 p-5">
            {mockGoals.map((goal) => (
              <ProgressRing
                key={goal.id}
                progress={(goal.current / goal.target) * 100}
                color={goal.color}
                label={goal.name}
                amount={`${formatAED(goal.current)} / ${formatAED(goal.target)}`}
              />
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Recent Insights">
          <div className="divide-y divide-white/[0.06]">
            {mockInsights.slice(0, 3).map((insight) => (
              <div
                key={insight.id}
                className="flex gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02]"
              >
                <span
                  className={cn(
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                    SEVERITY_DOT[insight.severity]
                  )}
                />
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium leading-snug text-text-high">
                    {insight.title}
                  </p>
                  <p className="line-clamp-2 text-xs leading-relaxed text-text-mid">
                    {insight.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Unused Subscriptions">
          <motion.div
            className="divide-y divide-white/[0.06]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            {unusedSubs.map((sub) => {
              const cancelled = cancelledSubs.has(sub.id);
              return (
                <div
                  key={sub.id}
                  className="flex items-center gap-3 px-5 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-sm font-medium text-text-high",
                        cancelled && "line-through opacity-50"
                      )}
                    >
                      {sub.name}
                    </p>
                    <p className="text-[11px] text-text-mid">{sub.lastUsed}</p>
                  </div>
                  <span className="font-mono text-xs text-text-mid">
                    {formatAED(sub.amount)}/mo
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={cancelled}
                    className="h-7 border-white/10 px-2.5 text-[10px] hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-400"
                    onClick={() =>
                      setCancelledSubs((prev) => new Set(prev).add(sub.id))
                    }
                  >
                    {cancelled ? "Cancelled" : "Cancel"}
                  </Button>
                </div>
              );
            })}
          </motion.div>
        </GlassCard>
      </motion.div>

      {/* Row 4 — Transactions */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={rowVariants}>
        <GlassCard
          title="Recent Transactions"
          action={
            selectedCategory ? (
              <Badge variant="outline" className="text-[10px] font-normal">
                Filtered: {selectedCategory}
              </Badge>
            ) : (
              <span className="text-[11px] text-text-mid">Last 10</span>
            )
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-text-mid">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Merchant</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="cursor-pointer border-b border-white/[0.04] transition-colors last:border-0 hover:bg-white/[0.04]"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-text-mid">
                      {tx.date}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-text-high">
                      {tx.merchant}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium",
                          categoryBadgeClass(tx.category)
                        )}
                      >
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-text-high">
                      −{formatAED(tx.amount)}
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-8 text-center text-sm text-text-mid"
                    >
                      No transactions in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>

      {/* Transaction detail drawer */}
      <Sheet open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        <SheetContent
          side="right"
          className="w-full border-white/10 bg-primary sm:max-w-md"
        >
          {selectedTx && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle>{selectedTx.merchant}</SheetTitle>
                <SheetDescription>{selectedTx.date}</SheetDescription>
              </SheetHeader>
              <div className="mt-8 space-y-6">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                  <p className="text-[11px] uppercase tracking-wider text-text-mid">
                    Amount
                  </p>
                  <p className="mt-1 font-mono text-3xl font-semibold text-text-high">
                    −{formatAED(selectedTx.amount)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-text-mid">
                      Category
                    </p>
                    <p className="mt-1 font-medium text-text-high">
                      {selectedTx.category}
                    </p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-[11px] uppercase tracking-wider text-text-mid">
                      Method
                    </p>
                    <p className="mt-1 font-medium text-text-high">
                      {selectedTx.method}
                    </p>
                  </motion.div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-white/10 hover:border-accent/30 hover:bg-accent/5"
                  onClick={() =>
                    openAdvisor(
                      `Recategorize my ${formatAED(selectedTx.amount)} transaction at ${selectedTx.merchant} from ${selectedTx.category} — what category fits better?`
                    )
                  }
                >
                  Categorize differently
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* FAB — Ask Navi */}
      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 18 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setAdvisorDrawerOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent via-accent-secondary to-accent shadow-[0_0_40px_-4px_rgba(0,224,184,0.55)] ring-2 ring-accent/30 transition-shadow hover:shadow-[0_0_56px_-4px_rgba(0,224,184,0.7)] lg:bottom-10 lg:right-10"
        aria-label="Ask Navi"
        data-tour="ask-navi-fab"
      >
        <Sparkles className="h-5 w-5 text-primary" />
      </motion.button>
    </div>
  );
}
