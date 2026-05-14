"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionWrapper, fadeUp, staggerContainer } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

const faqs = [
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
    <SectionWrapper className="py-32">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-12 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">FAQ</p>
          <h2 className="font-display text-4xl text-text-high">Questions? We&apos;ve got answers.</h2>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={faq.q} variants={fadeUp} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="pr-4 font-medium text-text-high">{faq.q}</span>
                <ChevronDown className={cn("h-5 w-5 shrink-0 text-text-mid transition-transform", open === i && "rotate-180")} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="border-t border-white/10 px-6 pb-5 pt-3 text-sm leading-relaxed text-text-mid">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
