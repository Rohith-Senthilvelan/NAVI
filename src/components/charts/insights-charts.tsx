"use client";

import { CATEGORY_COLORS } from "@/lib/insights";
import type { TransactionCategory } from "@/lib/mock-data";
import { formatAED } from "@/lib/utils";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type BreakdownDatum = { category: string; value: number; color: string };
type TrendDatum = Record<string, string | number>;

export function InsightsCategoryPie({
  data,
  totalSpent,
}: {
  data: BreakdownDatum[];
  totalSpent: number;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={58}
          outerRadius={88}
          paddingAngle={2}
          stroke="transparent"
        >
          {data.map((entry) => (
            <Cell key={entry.category} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.[0]) return null;
            const d = payload[0].payload as BreakdownDatum;
            const pct = Math.round((d.value / totalSpent) * 100);
            return (
              <div className="rounded-lg border border-white/10 bg-primary px-3 py-2 text-xs shadow-xl">
                <p className="font-medium text-text-high">{d.category}</p>
                <p className="text-text-mid">
                  {formatAED(d.value)} · {pct}%
                </p>
              </div>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function InsightsTrendLine({
  data,
  categories,
}: {
  data: TrendDatum[];
  categories: TransactionCategory[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={260}>
      <LineChart data={data}>
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
          tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
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
        {categories.map((cat) => (
          <Line
            key={cat}
            type="monotone"
            dataKey={cat}
            name={cat}
            stroke={CATEGORY_COLORS[cat] ?? "#00E0B8"}
            strokeWidth={2}
            dot={{ r: 3, fill: CATEGORY_COLORS[cat] ?? "#00E0B8" }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
