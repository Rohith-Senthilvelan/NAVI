"use client";

import { resetDemoData } from "@/lib/demo-reset";
import {
  useAdvisorStore,
  useFinanceStore,
  useToastStore,
  useUIStore,
} from "@/lib/store";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const PITCH_FLAG = "navi-pitch-active";
const TOTAL_MS = 90_000;

type PitchStep = {
  at: number;
  label: string;
  run: () => void;
};

export function PitchOrchestrator() {
  const router = useRouter();
  const { toast } = useToastStore();
  const { setAdvisorDrawerOpen } = useUIStore();
  const { addMessage, setLoading } = useAdvisorStore();
  const { boostGoal, savingsGoals } = useFinanceStore();

  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [caption, setCaption] = useState("Initializing pitch demo…");

  const startRef = useRef(0);
  const pausedAtRef = useRef(0);
  const pauseAccumRef = useRef(0);
  const firedRef = useRef(new Set<number>());
  const rafRef = useRef<number>(0);

  const buildSteps = useCallback((): PitchStep[] => {
    const bali = savingsGoals.find((g) => g.name.toLowerCase().includes("bali"));

    return [
      {
        at: 0,
        label: "Welcome to Navi — your AI financial coach for the UAE.",
        run: () => router.push("/dashboard"),
      },
      {
        at: 8_000,
        label: "Your dashboard KPIs update live — balance, spend, savings, round-ups.",
        run: () => router.push("/dashboard"),
      },
      {
        at: 18_000,
        label: "Ask Navi anything — budget fixes, trip planning, subscription audits.",
        run: () => {
          setAdvisorDrawerOpen(true);
          addMessage("user", "How am I doing on my budget this week?");
          setLoading(true);
          window.setTimeout(() => {
            setLoading(false);
            addMessage(
              "assistant",
              "Food is 18% over cap, but Transport has headroom. **Action:** Move AED 150 from Entertainment to Food for the rest of May."
            );
          }, 1200);
        },
      },
      {
        at: 32_000,
        label: "Budget view flags categories crossing 80% — before you overspend.",
        run: () => {
          setAdvisorDrawerOpen(false);
          router.push("/budget");
          window.setTimeout(() => {
            toast(
              "Food budget at 92% — AED 340 remaining this month",
              "error"
            );
          }, 600);
        },
      },
      {
        at: 48_000,
        label: "Boost savings goals in one tap — round-ups and manual top-ups.",
        run: () => {
          router.push("/savings");
          if (bali) {
            window.setTimeout(() => boostGoal(bali.id, 200), 800);
          }
        },
      },
      {
        at: 62_000,
        label: "Signature Digs surface personalized insights with one-click actions.",
        run: () => router.push("/insights"),
      },
      {
        at: 76_000,
        label: "Navi — money that thinks for you. Built for individuals & SMEs in the Gulf.",
        run: () => router.push("/dashboard"),
      },
      {
        at: 88_000,
        label: "Demo complete — explore freely or visit /demo to replay.",
        run: () => {
          sessionStorage.removeItem(PITCH_FLAG);
          setActive(false);
        },
      },
    ];
  }, [
    router,
    setAdvisorDrawerOpen,
    addMessage,
    setLoading,
    toast,
    boostGoal,
    savingsGoals,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(PITCH_FLAG) !== "1") return;
    setActive(true);
    startRef.current = performance.now();
    resetDemoData({ skipTour: true });
  }, []);

  useEffect(() => {
    if (!active) return;

    const steps = buildSteps();

    const tick = (now: number) => {
      if (!paused) {
        const elapsedMs =
          now - startRef.current - pauseAccumRef.current;
        setElapsed(Math.min(elapsedMs, TOTAL_MS));

        for (const step of steps) {
          if (elapsedMs >= step.at && !firedRef.current.has(step.at)) {
            firedRef.current.add(step.at);
            setCaption(step.label);
            step.run();
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, paused, buildSteps]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      setPaused((p) => {
        if (!p) {
          pausedAtRef.current = performance.now();
          return true;
        }
        pauseAccumRef.current += performance.now() - pausedAtRef.current;
        return false;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  if (!active) return null;

  const progress = (elapsed / TOTAL_MS) * 100;

  return (
    <AnimatePresence>
      <motion.div
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[250] flex justify-center px-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="pointer-events-auto w-full max-w-lg rounded-2xl border border-accent/25 bg-surface/95 p-4 shadow-[0_0_48px_-8px_rgba(0,224,184,0.35)] backdrop-blur-xl">
          <motion.div
            className="mb-2 flex items-center gap-2"
            key={caption}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Sparkles className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            <p className="text-sm font-medium text-text-high">{caption}</p>
          </motion.div>
          <motion.div
            className="h-1 overflow-hidden rounded-full bg-white/10"
            aria-hidden
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-secondary"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-text-mid">
            <span className="flex items-center gap-1.5">
              {paused ? (
                <Pause className="h-3 w-3 text-amber-400" aria-hidden />
              ) : (
                <Play className="h-3 w-3 text-accent" aria-hidden />
              )}
              <span className={cn(paused && "text-amber-300")}>
                {paused ? "Paused" : "Playing"} · Press SPACE
              </span>
            </span>
            <span className="font-mono tabular-nums">
              {Math.ceil((TOTAL_MS - elapsed) / 1000)}s left
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function activatePitchMode() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(PITCH_FLAG, "1");
  }
}
