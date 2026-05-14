"use client";

import { BRAND_PRIMARY } from "@/lib/chart-palette";
import { formatAED } from "@/lib/format";
import { cn } from "@/lib/utils";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useId } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

function SparklineArea({
  data,
  color = BRAND_PRIMARY,
  className,
}: {
  data: number[];
  color?: string;
  className?: string;
}) {
  const gradId = useId().replace(/:/g, "");
  const chartData = data.map((v, i) => ({ i, v }));

  return (
    <div className={cn("h-7 w-[72px] shrink-0", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
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
  const spring = useSpring(0, { stiffness: 120, damping: 20, mass: 0.6 });
  const display = useTransform(spring, (v) => {
    const formatted = formatAED(v, { decimals });
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
  delta?: number;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  delay?: number;
  className?: string;
}

export function KpiCard({
  label,
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  sparklineData,
  sparklineColor = BRAND_PRIMARY,
  delta,
  badge,
  footer,
  delay = 0,
  className,
}: KpiCardProps) {
  const deltaChip =
    delta !== undefined ? (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
          delta >= 0
            ? "bg-accent/15 text-accent"
            : "bg-rose-500/15 text-rose-400"
        )}
      >
        {delta >= 0 ? "+" : ""}
        {delta}%
      </span>
    ) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={cn(
        "card-glass group relative overflow-hidden p-4 transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(110,86,255,0.45),0_8px_32px_-8px_rgba(110,86,255,0.35)]",
        className
      )}
    >
      <div className="relative flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-mid">
            {label}
          </p>
          {badge ?? deltaChip}
        </div>

        <motion.div className="flex items-end justify-between gap-2">
          <p className="font-mono text-4xl font-extrabold tracking-tight text-text-high tabular-nums">
            <AnimatedValue
              value={value}
              decimals={decimals}
              prefix={prefix}
              suffix={suffix}
            />
          </p>
          {sparklineData && sparklineData.length > 1 && (
            <SparklineArea data={sparklineData} color={sparklineColor} />
          )}
        </motion.div>

        {footer && (
          <div className="border-t border-white/[0.06] pt-2 text-xs text-text-mid">
            {footer}
          </div>
        )}
      </div>
    </motion.div>
  );
}
