"use client";

import { Button } from "@/components/ui/button";
import { ChartSkeleton } from "@/components/charts/chart-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  getBudgetVsActualHistory,
  TRANSACTION_CATEGORIES,
  type BudgetCategory,
  type BudgetPeriod,
  type TransactionCategory,
} from "@/lib/mock-data";
import {
  type RebalanceFix,
  useFinanceStore,
  useToastStore,
} from "@/lib/store";
import { cn, formatAED } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Car,
  Circle,
  FileText,
  Heart,
  Plane,
  Plus,
  Repeat,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Tv,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

const BudgetBarChart = dynamic(
  () =>
    import("@/components/charts/budget-bar-chart").then((m) => m.BudgetBarChart),
  { ssr: false, loading: () => <ChartSkeleton height={260} /> }
);

const REF_DATE = new Date("2026-05-14");

const ICON_MAP: Record<string, LucideIcon> = {
  utensils: Utensils,
  "shopping-cart": ShoppingCart,
  car: Car,
  bag: ShoppingBag,
  "file-text": FileText,
  repeat: Repeat,
  tv: Tv,
  heart: Heart,
  plane: Plane,
  circle: Circle,
};

const FRIENDLY_NAMES: Partial<Record<string, string>> = {
  Food: "Dining",
};

function getIcon(iconKey: string) {
  return ICON_MAP[iconKey] ?? Circle;
}

function daysLeftInMonth(ref = REF_DATE) {
  const daysInMonth = new Date(
    ref.getFullYear(),
    ref.getMonth() + 1,
    0
  ).getDate();
  return daysInMonth - ref.getDate();
}

function scaleForView(value: number, view: BudgetPeriod, kind: "allocated" | "spent") {
  if (view === "monthly") return value;
  return kind === "allocated"
    ? Math.round(value / 4)
    : Math.round((value * 7) / refDayOfMonth());
}

function refDayOfMonth() {
  return REF_DATE.getDate();
}

function budgetPct(spent: number, allocated: number) {
  if (allocated <= 0) return 0;
  return Math.round((spent / allocated) * 100);
}

function barColor(pct: number) {
  if (pct > 100) return "bg-red-500";
  if (pct >= 70) return "bg-amber-400";
  return "bg-accent";
}

function buildNaviTake(budgets: BudgetCategory[]) {
  const over = budgets.filter((b) => b.spent > b.allocated);
  const under = budgets.filter(
    (b) => b.allocated > 0 && b.spent / b.allocated < 0.6
  );
  const totalAllocated = budgets.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const overallPct = Math.round((totalSpent / totalAllocated) * 100);

  if (over.length === 0) {
    return `You're at ${overallPct}% of your AED ${totalAllocated.toLocaleString()} monthly plan with ${daysLeftInMonth()} days left — solid control. ${under[0]?.name ?? "Transport"} still has the most headroom if you want to redirect savings toward goals.`;
  }

  const hot = over
    .map((b) => FRIENDLY_NAMES[b.name] ?? b.name)
    .slice(0, 2)
    .join(" and ");
  const cool = under[0]?.name ?? "Transport";
  return `Overall you're at ${overallPct}% of plan, but ${hot} ${over.length > 1 ? "are" : "is"} running hot. ${cool} is under-utilized — Navi can shift caps without touching bills or subscriptions. Tap a Smart Alert to rebalance in one step.`;
}

function buildRebalanceFixes(
  target: BudgetCategory,
  budgets: BudgetCategory[]
): RebalanceFix[] {
  const shopping = budgets.find((b) => b.name === "Shopping");
  const entertainment = budgets.find((b) => b.name === "Entertainment");

  return [
    {
      id: "fix-reduce-shopping",
      type: "reduce",
      label: "Reduce Shopping",
      sourceCategoryId: shopping?.id,
      targetCategoryId: shopping?.id ?? target.id,
      amount: 200,
      maxAmount: shopping ? Math.min(400, shopping.allocated) : 200,
    },
    {
      id: "fix-move-entertainment",
      type: "move",
      label: "Move from Entertainment",
      sourceCategoryId: entertainment?.id,
      targetCategoryId: target.id,
      amount: 150,
      maxAmount: entertainment ? Math.min(300, entertainment.allocated) : 150,
    },
    {
      id: "fix-increase-target",
      type: "increase",
      label: `Increase ${FRIENDLY_NAMES[target.name] ?? target.name} budget (one-time)`,
      targetCategoryId: target.id,
      amount: 200,
      maxAmount: 500,
    },
  ];
}

