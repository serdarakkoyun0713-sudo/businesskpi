import { fmtDurationLong, fmtDuration } from "@/lib/utils";
import type { PieSlice } from "./TimePieChart";

interface TimeBreakdownProps {
  items: PieSlice[];
  title: string;
}

export function TimeBreakdown({ items, title }: TimeBreakdownProps) {
  const nonZero = [...items].filter((i) => i.value > 0).sort((a, b) => b.value - a.value);
  const total = nonZero.reduce((s, i) => s + i.value, 0);

  return (
    <div
      className="rounded-card border border-border p-5"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        backgroundColor: "#161920",
        boxShadow: "0 1px 3px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.18)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-base text-text-primary">{title}</h3>
        {total > 0 && (
          <span className="text-xs text-text-muted">
            {fmtDurationLong(total)}
          </span>
        )}
      </div>

      {nonZero.length === 0 ? (
        <p className="text-sm text-text-disabled py-6 text-center">Bu dönemde veri yok</p>
      ) : (
        <div className="space-y-3">
          {nonZero.map((item) => {
            const pct = total > 0 ? (item.value / total) * 100 : 0;
            return (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {item.icon && <span className="text-sm leading-none">{item.icon}</span>}
                    <span className="text-sm text-text-primary font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-text-muted tabular-nums">
                      {fmtDurationLong(item.value)}
                    </span>
                    <span
                      className="text-xs font-bold tabular-nums w-9 text-right"
                      style={{ color: item.color }}
                    >
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
