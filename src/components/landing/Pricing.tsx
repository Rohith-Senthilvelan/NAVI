"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { SectionWrapper, fadeUp, staggerContainer } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    price: "AED 0",
    period: "forever",
    features: ["Basic budgeting", "Transaction tracking", "3 savings goals", "Monthly insights"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Plus",
    price: "AED 29",
    period: "/mo",
    features: ["Everything in Free", "AI Advisor chat", "Bill negotiator", "Smart alerts", "Unlimited goals"],
    cta: "Start Plus",
    highlight: true,
  },
  {
    name: "Business Advisor",
    price: "AED 99",
    period: "/mo",
    features: ["Everything in Plus", "SME cash flow", "Payroll insights", "Team subscriptions", "Priority support"],
    cta: "Go Business",
    highlight: false,
    gold: true,
    badge: "Most premium",
  },
];

export function Pricing() {
  return (
    <SectionWrapper id="pricing" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">Pricing</p>
          <h2 className="font-display text-4xl text-text-high sm:text-5xl">Simple plans. Serious value.</h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className={cn(
                "relative rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md transition-shadow hover:shadow-xl",
                tier.highlight && "border-accent/30 shadow-lg shadow-accent/10",
                tier.gold && "border-gold/40 bg-gradient-to-b from-gold/5 to-transparent hover:shadow-gold/10"
              )}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold to-amber-300 px-4 py-1 text-xs font-semibold text-primary">
                  {tier.badge}
                </span>
              )}
              <h3 className="text-lg font-semibold text-text-high">{tier.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl text-text-high">{tier.price}</span>
                <span className="text-text-mid">{tier.period}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-mid">
                    <Check className="h-4 w-4 shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <MagneticButton href="/login">
                  <span
                    className={cn(
                      "inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all",
                      tier.gold
                        ? "bg-gradient-to-r from-gold to-amber-300 text-primary"
                        : tier.highlight
                          ? "bg-gradient-to-r from-accent to-accent-secondary text-primary"
                          : "border border-white/10 text-text-high hover:bg-white/5"
                    )}
                  >
                    {tier.cta}
                  </span>
                </MagneticButton>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
