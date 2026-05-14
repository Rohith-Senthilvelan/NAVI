"use client";

import { motion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { SectionWrapper, fadeUp, staggerContainer } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

const DONUT_DATA = [
  { name: "Dining", value: 28, color: "#6E56FF" },
  { name: "Housing", value: 42, color: "#9B7BFF" },
  { name: "Transport", value: 18, color: "#4FD1FF" },
  { name: "Other", value: 12, color: "#F5C453" },
];

function BentoTile({
  className,
  children,
  gold,
}: {
  className?: string;
  children: React.ReactNode;
  gold?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "card-glass-hero flex flex-col p-7 transition-shadow hover:shadow-card-hover",
        gold && "border-gold/40 bg-gradient-to-br from-gold/[0.06] to-transparent",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

function SpendingIntelligence() {
  return (
    <BentoTile className="col-span-6 row-span-2 md:col-span-3">
      <h3 className="text-xl font-semibold text-text-high">Spending Intelligence</h3>
      <div className="mt-4 flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
        <div className="h-36 w-full sm:w-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DONUT_DATA}
                innerRadius={38}
                outerRadius={58}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {DONUT_DATA.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {DONUT_DATA.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-text-mid">
                <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                {d.name}
              </span>
              <span className="font-mono text-text-high">{d.value}%</span>
            </div>
          ))}
          <div className="mt-3 rounded-xl border border-accent/20 bg-accent/5 px-3 py-2 text-xs text-text-high">
            Navi: You spent <strong className="text-accent">18% more</strong> on dining this month.
          </div>
        </div>
      </div>
    </BentoTile>
  );
}

function RoundUpsTile() {
  return (
    <BentoTile className="col-span-6 md:col-span-3">
      <h3 className="text-xl font-semibold text-text-high">Round-Ups</h3>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="relative flex h-24 w-20 items-end justify-center">
          <svg viewBox="0 0 80 96" className="h-24 w-20" aria-hidden>
            <path
              d="M20 40 Q20 24 40 24 Q60 24 60 40 L60 72 Q60 84 40 84 Q20 84 20 72 Z"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="2"
            />
            <ellipse cx="40" cy="68" rx="18" ry="6" fill="rgba(110,86,255,0.2)" />
          </svg>
          <span
            className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-gold animate-coin-drop"
            style={{ animationDelay: "0s" }}
          />
          <span
            className="absolute left-[45%] top-0 h-2.5 w-2.5 rounded-full bg-gold animate-coin-drop"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
        <p className="text-right text-sm text-text-mid">
          <span className="block font-mono text-2xl font-bold text-text-high">AED 87</span>
          auto-saved this month
        </p>
      </div>
    </BentoTile>
  );
}

function BillNegotiatorTile() {
  return (
    <BentoTile className="col-span-6 md:col-span-2">
      <h3 className="text-xl font-semibold text-text-high">Bill Negotiator</h3>
      <div className="mt-4 rounded-xl border border-white/[0.06] bg-primary/60 p-3">
        <p className="text-[10px] uppercase tracking-wider text-text-low">New message</p>
        <p className="mt-1 text-xs font-medium text-text-high">Lower my Etisalat bill</p>
        <p className="mt-2 line-clamp-2 text-[11px] text-text-mid">
          Hi — I&apos;ve been a customer for 3 years. Can you match the current promo rate?
        </p>
        <button
          type="button"
          className="mt-3 w-full rounded-lg bg-gradient-button py-1.5 text-[11px] font-semibold text-white"
        >
          Send
        </button>
      </div>
    </BentoTile>
  );
}

function InvestmentCoachTile() {
  const pills = ["Conservative", "Balanced", "Aggressive"];
  return (
    <BentoTile className="col-span-6 md:col-span-2">
      <h3 className="text-xl font-semibold text-text-high">Investment Coach</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {pills.map((p) => (
          <span
            key={p}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition-all",
              p === "Balanced"
                ? "border-accent bg-accent/20 text-accent shadow-[0_0_20px_rgba(110,86,255,0.35)]"
                : "border-white/[0.08] text-text-mid"
            )}
          >
            {p}
          </span>
        ))}
      </div>
    </BentoTile>
  );
}

function BusinessAdvisorTile() {
  const spark = [12, 18, 15, 22, 28, 24, 32];
  const max = Math.max(...spark);
  const points = spark
    .map((v, i) => `${(i / (spark.length - 1)) * 100},${100 - (v / max) * 80}`)
    .join(" ");
  return (
    <BentoTile className="col-span-6 border-gold/30 md:col-span-2" gold>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-text-high">Business Advisor</h3>
        <span className="rounded-full bg-gradient-premium px-2 py-0.5 text-[10px] font-bold text-primary">
          PRO
        </span>
      </div>
      <p className="mt-1 text-sm font-mono text-gold">AED 99/mo</p>
      <svg viewBox="0 0 100 40" className="mt-4 h-10 w-full" aria-hidden>
        <polyline
          fill="none"
          stroke="#F5C453"
          strokeWidth="2"
          strokeLinecap="round"
          points={points}
        />
      </svg>
    </BentoTile>
  );
}

function InsightsFeedTile() {
  const insights = [
    { severity: "bg-amber-400", text: "Dining 18% over budget", sub: "4 Talabat orders this week" },
    { severity: "bg-accent", text: "Cancel unused Netflix?", sub: "Save AED 39.99/mo" },
    { severity: "bg-cyan", text: "Bali goal on track", sub: "68% funded — Aug 12 ETA" },
  ];
  return (
    <BentoTile className="col-span-6">
      <h3 className="text-xl font-semibold text-text-high">Live Insights Feed</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {insights.map((ins) => (
          <div
            key={ins.text}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <span className={cn("inline-block h-2 w-2 rounded-full", ins.severity)} />
            <p className="mt-2 text-sm font-medium text-text-high">{ins.text}</p>
            <p className="mt-1 text-xs text-text-mid">{ins.sub}</p>
          </div>
        ))}
      </div>
    </BentoTile>
  );
}

export function BentoFeatures() {
  return (
    <SectionWrapper id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-12 max-w-2xl"
        >
          <p className="type-eyebrow mb-3">Platform</p>
          <h2 className="type-h2">Every tool your money needs.</h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="grid auto-rows-[minmax(160px,auto)] grid-cols-6 gap-4"
        >
          <SpendingIntelligence />
          <RoundUpsTile />
          <BillNegotiatorTile />
          <InvestmentCoachTile />
          <BusinessAdvisorTile />
          <InsightsFeedTile />
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
