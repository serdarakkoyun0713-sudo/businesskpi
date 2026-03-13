import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TimePieChart } from "@/components/zaman/TimePieChart";
import { TimeBreakdown } from "@/components/zaman/TimeBreakdown";
import { fmtDurationLong, AYLAR } from "@/lib/utils";
import type { DailyEntry } from "@/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Zaman Dağılımı — BusinessKPI" };

function sumF(entries: DailyEntry[], key: keyof DailyEntry) {
  return entries.reduce((s, e) => s + (Number(e[key]) || 0), 0);
}

export default async function ZamanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  const now = new Date();
  const yil = now.getFullYear();
  const ay  = now.getMonth() + 1;

  // Bu ay + bu yıl verileri
  const monthStart = `${yil}-${String(ay).padStart(2, "0")}-01`;
  const monthEnd   = `${yil}-${String(ay).padStart(2, "0")}-31`;
  const yearStart  = `${yil}-01-01`;
  const yearEnd    = `${yil}-12-31`;

  const [{ data: monthEntries }, { data: yearEntries }] = await Promise.all([
    supabase.from("daily_entries").select("*").gte("date", monthStart).lte("date", monthEnd),
    supabase.from("daily_entries").select("*").gte("date", yearStart).lte("date", yearEnd),
  ]);

  const me = monthEntries ?? [];
  const ye = yearEntries ?? [];

  // ── Web aktivite dilimleri ──
  function webSlices(entries: DailyEntry[]) {
    return [
      { name: "YouTube",     value: sumF(entries,"yt_pc") + sumF(entries,"yt_mob"),        color: "#E63946", icon: "▶️" },
      { name: "Instagram",   value: sumF(entries,"ig_mob"),                                 color: "#7209B7", icon: "📸" },
      { name: "WhatsApp",    value: sumF(entries,"wa_mob") + sumF(entries,"wa_pc"),          color: "#2DC653", icon: "💬" },
      { name: "Gmail/Docs",  value: sumF(entries,"gmail_pc") + sumF(entries,"gmail_mob"),   color: "#F59E0B", icon: "📧" },
    ];
  }

  // ── Üretim araçları ──
  function toolSlices(entries: DailyEntry[]) {
    return [
      { name: "Etsy Seller", value: sumF(entries,"etsy_seller"), color: "#F59E0B", icon: "🛍️" },
      { name: "Printify",    value: sumF(entries,"printify"),    color: "#0EA5E9", icon: "🖨️" },
      { name: "Kittl",       value: sumF(entries,"kittl"),       color: "#7209B7", icon: "🎨" },
      { name: "Canva",       value: sumF(entries,"canva"),       color: "#4361EE", icon: "✏️" },
    ];
  }

  // ── AI araçları ──
  function aiSlices(entries: DailyEntry[]) {
    return [
      { name: "ChatGPT",   value: sumF(entries,"chatgpt"),  color: "#2DC653", icon: "🤖" },
      { name: "Claude AI", value: sumF(entries,"claude_ai"),color: "#E63946", icon: "🧠" },
      { name: "Gemini",    value: sumF(entries,"gemini"),   color: "#0EA5E9", icon: "✨" },
    ];
  }

  // ── Kişisel gelişim ──
  function devSlices(entries: DailyEntry[]) {
    return [
      { name: "Egzersiz",   value: sumF(entries,"egzersiz_dk"),  color: "#F59E0B", icon: "💪" },
      { name: "İngilizce",  value: sumF(entries,"ingilizce_dk"), color: "#4361EE", icon: "📖" },
    ];
  }

  // ── Toplam ekran süresi ──
  function totalScreen(entries: DailyEntry[]) {
    return [
      ...webSlices(entries),
      ...toolSlices(entries),
      ...aiSlices(entries),
    ];
  }

  const monthLabel = `${AYLAR[ay - 1]} ${yil}`;

  // Toplam kişisel gelişim süreleri (yıllık)
  const totalEgzersizYil  = sumF(ye, "egzersiz_dk");
  const totalIngilizceYil = sumF(ye, "ingilizce_dk");
  const totalOkuma        = sumF(ye, "okuma_syf");
  const gunSayisi         = ye.length;

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Başlık */}
      <div>
        <h2 className="font-display text-xl font-bold text-text-primary">Zaman Dağılımı</h2>
        <p className="text-sm text-text-muted mt-1">
          Ekran süresi, araç kullanımı ve kişisel gelişim analizi
        </p>
      </div>

      {/* Özet strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Egzersiz (yıl)",   value: fmtDurationLong(totalEgzersizYil),  color: "#F59E0B" },
          { label: "İngilizce (yıl)",  value: fmtDurationLong(totalIngilizceYil), color: "#4361EE" },
          { label: "Okuma (yıl)",      value: `${totalOkuma} sayfa`,              color: "#0EA5E9" },
          { label: "Veri günü",        value: `${gunSayisi} gün`,                 color: "#2DC653" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-card border border-border p-4"
            style={{ backgroundColor: "#161920" }}
          >
            <p className="text-[10px] font-semibold text-text-muted tracking-wide uppercase mb-1.5">
              {item.label}
            </p>
            <p
              className="font-display font-bold text-xl tabular-nums"
              style={{ color: item.color }}
            >
              {item.value || "—"}
            </p>
          </div>
        ))}
      </div>

      {/* Bu ay pasta grafikler */}
      <div>
        <h3 className="font-display font-bold text-base text-text-primary mb-3">
          {monthLabel} — Bu Ay
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <TimePieChart data={webSlices(me)}  title="Web Aktivitesi" />
          <TimePieChart data={toolSlices(me)} title="Üretim Araçları" />
          <TimePieChart data={aiSlices(me)}   title="AI Araçları" />
        </div>
      </div>

      {/* Bu ay detay breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TimeBreakdown items={totalScreen(me)} title={`Toplam Ekran Süresi — ${monthLabel}`} />
        <TimeBreakdown items={devSlices(me)}   title={`Kişisel Gelişim — ${monthLabel}`} />
      </div>

      {/* Yıllık breakdown */}
      <div>
        <h3 className="font-display font-bold text-base text-text-primary mb-3">
          {yil} Yılı Toplamı
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TimeBreakdown items={webSlices(ye)}  title="Web Aktivitesi (yıllık)" />
          <TimeBreakdown items={[...toolSlices(ye), ...aiSlices(ye)]} title="Araç & AI (yıllık)" />
        </div>
      </div>
    </div>
  );
}
