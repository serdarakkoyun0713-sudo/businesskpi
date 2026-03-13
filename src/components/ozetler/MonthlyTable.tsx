"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";
import { fmtDuration, fmtUsd, fmtNum, ayAdi, AYLAR } from "@/lib/utils";
import type { DailyEntry, MonthlyNet } from "@/types/database";

interface MonthlyTableProps {
  entries: DailyEntry[];        // tüm yıl
  netList: MonthlyNet[];        // tüm yıl monthly_net
  yil: number;
}

interface MonthRow {
  ay: number;
  label: string;
  siparis: number;
  listing: number;
  ciro: number | null;
  egzersiz: number;
  ingilizce: number;
  okuma: number;
  gunSayisi: number;
}

function buildMonthRows(entries: DailyEntry[], netList: MonthlyNet[]): MonthRow[] {
  const map = new Map<number, MonthRow>();

  // 12 ayı başlat
  for (let m = 1; m <= 12; m++) {
    map.set(m, {
      ay: m,
      label: ayAdi(m),
      siparis: 0, listing: 0, ciro: null,
      egzersiz: 0, ingilizce: 0, okuma: 0, gunSayisi: 0,
    });
  }

  // Entries'i aylara dağıt
  for (const e of entries) {
    const ay = parseInt(e.date.slice(5, 7), 10);
    const row = map.get(ay);
    if (!row) continue;
    row.siparis    += e.siparis      ?? 0;
    row.listing    += e.listing      ?? 0;
    row.egzersiz   += e.egzersiz_dk  ?? 0;
    row.ingilizce  += e.ingilizce_dk ?? 0;
    row.okuma      += e.okuma_syf    ?? 0;
    row.gunSayisi  += 1;
  }

  // Net ciro ekle
  for (const n of netList) {
    const row = map.get(n.ay);
    if (row) row.ciro = n.net_usd;
  }

  return Array.from(map.values());
}

type SortKey = "ay" | "siparis" | "listing" | "ciro" | "egzersiz" | "ingilizce";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronUp size={12} className="text-text-disabled opacity-50" />;
  return dir === "asc"
    ? <ChevronUp size={12} className="text-accent-blue" />
    : <ChevronDown size={12} className="text-accent-blue" />;
}

function PctBadge({ current, prev }: { current: number; prev: number }) {
  if (prev === 0 || current === 0) return null;
  const pct = ((current - prev) / prev) * 100;
  const pos = pct >= 0;
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[10px] font-semibold ml-1.5"
      style={{ color: pos ? "#2DC653" : "#E63946" }}
    >
      {pos ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {Math.abs(pct).toFixed(0)}%
    </span>
  );
}