export default function BudgetPage() {
  const {
    budgets,
    budgetViewPeriod,
    autoRebalance,
    setBudgetViewPeriod,
    setAutoRebalance,
    addBudget,
    applyRebalanceFix,
  } = useFinanceStore();

  const [newBudgetOpen, setNewBudgetOpen] = useState(false);
  const [rebalanceTarget, setRebalanceTarget] = useState<BudgetCategory | null>(null);
  const [fixAmounts, setFixAmounts] = useState<Record<string, number>>({});
  const { toast: pushToast } = useToastStore();

  const [formCategory, setFormCategory] = useState<TransactionCategory>("Food");
  const [formAmount, setFormAmount] = useState("500");
  const [formPeriod, setFormPeriod] = useState<BudgetPeriod>("monthly");

  const daysLeft = daysLeftInMonth();
  const chartData = useMemo(() => getBudgetVsActualHistory(budgets), [budgets]);

  const rebalanceFixes = useMemo(
    () => (rebalanceTarget ? buildRebalanceFixes(rebalanceTarget, budgets) : []),
    [rebalanceTarget, budgets]
  );

  const showToast = (message: string) => pushToast(message, "success");

  const openRebalance = (budget: BudgetCategory) => {
    const fixes = buildRebalanceFixes(budget, budgets);
    setFixAmounts(
      Object.fromEntries(fixes.map((f) => [f.id, f.amount]))
    );
    setRebalanceTarget(budget);
  };

  const handleCreateBudget = () => {
    const amount = Number(formAmount);
    if (!formCategory || !amount || amount <= 0) return;
    addBudget(formCategory, amount, formPeriod);
    setNewBudgetOpen(false);
    showToast(
      `${formCategory} budget set to ${formatAED(amount)} (${formPeriod}).`
    );
  };

  const handleApplyFix = (fix: RebalanceFix) => {
    const amount = fixAmounts[fix.id] ?? fix.amount;
    applyRebalanceFix({ ...fix, amount });
    setRebalanceTarget(null);
    showToast(`Applied: ${fix.label} — ${formatAED(amount)}`);
  };

  return (
    <motion.div
      className="space-y-8 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent/80">
            Spending caps
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-text-high">
            Budgets
          </h1>
        </div>
        <Button
          onClick={() => setNewBudgetOpen(true)}
          className="rounded-full bg-gradient-to-r from-accent to-accent-secondary px-5 text-primary shadow-[0_0_24px_-4px_rgba(0,224,184,0.45)] hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Budget
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px]">
        {/* LEFT — budget cards */}
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {budgets.map((budget, i) => {
              const allocated = scaleForView(
                budget.allocated,
                budgetViewPeriod,
                "allocated"
              );
              const spent = scaleForView(
                budget.spent,
                budgetViewPeriod,
                "spent"
              );
              const pct = budgetPct(spent, allocated);
              const over = spent > allocated;
              const overPct = over
                ? Math.round(((spent - allocated) / allocated) * 100)
                : 0;
              const dailyLeft =
                daysLeft > 0 && !over
                  ? Math.max(0, Math.round((allocated - spent) / daysLeft))
                  : 0;
              const Icon = getIcon(budget.icon);
              const displayName = FRIENDLY_NAMES[budget.name] ?? budget.name;

              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.45 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl transition-shadow hover:border-accent/15 hover:shadow-[0_0_32px_-8px_rgba(0,224,184,0.2)]"
                >
                  <motion.div
                    className="flex items-start justify-between gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                        <Icon className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-high">
                          {displayName}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-text-mid">
                          {budgetViewPeriod}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "font-mono text-xs font-medium",
                        over ? "text-red-400" : "text-text-mid"
                      )}
                    >
                      {pct}%
                    </span>
                  </motion.div>

                  <p className="mt-4 font-mono text-lg font-semibold text-text-high">
                    {formatAED(spent)}
                    <span className="text-sm font-normal text-text-mid">
                      {" "}
                      / {formatAED(allocated)}
                    </span>
                  </p>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      className={cn("h-full rounded-full", barColor(pct))}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(pct, 100)}%` }}
                      transition={{ duration: 0.7, delay: 0.1 + i * 0.03 }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[11px] text-text-mid">
                    <span>{daysLeft} days left in month</span>
                    {!over && dailyLeft > 0 && (
                      <span className="text-accent">
                        {formatAED(dailyLeft)}/day left to stay on track
                      </span>
                    )}
                  </div>

                  {over && (
                    <button
                      type="button"
                      onClick={() => openRebalance(budget)}
                      className="mt-4 flex w-full items-start gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2.5 text-left transition-colors hover:bg-red-500/15"
                    >
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-red-400">
                          Smart Alert
                        </p>
                        <p className="text-xs leading-snug text-red-200/90">
                          You&apos;re {overPct}% over on {displayName}. Tap to
                          rebalance.
                        </p>
                      </div>
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Budget vs Actual chart */}
          <motion.div
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-high">
                Budget vs Actual
              </h2>
              <span className="text-[11px] text-text-mid">Last 3 months</span>
            </div>
            <div className="h-[260px] min-h-[260px] w-full">
              <BudgetBarChart data={chartData} />
            </div>
          </motion.div>
        </div>

        {/* RIGHT — sticky sidebar */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <motion.div
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/20 bg-accent/10">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              <h2 className="text-sm font-semibold text-text-high">
                Navi&apos;s Take
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-text-mid">
              {buildNaviTake(budgets)}
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-mid">
              View period
            </p>
            <motion.div
              className="flex rounded-xl border border-white/10 bg-white/[0.02] p-1"
              role="group"
              aria-label="Budget view period"
            >
              {(["weekly", "monthly"] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setBudgetViewPeriod(period)}
                  className={cn(
                    "flex-1 rounded-lg py-2 text-xs font-medium capitalize transition-colors",
                    budgetViewPeriod === period
                      ? "bg-accent/15 text-accent"
                      : "text-text-mid hover:text-text-high"
                  )}
                >
                  {period}
                </button>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-high">
                Auto-rebalance
              </p>
              <p className="mt-1 text-xs leading-relaxed text-text-mid">
                Let Navi adjust budgets weekly based on patterns.
              </p>
            </div>
            <Switch
              checked={autoRebalance}
              onCheckedChange={setAutoRebalance}
              aria-label="Auto-rebalance budgets"
            />
          </motion.div>
        </div>
      </div>

      {/* New Budget dialog */}
      <Dialog open={newBudgetOpen} onOpenChange={setNewBudgetOpen}>
        <DialogContent className="border-white/10 bg-primary sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-text-high">New Budget</DialogTitle>
            <DialogDescription>
              Set a spending cap for a category. Updates sync across Navi.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="budget-category">Category</Label>
              <select
                id="budget-category"
                value={formCategory}
                onChange={(e) =>
                  setFormCategory(e.target.value as TransactionCategory)
                }
                className="flex h-10 w-full rounded-md border border-white/10 bg-surface px-3 text-sm text-text-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {TRANSACTION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {FRIENDLY_NAMES[cat] ?? cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget-amount">Amount (AED)</Label>
              <Input
                id="budget-amount"
                type="number"
                min={1}
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                placeholder="500"
              />
            </div>
            <div className="space-y-2">
              <Label>Period</Label>
              <div className="flex rounded-xl border border-white/10 bg-white/[0.02] p-1">
                {(["weekly", "monthly"] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setFormPeriod(period)}
                    className={cn(
                      "flex-1 rounded-lg py-2 text-xs font-medium capitalize transition-colors",
                      formPeriod === period
                        ? "bg-accent/15 text-accent"
                        : "text-text-mid hover:text-text-high"
                    )}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-white/10"
              onClick={() => setNewBudgetOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateBudget}
              className="bg-accent text-primary hover:bg-accent-secondary"
            >
              Create Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rebalance side panel */}
      <Sheet
        open={!!rebalanceTarget}
        onOpenChange={(open) => !open && setRebalanceTarget(null)}
      >
        <SheetContent
          side="right"
          className="flex w-full flex-col border-white/10 bg-primary sm:max-w-md"
        >
          {rebalanceTarget && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle>Rebalance {FRIENDLY_NAMES[rebalanceTarget.name] ?? rebalanceTarget.name}</SheetTitle>
                <SheetDescription>
                  Navi suggests a few ways to get back on track. Adjust amounts
                  and apply.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 flex-1 space-y-4 overflow-y-auto pr-1">
                {rebalanceFixes.map((fix) => {
                  const amount = fixAmounts[fix.id] ?? fix.amount;
                  return (
                    <div
                      key={fix.id}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4"
                    >
                      <p className="text-sm font-medium text-text-high">
                        {fix.type === "reduce" && fix.sourceCategoryId && (
                          <>
                            Reduce{" "}
                            {budgets.find((b) => b.id === fix.sourceCategoryId)
                              ?.name ?? "category"}{" "}
                            by {formatAED(amount)}
                          </>
                        )}
                        {fix.type === "move" && fix.sourceCategoryId && (
                          <>
                            Move from{" "}
                            {budgets.find((b) => b.id === fix.sourceCategoryId)
                              ?.name ?? "category"}{" "}
                            {formatAED(amount)}
                          </>
                        )}
                        {fix.type === "increase" && (
                          <>
                            Increase{" "}
                            {FRIENDLY_NAMES[rebalanceTarget.name] ??
                              rebalanceTarget.name}{" "}
                            budget by {formatAED(amount)} (one-time)
                          </>
                        )}
                      </p>
                      <input
                        type="range"
                        min={0}
                        max={fix.maxAmount}
                        step={10}
                        value={amount}
                        onChange={(e) =>
                          setFixAmounts((prev) => ({
                            ...prev,
                            [fix.id]: Number(e.target.value),
                          }))
                        }
                        className="mt-3 w-full accent-accent"
                      />
                      <motion.div
                        className="mt-1 flex justify-between text-[11px] text-text-mid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <span>AED 0</span>
                        <span className="font-mono text-accent">
                          {formatAED(amount)}
                        </span>
                        <span>{formatAED(fix.maxAmount)}</span>
                      </motion.div>
                      <Button
                        size="sm"
                        className="mt-3 w-full bg-accent text-primary hover:bg-accent-secondary"
                        disabled={amount <= 0}
                        onClick={() => handleApplyFix(fix)}
                      >
                        Apply
                      </Button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
