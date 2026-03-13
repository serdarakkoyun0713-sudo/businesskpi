import { Suspense } from "react";
import { ShoppingBag, LayoutGrid, DollarSign, Moon, Dumbbell, BookOpen } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { OrdersChart } from "@/components/dashboard/OrdersChart";
import { GoalProgress } from "@/components/dashboard/GoalProgress";
import { TodayCard } from "@/components/dashboard/TodayCard";
import { ActivityRow } from "@/components/dashboard/ActivityRow";
import {
  getMonthEntries,
  getPrevMonthEntries,
  getLast14Days,
  getTodayEntry,
  getYearlyNet,
  DEFAULT_GOALS,
} from "@/lib/queries";
import { fmtChange, fmtDuration, AYLAR } from "@/lib/utils";
import type { DailyEntry } from "@/types/database";

// ─── Yardımcı fonksiyonlar ────────────────────────────────────────────────────

function sumField(entries: DailyEntry[], field: keyof DailyEntry): number {
  return entries.reduce((s, e) => s + (Number(e[field]) || 0), 0);
}

function avgField(entries: DailyEntry[], field: keyof DailyEntry): number {
  if (entries.length === 0) return 0;
  return sumField(entries, field) / entries.length;
}

/** Uyku ortalaması: "6:30" stringlerini dakikaya çevirip geri string yapar */
function avgUyku(entries: DailyEntry[]): string {
  const valid = entries.filter((e) => e.uyku && e.uyku.includes(":"));
  if (valid.length === 0) return "—";
  const totalMin = valid.reduce((s, e) => {
    const [h, m] = (e.uyku ?? "0:0").split(":").map(Number);
    return s + h * 60 + (m ?? 0);
  }, 0);
  const avg = totalMin / valid.length;
  const h = Math.floor(avg / 60);
  const m = Math.round(avg % 60);
  return `${h}:${String(m).padStart(2, "0")}`;
}

// ─── Skeleton bileşeni ────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="rounded-card border border-border bg-bg-surface animate-pulse h-[110px]" />
  );
}

// ─── Ana bileşen (async Server Component) ────────────────────────────────────

