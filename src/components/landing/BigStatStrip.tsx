"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { SectionWrapper } from "@/components/landing/motion";

const STATS = [
  { value: 1.2, prefix: "AED ", suffix: "M+", label: "Saved by Navi users", decimals: 1 },
  { value: 4.9, prefix: "", suffix: "★", label: "Average rating", decimals: 1 },
  { value: 62, prefix: "", suffix: "%", label: "Lower spending on waste", decimals: 0 },
  { value: 2, prefix: "<", suffix: " min", label: "To set up", decimals: 0 },
];

function AnimatedStat({
  value,
  prefix,
  suffix,
  decimals,
}: {
  value: number;
  prefix: string;
  suffix: string;
  decimals: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const spring = useSpring(0, { stiffness: 120, damping: 20, mass: 0.6 });
  const display = useTransform(spring, (v) => {
    const formatted = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString();
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, spring, value]);

  return (
    <motion.span ref={ref} className="font-extrabold tracking-tight text-text-high">
      {display}
    </motion.span>
  );
}

export function BigStatStrip() {
  return (
    <SectionWrapper className="border-b border-white/[0.06] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-0">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center text-center md:px-8 ${
                i > 0 ? "md:border-l md:border-white/[0.06]" : ""
              }`}
            >
              <div className="text-5xl md:text-6xl">
                <AnimatedStat {...stat} />
              </div>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-text-low">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
