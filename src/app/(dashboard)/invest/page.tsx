"use client";

import { Button } from "@/components/ui/button";
import { ChartSkeleton } from "@/components/charts/chart-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ASSET_CLASS_DETAILS,
  getProfileExplanation,
  getProfileLabel,
  getSamplePortfolio,
  getSuggestedMix,
  LEARN_LESSONS,
  PROFILER_QUESTIONS,
  scoreToProfile,
  type LearnLesson,
  type RiskProfile,
} from "@/lib/invest";
import { useUIStore, useUserStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  Crown,
  LineChart,
  RefreshCw,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

const AllocationPieChart = dynamic(
  () =>
    import("@/components/charts/allocation-pie-chart").then(
      (m) => m.AllocationPieChart
    ),
  { ssr: false, loading: () => <ChartSkeleton height={220} /> }
);

const PROFILE_ICONS: Record<RiskProfile, typeof Shield> = {
  conservative: Shield,
  balanced: LineChart,
  aggressive: Zap,
};

const PROFILE_COLORS: Record<RiskProfile, string> = {
  conservative: "#6366F1",
  balanced: "#6E56FF",
  aggressive: "#F5C453",
};

const RISK_STYLES = {
  Low: "text-accent bg-accent/10 border-accent/20",
  Medium: "text-amber-300 bg-amber-400/10 border-amber-400/20",
  High: "text-red-300 bg-red-400/10 border-red-400/20",
};

function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex flex-1 flex-col gap-1.5">
          <motion.div
            className="h-1 overflow-hidden rounded-full bg-white/[0.08]"
          >
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: i < current ? "100%" : i === current ? "50%" : "0%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
          <span
            className={cn(
              "text-center text-[10px] font-medium",
              i <= current ? "text-accent" : "text-text-mid"
            )}
          >
            {i + 1}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

function RiskProfiler({ onComplete }: { onComplete: (p: RiskProfile) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const question = PROFILER_QUESTIONS[step];
  const isLast = step === PROFILER_QUESTIONS.length - 1;

  const selectOption = (score: number) => {
    const next = [...answers, score];
    setAnswers(next);
    if (isLast) {
      const total = next.reduce((s, v) => s + v, 0);
      onComplete(scoreToProfile(total));
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <motion.div
      className="mx-auto max-w-xl space-y-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="space-y-2 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent/80">
          Risk Profiler
        </p>
        <h2 className="text-xl font-semibold text-text-high">
          Let&apos;s learn how you feel about risk
        </h2>
        <p className="text-sm text-text-mid">
          5 quick questions · about 2 minutes
        </p>
      </div>

      <StepIndicator current={step} total={PROFILER_QUESTIONS.length} />

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.35 }}
          className="space-y-4"
        >
          <p className="text-center text-sm font-medium text-text-high">
            {question.question}
          </p>
          <div className="space-y-2">
            {question.options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => selectOption(opt.score)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3.5 text-left text-sm text-text-high transition-colors hover:border-accent/30 hover:bg-accent/5"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {step > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="mx-auto flex text-text-mid"
          onClick={() => {
            setStep((s) => s - 1);
            setAnswers((a) => a.slice(0, -1));
          }}
        >
          Back
        </Button>
      )}
    </motion.div>
  );
}

