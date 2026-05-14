"use client";

import { cn, formatAED } from "@/lib/utils";
import { motion } from "framer-motion";
import { Flame, Gift } from "lucide-react";

const STREAK_DAYS = 12;
const NEXT_MILESTONE = { days: 14, reward: "AED 25 boost credit" };

export function GamificationWidget({ className }: { className?: string }) {
  const progress = (STREAK_DAYS / NEXT_MILESTONE.days) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-accent/[0.06] p-5 backdrop-blur-xl",
        className
      )}
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />
      <motion.div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-text-mid">
            Streak
          </p>
          <div className="mt-1 flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-400" />
            <span className="font-mono text-2xl font-semibold text-text-high">
              {STREAK_DAYS}
            </span>
            <span className="text-sm text-text-mid">days</span>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-right">
          <p className="text-[10px] text-text-mid">Next reward</p>
          <p className="text-xs font-medium text-accent">{NEXT_MILESTONE.reward}</p>
        </div>
      </motion.div>
      <div className="relative mt-4">
        <motion.div className="mb-1.5 flex items-center justify-between text-[11px] text-text-mid">
          <span className="inline-flex items-center gap-1">
            <Gift className="h-3 w-3" />
            {NEXT_MILESTONE.days - STREAK_DAYS} days to milestone
          </span>
          <span>{STREAK_DAYS}/{NEXT_MILESTONE.days}</span>
        </motion.div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <p className="mt-2 text-[11px] text-text-mid">
          Keep logging in daily — Navi adds {formatAED(25)} to your next boost.
        </p>
      </div>
    </motion.div>
  );
}
