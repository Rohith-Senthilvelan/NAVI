"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  mockRoundUpTotal,
  mockRoundUps,
  type RoundUpNearest,
  type SavingsGoal,
} from "@/lib/mock-data";
import { useAdvisorStore, useFinanceStore, useToastStore, useUIStore } from "@/lib/store";
import { cn, formatAED } from "@/lib/utils";
import { motion, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Coins,
  MoreHorizontal,
  Pause,
  Pencil,
  PiggyBank,
  Plus,
  Sparkles,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

const REF_DATE = new Date("2026-05-14");
const JAR_CAPACITY = 120;

function AnimatedAmount({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 55, damping: 18 });
  const display = useTransform(spring, (v) =>
    new Intl.NumberFormat("en-AE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(v))
  );
  spring.set(value);
  return (
    <motion.span className="font-mono tabular-nums">
      {display}
    </motion.span>
  );
}

function formatMonthYear(date: Date) {
  return date.toLocaleDateString("en-AE", { month: "short", year: "numeric" });
}

function getEtaLabel(goal: SavingsGoal) {
  const deadline = new Date(goal.deadline);
  const remaining = goal.target - goal.current;
  const monthly = goal.monthlyContribution || 1;
  const monthsNeeded = remaining / monthly;

  const monthsUntilDeadline =
    (deadline.getFullYear() - REF_DATE.getFullYear()) * 12 +
    (deadline.getMonth() - REF_DATE.getMonth()) +
    (deadline.getDate() - REF_DATE.getDate()) / 30;

  if (monthsNeeded <= monthsUntilDeadline) {
    const reach = new Date(REF_DATE);
    reach.setMonth(reach.getMonth() + Math.ceil(monthsNeeded));
    return {
      onTrack: true,
      text: `On track to reach by ${formatMonthYear(reach)}`,
    };
  }

  const weeksBehind = Math.max(
    1,
    Math.round((monthsNeeded - monthsUntilDeadline) * 4.33)
  );
  return { onTrack: false, text: `Behind by ${weeksBehind} weeks` };
}

function naviNewGoalFeedback(target: number, monthly: number) {
  const remaining = target;
  const months = Math.max(1, Math.ceil(remaining / monthly));
  const reach = new Date(REF_DATE);
  reach.setMonth(reach.getMonth() + months);
  const bumped = monthly + 100;
  const bumpedMonths = Math.max(1, Math.ceil(remaining / bumped));
  const monthsSaved = months - bumpedMonths;
  return `Saving AED ${monthly}/mo gets you there by ${formatMonthYear(reach)}. Want to bump to AED ${bumped} and shave ${monthsSaved} month${monthsSaved === 1 ? "" : "s"}?`;
}

function computeRoundUp(amount: number, nearest: RoundUpNearest) {
  if (amount % nearest === 0) return 0;
  const rounded = Math.ceil(amount / nearest) * nearest;
  return Math.round((rounded - amount) * 100) / 100;
}

function ProgressRing({
  progress,
  color,
  size = 72,
}: {
  progress: number;
  color: string;
  size?: number;
}) {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
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
        className="transition-all duration-700"
      />
    </svg>
  );
}

function SavingsJar({ fillPct }: { fillPct: number }) {
  const level = Math.min(100, Math.max(0, fillPct));
  const liquidY = 200 - (level / 100) * 130;

  return (
    <svg viewBox="0 0 160 220" className="mx-auto h-[220px] w-[160px]">
      <defs>
        <linearGradient id="jarLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5BFFCC" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00E0B8" stopOpacity="0.55" />
        </linearGradient>
        <clipPath id="jarClip">
          <path d="M48 72 Q48 58 80 58 Q112 58 112 72 L118 188 Q118 204 80 204 Q42 204 42 188 Z" />
        </clipPath>
      </defs>
      <path
        d="M48 72 Q48 58 80 58 Q112 58 112 72 L118 188 Q118 204 80 204 Q42 204 42 188 Z"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="2"
      />
      <rect
        x="40"
        y="52"
        width="80"
        height="12"
        rx="4"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.1)"
      />
      <g clipPath="url(#jarClip)">
        <motion.rect
          x="40"
          initial={{ y: 200 }}
          animate={{ y: liquidY }}
          width="80"
          height="160"
          fill="url(#jarLiquid)"
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <ellipse
          cx="80"
          cy={liquidY + 4}
          rx="36"
          ry="6"
          fill="rgba(91,255,204,0.35)"
        />
      </g>
      <text
        x="80"
        y="128"
        textAnchor="middle"
        className="fill-text-high text-[13px] font-semibold"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        {Math.round(level)}%
      </text>
    </svg>
  );
}

