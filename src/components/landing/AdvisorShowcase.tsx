"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper, fadeUp, staggerContainer } from "@/components/landing/motion";
import { MagneticButton } from "@/components/shared/magnetic-button";

const USER_MSG = "Can I afford a trip to Bali this month?";
const NAVI_MSG =
  "Based on your last 30 days, you have AED 2,140 in flexible spend. A 4-day Bali trip averages AED 3,800. If you shift AED 500 from Shopping and pause your unused subscriptions (AED 220), you'll be there. Want me to lock it in?";

function useTypewriter(text: string, active: boolean, speed = 28) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) return;
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
      } else clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, active, speed]);
  return displayed;
}

export function AdvisorShowcase() {
  const [phase, setPhase] = useState<"user" | "navi" | "done">("user");
  const [started, setStarted] = useState(false);
  const userText = useTypewriter(USER_MSG, started && phase === "user");
  const naviText = useTypewriter(NAVI_MSG, phase === "navi" || phase === "done");

  useEffect(() => {
    if (!started) return;
    if (phase === "user" && userText.length === USER_MSG.length) {
      const t = setTimeout(() => setPhase("navi"), 600);
      return () => clearTimeout(t);
    }
    if (phase === "navi" && naviText.length === NAVI_MSG.length) {
      const t = setTimeout(() => setPhase("done"), 400);
      return () => clearTimeout(t);
    }
  }, [started, phase, userText, naviText]);

  return (
    <SectionWrapper className="py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <motion.p variants={fadeUp} className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
            AI Advisor
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-display text-4xl leading-tight text-text-high sm:text-5xl">
            Talk to Navi like you&apos;d talk to your accountant.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 text-lg text-text-mid">
            No jargon. No dashboards to decode. Just ask — and Navi plans, calculates, and executes.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          onViewportEnter={() => setStarted(true)}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
            <motion.div className="h-3 w-3 rounded-full bg-accent" />
            <span className="text-sm font-medium text-text-high">Navi Advisor</span>
            <span className="ml-auto text-xs text-text-mid">Live</span>
          </div>

          <div className="space-y-4 min-h-[320px]">
            <AnimatePresence>
              {started && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-white/10 px-4 py-3 text-sm text-text-high"
                >
                  {userText}
                  {phase === "user" && userText.length < USER_MSG.length && (
                    <span className="animate-blink text-accent">|</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {(phase === "navi" || phase === "done") && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-[90%] rounded-2xl rounded-tl-sm border border-accent/20 bg-accent/5 px-4 py-3 text-sm leading-relaxed text-text-high"
              >
                {naviText}
                {phase === "navi" && naviText.length < NAVI_MSG.length && (
                  <span className="animate-blink text-accent">|</span>
                )}
              </motion.div>
            )}

            {phase === "done" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <MagneticButton href="/login">
                  <span className="inline-flex rounded-full bg-gradient-to-r from-accent to-accent-secondary px-5 py-2.5 text-sm font-semibold text-primary">
                    Yes, plan it
                  </span>
                </MagneticButton>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
