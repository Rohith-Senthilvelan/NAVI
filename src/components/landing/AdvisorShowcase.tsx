"use client";

import { Check } from "lucide-react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { fadeUp, staggerContainer } from "@/components/landing/motion";
import type { Conversation } from "@/components/landing/chat-conversation";
import { formatAED } from "@/lib/format";

const ChatConversation = dynamic(
  () =>
    import("@/components/landing/chat-conversation").then(
      (m) => m.ChatConversation
    ),
  { ssr: false }
);

const CLAIMS = [
  "Answers in plain English — no jargon, no dashboards to decode.",
  "Plans with your real numbers, not generic templates.",
  "Executes only what you approve — you\u2019re always in control.",
];

const CONVERSATIONS: Conversation[] = [
  {
    user: "Can I afford a Bali trip in August?",
    navi: `Based on your last 30 days, you have ${formatAED(2140)} in flexible spend. A 4-day Bali trip averages ${formatAED(3800)}. If you reroute ${formatAED(500, { suffix: "/mo" })} from Shopping and pause 2 unused subs (${formatAED(220)}), you'll have it by Aug 12. Want me to lock it in?`,
    primaryCta: "Yes, plan it",
    secondaryCta: "Show me the math",
    secondaryHref: "/demo",
  },
  {
    user: "Which subscriptions should I pause this month?",
    navi: `Netflix hasn't been opened in 47 days (${formatAED(39, { suffix: "/mo" })}). Adobe CC and Canva overlap — pausing both frees ${formatAED(275, { suffix: "/mo" })} without touching essentials. I can draft cancel emails you approve before sending.`,
    primaryCta: "Review subs",
    secondaryCta: "Draft emails",
    secondaryHref: "/subscriptions",
  },
];

export function AdvisorShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveIndex(v >= 0.5 ? 1 : 0);
  });

  return (
    <section ref={containerRef} id="advisor" className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen items-center py-24 md:py-32">
        <motion.div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-6 md:grid-cols-2 md:gap-6 md:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p variants={fadeUp} className="type-eyebrow mb-4">
              AI Advisor
            </motion.p>
            <motion.h2 variants={fadeUp} className="type-h2">
              Talk to Navi the way you&apos;d talk to your accountant.
            </motion.h2>
            <motion.ul variants={staggerContainer} className="mt-8 space-y-4">
              {CLAIMS.map((claim) => (
                <motion.li
                  key={claim}
                  variants={fadeUp}
                  className="flex items-start gap-3 text-sm leading-relaxed text-text-mid"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15">
                    <Check className="h-3 w-3 text-accent" />
                  </span>
                  {claim}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <div className="relative h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <ChatConversation
                  conversation={CONVERSATIONS[activeIndex]}
                  play
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
