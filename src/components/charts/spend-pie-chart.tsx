"use client";

import { BRAND_PRIMARY } from "@/lib/chart-palette";
import { formatAED } from "@/lib/utils";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export type SpendPieDatum = {
  category: string;
  value: number;
  color: string;
};

type SpendPieChartProps = {
  data: SpendPieDatum[];
  monthSpent: number;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
};

export function SpendPieChart({
  data,
  monthSpent,
  selectedCategory,
  onSelectCategory,
}: SpendPieChartProps) {
  const activeIndex = selectedCategory
    ? data.findIndex((d) => d.category === selectedCategory)
    : -1;

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={280}>
      <PieChart>
        {activeIndex >= 0 && (
          <Pie
            data={[{ value: 1 }]}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={108}
            outerRadius={112}
            fill="none"
            stroke={data[activeIndex]?.color ?? BRAND_PRIMARY}
            strokeWidth={2}
            isAnimationActive
            animationDuration={600}
          />
        )}
        <Pie
          data={data}
          dataKey="value"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={82}
          outerRadius={118}
          paddingAngle={2}
          stroke="transparent"
          onClick={(_, index) => {
            const cat = data[index]?.category;
            onSelectCategory(selectedCategory === cat ? null : cat ?? null);
          }}
          className="cursor-pointer outline-none"
        >
          {data.map((entry) => (
            <Cell
              key={entry.category}
              fill={entry.color}
              opacity={
                selectedCategory && selectedCategory !== entry.category ? 0.35 : 1
              }
              className="transition-opacity duration-200"
            />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.[0]) return null;
            const d = payload[0].payload as SpendPieDatum;
            const pct = Math.round((d.value / monthSpent) * 100);
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
