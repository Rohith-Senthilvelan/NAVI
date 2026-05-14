"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper, fadeUp, staggerContainer } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

function BentoTile({
  className,
  title,
  description,
  children,
  gold,
}: {
  className?: string;
  title: string;
  description: string;
  children: React.ReactNode;
  gold?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0B0D1F]/80 p-6 backdrop-blur-2xl transition-shadow hover:shadow-card-hover",
        gold && "border-gold/40 shadow-gold/5",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      {gold && (
        <Badge variant="gold" className="mb-3">
          PRO
        </Badge>
      )}
      <h3 className="text-lg font-semibold text-text-high">{title}</h3>
      <p className="mt-1 text-sm text-text-mid">{description}</p>
      <div className="mt-6">{children}</div>
    </motion.div>
  );
}

function BudgetIllustration() {
  const [filled, setFilled] = useState(false);
  return (
    <div
      onMouseEnter={() => setFilled(true)}
      className="space-y-3"
    >
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: "30%" }}
          animate={{ width: filled ? "85%" : "30%" }}
          transition={{ duration: 0.8 }}
        />
      </div>
      {filled && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center rounded-full bg-amber-400/15 px-2.5 py-1 text-xs text-amber-400"
        >
          ⚠ Dining 85% — alert sent
        </motion.span>
      )}
    </div>
  );
}

function CoinJarIllustration() {
  return (
    <div className="relative flex h-28 items-end justify-center">
      <svg viewBox="0 0 100 80" className="h-24 w-24">
        <path d="M25 35 Q25 20 50 20 Q75 20 75 35 L75 65 Q75 75 50 75 Q25 75 25 65 Z" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        <path d="M30 40 L70 40" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        <circle cx="50" cy="55" r="8" fill="#F5C453" opacity="0.6" />
      </svg>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute h-3 w-3 rounded-full bg-gold"
          style={{
            left: `${42 + i * 4}%`,
            animation: `coin-drop 2s ease-in ${i * 0.6}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function PieIllustration() {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="mx-auto h-28 w-28"
      whileHover={{ rotate: 30 }}
      transition={{ duration: 0.6 }}
    >
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#6E56FF" strokeWidth="12" strokeDasharray="100 151" strokeLinecap="round" transform="rotate(-90 50 50)" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#9B7BFF" strokeWidth="12" strokeDasharray="60 191" strokeLinecap="round" transform="rotate(30 50 50)" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#F5C453" strokeWidth="12" strokeDasharray="40 211" strokeLinecap="round" transform="rotate(100 50 50)" />
    </motion.svg>
  );
}

function FlipCardIllustration() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="perspective-[600px] h-28 cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-xl border border-white/10 bg-surface p-3" style={{ backfaceVisibility: "hidden" }}>
          <p className="text-[10px] text-text-mid">To: DEWA</p>
          <p className="mt-1 text-xs text-text-high">Requesting 15% loyalty discount…</p>
        </div>
        <div className="absolute inset-0 rounded-xl border border-accent/30 bg-accent/10 p-3" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <p className="text-[10px] text-accent">Approved ✓</p>
          <p className="mt-1 text-xs text-text-high">Saved AED 72 on your bill</p>
        </div>
      </motion.div>
    </div>
  );
}

function RiskPillsIllustration() {
  const [active, setActive] = useState<string | null>(null);
  const pills = ["Conservative", "Balanced", "Aggressive"];
  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((p) => (
        <button
          key={p}
          type="button"
          onMouseEnter={() => setActive(p)}
          onMouseLeave={() => setActive(null)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs transition-all",
            active === p
              ? "border-accent bg-accent/20 text-accent"
              : "border-white/10 text-text-mid"
          )}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

function BusinessIllustration() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#F5C453" strokeWidth="1.5">
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-text-high">SaaS Stack Audit</p>
        <p className="text-xs text-text-mid">3 unused seats found</p>
        <Badge variant="gold" className="mt-1 text-[10px]">
          Subscription
        </Badge>
      </div>
    </div>
  );
}

export function BentoGrid() {
  return (
    <SectionWrapper id="features" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-2xl">
          <p className="type-eyebrow mb-4">Features</p>
          <h2 className="type-h2">
            Everything your money needs. Nothing it doesn&apos;t.
          </h2>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-3"
        >
          <BentoTile className="md:col-span-2 md:row-span-2" title="Smart Budgeting & Alerts" description="Real-time spend tracking with proactive warnings.">
            <BudgetIllustration />
          </BentoTile>
          <BentoTile title="Round-Up Savings" description="Spare change, serious goals.">
            <CoinJarIllustration />
          </BentoTile>
          <BentoTile title="Signature Digs" description="Insights that actually mean something.">
            <PieIllustration />
          </BentoTile>
          <BentoTile className="md:col-span-2" title="Bill Negotiator" description="Navi drafts and sends on your behalf.">
            <FlipCardIllustration />
          </BentoTile>
          <BentoTile title="AI Investment Coach" description="Risk-aware guidance in plain English.">
            <RiskPillsIllustration />
          </BentoTile>
          <BentoTile className="md:col-span-2" gold title="Business Advisor Mode" description="Cash flow, payroll, and subscription intelligence for SMEs.">
            <BusinessIllustration />
          </BentoTile>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
