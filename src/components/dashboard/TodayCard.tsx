import { Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { fmtDuration, AYLAR } from "@/lib/utils";
import type { DailyEntry } from "@/types/database";

interface TodayCardProps {
  entry: DailyEntry | null;
}

export function TodayCard({ entry }: TodayCardProps) {
  const now = new Date();
  const dateStr = `${now.getDate()} ${AYLAR[now.getMonth()]}`;

  return (
    <div
      className="rounded-card border overflow-hidden"
      style={{
        borderColor: entry ? "rgba(45,198,83,0.3)" : "#2A2F3E",
        background: entry
          ? "linear-gradient(135deg, rgba(45,198,83,0.06) 0%, rgba(255,255,255,0.01) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        backgroundColor: "#161920",
        boxShadow: "0 1px 3px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.18)",
      }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-[8px] flex items-center justify-center"
              style={{
                background: entry ? "rgba(45,198,83,0.15)" : "rgba(67,97,238,0.15)",
              }}
            >
              <Calendar size={15} className={entry ? "text-accent-green" : "text-accent-blue"} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-text-primary leading-none">
                Bugün
              </h3>
              <p className="text-xs text-text-muted mt-0.5">{dateStr}</p>
            </div>
          </div>

          {entry ? (
            <span className="badge-green">Girildi ✓</span>
          ) : (
            <span className="badge-blue">Bekliyor</span>
          )}
        </div>

        {entry ? (
          <div className="grid grid-cols-2 gap-2">
            <Metric label="Sipariş" value={entry.siparis?.toString() ?? "—"} />
            <Metric label="Ciro" value={entry.ciro ? `$${entry.ciro}` : "—"} />
            <Metric label="Listing" value={entry.listing?.toString() ?? "—"} />
            <Metric label="Uyku" value={entry.uyku ?? "—"} />
            <Metric label="Egzersiz" value={fmtDuration(entry.egzersiz_dk)} />
            <Metric label="İngilizce" value={fmtDuration(entry.ingilizce_dk)} />
          </div>
        ) : (
          <div className="py-3">
            <p className="text-sm text-text-muted mb-3">
              Bugüne ait veri henüz girilmedi.
            </p>
            <Link
              href="/giris-yap"
              className="inline-flex items-center gap-2 btn-primary w-auto px-4 py-2.5 text-sm"
              style={{ boxShadow: "0 4px 12px rgba(67,97,238,0.3)" }}
            >
              <Plus size={15} />
              Veri Gir
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg-surface2 rounded-[8px] px-3 py-2">
      <p className="text-[10px] text-text-disabled uppercase tracking-wide font-semibold mb-0.5">
        {label}
      </p>
      <p className="text-sm font-bold text-text-primary tabular-nums">{value}</p>
    </div>
  );
}
