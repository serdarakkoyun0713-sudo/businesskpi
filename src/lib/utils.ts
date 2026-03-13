/** Dakikayı "X sa Y dk" formatına çevirir */
export function fmtDuration(totalMinutes: number | null | undefined): string {
  if (!totalMinutes || totalMinutes <= 0) return "—";
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} dk`;
  if (m === 0) return `${h} sa`;
  return `${h} sa ${m} dk`;
}

/** "X gün Y sa Z dk" formatı (zaman dağılımı sayfası için) */
export function fmtDurationLong(totalMinutes: number | null | undefined): string {
  if (!totalMinutes || totalMinutes <= 0) return "—";
  const days = Math.floor(totalMinutes / (60 * 24));
  const rem = totalMinutes % (60 * 24);
  const h = Math.floor(rem / 60);
  const m = rem % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} gün`);
  if (h > 0) parts.push(`${h} sa`);
  if (m > 0) parts.push(`${m} dk`);
  return parts.join(" ") || "—";
}

/** Sayıyı para formatına çevirir: 1234.5 → "$1,234.50" */
export function fmtUsd(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

/** Sayı formatı: 1234 → "1,234" */
export function fmtNum(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("tr-TR").format(value);
}

/** Türkçe ay adı döndürür (0-indexed) */
export const AYLAR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export function ayAdi(ay: number): string {
  return AYLAR[ay - 1] ?? "";
}

/** Yüzde değişim hesaplar ve işaretli string döndürür */
export function fmtChange(current: number, previous: number): { value: string; positive: boolean; neutral: boolean } {
  if (previous === 0) return { value: "—", positive: false, neutral: true };
  const pct = ((current - previous) / previous) * 100;
  const positive = pct >= 0;
  return {
    value: `${positive ? "+" : ""}${pct.toFixed(1)}%`,
    positive,
    neutral: false,
  };
}

/** CSS class yardımcısı */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
