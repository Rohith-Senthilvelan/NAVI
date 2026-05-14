"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SectionWrapper, fadeUp, staggerContainer } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[200px] overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-primary shadow-[0_24px_64px_-12px_rgba(110,86,255,0.2)]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
        <span className="text-[9px] font-medium text-text-mid">Navi</span>
        <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function BudgetPhone() {
  const bars = [
    { label: "Dining", pct: 92, color: "bg-accent" },
    { label: "Groceries", pct: 64, color: "bg-accent-secondary" },
    { label: "Transport", pct: 38, color: "bg-cyan" },
  ];
  return (
    <PhoneFrame className="min-h-[220px]">
      <p className="text-[8px] uppercase tracking-wider text-text-low">This week</p>
      <div className="mt-3 space-y-2.5">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="mb-1 flex justify-between text-[8px]">
              <span className="text-text-mid">{b.label}</span>
              <span className="text-text-high">{b.pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div className={cn("h-full rounded-full", b.color)} style={{ width: `${b.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-2 py-1.5 text-[8px] font-medium text-red-300">
        Over budget — Dining +AED 340
      </div>
    </PhoneFrame>
  );
}

function RoundUpPhone() {
  const txns = [
    { name: "Carrefour", amt: "AED 42.30", chip: "+0.70" },
    { name: "Talabat", amt: "AED 67.15", chip: "+0.85" },
    { name: "ADNOC", amt: "AED 120.00", chip: "+0.00" },
  ];
  return (
    <PhoneFrame className="min-h-[220px]">
      <p className="text-[8px] uppercase tracking-wider text-text-low">Round-ups</p>
      <div className="mt-3 space-y-2">
        {txns.map((t) => (
          <div
            key={t.name}
            className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-1.5"
          >
            <div>
              <p className="text-[9px] font-medium text-text-high">{t.name}</p>
              <p className="text-[8px] text-text-mid">{t.amt}</p>
            </div>
            <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[8px] font-semibold text-accent">
              {t.chip}
            </span>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

function AdvisorPhone() {
  return (
    <PhoneFrame className="min-h-[220px]">
      <div className="space-y-2">
        <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm bg-white/10 px-2 py-1.5 text-[8px] text-text-high">
          Can I afford Bali in August?
        </div>
        <div className="max-w-[90%] rounded-lg rounded-tl-sm border border-accent/20 bg-accent/5 px-2 py-1.5 text-[8px] leading-relaxed text-text-high">
          You&apos;re AED 2,140 flexible. Reroute AED 500/mo and you&apos;re there by Aug 12.
        </div>
        <div className="flex gap-1">
          <span className="rounded-full bg-gradient-button px-2 py-0.5 text-[7px] font-semibold text-white">
            Plan it
          </span>
          <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[7px] text-text-mid">
            Show math
          </span>
        </div>
      </div>
    </PhoneFrame>
  );
}

const TILES = [
  {
    title: "Smart Budgeting",
    desc: "Real-time category tracking with proactive over-budget alerts.",
    href: "#features",
    mock: <BudgetPhone />,
  },
  {
    title: "Round-Up Savings",
    desc: "Spare change from every purchase, routed to your goals automatically.",
    href: "#features",
    mock: <RoundUpPhone />,
  },
  {
    title: "AI Advisor",
    desc: "Ask anything. Navi plans, calculates, and executes on your approval.",
    href: "#advisor",
    mock: <AdvisorPhone />,
  },
];

export function ProductShowcase() {
  return (
    <SectionWrapper id="product" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <motion.h2 variants={fadeUp} className="type-h2">
            Built like a private bank. Acts like a friend.
          </motion.h2>
          <motion.p variants={fadeUp} className="type-body-lg mt-5">
            Pioneering AI-driven fintech for the UAE — dense, premium, and always on your side.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {TILES.map((tile) => (
            <motion.article
              key={tile.title}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="card-glass-hero flex flex-col p-7 transition-[box-shadow,border-color] duration-400 hover:border-accent/35 hover:shadow-[0_32px_80px_-16px_rgba(110,86,255,0.35)]"
            >
              <div className="mb-8 flex flex-1 items-end justify-center pt-2">
                {tile.mock}
              </div>
              <h3 className="text-3xl font-semibold tracking-tight text-text-high">
                {tile.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-mid">{tile.desc}</p>
              <Link
                href={tile.href}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-secondary"
              >
                Explore
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
