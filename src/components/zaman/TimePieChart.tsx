"use client";

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { fmtDurationLong, fmtDuration } from "@/lib/utils";

export interface PieSlice {
  name: string;
  value: number;   // dakika
  color: string;
  icon?: string;
}

interface TimePieChartProps {
  data: PieSlice[];
  title: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div
      className="rounded-[10px] border border-border px-4 py-3 text-sm"
      style={{ background: "#1E2230", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.payload.color }} />
        <span className="font-semibold text-text-primary">{d.name}</span>
      </div>
      <p className="text-accent-blue font-bold">{fmtDurationLong(d.value)}</p>
      <p className="text-text-muted text-xs mt-0.5">
        {d.payload.percent !== undefined ? `${(d.payload.percent * 100).toFixed(1)}%` : ""}
      </p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomLegend({ payload }: any) {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
      {payload.map((entry: { color: string; value: string }) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-xs text-text-muted">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function TimePieChart({ data, title }: TimePieChartProps) {
  const nonZero = data.filter((d) => d.value > 0);
  const total = nonZero.reduce((s, d) => s + d.value, 0);

  if (nonZero.length === 0) {
    return (
      <div
        className="rounded-card border border-border p-5 flex flex-col items-center justify-center gap-3 h-[340px]"
        style={{ backgroundColor: "#161920" }}
      >
        <p className="text-text-disabled text-sm">{title} — veri yok</p>
      </div>
    );
  }

  // Percent ekle (tooltip için)
  const withPct = nonZero.map((d) => ({
    ...d,
    percent: d.value / total,
  }));

  return (
    <div
      className="rounded-card border border-border p-5"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        backgroundColor: "#161920",
        boxShadow: "0 1px 3px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.18)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-base text-text-primary">{title}</h3>
        <span className="text-xs text-text-muted">
          Toplam: <span className="text-text-primary font-semibold">{fmtDurationLong(total)}</span>
        </span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={withPct}
            cx="50%"
            cy="45%"
            innerRadius={65}
            outerRadius={105}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {withPct.map((entry, i) => (
              <Cell key={i} fill={entry.color} opacity={0.9} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
