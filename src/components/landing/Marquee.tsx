"use client";

import React from "react";
import {
  Brain,
  PiggyBank,
  Bell,
  Mail,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "AI Budgeting", icon: Brain },
  { label: "Round-Up Savings", icon: PiggyBank },
  { label: "AED Smart Alerts", icon: Bell },
  { label: "Bill Negotiator", icon: Mail },
  { label: "Investment Coach", icon: TrendingUp },
  { label: "Business Advisor", icon: Briefcase },
];

export function Marquee() {
  const doubled = [...items, ...items];

  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] py-6">
      <div className="group flex">
        <div className="gpu-layer flex min-w-full shrink-0 animate-marquee items-center gap-4 group-hover:[animation-play-state:paused]">
          {doubled.map((item, i) => (
            <MarqueeCard key={`${item.label}-${i}`} {...item} />
          ))}
        </div>
        <div
          aria-hidden
          className="gpu-layer flex min-w-full shrink-0 animate-marquee items-center gap-4 group-hover:[animation-play-state:paused]"
        >
          {doubled.map((item, i) => (
            <MarqueeCard key={`dup-${item.label}-${i}`} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MarqueeCard({
  label,
  icon: Icon,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div
      className={cn(
        "mx-2 flex shrink-0 items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#0B0D1F]/80 px-5 py-3 backdrop-blur-2xl transition-colors hover:border-accent/30 hover:shadow-card-hover"
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
        <Icon className="h-4 w-4 text-accent" />
      </div>
      <span className="whitespace-nowrap text-sm font-medium text-text-high">
        {label}
      </span>
    </div>
  );
}
