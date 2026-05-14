"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionWrapper, fadeUp, staggerContainer } from "@/components/landing/motion";

const steps = [
  { num: "01", title: "Connect", desc: "Link your UAE bank accounts securely in under 2 minutes." },
  { num: "02", title: "Navi learns", desc: "AI maps your income, habits, and goals — no manual tagging." },
  { num: "03", title: "Get a plan", desc: "Personalised budgets, savings targets, and action items." },
  { num: "04", title: "Navi acts", desc: "Negotiates bills, moves money, and keeps you on track." },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "100%"]);

  return (
    <SectionWrapper className="py-32">
      <div ref={ref} className="mx-auto max-w-7xl px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">How it works</p>
          <h2 className="font-display text-4xl text-text-high sm:text-5xl">Four steps to financial clarity</h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-white/10 md:block">
            <motion.div className="h-full bg-gradient-to-r from-accent to-accent-secondary" style={{ width: lineWidth }} />
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid gap-12 md:grid-cols-4"
          >
            {steps.map((step) => (
              <motion.div key={step.num} variants={fadeUp} className="relative text-center md:text-left">
                <span className="font-display text-5xl text-accent/30">{step.num}</span>
                <h3 className="mt-4 text-xl font-semibold text-text-high">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-mid">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
