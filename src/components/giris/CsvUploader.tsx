"use client";

import { useState, useCallback, useTransition, useRef } from "react";
import {
  Upload, FileText, X, CheckCircle2, AlertCircle,
  ChevronDown, Loader2, Info, ArrowRight
} from "lucide-react";
import {
  parseCsv, applyManualAssignments, COLUMN_LABELS, ALL_DB_COLUMNS,
  type ParsedDay, type DbColumn, type CsvRow
} from "@/lib/csvParser";
import { saveCsvEntries } from "@/app/(app)/giris-yap/actions";
import { fmtDuration, AYLAR } from "@/lib/utils";
import { cn } from "@/lib/utils";

// ─── Adım göstergesi ──────────────────────────────────────────────────────────

type Step = "upload" | "preview" | "done";

function StepIndicator({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "upload", label: "Dosya Seç" },
    { key: "preview", label: "Önizle & Onayla" },
    { key: "done", label: "Kaydedildi" },
  ];
  const idx = steps.findIndex((s) => s.key === step);

  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all",
                i < idx
                  ? "bg-accent-green text-white"
                  : i === idx
                  ? "bg-accent-blue text-white"
                  : "bg-border text-text-disabled"
              )}
            >
              {i < idx ? <CheckCircle2 size={13} /> : i + 1}
            </div>
            <span
              className={cn(
                "text-xs font-medium hidden sm:block",
                i === idx ? "text-text-primary" : "text-text-muted"
              )}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight size={12} className="text-border shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Bilinmeyen domain satırı için dropdown ────────────────────────────────

function UnknownDomainRow({
  row,
  assignment,
  onAssign,
}: {
  row: CsvRow;
  assignment: DbColumn | null;
  onAssign: (domain: string, col: DbColumn | null) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary font-mono truncate">{row.domain}</p>
        <p className="text-xs text-text-muted">{fmtDuration(row.minutes)}</p>
      </div>
      <div className="relative shrink-0">
        <select
          value={assignment ?? ""}
          onChange={(e) => onAssign(row.domain, (e.target.value as DbColumn) || null)}
          className="appearance-none bg-bg-surface2 border border-border rounded-[8px] text-xs
                     text-text-primary pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1
                     focus:ring-accent-blue/50 cursor-pointer"
        >
          <option value="">— Yoksay —</option>
          {ALL_DB_COLUMNS.map((col) => (
            <option key={col} value={col}>{COLUMN_LABELS[col]}</option>
          ))}
        </select>
        <ChevronDown
          size={12}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
      </div>
    </div>
  );
}

// ─── Günlük önizleme kartı ────────────────────────────────────────────────────

