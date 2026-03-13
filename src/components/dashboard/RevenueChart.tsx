"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ayAdi } from "@/lib/utils";

interface RevenuePoint {
  ay: number;
  yil: number;
  net_usd: number;
}

interface RevenueChartProps {
  data: RevenuePoint[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-[10px] border border-border px-3.5 py-2.5 text-sm"
      style={{ background: "#1E2230", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
    >
      <p className="text-text-muted text-xs mb-1">{label}</p>
      <p className="font-bold text-accent-green">
        ${Number(payload[0].value).toFixed(2)}
      </p>
    </div>
  );
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map((d) => ({
    name: ayAdi(d.ay).slice(0, 3),
    value: d.net_usd,
  }));

  const isEmpty = chartData.length === 0;

  return (
    <div
      className="rounded-card border border-border p-5"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        backgroundColor: "#161920",
        boxShadow: "0 1px 3px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.18)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-bold text-base text-text-primary">Aylık Net Gelir</h3>
          <p className="text-xs text-text-muted mt-0.5">USD cinsinden</p>
        </div>
        <span className="badge-green">Bu yıl</span>
      </div>

      {isEmpty ? (
        <EmptyChart label="Henüz gelir verisi yok" />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2DC653" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#2DC653" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#7B8299", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#7B8299", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)" }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2DC653"
              strokeWidth={2.5}
              fill="url(#greenGrad)"
              dot={false}
              activeDot={{ r: 5, fill: "#2DC653", stroke: "#0D0F14", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-[200px] flex items-center justify-center">
      <p className="text-sm text-text-disabled">{label}</p>
    </div>
  );
}