function AssetAccordion() {
  const [openId, setOpenId] = useState<string | null>("etfs");

  return (
    <div className="space-y-2">
      {ASSET_CLASS_DETAILS.map((asset) => {
        const open = openId === asset.id;
        return (
          <motion.div
            key={asset.id}
            className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]"
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : asset.id)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left"
            >
              <span className="text-sm font-medium text-text-high">
                {asset.name}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-text-mid transition-transform",
                  open && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-4 border-t border-white/[0.06] px-4 py-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-accent">
                        Pros
                      </p>
                      <ul className="space-y-1.5 text-xs leading-relaxed text-text-mid">
                        {asset.pros.map((p) => (
                          <li key={p}>+ {p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                        Cons
                      </p>
                      <ul className="space-y-1.5 text-xs leading-relaxed text-text-mid">
                        {asset.cons.map((c) => (
                          <li key={c}>− {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

function ProfileDashboard({
  profile,
  onRetake,
}: {
  profile: RiskProfile;
  onRetake: () => void;
}) {
  const { setAdvisorDrawerOpen } = useUIStore();
  const [lessonOpen, setLessonOpen] = useState<LearnLesson | null>(null);

  const mix = useMemo(() => getSuggestedMix(profile), [profile]);
  const portfolio = useMemo(() => getSamplePortfolio(profile), [profile]);
  const Icon = PROFILE_ICONS[profile];
  const color = PROFILE_COLORS[profile];

  return (
    <div className="space-y-8">
      {/* Profile card */}
      <motion.div
        className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="h-7 w-7" style={{ color }} />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-text-mid">
                Your profile
              </p>
              <h2 className="text-2xl font-semibold text-text-high">
                {getProfileLabel(profile)}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-mid">
                {getProfileExplanation(profile)}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-text-mid"
            onClick={onRetake}
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Retake profiler
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Suggested mix */}
        <motion.div
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <h3 className="text-sm font-semibold text-text-high">Suggested Mix</h3>
          <p className="mt-1 text-xs text-text-mid">
            Illustrative allocation — not a product recommendation
          </p>
          <div className="relative mt-4 h-[220px]">
            <AllocationPieChart data={mix} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <TrendingUp className="mb-1 h-4 w-4 text-accent" />
              <span className="text-[10px] text-text-mid">Target mix</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {mix.map((m) => (
              <span
                key={m.name}
                className="flex items-center gap-1.5 text-xs text-text-mid"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: m.color }}
                />
                {m.name} {m.value}%
              </span>
            ))}
          </div>
        </motion.div>

        {/* Accordion */}
        <motion.div
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="mb-4 text-sm font-semibold text-text-high">
            Asset classes — pros &amp; cons
          </h3>
          <AssetAccordion />
        </motion.div>
      </div>

      {/* Sample portfolio table */}
      <motion.div
        className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="border-b border-white/[0.06] px-5 py-4">
          <h3 className="text-sm font-semibold text-text-high">
            Sample portfolio
          </h3>
          <p className="text-xs text-text-mid">
            Mock instruments for a {getProfileLabel(profile).toLowerCase()} profile
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-text-mid">
                <th className="px-5 py-3 font-medium">Ticker</th>
                <th className="px-5 py-3 font-medium">Instrument</th>
                <th className="px-5 py-3 font-medium">Allocation</th>
                <th className="px-5 py-3 font-medium">Return range</th>
                <th className="px-5 py-3 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((row) => (
                <tr
                  key={row.ticker}
                  className="border-b border-white/[0.04] last:border-0"
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-accent">
                    {row.ticker}
                  </td>
                  <td className="px-5 py-3.5 text-text-high">{row.name}</td>
                  <td className="px-5 py-3.5 font-mono text-text-mid">
                    {row.allocation}%
                  </td>
                  <td className="px-5 py-3.5 font-mono text-text-mid">
                    {row.returnRange}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        RISK_STYLES[row.risk]
                      )}
                    >
                      {row.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Coach Mode banner */}
      <motion.div
        className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gold/30 bg-gradient-to-r from-gold/20 via-gold/10 to-transparent p-6 sm:flex-row sm:items-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/40 bg-gold/20">
            <Crown className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-high">Coach Mode</p>
            <p className="mt-1 text-sm text-text-mid">
              This is general coaching. For business-grade advice, unlock
              Business Advisor Mode.
            </p>
          </div>
        </div>
        <Button
          className="shrink-0 bg-gradient-to-r from-gold to-amber-400 text-primary hover:opacity-90"
          onClick={() => setAdvisorDrawerOpen(true)}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Unlock Business Advisor
        </Button>
      </motion.div>

      {/* Learn */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-high">Learn</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LEARN_LESSONS.map((lesson, i) => (
            <motion.button
              key={lesson.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              onClick={() => setLessonOpen(lesson)}
              className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left backdrop-blur-xl transition-colors hover:border-accent/20 hover:bg-accent/5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
                <BookOpen className="h-4 w-4 text-accent" />
              </div>
              <p className="text-sm font-semibold text-text-high">
                {lesson.title}
              </p>
              <p className="mt-1 text-xs text-text-mid">{lesson.subtitle}</p>
              <p className="mt-3 text-[11px] text-accent">
                {lesson.readMinutes} min read →
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lesson modal */}
      <Dialog open={!!lessonOpen} onOpenChange={(o) => !o && setLessonOpen(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-white/10 bg-primary sm:max-w-lg">
          {lessonOpen && (
            <>
              <DialogHeader>
                <DialogTitle className="text-text-high">
                  {lessonOpen.title}
                </DialogTitle>
                <DialogDescription>{lessonOpen.subtitle}</DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2 text-xs text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                Navi explains
              </div>
              <p className="text-sm leading-relaxed text-text-mid">
                {lessonOpen.body}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Disclaimer */}
      <p className="text-center text-[11px] leading-relaxed text-text-mid/80">
        Navi provides educational guidance, not regulated financial advice.
      </p>
    </div>
  );
}

export default function InvestPage() {
  const { riskProfile, setRiskProfile, clearRiskProfile } = useUserStore();

  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent/80">
          Grow your wealth
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-text-high">
          Invest
        </h1>
      </motion.div>

      {!riskProfile ? (
        <RiskProfiler onComplete={setRiskProfile} />
      ) : (
        <ProfileDashboard
          profile={riskProfile}
          onRetake={clearRiskProfile}
        />
      )}
    </div>
  );
}