export default async function DashboardPage() {
  const now = new Date();
  const yil = now.getFullYear();
  const ay = now.getMonth() + 1;

  // Paralel veri çekme
  const [thisMonth, prevMonth, last14, todayEntry, yearlyNet] = await Promise.all([
    getMonthEntries(yil, ay),
    getPrevMonthEntries(yil, ay),
    getLast14Days(),
    getTodayEntry(),
    getYearlyNet(yil),
  ]);

  // ── Bu ay hesaplamaları ──
  const totalSiparis = sumField(thisMonth, "siparis");
  const totalListing = sumField(thisMonth, "listing");
  const totalCiro    = sumField(thisMonth, "ciro");
  const avgEgzersiz  = Math.round(avgField(thisMonth, "egzersiz_dk"));
  const avgIngilizce = Math.round(avgField(thisMonth, "ingilizce_dk"));
  const toplamEgzersiz = sumField(thisMonth, "egzersiz_dk");
  const toplamIngilizce = sumField(thisMonth, "ingilizce_dk");
  const toplamOkuma = sumField(thisMonth, "okuma_syf");
  const uykuOrtalama = avgUyku(thisMonth);

  // ── Geçen ay hesaplamaları (değişim oranı) ──
  const prevSiparis = sumField(prevMonth, "siparis");
  const prevListing = sumField(prevMonth, "listing");
  const prevCiro    = sumField(prevMonth, "ciro");

  // ── Son 14 gün bar chart verisi ──
  const ordersData = last14.map((e) => ({
    gun: e.date.slice(5).replace("-", "/"), // "03/13"
    siparis: e.siparis ?? 0,
    listing: e.listing ?? 0,
  }));

  // ── Web aktivite verileri (bu ay toplam) ──
  const webItems = [
    { label: "YouTube",     minutes: sumField(thisMonth, "yt_pc") + sumField(thisMonth, "yt_mob"),       color: "#E63946", icon: "▶️" },
    { label: "Instagram",   minutes: sumField(thisMonth, "ig_mob"),                                       color: "#7209B7", icon: "📸" },
    { label: "WhatsApp",    minutes: sumField(thisMonth, "wa_mob") + sumField(thisMonth, "wa_pc"),         color: "#2DC653", icon: "💬" },
    { label: "Gmail/Docs",  minutes: sumField(thisMonth, "gmail_pc") + sumField(thisMonth, "gmail_mob"),  color: "#F59E0B", icon: "📧" },
  ].filter((i) => i.minutes > 0);

  const toolItems = [
    { label: "Etsy Seller", minutes: sumField(thisMonth, "etsy_seller"), color: "#F59E0B", icon: "🛍️" },
    { label: "Printify",    minutes: sumField(thisMonth, "printify"),    color: "#0EA5E9", icon: "🖨️" },
    { label: "Kittl",       minutes: sumField(thisMonth, "kittl"),       color: "#7209B7", icon: "🎨" },
    { label: "Canva",       minutes: sumField(thisMonth, "canva"),       color: "#4361EE", icon: "✏️" },
    { label: "ChatGPT",     minutes: sumField(thisMonth, "chatgpt"),     color: "#2DC653", icon: "🤖" },
    { label: "Claude AI",   minutes: sumField(thisMonth, "claude_ai"),   color: "#E63946", icon: "🧠" },
    { label: "Gemini",      minutes: sumField(thisMonth, "gemini"),      color: "#0EA5E9", icon: "✨" },
  ].filter((i) => i.minutes > 0);

  // ── Hedef verisi ──
  const goals = [
    { label: "Aylık Sipariş",  current: totalSiparis,     target: DEFAULT_GOALS.siparis_hedef, format: "num"      as const, accent: "blue"   as const },
    { label: "Aylık Listing",  current: totalListing,     target: DEFAULT_GOALS.listing_hedef, format: "num"      as const, accent: "purple" as const },
    { label: "Aylık Ciro",     current: totalCiro,        target: DEFAULT_GOALS.ciro_hedef,    format: "usd"      as const, accent: "green"  as const },
    { label: "Aylık Egzersiz", current: toplamEgzersiz,   target: DEFAULT_GOALS.egzersiz_hedef,format: "duration" as const, accent: "amber"  as const },
  ];

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* ── Üst başlık ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-text-primary">
            {AYLAR[ay - 1]} {yil}
          </h2>
          <p className="text-sm text-text-muted mt-0.5">
            {thisMonth.length} gün veri girildi
          </p>
        </div>
        <div className="badge-blue hidden sm:flex">
          Otomatik güncelleniyor
        </div>
      </div>

      {/* ── KPI Kartları ── */}
      <Suspense fallback={
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      }>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <StatCard
            label="Sipariş"
            value={totalSiparis.toString()}
            sub={`Geçen ay: ${prevSiparis}`}
            change={fmtChange(totalSiparis, prevSiparis)}
            icon={ShoppingBag}
            accent="blue"
          />
          <StatCard
            label="Listing"
            value={totalListing.toString()}
            sub={`Geçen ay: ${prevListing}`}
            change={fmtChange(totalListing, prevListing)}
            icon={LayoutGrid}
            accent="purple"
          />
          <StatCard
            label="Aylık Ciro"
            value={totalCiro > 0 ? `$${totalCiro.toFixed(0)}` : "—"}
            sub={prevCiro > 0 ? `Geçen: $${prevCiro.toFixed(0)}` : undefined}
            change={totalCiro > 0 && prevCiro > 0 ? fmtChange(totalCiro, prevCiro) : undefined}
            icon={DollarSign}
            accent="green"
          />
          <StatCard
            label="Uyku Ort."
            value={uykuOrtalama !== "—" ? `${uykuOrtalama} sa` : "—"}
            sub="günlük ortalama"
            icon={Moon}
            accent="sky"
          />
          <StatCard
            label="Egzersiz"
            value={fmtDuration(toplamEgzersiz)}
            sub={`Ort. ${fmtDuration(avgEgzersiz)}/gün`}
            icon={Dumbbell}
            accent="amber"
          />
          <StatCard
            label="İngilizce"
            value={fmtDuration(toplamIngilizce)}
            sub={`Ort. ${fmtDuration(avgIngilizce)}/gün`}
            icon={BookOpen}
            accent="red"
          />
        </div>
      </Suspense>

      {/* ── Orta satır: Today + Gelir Grafiği ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
        <TodayCard entry={todayEntry} />
        <RevenueChart data={yearlyNet} />
      </div>

      {/* ── Alt satır 1: Sipariş Grafiği + Hedef Takibi ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <OrdersChart data={ordersData} />
        <GoalProgress goals={goals} ay={ay} yil={yil} />
      </div>

      {/* ── Alt satır 2: Web Aktivite + Araç Kullanımı ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ActivityRow
          title="Web Aktivitesi"
          items={webItems.length > 0 ? webItems : []}
        />
        <ActivityRow
          title="Araç & AI Kullanımı"
          items={toolItems.length > 0 ? toolItems : []}
        />
      </div>

      {/* ── Alt özet bilgi satırı ── */}
      {toplamOkuma > 0 && (
        <div
          className="rounded-card border border-border p-4 flex items-center gap-3"
          style={{ backgroundColor: "#161920" }}
        >
          <span className="text-lg">📚</span>
          <span className="text-sm text-text-muted">
            Bu ay toplam{" "}
            <span className="font-bold text-text-primary">{toplamOkuma} sayfa</span>{" "}
            okundu
          </span>
        </div>
      )}
    </div>
  );
}
