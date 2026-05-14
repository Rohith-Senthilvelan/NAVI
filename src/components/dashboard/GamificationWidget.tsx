"use client";

import { BRAND_AMBER } from "@/lib/chart-palette";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Flame, Gift } from "lucide-react";

const STREAK_DAYS = 12;
const NEXT_MILESTONE = { days: 14, reward: "AED 25 boost credit" };

export function GamificationWidget({ className }: { className?: string }) {
  const progress = (STREAK_DAYS / NEXT_MILESTONE.days) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.45 }}
      className={cn(
        "flex flex-wrap items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 backdrop-blur-xl",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
          <Flame className="h-5 w-5" style={{ color: BRAND_AMBER }} />
        </div>
        <motion.div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-text-mid">
            Streak
          </p>
          <p className="font-mono text-xl font-bold leading-tight text-text-high">
            {STREAK_DAYS}
            <span className="ml-1 text-sm font-medium text-text-mid">days</span>
          </p>
        </motion.div>
      </div>

      <div className="min-w-[140px] flex-1">
        <div className="mb-1 flex items-center justify-between text-[10px] text-text-mid">
          <span className="inline-flex items-center gap-1">
            <Gift className="h-3 w-3" />
            {NEXT_MILESTONE.days - STREAK_DAYS}d to milestone
          </span>
          <span className="font-mono">
            {STREAK_DAYS}/{NEXT_MILESTONE.days}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-gold to-[#FF8E3C]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <div className="shrink-0 rounded-full border border-gold/25 bg-gold/10 px-3 py-1.5 text-right">
        <p className="text-[9px] uppercase tracking-wider text-text-mid">Next reward</p>
        <p className="text-xs font-semibold text-gold">{NEXT_MILESTONE.reward}</p>
      </div>
    </motion.div>
  );
}
