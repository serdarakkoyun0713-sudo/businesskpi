import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GoalsForm } from "@/components/hedefler/GoalsForm";
import { getUserGoals } from "@/lib/queries";
import { getMonthEntries } from "@/lib/queries";
import { fmtDuration, fmtUsd, AYLAR } from "@/lib/utils";
import type { DailyEntry } from "@/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Hedefler — BusinessKPI" };

function sumF(entries: DailyEntry[], key: keyof DailyEntry) {
  return entries.reduce((s, e) => s + (Number(e[key]) || 0), 0);
}

export default async function HedeflerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  const now = new Date();
  const yil = now.getFullYear();
  const ay  = now.getMonth() + 1;

  const [goals, monthEntries] = await Promise.all([
    getUserGoals(),
    getMonthEntries(yil, ay),
  ]);

  // Bu ayki gerçekleşmeler
  const actual = {
    siparis:   sumF(monthEntries, "siparis"),
    listing:   sumF(monthEntries, "listing"),
    ciro:      sumF(monthEntries, "ciro"),
    egzersiz:  sumF(monthEntries, "egzersiz_dk"),
    ingilizce: sumF(monthEntries, "ingilizce_dk"),
    okuma:     sumF(monthEntries, "okuma_syf"),
  };

  const progressItems = [
    {
      label: "Sipariş",
      current: actual.siparis,
      target: goals.siparis_hedef,
      display: actual.siparis.toString(),
      targetDisplay: goals.siparis_hedef.toString(),
      accent: "#4361EE",
    },
    {
      label: "Listing",
      current: actual.listing,
      target: goals.listing_hedef,
      display: actual.listing.toString(),
      targetDisplay: goals.listing_hedef.toString(),
      accent: "#7209B7",
    },
    {
      label: "Ciro",
      current: actual.ciro,
      target: goals.ciro_hedef,
      display: fmtUsd(actual.ciro),
      targetDisplay: fmtUsd(goals.ciro_hedef),
      accent: "#2DC653",
    },
    {
      label: "Egzersiz",
      current: actual.egzersiz,
      target: goals.egzersiz_hedef,
      display: fmtDuration(actual.egzersiz),
      targetDisplay: fmtDuration(goals.egzersiz_hedef),
      accent: "#F59E0B",
    },
    {
      label: "İngilizce",
      current: actual.ingilizce,
      target: goals.ingilizce_hedef,
      display: fmtDuration(actual.ingilizce),
      targetDisplay: fmtDuration(goals.ingilizce_hedef),
      accent: "#E63946",
    },
    {
      label: "Okuma",
      current: actual.okuma,
      target: goals.okuma_hedef,
      display: `${actual.okuma} syf`,
      targetDisplay: `${goals.okuma_hedef} syf`,
      accent: "#0EA5E9",
    },
  ];

  return (
    <div className="space-y-6 max-w-[900px]">
      <div>
        <h2 className="font-display text-xl font-bold text-text-primary">Hedefler</h2>
        <p className="text-sm text-text-muted mt-1">
          Aylık hedeflerini belirle — Dashboard&apos;a otomatik yansır
        </p>
      </div>

      {/* Bu ayın anlık ilerlemesi */}
      <div
        className="rounded-card border border-border p-5"
        style={{ backgroundColor: "#161920" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-base text-text-primary">
            {AYLAR[ay - 1]} {yil} — Mevcut Durum
          </h3>
          <span className="text-xs text-text-muted">{monthEntries.length} gün girildi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {progressItems.map((item) => {
            const pct = item.target > 0 ? Math.min((item.current / item.target) * 100, 100) : 0;
            const done = pct >= 100;
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-text-primary">{item.label}</span>
                  <span className="text-text-muted tabular-nums">
                    {item.display}
                    <span className="text-text-disabled"> / {item.targetDisplay}</span>
                  </span>
                </div>
                <div
                  className="h-2.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: done
                        ? "linear-gradient(90deg, #2DC653, #0EA5E9)"
                        : item.accent,
                      boxShadow: done ? "0 0 8px rgba(45,198,83,0.5)" : undefined,
                    }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className="text-[11px] font-bold tabular-nums"
                    style={{ color: done ? "#2DC653" : item.accent }}
                  >
                    {pct.toFixed(0)}%
                  </span>
                  {done && (
                    <span className="text-[10px] font-bold text-accent-green bg-accent-green/12 px-2 py-0.5 rounded-badge">
                      ✓ Tamamlandı
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hedef düzenleme formu */}
      <div
        className="rounded-card border border-border p-5"
        style={{ backgroundColor: "#161920" }}
      >
        <h3 className="font-display font-bold text-base text-text-primary mb-5">
          Hedefleri Düzenle
        </h3>
        <GoalsForm goals={goals} />
      </div>
    </div>
  );
}
