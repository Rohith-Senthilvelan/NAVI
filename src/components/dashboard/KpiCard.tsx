"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

function Sparkline({
  data,
  color = "#00E0B8",
  className,
}: {
  data: number[];
  color?: string;
  className?: string;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 72;
  const h = 28;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("shrink-0 opacity-80", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <polyline
        fill={`url(#spark-${color.replace("#", "")})`}
        stroke="none"
        points={`0,${h} ${points} ${w},${h}`}
      />
    </svg>
  );
}

function AnimatedValue({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const spring = useSpring(0, { stiffness: 60, damping: 18, mass: 0.8 });
  const display = useTransform(spring, (v) => {
    const formatted = new Intl.NumberFormat("en-AE", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(v);
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export interface KpiCardProps {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  sparklineData?: number[];
  sparklineColor?: string;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  delay?: number;
  className?: string;
}

export function KpiCard({
  label,
  value,
  decimals = 0,
  prefix = "AED ",
  suffix = "",
  sparklineData,
  sparklineColor = "#00E0B8",
  badge,
  footer,
  delay = 0,
  className,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl",
        "transition-shadow duration-300 hover:border-accent/20 hover:shadow-[0_0_40px_-8px_rgba(0,224,184,0.25)]",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 0%), rgba(0,224,184,0.06), transparent 40%)",
        }}
      />

      <motion.div
        className="relative flex flex-col gap-3"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.parentElement?.style.setProperty(
            "--mouse-x",
            `${((e.clientX - rect.left) / rect.width) * 100}%`
          );
          e.currentTarget.parentElement?.style.setProperty(
            "--mouse-y",
            `${((e.clientY - rect.top) / rect.height) * 100}%`
          );
        }}
      >
        <motion.div
          className="flex items-start justify-between gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.1 }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-mid">
            {label}
          </p>
          {badge}
        </motion.div>

        <div className="flex items-end justify-between gap-3">
          <p className="font-mono text-2xl font-semibold tracking-tight text-text-high tabular-nums">
            <AnimatedValue
              value={value}
              decimals={decimals}
              prefix={prefix}
              suffix={suffix}
            />
          </p>
          {sparklineData && sparklineData.length > 1 && (
            <Sparkline data={sparklineData} color={sparklineColor} />
          )}
        </div>

        {footer && (
          <div className="border-t border-white/[0.06] pt-3 text-xs text-text-mid">
            {footer}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
