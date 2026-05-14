"use client";

import { Play, Shield, Sparkles, MapPin, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { fadeUp, staggerContainer } from "@/components/landing/motion";
import { formatAED } from "@/lib/format";
import { cn } from "@/lib/utils";

const trustBadges = [
  { icon: MapPin, label: "AED-native" },
  { icon: Shield, label: "Bank-grade encryption" },
  { icon: Sparkles, label: "Built in UAE" },
  { icon: Brain, label: "Backed by AI" },
];

const BLOB_MORPH = [
  {
    animate: {
      width: ["20rem", "24rem", "18rem", "20rem"],
      height: ["20rem", "17rem", "22rem", "20rem"],
      borderRadius: ["50%", "42% 58% 48% 52%", "58% 42% 55% 45%", "50%"],
    },
    className: "left-[8%] top-[18%] bg-[#6E56FF]/25 blur-[100px]",
    delay: 0,
  },
  {
    animate: {
      width: ["24rem", "20rem", "26rem", "24rem"],
      height: ["24rem", "26rem", "20rem", "24rem"],
      borderRadius: ["50%", "55% 45% 50% 50%", "45% 55% 48% 52%", "50%"],
    },
    className: "left-[65%] top-[8%] bg-[#4F46FF]/20 blur-[120px]",
    delay: 10,
  },
  {
    animate: {
      width: ["18rem", "22rem", "16rem", "18rem"],
      height: ["18rem", "15rem", "20rem", "18rem"],
      borderRadius: ["50%", "48% 52% 42% 58%", "52% 48% 55% 45%", "50%"],
    },
    className: "left-[45%] top-[55%] bg-[#9B7BFF]/15 blur-[90px]",
    delay: 20,
  },
];

function PhoneMockup() {
  return (
    <motion.div className="relative mx-auto w-[280px] animate-float sm:w-[320px]">
      {/* Mobile: faded stack behind */}
      <div className="pointer-events-none absolute inset-0 sm:hidden">
        <div className="absolute left-1/2 top-4 w-[240px] -translate-x-1/2 scale-90 rounded-[2rem] border border-white/[0.04] bg-primary/40 opacity-30 blur-[1px]" />
        <div className="absolute left-1/2 top-8 w-[250px] -translate-x-1/2 scale-95 rounded-[2rem] border border-white/[0.05] bg-primary/50 opacity-50" />
      </div>

      <div className="relative rounded-[2.5rem] border border-white/[0.06] bg-[#0B0D1F]/80 p-3 shadow-card-hover backdrop-blur-2xl">
        <div className="overflow-hidden rounded-[2rem] border border-white/[0.06] bg-primary">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
            <span className="text-xs font-medium text-text-high">Navi</span>
            <span className="flex items-center gap-1.5 rounded-full bg-cyan/15 px-2 py-0.5 text-[10px] text-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
              Live
            </span>
          </div>
          <div className="space-y-4 p-5">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-mid">
                Monthly spend
              </p>
              <p className="font-mono text-2xl font-semibold tabular-nums text-text-high">
                {formatAED(8420)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0" aria-hidden>
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="#6E56FF" strokeWidth="10" strokeDasharray="140 60" strokeLinecap="round" transform="rotate(-90 40 40)" />
              </svg>
              <div className="flex-1 space-y-2">
                {[
                  { label: "Housing", pct: 72, color: "bg-accent" },
                  { label: "Dining", pct: 45, color: "bg-accent-secondary" },
                  { label: "Savings", pct: 88, color: "bg-gold" },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="mb-1 flex justify-between text-[10px]">
                      <span className="text-text-mid">{bar.label}</span>
                      <span className="tabular-nums text-text-high">{bar.pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className={cn("h-full rounded-full", bar.color)} style={{ width: `${bar.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-3">
              <p className="text-xs leading-relaxed text-text-high">
                You can save {formatAED(220)} by pausing unused subs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-28 sm:pt-32">
      <div className="absolute inset-0 bg-gradient-hero" />
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
        aria-hidden
      />
      <div className="hero-dot-grid pointer-events-none absolute inset-0 z-0" aria-hidden />

      {BLOB_MORPH.map((blob, i) => (
        <motion.div
          key={i}
          aria-hidden
          className={cn("pointer-events-none absolute z-0", blob.className)}
          animate={blob.animate}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: blob.delay,
          }}
        />
      ))}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto grid max-w-7xl items-center gap-6 px-6 pb-20 lg:grid-cols-2 lg:gap-6"
      >
        <div>
          <motion.div variants={fadeUp} className="type-eyebrow mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-glass px-4 py-1.5 backdrop-blur-2xl">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Meet Navi — AI Financial Coach for the UAE
          </motion.div>
          <motion.h1 variants={fadeUp} className="type-h1">
            Money that{" "}
            <span className="bg-gradient-to-r from-[#6E56FF] to-[#9B7BFF] bg-clip-text text-transparent">
              thinks
            </span>{" "}
            for you.
          </motion.h1>
          <motion.p variants={fadeUp} className="type-body-lg mt-6 max-w-xl">
            Navi is not another tracker. It&apos;s the financial advisor that plans, negotiates, and acts — built for students, professionals, and founders.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
            <MagneticButton href="/login">
              <span className="btn-primary">Try Navi free</span>
            </MagneticButton>
            <a href="/demo" className="btn-secondary group gap-2 link-grow" data-cursor-hover>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-accent/20">
                <Play className="h-3.5 w-3.5 fill-text-high text-text-high" />
              </span>
              Watch the 90-sec demo
            </a>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-glass px-3 py-1.5 text-xs text-text-mid backdrop-blur-2xl">
                <Icon className="h-3.5 w-3.5 text-accent" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div variants={fadeUp} className="relative lg:pl-8">
          <PhoneMockup />
        </motion.div>
      </motion.div>
    </section>
  );
}
