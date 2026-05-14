"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type MixDatum = { name: string; value: number; color: string };

export function AllocationPieChart({ data }: { data: MixDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          stroke="transparent"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.[0]) return null;
            const d = payload[0].payload as MixDatum;
            return (
              <div className="rounded-lg border border-white/10 bg-primary px-3 py-2 text-xs shadow-xl">
                <p className="font-medium text-text-high">{d.name}</p>
                <p className="text-text-mid">{d.value}%</p>
              </div>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
