"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper, fadeUp, staggerContainer } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Is Navi available outside the UAE?",
    a: "Navi is built for the UAE market first — AED-native, with local bank integrations and regulatory compliance. Expansion to GCC markets is on our roadmap.",
  },
  {
    q: "How does Navi connect to my bank?",
    a: "We use bank-grade open banking APIs with read-only access by default. Your credentials never touch our servers — authentication happens directly with your bank.",
  },
  {
    q: "What makes Navi different from budgeting apps?",
    a: "Most apps show you what happened. Navi tells you what to do next — and can act on your behalf, from pausing subscriptions to reallocating savings.",
  },
  {
    q: "Is my financial data secure?",
    a: "Yes. We use AES-256 encryption at rest, TLS 1.3 in transit, and never sell your data. Navi is designed to meet UAE data protection standards.",
  },
  {
    q: "Can I use Navi for my business?",
    a: "Absolutely. Business Advisor mode (AED 99/mo) adds cash flow forecasting, payroll insights, and team subscription management for SMEs.",
  },
  {
    q: "How does the AI advisor work?",
    a: "Navi's AI analyses your real transaction data to give personalised advice. It can answer questions, create plans, and execute actions you approve — never without your consent.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SectionWrapper className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-12 text-center"
        >
          <p className="type-eyebrow mb-3">FAQ</p>
          <h2 className="type-h2">Questions? We&apos;ve got answers.</h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="space-y-3"
        >
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <motion.div key={faq.q} variants={fadeUp} className="card-glass overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-medium text-text-high">{faq.q}</span>
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-lg text-text-mid transition-transform duration-200",
                      isOpen && "rotate-45 border-accent/30 text-accent"
                    )}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-white/[0.06] px-6 pb-5 pt-3 text-sm leading-relaxed text-text-mid">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