export function MonthlyTable({ entries, netList, yil }: MonthlyTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("ay");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const rows = buildMonthRows(entries, netList);

  const currentMonth = new Date().getFullYear() === yil
    ? new Date().getMonth() + 1
    : 12;

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = [...rows].sort((a, b) => {
    if (sortKey === "ay") return sortDir === "asc" ? a.ay - b.ay : b.ay - a.ay;
    const va = sortKey === "ciro" ? (a.ciro ?? 0) : (a as unknown as Record<string, number>)[sortKey] ?? 0;
    const vb = sortKey === "ciro" ? (b.ciro ?? 0) : (b as unknown as Record<string, number>)[sortKey] ?? 0;
    return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
  });

  function Th({ label, sk }: { label: string; sk: SortKey }) {
    return (
      <th
        className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted tracking-wide uppercase cursor-pointer hover:text-text-primary transition-colors select-none whitespace-nowrap"
        onClick={() => handleSort(sk)}
      >
        <span className="flex items-center gap-1">
          {label}
          <SortIcon active={sortKey === sk} dir={sortDir} />
        </span>
      </th>
    );
  }

  const totals = {
    siparis:   rows.reduce((s, r) => s + r.siparis, 0),
    listing:   rows.reduce((s, r) => s + r.listing, 0),
    ciro:      rows.reduce((s, r) => s + (r.ciro ?? 0), 0),
    egzersiz:  rows.reduce((s, r) => s + r.egzersiz, 0),
    ingilizce: rows.reduce((s, r) => s + r.ingilizce, 0),
  };

  return (
    <div
      className="rounded-card border border-border overflow-hidden"
      style={{ backgroundColor: "#161920" }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="font-display font-bold text-base text-text-primary">Aylık Tablo</h3>
        <span className="text-xs text-text-muted">{yil}</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid #2A2F3E" }}>
              <Th label="Ay"        sk="ay"        />
              <Th label="Sipariş"   sk="siparis"   />
              <Th label="Listing"   sk="listing"   />
              <Th label="Net Gelir" sk="ciro"      />
              <Th label="Egzersiz"  sk="egzersiz"  />
              <Th label="İngilizce" sk="ingilizce" />
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted tracking-wide uppercase whitespace-nowrap">
                Gün
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const prevRow = rows.find((r) => r.ay === row.ay - 1);
              const isCurrent = row.ay === currentMonth;
              const isFuture  = row.ay > currentMonth;
              const hasData   = row.gunSayisi > 0 || row.ciro !== null;

              return (
                <tr
                  key={row.ay}
                  className={`border-b border-border/40 transition-colors
                    ${isCurrent ? "bg-accent-blue/05" : "hover:bg-bg-surface2"}
                    ${isFuture && !hasData ? "opacity-30" : ""}`}
                >
                  {/* Ay */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {isCurrent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-blue shrink-0" />
                      )}
                      <span className={`text-sm font-semibold ${isCurrent ? "text-accent-blue" : "text-text-primary"}`}>
                        {row.label}
                      </span>
                    </div>
                  </td>

                  {/* Sipariş */}
                  <td className="px-4 py-3 text-sm text-text-primary tabular-nums">
                    {row.siparis > 0 ? (
                      <>
                        {fmtNum(row.siparis)}
                        {prevRow && prevRow.siparis > 0 && (
                          <PctBadge current={row.siparis} prev={prevRow.siparis} />
                        )}
                      </>
                    ) : (
                      <span className="text-text-disabled">—</span>
                    )}
                  </td>

                  {/* Listing */}
                  <td className="px-4 py-3 text-sm text-text-primary tabular-nums">
                    {row.listing > 0 ? fmtNum(row.listing) : <span className="text-text-disabled">—</span>}
                  </td>

                  {/* Net gelir */}
                  <td className="px-4 py-3 text-sm tabular-nums">
                    {row.ciro !== null ? (
                      <span className="font-semibold text-accent-green">{fmtUsd(row.ciro)}</span>
                    ) : (
                      <span className="text-text-disabled">—</span>
                    )}
                  </td>

                  {/* Egzersiz */}
                  <td className="px-4 py-3 text-sm text-text-muted tabular-nums">
                    {row.egzersiz > 0 ? fmtDuration(row.egzersiz) : <span className="text-text-disabled">—</span>}
                  </td>

                  {/* İngilizce */}
                  <td className="px-4 py-3 text-sm text-text-muted tabular-nums">
                    {row.ingilizce > 0 ? fmtDuration(row.ingilizce) : <span className="text-text-disabled">—</span>}
                  </td>

                  {/* Gün sayısı */}
                  <td className="px-4 py-3 text-sm text-text-disabled tabular-nums">
                    {row.gunSayisi > 0 ? row.gunSayisi : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Totals row */}
          <tfoot>
            <tr className="border-t-2" style={{ borderColor: "#2A2F3E" }}>
              <td className="px-4 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">
                Toplam
              </td>
              <td className="px-4 py-3 text-sm font-bold text-text-primary tabular-nums">
                {fmtNum(totals.siparis)}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-text-primary tabular-nums">
                {fmtNum(totals.listing)}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-accent-green tabular-nums">
                {totals.ciro > 0 ? fmtUsd(totals.ciro) : "—"}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-text-muted tabular-nums">
                {fmtDuration(totals.egzersiz)}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-text-muted tabular-nums">
                {fmtDuration(totals.ingilizce)}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-text-disabled tabular-nums">
                {entries.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