function DayPreviewCard({
  day,
  assignments,
  onAssign,
  unknownDomains,
}: {
  day: ParsedDay;
  assignments: Record<string, DbColumn | null>;
  onAssign: (domain: string, col: DbColumn | null) => void;
  unknownDomains: string[];
}) {
  const [expanded, setExpanded] = useState(false);
  const d = new Date(day.date + "T00:00:00");
  const label = `${d.getDate()} ${AYLAR[d.getMonth()]} ${d.getFullYear()}`;
  const totalMin = Object.values(day.columnTotals).reduce((s, v) => s + (v ?? 0), 0);

  // Bu gün için bilinmeyen satırlar
  const dayUnknown = day.rows.filter(
    (r) => r.column === null && !assignments[r.domain]
  );

  return (
    <div
      className="rounded-[10px] border overflow-hidden"
      style={{
        borderColor: dayUnknown.length > 0 ? "rgba(245,158,11,0.35)" : "rgba(45,198,83,0.3)",
        backgroundColor: "#1E2230",
      }}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-bg-surface2 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-text-primary">{label}</span>
          <span className="badge-blue text-[10px]">
            {day.rows.length} site
          </span>
          {dayUnknown.length > 0 && (
            <span className="badge-amber text-[10px]">
              {dayUnknown.length} tanınmayan
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted">
            Toplam: <span className="text-text-primary font-semibold">{fmtDuration(totalMin)}</span>
          </span>
          <ChevronDown
            size={14}
            className={cn("text-text-muted transition-transform", expanded && "rotate-180")}
          />
        </div>
      </button>

      {/* Detaylar */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-border/50">
          {/* Tanınan siteler */}
          {Object.keys(day.columnTotals).length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold mb-2">
                Tanınan Siteler
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.entries(day.columnTotals) as [DbColumn, number][]).map(([col, min]) => (
                  <div
                    key={col}
                    className="bg-bg-main rounded-[8px] px-3 py-2"
                  >
                    <p className="text-[10px] text-text-disabled truncate">{COLUMN_LABELS[col]}</p>
                    <p className="text-xs font-bold text-accent-green tabular-nums">
                      {fmtDuration(min)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tanınmayan siteler */}
          {day.unknownRows.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] text-text-muted uppercase tracking-wide font-semibold mb-2 flex items-center gap-1.5">
                <AlertCircle size={11} className="text-accent-amber" />
                Tanınmayan Siteler — kolona ata
              </p>
              {day.unknownRows
                .filter((r) => unknownDomains.includes(r.domain))
                .map((r) => (
                  <UnknownDomainRow
                    key={`${r.domain}-${r.date}`}
                    row={r}
                    assignment={assignments[r.domain] ?? null}
                    onAssign={onAssign}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Ana CSV Uploader bileşeni ────────────────────────────────────────────────

export function CsvUploader() {
  const [step, setStep] = useState<Step>("upload");
  const [parsedDays, setParsedDays] = useState<ParsedDay[]>([]);
  const [assignments, setAssignments] = useState<Record<string, DbColumn | null>>({});
  const [dragOver, setDragOver] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [saveResult, setSaveResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  // Tüm bilinmeyen domain'leri topla
  const allUnknownDomains = Array.from(
    new Set(parsedDays.flatMap((d) => d.unknownRows.map((r) => r.domain)))
  );

  function processFile(file: File) {
    setParseError(null);
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      setParseError("Lütfen bir CSV dosyası seçin.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const days = parseCsv(text);
        if (days.length === 0) {
          setParseError("CSV dosyasında geçerli veri bulunamadı. Format: Date,WebSite,Time(sec),Sessions");
          return;
        }
        setParsedDays(days);
        setAssignments({});
        setStep("preview");
      } catch {
        setParseError("Dosya okunamadı. Lütfen geçerli bir CSV dosyası yükleyin.");
      }
    };
    reader.readAsText(file, "UTF-8");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleAssign(domain: string, col: DbColumn | null) {
    setAssignments((prev) => ({ ...prev, [domain]: col }));
  }

  // Assignments uygulanmış günler
  const resolvedDays = applyManualAssignments(parsedDays, assignments as Record<string, DbColumn>);

  function handleSave() {
    setSaveResult(null);
    startTransition(async () => {
      const payload = resolvedDays.map((d) => ({
        date: d.date,
        columnTotals: d.columnTotals,
      }));

      const res = await saveCsvEntries(payload);
      if (res?.error) {
        setSaveResult(`Hata: ${res.error}`);
      } else {
        setSaveResult(`✓ ${res.saved} gün başarıyla kaydedildi!`);
        setStep("done");
      }
    });
  }

  function handleReset() {
    setStep("upload");
    setParsedDays([]);
    setAssignments({});
    setParseError(null);
    setSaveResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  // ─── ADIM 1: Yükleme ────────────────────────────────────────────────────

  if (step === "upload") {
    return (
      <div className="space-y-4">
        <StepIndicator step="upload" />

        {/* Drag & drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center gap-4 rounded-card border-2 border-dashed",
            "cursor-pointer transition-all duration-200 py-14 px-6",
            dragOver
              ? "border-accent-blue bg-accent-blue/08 scale-[1.01]"
              : "border-border hover:border-accent-blue/50 hover:bg-bg-surface2"
          )}
        >
          <div
            className="w-16 h-16 rounded-card flex items-center justify-center"
            style={{ background: dragOver ? "rgba(67,97,238,0.2)" : "rgba(67,97,238,0.1)" }}
          >
            <Upload size={28} className="text-accent-blue" />
          </div>

          <div className="text-center">
            <p className="font-display font-bold text-text-primary mb-1">
              CSV dosyasını sürükle & bırak
            </p>
            <p className="text-text-muted text-sm">
              veya{" "}
              <span className="text-accent-blue font-semibold">dosyayı seç</span>
            </p>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Hata */}
        {parseError && (
          <div className="flex items-start gap-3 bg-accent-red/10 border border-accent-red/25 rounded-input px-4 py-3 text-sm text-accent-red">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {parseError}
          </div>
        )}

        {/* Format bilgisi */}
        <div
          className="rounded-[10px] border border-border/60 p-4"
          style={{ backgroundColor: "#1E2230" }}
        >
          <div className="flex items-start gap-3">
            <Info size={15} className="text-text-muted shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-text-muted">Beklenen CSV formatı (Web Activity Tracker):</p>
              <code className="block text-[11px] text-accent-sky bg-bg-main rounded-[6px] px-3 py-2 font-mono leading-relaxed">
                Date,WebSite,Time(sec),Sessions<br />
                3/13/2026,claude.ai,7563,90<br />
                3/13/2026,www.youtube.com,2331,19<br />
                3/12/2026,chatgpt.com,1572,33
              </code>
              <p className="text-[10px] text-text-disabled">
                Birden fazla gün içeren CSV desteklenir. Saniyeler otomatik dakikaya çevrilir.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── ADIM 2: Önizleme ────────────────────────────────────────────────────

  if (step === "preview") {
    const stillUnknown = resolvedDays.flatMap((d) => d.unknownRows).filter(
      (r) => !assignments[r.domain]
    ).length;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <StepIndicator step="preview" />
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={13} />
            Yeni dosya yükle
          </button>
        </div>

        {/* Özet */}
        <div
          className="rounded-[10px] border border-border p-4 flex items-center gap-4 flex-wrap"
          style={{ backgroundColor: "#1E2230" }}
        >
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-accent-blue" />
            <span className="text-sm font-semibold text-text-primary">
              {parsedDays.length} gün
            </span>
            <span className="text-text-muted text-sm">bulundu</span>
          </div>
          {stillUnknown > 0 && (
            <div className="flex items-center gap-2 text-accent-amber text-sm">
              <AlertCircle size={14} />
              {stillUnknown} site atanmadı — yoksayılacak
            </div>
          )}
        </div>

        {/* Bilinmeyen domain'ler için global atama */}
        {allUnknownDomains.length > 0 && (
          <div
            className="rounded-card border border-accent-amber/30 p-4"
            style={{ backgroundColor: "#1E2230" }}
          >
            <p className="text-xs font-semibold text-accent-amber mb-3 flex items-center gap-2">
              <AlertCircle size={13} />
              Tanınmayan Siteler — hangi kolona kaydedelim?
            </p>
            <div className="space-y-1">
              {allUnknownDomains.map((domain) => {
                const row = parsedDays
                  .flatMap((d) => d.unknownRows)
                  .find((r) => r.domain === domain)!;
                return (
                  <UnknownDomainRow
                    key={domain}
                    row={row}
                    assignment={assignments[domain] ?? null}
                    onAssign={handleAssign}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Günlük kartlar */}
        <div className="space-y-3">
          {resolvedDays.map((day) => (
            <DayPreviewCard
              key={day.date}
              day={day}
              assignments={assignments}
              onAssign={handleAssign}
              unknownDomains={allUnknownDomains}
            />
          ))}
        </div>

        {/* Hata/bilgi */}
        {saveResult && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-input border border-accent-red/25 bg-accent-red/10 text-sm text-accent-red">
            <AlertCircle size={15} />
            {saveResult}
          </div>
        )}

        {/* Onayla ve Kaydet */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="btn-primary"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              Onayla ve Kaydet ({parsedDays.length} gün)
            </>
          )}
        </button>
      </div>
    );
  }

  // ─── ADIM 3: Tamamlandı ───────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      <StepIndicator step="done" />
      <div
        className="flex flex-col items-center justify-center gap-4 py-12 rounded-card border border-accent-green/30"
        style={{ backgroundColor: "#1E2230" }}
      >
        <div
          className="w-16 h-16 rounded-card flex items-center justify-center"
          style={{ background: "rgba(45,198,83,0.15)" }}
        >
          <CheckCircle2 size={32} className="text-accent-green" />
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-text-primary text-lg mb-1">Kaydedildi!</p>
          <p className="text-text-muted text-sm">{saveResult}</p>
        </div>
        <button type="button" onClick={handleReset} className="btn-ghost w-auto px-6">
          Yeni CSV Yükle
        </button>
      </div>
    </div>
  );
}
