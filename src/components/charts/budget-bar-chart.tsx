"use client";

import { CHART_PALETTE } from "@/lib/chart-palette";
import { formatAED } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type BudgetBarDatum = {
  month: string;
  budget: number;
  actual: number;
};

export function BudgetBarChart({ data }: { data: BudgetBarDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={260}>
      <BarChart data={data} barGap={4} barCategoryGap="18%">
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.06)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="rounded-lg border border-white/10 bg-primary px-3 py-2 text-xs shadow-xl">
                <p className="mb-1 font-medium text-text-high">{label}</p>
                {payload.map((p) => (
                  <p key={String(p.dataKey)} className="text-text-mid">
                    {p.name}: {formatAED(Number(p.value))}
                  </p>
                ))}
              </div>
            );
          }}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
        <Bar
          dataKey="budget"
          name="Budget"
          fill={CHART_PALETTE[0]}
          radius={[4, 4, 0, 0]}
          opacity={0.85}
        />
        <Bar
          dataKey="actual"
          name="Actual"
          fill={CHART_PALETTE[4]}
          radius={[4, 4, 0, 0]}
          opacity={0.65}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