const BOOST_SOURCES = [
  { id: "shopping", label: "Shopping headroom", amount: 200 },
  { id: "entertainment", label: "Entertainment surplus", amount: 150 },
  { id: "subscriptions", label: "Pause unused subscriptions", amount: 275 },
];

const SMART_SUGGESTIONS = [
  {
    id: "friday",
    icon: Calendar,
    title: "Friday surplus",
    body: "You usually have AED 200 unspent every Friday. Auto-save it?",
    action: "Enable auto-save",
  },
  {
    id: "netflix",
    icon: Pause,
    title: "Reroute subscription",
    body: "Pause Netflix (unused 47d) → reroute AED 39/mo to Bali goal.",
    action: "Reroute to Bali",
  },
  {
    id: "round10",
    icon: Coins,
    title: "Round-up boost",
    body: "Round to nearest AED 10 this month for AED ~85 extra savings.",
    action: "Switch to AED 10",
  },
];

export default function SavingsPage() {
  const {
    savingsGoals,
    yearSavings,
    roundUpEnabled,
    roundUpNearest,
    setRoundUpEnabled,
    setRoundUpNearest,
    addGoal,
    updateGoal,
    pauseGoal,
    deleteGoal,
    boostGoal,
  } = useFinanceStore();
  const { addMessage } = useAdvisorStore();
  const { setAdvisorDrawerOpen } = useUIStore();

  const [boostGoalTarget, setBoostGoalTarget] = useState<SavingsGoal | null>(null);
  const [boostAmount, setBoostAmount] = useState(100);
  const [boostSource, setBoostSource] = useState(BOOST_SOURCES[0].id);
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<SavingsGoal | null>(null);
  const [naviFeedback, setNaviFeedback] = useState<string | null>(null);
  const { toast: pushToast } = useToastStore();

  const [formName, setFormName] = useState("");
  const [formTarget, setFormTarget] = useState("5000");
  const [formDeadline, setFormDeadline] = useState("2027-06-01");
  const [formMonthly, setFormMonthly] = useState("500");

  const monthlyRoundUp = mockRoundUpTotal;
  const jarFill = (monthlyRoundUp / JAR_CAPACITY) * 100;

  const recentRoundUps = useMemo(
    () =>
      [...mockRoundUps]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 10)
        .map((r) => ({
          ...r,
          roundUp: roundUpEnabled
            ? computeRoundUp(r.originalAmount, roundUpNearest)
            : 0,
        })),
    [roundUpEnabled, roundUpNearest]
  );

  const showToast = (message: string) => pushToast(message, "success");

  const resetForm = () => {
    setFormName("");
    setFormTarget("5000");
    setFormDeadline("2027-06-01");
    setFormMonthly("500");
    setNaviFeedback(null);
    setEditGoal(null);
  };

  const handleSaveGoal = () => {
    const target = Number(formTarget);
    const monthly = Number(formMonthly);
    if (!formName || !target || !monthly) return;

    if (editGoal) {
      updateGoal(editGoal.id, {
        name: formName,
        target,
        deadline: formDeadline,
        monthlyContribution: monthly,
      });
      setNewGoalOpen(false);
      resetForm();
      showToast(`Updated ${formName}.`);
      return;
    }

    const colors = ["#00E0B8", "#5BFFCC", "#D4AF37", "#6366F1"];
    addGoal({
      name: formName,
      target,
      deadline: formDeadline,
      monthlyContribution: monthly,
      color: colors[savingsGoals.length % colors.length],
    });
    setNaviFeedback(naviNewGoalFeedback(target, monthly));
    showToast(`${formName} Grow Plan created.`);
  };

  const handleBoost = () => {
    if (!boostGoalTarget || boostAmount <= 0) return;
    boostGoal(boostGoalTarget.id, boostAmount);
    setBoostGoalTarget(null);
    showToast(
      `Boosted ${boostGoalTarget.name} by ${formatAED(boostAmount)} from ${BOOST_SOURCES.find((s) => s.id === boostSource)?.label}.`
    );
  };

  const handleSuggestion = (id: string) => {
    if (id === "round10") {
      setRoundUpNearest(10);
      showToast("Round-ups set to nearest AED 10.");
      return;
    }
    if (id === "netflix") {
      const bali = savingsGoals.find((g) => g.name.includes("Bali"));
      if (bali) boostGoal(bali.id, 39);
      showToast("AED 39/mo rerouted from Netflix to Bali goal.");
      return;
    }
    addMessage("user", "Enable auto-save for my Friday AED 200 surplus.");
    setAdvisorDrawerOpen(true);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Hero strip */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-accent/10 p-8 backdrop-blur-xl"
      >
        <motion.div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/15 blur-3xl"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent/80">
          Your savings story
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-high sm:text-4xl">
          You&apos;ve saved AED <AnimatedAmount value={yearSavings.total} /> with
          Navi this year
        </h1>
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { label: "Round-Ups", value: yearSavings.roundUps },
            { label: "Auto-Save", value: yearSavings.autoSave },
            { label: "Manual", value: yearSavings.manual },
          ].map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-text-mid"
            >
              <span className="font-medium text-text-high">{chip.label}:</span>
              {formatAED(chip.value)}
            </span>
          ))}
        </div>
      </motion.section>

      {/* Section 1 — Grow Plans */}
      <section className="space-y-4">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-lg font-semibold text-text-high">Grow Plans</h2>
          <span className="text-xs text-text-mid">
            {savingsGoals.filter((g) => !g.paused).length} active goals
          </span>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {savingsGoals.map((goal, i) => {
            const pct = Math.round((goal.current / goal.target) * 100);
            const eta = getEtaLabel(goal);
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl",
                  goal.paused && "opacity-60"
                )}
              >
                <motion.div
                  className="flex items-start justify-between gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-high">
                      {goal.name}
                      {goal.paused && (
                        <span className="ml-2 text-[10px] font-normal uppercase text-text-mid">
                          Paused
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-text-mid">
                      {formatAED(goal.current)} / {formatAED(goal.target)}
                    </p>
                  </motion.div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-text-mid hover:bg-white/[0.05] hover:text-text-high"
                        aria-label="Goal options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditGoal(goal);
                          setFormName(goal.name);
                          setFormTarget(String(goal.target));
                          setFormDeadline(goal.deadline);
                          setFormMonthly(String(goal.monthlyContribution));
                          setNewGoalOpen(true);
                        }}
                      >
                        <Pencil className="mr-2 h-3.5 w-3.5" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => pauseGoal(goal.id)}>
                        <Pause className="mr-2 h-3.5 w-3.5" />
                        {goal.paused ? "Resume" : "Pause"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-400 focus:text-red-400"
                        onClick={() => {
                          deleteGoal(goal.id);
                          showToast(`Deleted ${goal.name}.`);
                        }}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="relative">
                    <ProgressRing progress={pct} color={goal.color} />
                    <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold text-text-high">
                      {pct}%
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-xs font-medium",
                        eta.onTrack ? "text-accent" : "text-amber-400"
                      )}
                    >
                      {eta.text}
                    </p>
                    <p className="mt-1 text-[11px] text-text-mid">
                      {formatAED(goal.monthlyContribution)}/mo contribution
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 w-full border-white/10 hover:border-accent/30 hover:bg-accent/5"
                  disabled={goal.paused}
                  onClick={() => {
                    setBoostGoalTarget(goal);
                    setBoostAmount(100);
                    setBoostSource(BOOST_SOURCES[0].id);
                  }}
                >
                  <TrendingUp className="mr-2 h-3.5 w-3.5" />
                  Boost goal
                </Button>
              </motion.div>
            );
          })}

          {/* New Grow Plan card */}
          <button
            type="button"
            onClick={() => {
              resetForm();
              setNewGoalOpen(true);
            }}
            className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.01] p-5 text-text-mid transition-colors hover:border-accent/30 hover:bg-accent/5 hover:text-accent"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-current">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">New Grow Plan</span>
          </button>
        </div>
      </section>

      {/* Section 2 — Round-Ups */}
      <section className="space-y-4">
        <motion.div
          className="flex flex-wrap items-center justify-between gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-lg font-semibold text-text-high">Round-Ups</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-mid">Round-Up enabled</span>
            <Switch
              checked={roundUpEnabled}
              onCheckedChange={setRoundUpEnabled}
              aria-label="Round-up enabled"
            />
          </div>
        </motion.div>

        <div className="grid gap-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl lg:grid-cols-2">
          <div>
            <p className="mb-2 text-center text-xs text-text-mid">
              This month · {formatAED(monthlyRoundUp)} saved
            </p>
            <SavingsJar fillPct={jarFill} />
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-text-mid">
                Round to nearest
              </p>
              <div className="flex gap-2">
                {([1, 5, 10] as const).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRoundUpNearest(n)}
                    className={cn(
                      "flex-1 rounded-lg border py-2 text-xs font-medium transition-colors",
                      roundUpNearest === n
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-white/10 text-text-mid hover:text-text-high"
                    )}
                  >
                    AED {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-mid">
              Recent round-ups
            </p>
            <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
              {recentRoundUps.map((r) => (
                <div
                  key={r.transactionId}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-high">
                      {r.merchant}
                    </p>
                    <p className="text-[11px] text-text-mid">{r.date}</p>
                  </div>
                  <motion.div
                    className="text-right"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="font-mono text-xs text-text-mid">
                      {formatAED(r.originalAmount)}
                    </p>
                    <p className="font-mono text-xs font-medium text-accent">
                      +{formatAED(r.roundUp)}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Smart Save Suggestions */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-high">
          Smart Save Suggestions
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {SMART_SUGGESTIONS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <p className="text-sm font-semibold text-text-high">{s.title}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-text-mid">
                  {s.body}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-4 justify-start px-0 text-accent hover:bg-transparent hover:text-accent-secondary"
                  onClick={() => handleSuggestion(s.id)}
                >
                  {s.action}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* New / Edit Goal dialog */}
      <Dialog
        open={newGoalOpen}
        onOpenChange={(open) => {
          setNewGoalOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="border-white/10 bg-primary sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-text-high">
              {editGoal ? "Edit Grow Plan" : "New Grow Plan"}
            </DialogTitle>
            <DialogDescription>
              Set a target, deadline, and monthly contribution.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <motion.div className="space-y-2">
              <Label htmlFor="goal-name">Name</Label>
              <Input
                id="goal-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. New car"
              />
            </motion.div>
            <div className="space-y-2">
              <Label htmlFor="goal-target">Target (AED)</Label>
              <Input
                id="goal-target"
                type="number"
                value={formTarget}
                onChange={(e) => setFormTarget(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-deadline">Deadline</Label>
              <Input
                id="goal-deadline"
                type="date"
                value={formDeadline}
                onChange={(e) => setFormDeadline(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-monthly">Monthly contribution (AED)</Label>
              <Input
                id="goal-monthly"
                type="number"
                value={formMonthly}
                onChange={(e) => setFormMonthly(e.target.value)}
              />
            </div>
            {naviFeedback && !editGoal && (
              <div className="flex gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-sm leading-relaxed text-text-high">
                  {naviFeedback}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-white/10"
              onClick={() => {
                setNewGoalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-accent text-primary hover:bg-accent-secondary"
              onClick={handleSaveGoal}
            >
              {editGoal ? "Save changes" : "Create plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boost goal sheet */}
      <Sheet
        open={!!boostGoalTarget}
        onOpenChange={(open) => !open && setBoostGoalTarget(null)}
      >
        <SheetContent
          side="right"
          className="border-white/10 bg-primary sm:max-w-md"
        >
          {boostGoalTarget && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle>Boost {boostGoalTarget.name}</SheetTitle>
                <SheetDescription>
                  Pick an amount and where Navi should pull it from.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label>Amount to add</Label>
                  <Input
                    type="number"
                    min={10}
                    step={10}
                    value={boostAmount}
                    onChange={(e) => setBoostAmount(Number(e.target.value))}
                  />
                  <input
                    type="range"
                    min={10}
                    max={500}
                    step={10}
                    value={boostAmount}
                    onChange={(e) => setBoostAmount(Number(e.target.value))}
                    className="w-full accent-accent"
                  />
                  <p className="text-center font-mono text-sm text-accent">
                    +{formatAED(boostAmount)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Navi suggests pulling from</Label>
                  {BOOST_SOURCES.map((src) => (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => setBoostSource(src.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                        boostSource === src.id
                          ? "border-accent/30 bg-accent/10 text-text-high"
                          : "border-white/10 text-text-mid hover:bg-white/[0.03]"
                      )}
                    >
                      <span>{src.label}</span>
                      <span className="font-mono text-xs">
                        up to {formatAED(src.amount)}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                  <div className="flex items-start gap-2">
                    <Zap className="mt-0.5 h-4 w-4 text-accent" />
                    <p className="text-xs leading-relaxed text-text-mid">
                      Boosting by {formatAED(boostAmount)} moves{" "}
                      {boostGoalTarget.name} to{" "}
                      {Math.round(
                        ((boostGoalTarget.current + boostAmount) /
                          boostGoalTarget.target) *
                          100
                      )}
                      % — about{" "}
                      {Math.ceil(
                        (boostGoalTarget.target -
                          boostGoalTarget.current -
                          boostAmount) /
                          boostGoalTarget.monthlyContribution
                      )}{" "}
                      months sooner at current pace.
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full bg-accent text-primary hover:bg-accent-secondary"
                  onClick={handleBoost}
                >
                  <PiggyBank className="mr-2 h-4 w-4" />
                  Apply boost
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
