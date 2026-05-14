"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { SectionWrapper, fadeUp, staggerContainer } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "AED 0",
    tagline: "For students & beginners",
    features: [
      "Basic budgeting",
      "Transaction tracking",
      "3 savings goals",
      "Monthly insights",
      "Round-ups",
      "Email support",
    ],
    cta: "Get started",
    variant: "secondary" as const,
    featured: false,
    gold: false,
  },
  {
    name: "Plus",
    price: "AED 29",
    tagline: "For pros who want more",
    features: [
      "Everything in Free",
      "AI Advisor chat",
      "Bill Negotiator",
      "Smart alerts",
      "Unlimited goals",
      "Investment Coach",
    ],
    cta: "Start Plus",
    variant: "primary" as const,
    featured: true,
    gold: false,
  },
  {
    name: "Business Advisor",
    price: "AED 99",
    tagline: "For founders & SMEs",
    features: [
      "Everything in Plus",
      "Cash flow forecasts",
      "Runway analysis",
      "Team subscriptions",
      "Payroll insights",
      "Dedicated coach",
    ],
    cta: "Go Business",
    variant: "premium" as const,
    featured: false,
    gold: true,
  },
];

export function Pricing() {
  return (
    <SectionWrapper id="pricing" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-14 text-center"
        >
          <p className="type-eyebrow mb-3">Pricing</p>
          <h2 className="type-h2">Simple plans. Serious value.</h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid items-stretch gap-6 md:grid-cols-3"
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={cn(
                "relative flex flex-col rounded-3xl border border-white/[0.06] bg-[#0B0D1F]/80 p-8 backdrop-blur-2xl",
                plan.featured &&
                  "z-10 scale-[1.04] border-accent/40 shadow-[0_0_0_1px_rgba(110,86,255,0.35),0_32px_80px_-16px_rgba(110,86,255,0.4)]",
                plan.gold && "border-gold/40 bg-gradient-to-b from-gold/[0.06] to-transparent"
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-button px-4 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}

              <h3 className="text-2xl font-semibold text-text-high">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-6xl font-extrabold tracking-tight text-text-high">
                  {plan.price}
                </span>
                {plan.price !== "AED 0" && (
                  <span className="text-sm text-text-low">/mo</span>
                )}
              </div>
              <p className="mt-2 text-sm text-text-mid">{plan.tagline}</p>

              <div className="my-8 h-px bg-white/[0.06]" />

              <ul className="flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-text-mid">
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        plan.gold ? "text-gold" : "text-accent"
                      )}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <MagneticButton href="/login">
                  <span
                    className={cn(
                      "inline-flex w-full items-center justify-center",
                      plan.variant === "primary" && "btn-primary",
                      plan.variant === "secondary" && "btn-secondary",
                      plan.variant === "premium" && "btn-premium"
                    )}
                  >
                    {plan.cta}
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
