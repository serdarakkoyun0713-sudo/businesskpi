"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface OrdersPoint {
  gun: string; // "Pzt", "Sal" etc. or date
  siparis: number;
  listing: number;
}

interface OrdersChartProps {
  data: OrdersPoint[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-[10px] border border-border px-3.5 py-2.5 text-sm"
      style={{ background: "#1E2230", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
    >
      <p className="text-text-muted text-xs mb-2">{label}</p>
      {payload.map((p: { color: string; name: string; value: number }) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-text-muted text-xs capitalize">{p.name}:</span>
          <span className="font-bold text-text-primary">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function OrdersChart({ data }: OrdersChartProps) {
  const isEmpty = data.length === 0;

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
          <h3 className="font-display font-bold text-base text-text-primary">Sipariş & Listing</h3>
          <p className="text-xs text-text-muted mt-0.5">Son 14 gün</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-blue inline-block" />
            Sipariş
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-purple inline-block" />
            Listing
          </span>
        </div>
      </div>

      {isEmpty ? (
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-sm text-text-disabled">Henüz veri yok</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barGap={2}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="gun"
              tick={{ fill: "#7B8299", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#7B8299", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="siparis" name="siparis" radius={[4, 4, 0, 0]} maxBarSize={20}>
              {data.map((_, i) => (
                <Cell key={i} fill="#4361EE" fillOpacity={0.85} />
              ))}
            </Bar>
            <Bar dataKey="listing" name="listing" radius={[4, 4, 0, 0]} maxBarSize={20}>
              {data.map((_, i) => (
                <Cell key={i} fill="#7209B7" fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
