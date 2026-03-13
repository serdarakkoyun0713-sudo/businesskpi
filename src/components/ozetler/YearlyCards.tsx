import {
  ShoppingBag, DollarSign, LayoutGrid, Dumbbell,
  BookOpen, Brain, TrendingUp, Calendar
} from "lucide-react";
import { fmtDuration, fmtNum, fmtUsd, ayAdi } from "@/lib/utils";
import type { DailyEntry, MonthlyNet } from "@/types/database";
import type { LucideIcon } from "lucide-react";

interface YearlyCardsProps {
  entries: DailyEntry[];
  netList: MonthlyNet[];
  yil: number;
}

function sum(arr: DailyEntry[], key: keyof DailyEntry) {
  return arr.reduce((s, e) => s + (Number(e[key]) || 0), 0);
}

function avg(arr: DailyEntry[], key: keyof DailyEntry): number {
  if (arr.length === 0) return 0;
  return sum(arr, key) / arr.length;
}

function avgUyku(entries: DailyEntry[]): string {
  const valid = entries.filter((e) => e.uyku && e.uyku.includes(":"));
  if (valid.length === 0) return "—";
  const totalMin = valid.reduce((s, e) => {
    const [h, m] = (e.uyku ?? "0:0").split(":").map(Number);
    return s + h * 60 + (m ?? 0);
  }, 0);
  const a = totalMin / valid.length;
  return `${Math.floor(a / 60)}:${String(Math.round(a % 60)).padStart(2, "0")}`;
}

interface BigStatProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  accent: string;
  glow: string;
}

function BigStat({ icon: Icon, label, value, sub, accent, glow }: BigStatProps) {
  return (
    <div
      className="relative rounded-card border border-border overflow-hidden p-5 flex flex-col gap-3"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        backgroundColor: "#161920",
        boxShadow: "0 1px 3px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.18)",
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-5 bottom-5 w-[3px] rounded-r-full"
        style={{ background: accent }}
      />

      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-text-muted tracking-wide uppercase pl-1">
          {label}
        </p>
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
          style={{ background: `${accent}20`, boxShadow: `0 0 14px ${glow}` }}
        >
          <Icon size={17} style={{ color: accent }} />
        </div>
      </div>

      <div className="pl-1">
        <p
          className="font-display font-bold text-3xl text-text-primary tabular-nums leading-none"
          style={{ letterSpacing: "-0.02em" }}
        >
          {value}
        </p>
        {sub && (
          <p className="text-xs text-text-muted mt-1.5">{sub}</p>
        )}
      </div>
    </div>
  );
}

export function YearlyCards({ entries, netList, yil }: YearlyCardsProps) {
  const totalSiparis   = sum(entries, "siparis");
  const totalListing   = sum(entries, "listing");
  const totalCiro      = netList.reduce((s, n) => s + (n.net_usd || 0), 0);
  const totalEgzersiz  = sum(entries, "egzersiz_dk");
  const totalIngilizce = sum(entries, "ingilizce_dk");
  const totalOkuma     = sum(entries, "okuma_syf");
  const totalAI        = sum(entries, "chatgpt") + sum(entries, "claude_ai") + sum(entries, "gemini");
  const avgUykuStr     = avgUyku(entries);
  const avgEgzMin      = Math.round(avg(entries, "egzersiz_dk"));
  const girilenGun     = entries.length;

  return (
    <div className="space-y-3">
      {/* Başlık */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center"
          style={{ background: "rgba(67,97,238,0.15)" }}
        >
          <Calendar size={16} className="text-accent-blue" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-text-primary leading-none">
            {yil} Yılı Özeti
          </h3>
          <p className="text-xs text-text-muted mt-0.5">{girilenGun} gün veri girildi</p>
        </div>
      </div>

      {/* Kartlar grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <BigStat
          icon={ShoppingBag}
          label="Toplam Sipariş"
          value={fmtNum(totalSiparis)}
          sub={`Günlük ort. ${(totalSiparis / Math.max(girilenGun, 1)).toFixed(1)}`}
          accent="#4361EE"
          glow="rgba(67,97,238,0.25)"
        />
        <BigStat
          icon={LayoutGrid}
          label="Toplam Listing"
          value={fmtNum(totalListing)}
          sub={`Günlük ort. ${(totalListing / Math.max(girilenGun, 1)).toFixed(1)}`}
          accent="#7209B7"
          glow="rgba(114,9,183,0.25)"
        />
        <BigStat
          icon={DollarSign}
          label="Net Gelir"
          value={totalCiro > 0 ? `$${totalCiro.toFixed(0)}` : "—"}
          sub={totalCiro > 0 ? `Aylık ort. ${fmtUsd(totalCiro / 12)}` : "Veri yok"}
          accent="#2DC653"
          glow="rgba(45,198,83,0.25)"
        />
        <BigStat
          icon={TrendingUp}
          label="Veri Günü"
          value={girilenGun.toString()}
          sub={`${Math.round((girilenGun / 365) * 100)}% doluluk oranı`}
          accent="#0EA5E9"
          glow="rgba(14,165,233,0.25)"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <BigStat
          icon={Dumbbell}
          label="Toplam Egzersiz"
          value={fmtDuration(totalEgzersiz)}
          sub={`Ort. ${fmtDuration(avgEgzMin)}/gün`}
          accent="#F59E0B"
          glow="rgba(245,158,11,0.25)"
        />
        <BigStat
          icon={BookOpen}
          label="İngilizce"
          value={fmtDuration(totalIngilizce)}
          sub={`Ort. ${fmtDuration(Math.round(avg(entries, "ingilizce_dk")))}/gün`}
          accent="#E63946"
          glow="rgba(230,57,70,0.25)"
        />
        <BigStat
          icon={BookOpen}
          label="Okuma"
          value={`${fmtNum(totalOkuma)} syf`}
          sub={`Ort. ${(totalOkuma / Math.max(girilenGun, 1)).toFixed(1)} syf/gün`}
          accent="#0EA5E9"
          glow="rgba(14,165,233,0.25)"
        />
        <BigStat
          icon={Brain}
          label="AI Kullanımı"
          value={fmtDuration(totalAI)}
          sub={avgUykuStr !== "—" ? `Uyku ort. ${avgUykuStr} sa` : "Uyku verisi yok"}
          accent="#7209B7"
          glow="rgba(114,9,183,0.25)"
        />
      </div>
    </div>
  );
}
