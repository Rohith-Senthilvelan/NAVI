"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link2, Brain, ClipboardList, Zap } from "lucide-react";
import { SectionWrapper, fadeUp, staggerContainer } from "@/components/landing/motion";

const STEPS = [
  {
    num: "01",
    title: "Connect",
    desc: "Securely link your bank or upload statements.",
    icon: Link2,
  },
  {
    num: "02",
    title: "Learn",
    desc: "Navi analyzes 90 days of spending in seconds.",
    icon: Brain,
  },
  {
    num: "03",
    title: "Plan",
    desc: "Get a personalized budget + savings plan.",
    icon: ClipboardList,
  },
  {
    num: "04",
    title: "Act",
    desc: "Approve actions. Navi handles the rest.",
    icon: Zap,
  },
];

export function HowItWorks() {
  const lineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(lineRef, { once: true, amount: 0.4 });

  return (
    <SectionWrapper id="how-it-works" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-14 text-center"
        >
          <p className="type-eyebrow mb-3">How it works</p>
          <h2 className="type-h2">Four steps to financial clarity</h2>
        </motion.div>

        <div ref={lineRef} className="relative">
          <div className="absolute left-0 right-0 top-[3.25rem] hidden h-px bg-white/[0.06] md:block">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-accent-secondary"
              initial={{ width: "0%" }}
              animate={{ width: inView ? "100%" : "0%" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 md:grid-cols-4"
          >
            {STEPS.map((step) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                className="card-glass relative p-6 text-center md:text-left"
              >
                <motion.div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 md:mx-0"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <step.icon className="h-5 w-5 text-accent" />
                </motion.div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent/50">
                  {step.num}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-text-high">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-mid">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
