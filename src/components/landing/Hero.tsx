"use client";

import { Play, Shield, Sparkles, MapPin, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { fadeUp, staggerContainer } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

const trustBadges = [
  { icon: MapPin, label: "AED-native" },
  { icon: Shield, label: "Bank-grade encryption" },
  { icon: Sparkles, label: "Built in UAE" },
  { icon: Brain, label: "Backed by AI" },
];

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] animate-float sm:w-[320px]">
      <div className="rounded-[2.5rem] border border-white/15 bg-white/[0.06] p-3 shadow-2xl shadow-accent/10">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-primary">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <span className="text-xs font-medium text-text-high">Navi</span>
            <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] text-accent">
              Live
            </span>
          </div>
          <div className="space-y-4 p-5">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-mid">
                Monthly spend
              </p>
              <p className="font-mono text-2xl font-semibold text-text-high">
                AED 8,420
              </p>
            </div>
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0" aria-hidden>
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                <circle
                  cx="40" cy="40" r="32" fill="none" stroke="#00E0B8" strokeWidth="10"
                  strokeDasharray="140 60" strokeLinecap="round" transform="rotate(-90 40 40)"
                />
                <circle cx="40" cy="40" r="32" fill="none" stroke="#5BFFCC" strokeWidth="10" strokeDasharray="50 150" strokeLinecap="round" transform="rotate(30 40 40)" opacity="0.7" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="#D4AF37" strokeWidth="10" strokeDasharray="30 170" strokeLinecap="round" transform="rotate(120 40 40)" opacity="0.6" />
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
                      <span className="text-text-high">{bar.pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={cn("h-full rounded-full", bar.color)}
                        style={{ width: `${bar.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-3">
              <div className="mb-1 flex items-center gap-1.5">
                <div className="h-4 w-4 rounded-full bg-accent/30" />
                <span className="text-[10px] font-medium text-accent">Navi</span>
              </div>
              <p className="text-xs leading-relaxed text-text-high">
                You can save AED 220 by pausing unused subs.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute -right-6 -top-4 h-24 w-24 rounded-full bg-accent/15"
        aria-hidden
      />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-32">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div
        className="pointer-events-none absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-accent/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-[70%] top-[10%] h-96 w-96 rounded-full bg-accent-secondary/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-[50%] top-[60%] h-80 w-80 rounded-full bg-gold/10"
        aria-hidden
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 lg:grid-cols-2 lg:gap-8"
      >
        <div>
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-text-mid">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Meet Navi — AI Financial Coach for the UAE
          </motion.div>
          <motion.h1 variants={fadeUp} className="font-display text-5xl leading-[1.05] tracking-tight text-text-high sm:text-7xl lg:text-[5.5rem]">
            Money that <em className="italic text-accent">thinks</em> for you.
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-text-mid">
            Navi is not another tracker. It&apos;s the financial advisor that plans, negotiates, and acts — built for students, professionals, and founders.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
            <MagneticButton href="/login">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-accent via-accent-secondary to-white px-7 py-3.5 text-sm font-semibold text-primary shadow-xl shadow-accent/25">
                Try Navi free
              </span>
            </MagneticButton>
            <a
              href="/demo"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3.5 text-sm text-text-high transition-colors hover:border-white/20 hover:bg-white/5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-accent/20">
                <Play className="h-3.5 w-3.5 fill-text-high text-text-high" />
              </span>
              Watch the 60-sec demo
            </a>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-text-mid">
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
