/**
 * Web Activity Tracker CSV Parser
 *
 * CSV formatı:
 *   Date,WebSite,Time(sec),Sessions
 *   3/13/2026,claude.ai,7563,90
 *
 * Çıktı: her gün için bir ParsedDay objesi
 */

export type DbColumn =
  | "yt_pc" | "yt_mob" | "ig_mob"
  | "gmail_pc" | "gmail_mob"
  | "wa_mob" | "wa_pc"
  | "kittl" | "canva" | "printify"
  | "etsy_seller" | "etsy_buyer"
  | "chatgpt" | "claude_ai" | "gemini";

export interface CsvRow {
  date: string;       // ISO: "2026-03-13"
  domain: string;     // ham domain
  seconds: number;
  minutes: number;    // Math.ceil(seconds / 60)
  sessions: number;
  column: DbColumn | null;  // eşleşen DB kolonu (null = tanınmayan)
}

export interface ParsedDay {
  date: string;       // ISO
  rows: CsvRow[];
  knownRows: CsvRow[];
  unknownRows: CsvRow[];
  columnTotals: Partial<Record<DbColumn, number>>;  // dakika toplamları
}

// ─── Domain → DB kolonu eşleştirmesi ────────────────────────────────────────

const DOMAIN_MAP: Array<{ match: (d: string) => boolean; column: DbColumn }> = [
  { match: (d) => d.includes("youtube.com"),        column: "yt_pc"        },
  { match: (d) => d.includes("youtu.be"),           column: "yt_pc"        },
  { match: (d) => d.includes("instagram.com"),      column: "ig_mob"       },
  { match: (d) => d.includes("mail.google.com"),    column: "gmail_pc"     },
  { match: (d) => d.includes("docs.google.com"),    column: "gmail_pc"     },
  { match: (d) => d.includes("drive.google.com"),   column: "gmail_pc"     },
  { match: (d) => d.includes("web.whatsapp.com"),   column: "wa_pc"        },
  { match: (d) => d.includes("whatsapp.com"),       column: "wa_mob"       },
  { match: (d) => d.includes("kittl.com"),          column: "kittl"        },
  { match: (d) => d.includes("canva.com"),          column: "canva"        },
  { match: (d) => d.includes("printify.com"),       column: "printify"     },
  { match: (d) => d.includes("etsy.com"),           column: "etsy_seller"  },
  { match: (d) => d.includes("chatgpt.com"),        column: "chatgpt"      },
  { match: (d) => d.includes("claude.ai"),          column: "claude_ai"    },
  { match: (d) => d.includes("gemini.google.com"),  column: "gemini"       },
];

export function mapDomain(domain: string): DbColumn | null {
  const lower = domain.toLowerCase();
  for (const rule of DOMAIN_MAP) {
    if (rule.match(lower)) return rule.column;
  }
  return null;
}

// ─── Tarih parse: "3/13/2026" → "2026-03-13" ────────────────────────────────

export function parseDate(raw: string): string | null {
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return null;
  const [m, d, y] = parts.map(Number);
  if (!m || !d || !y) return null;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// ─── Ana parse fonksiyonu ────────────────────────────────────────────────────

export function parseCsv(csvText: string): ParsedDay[] {
  const lines = csvText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) return [];

  // Header satırını atla (büyük/küçük harf toleranslı)
  const startIdx = lines[0].toLowerCase().includes("date") ? 1 : 0;

  const dayMap = new Map<string, CsvRow[]>();

  for (let i = startIdx; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 3) continue;

    const rawDate = cols[0]?.trim() ?? "";
    const rawDomain = cols[1]?.trim() ?? "";
    const rawSec = parseInt(cols[2]?.trim() ?? "0", 10);
    const rawSessions = parseInt(cols[3]?.trim() ?? "0", 10);

    if (!rawDate || !rawDomain || isNaN(rawSec)) continue;

    const date = parseDate(rawDate);
    if (!date) continue;

    const minutes = Math.ceil(rawSec / 60);
    const column = mapDomain(rawDomain);

    const row: CsvRow = {
      date,
      domain: rawDomain,
      seconds: rawSec,
      minutes,
      sessions: rawSessions,
      column,
    };

    const existing = dayMap.get(date) ?? [];
    existing.push(row);
    dayMap.set(date, existing);
  }

  // Her gün için ParsedDay oluştur
  const result: ParsedDay[] = [];

  for (const [date, rows] of Array.from(dayMap.entries())) {
    const knownRows = rows.filter((r: CsvRow) => r.column !== null);
    const unknownRows = rows.filter((r: CsvRow) => r.column === null);

    // Kolon toplamları (dakika)
    const columnTotals: Partial<Record<DbColumn, number>> = {};
    for (const row of knownRows) {
      if (row.column) {
        const col = row.column as DbColumn;
        columnTotals[col] = (columnTotals[col] ?? 0) + row.minutes;
      }
    }

    result.push({ date, rows, knownRows, unknownRows, columnTotals });
  }

  // Tarihe göre sırala
  result.sort((a, b) => a.date.localeCompare(b.date));
  return result;
}

// ─── Kullanıcının yaptığı domain atamaları ile güncellenmiş toplamlar ────────

export function applyManualAssignments(
  days: ParsedDay[],
  assignments: Record<string, DbColumn>  // domain → column
): ParsedDay[] {
  return days.map((day) => {
    const updatedRows = day.rows.map((row) => ({
      ...row,
      column: assignments[row.domain] ?? row.column,
    }));

    const knownRows = updatedRows.filter((r) => r.column !== null);
    const unknownRows = updatedRows.filter((r) => r.column === null);

    const columnTotals: Partial<Record<DbColumn, number>> = {};
    for (const row of knownRows) {
      if (row.column) {
        columnTotals[row.column] = (columnTotals[row.column] ?? 0) + row.minutes;
      }
    }

    return { ...day, rows: updatedRows, knownRows, unknownRows, columnTotals };
  });
}

// ─── İnsan-okunabilir kolon adları ──────────────────────────────────────────

export const COLUMN_LABELS: Record<DbColumn, string> = {
  yt_pc:       "YouTube (PC)",
  yt_mob:      "YouTube (Mobil)",
  ig_mob:      "Instagram",
  gmail_pc:    "Gmail / Google Docs",
  gmail_mob:   "Gmail (Mobil)",
  wa_mob:      "WhatsApp (Mobil)",
  wa_pc:       "WhatsApp Web",
  kittl:       "Kittl",
  canva:       "Canva",
  printify:    "Printify",
  etsy_seller: "Etsy Seller",
  etsy_buyer:  "Etsy Buyer",
  chatgpt:     "ChatGPT",
  claude_ai:   "Claude AI",
  gemini:      "Gemini",
};

export const ALL_DB_COLUMNS: DbColumn[] = Object.keys(COLUMN_LABELS) as DbColumn[];
