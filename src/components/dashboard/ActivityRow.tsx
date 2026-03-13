import { fmtDuration } from "@/lib/utils";

interface ActivityItem {
  label: string;
  minutes: number;
  color: string;
  icon?: string;
}

interface ActivityRowProps {
  items: ActivityItem[];
  title: string;
}

export function ActivityRow({ items, title }: ActivityRowProps) {
  const sorted = [...items].sort((a, b) => b.minutes - a.minutes);
  const total = items.reduce((s, i) => s + i.minutes, 0);

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
            Toplam: <span className="text-text-primary font-semibold">{fmtDuration(total)}</span>
          </span>
        )}
      </div>

      {sorted.length === 0 || total === 0 ? (
        <p className="text-sm text-text-disabled py-4 text-center">Bu ay veri yok</p>
      ) : (
        <div className="space-y-3">
          {sorted.slice(0, 6).map((item) => {
            const pct = total > 0 ? (item.minutes / total) * 100 : 0;
            return (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted font-medium flex items-center gap-1.5">
                    {item.icon && <span>{item.icon}</span>}
                    {item.label}
                  </span>
                  <span className="text-text-primary font-semibold tabular-nums">
                    {fmtDuration(item.minutes)}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: item.color,
                    }}
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
