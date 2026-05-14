"use client";

import { useUserStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const STEPS = [
  {
    id: "sidebar",
    target: '[data-tour="sidebar"]',
    title: "Your command center",
    body: "Jump between budget, savings, insights, and your AI coach from one sidebar.",
    route: "/dashboard",
  },
  {
    id: "kpis",
    target: '[data-tour="dashboard-kpis"]',
    title: "Live financial KPIs",
    body: "Balance, spend, savings, and round-ups update in real time across accounts.",
    route: "/dashboard",
  },
  {
    id: "fab",
    target: '[data-tour="ask-navi-fab"]',
    title: "Ask Navi anytime",
    body: "Tap the FAB or top-bar button to open your AI financial coach in one click.",
    route: "/dashboard",
  },
  {
    id: "insights",
    target: '[data-tour="insights-feed"]',
    title: "Signature Digs feed",
    body: "Navi surfaces personalized insights — overspend alerts, savings wins, and quick actions.",
    route: "/insights",
  },
] as const;

function getRect(selector: string) {
  const el = document.querySelector(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

export function OnboardingTour() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOnboarded, setOnboarded } = useUserStore();
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<ReturnType<typeof getRect>>(null);
  const [ready, setReady] = useState(false);

  const step = STEPS[stepIndex];
  const active = !isOnboarded;

  const updateSpotlight = useCallback(() => {
    if (!active || !step) return;
    setSpotlight(getRect(step.target));
  }, [active, step]);

  useEffect(() => {
    if (!active) return;
    if (pathname !== step.route) {
      router.push(step.route);
      return;
    }
    const t = window.setTimeout(() => {
      setReady(true);
      updateSpotlight();
    }, 400);
    return () => window.clearTimeout(t);
  }, [active, pathname, step, router, updateSpotlight]);

  useEffect(() => {
    if (!active || !ready) return;
    updateSpotlight();
    window.addEventListener("resize", updateSpotlight);
    window.addEventListener("scroll", updateSpotlight, true);
    return () => {
      window.removeEventListener("resize", updateSpotlight);
      window.removeEventListener("scroll", updateSpotlight, true);
    };
  }, [active, ready, stepIndex, updateSpotlight]);

  const finish = () => {
    setOnboarded(true);
    setReady(false);
  };

  const next = () => {
    if (stepIndex >= STEPS.length - 1) {
      finish();
      return;
    }
    setReady(false);
    setStepIndex((i) => i + 1);
  };

  if (!active || !ready || !spotlight) return null;

  const pad = 8;
  const hole = {
    top: spotlight.top - pad,
    left: spotlight.left - pad,
    width: spotlight.width + pad * 2,
    height: spotlight.height + pad * 2,
  };

  const tooltipTop = hole.top + hole.height + 16;
  const tooltipLeft = Math.min(
    Math.max(hole.left, 16),
    window.innerWidth - 340
  );

  return (
    <AnimatePresence>
      <motion.div
        key="tour-overlay"
        className="fixed inset-0 z-[200]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label="Product tour"
      >
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <mask id="tour-spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={hole.left}
                y={hole.top}
                width={hole.width}
                height={hole.height}
                rx={12}
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.72)"
            mask="url(#tour-spotlight-mask)"
          />
        </svg>

        <motion.div
          className="pointer-events-none absolute rounded-xl ring-2 ring-accent ring-offset-2 ring-offset-primary"
          style={{
            top: hole.top,
            left: hole.left,
            width: hole.width,
            height: hole.height,
          }}
          layoutId="tour-ring"
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        />

        <motion.div
          className="absolute w-[min(320px,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-surface/95 p-5 shadow-2xl backdrop-blur-xl"
          style={{ top: tooltipTop, left: tooltipLeft }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          key={step.id}
        >
          <motion.div
            className="mb-3 flex items-center justify-between gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-[11px] font-medium uppercase tracking-widest text-accent/80">
              Step {stepIndex + 1} of {STEPS.length}
            </span>
            <button
              type="button"
              onClick={finish}
              className="rounded-lg p-1 text-text-mid transition-colors hover:bg-white/10 hover:text-text-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Skip tour"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
          <h3 className="text-base font-semibold text-text-high">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-mid">{step.body}</p>
          <motion.div className="mt-4 flex items-center gap-2">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i <= stepIndex ? "bg-accent" : "bg-white/10"
                )}
              />
            ))}
          </motion.div>
          <button
            type="button"
            onClick={next}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            aria-label={
              stepIndex >= STEPS.length - 1 ? "Finish tour" : "Next tour step"
            }
          >
            {stepIndex >= STEPS.length - 1 ? "Get started" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
