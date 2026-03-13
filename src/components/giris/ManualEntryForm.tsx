"use client";

import { useState, useTransition, useEffect } from "react";
import {
  ShoppingBag, DollarSign, LayoutGrid, Moon, Dumbbell,
  BookOpen, Monitor, Smartphone, Save, Loader2, CheckCircle2,
  ChevronDown, ChevronUp, StickyNote, Globe
} from "lucide-react";
import { saveManualEntry, getEntryForDate } from "@/app/(app)/giris-yap/actions";
import type { DailyEntry } from "@/types/database";
import { cn } from "@/lib/utils";

// ─── Tarih seçici ──────────────────────────────────────────────────────────

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ─── Alt bileşenler ────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  color,
  open,
  onToggle,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-4 hover:bg-bg-surface2 transition-colors rounded-t-card"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-[8px] flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon size={14} style={{ color }} />
        </div>
        <span className="font-display font-bold text-sm text-text-primary">{title}</span>
      </div>
      {open
        ? <ChevronUp size={16} className="text-text-muted" />
        : <ChevronDown size={16} className="text-text-muted" />}
    </button>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string | number | null;
  hint?: string;
  min?: string;
  step?: string;
}

function Field({ label, name, type = "number", placeholder, defaultValue, hint, min = "0", step }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold text-text-muted tracking-wide uppercase">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder ?? "—"}
        defaultValue={defaultValue ?? ""}
        min={type === "number" ? min : undefined}
        step={step}
        className="input-base text-sm"
      />
      {hint && <p className="text-[10px] text-text-disabled">{hint}</p>}
    </div>
  );
}

// ─── Ana bileşen ────────────────────────────────────────────────────────────

interface ManualEntryFormProps {
  initialDate?: string;
}

export function ManualEntryForm({ initialDate }: ManualEntryFormProps) {
  const [date, setDate] = useState(initialDate ?? todayISO());
  const [existing, setExisting] = useState<DailyEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  // Bölümler açık/kapalı
  const [openSections, setOpenSections] = useState({
    etsy: true,
    kisisel: true,
    web: false,
    araclar: false,
    not_: false,
  });

  function toggleSection(k: keyof typeof openSections) {
    setOpenSections((p) => ({ ...p, [k]: !p[k] }));
  }

  // Tarih değişince mevcut kaydı yükle
  useEffect(() => {
    if (!date) return;
    setLoading(true);
    setResult(null);
    getEntryForDate(date).then((entry) => {
      setExisting(entry);
      setLoading(false);
    });
  }, [date]);

  function handleSubmit(formData: FormData) {
    setResult(null);
    startTransition(async () => {
      const res = await saveManualEntry(formData);
      if (res?.error) {
        setResult({ ok: false, msg: res.error });
      } else {
        setResult({ ok: true, msg: "Kayıt başarıyla kaydedildi!" });
        // Mevcut kaydı yenile
        getEntryForDate(date).then(setExisting);
      }
    });
  }

  const e = existing; // kısa alias

  return (
    <div className="space-y-4">
      {/* Tarih seçici */}
      <div
        className="rounded-card border border-border p-5"
        style={{ backgroundColor: "#161920" }}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-text-muted tracking-wide uppercase mb-1.5">
              Tarih
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={todayISO()}
              className="input-base text-sm w-full max-w-[220px]"
            />
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <Loader2 size={14} className="animate-spin" />
              Yükleniyor...
            </div>
          )}

          {!loading && e && (
            <div className="flex items-center gap-2 text-accent-amber text-sm font-medium bg-accent-amber/10 px-3 py-1.5 rounded-badge border border-accent-amber/25">
              <CheckCircle2 size={14} />
              Bu tarihe ait kayıt mevcut — düzenleyebilirsin
            </div>
          )}

          {!loading && !e && date && (
            <div className="flex items-center gap-2 text-accent-blue text-sm font-medium bg-accent-blue/10 px-3 py-1.5 rounded-badge border border-accent-blue/25">
              Yeni kayıt
            </div>
          )}
        </div>
      </div>

      {/* Sonuç bildirimi */}
      {result && (
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-input border text-sm font-medium animate-slide-up",
            result.ok
              ? "bg-accent-green/10 border-accent-green/25 text-accent-green"
              : "bg-accent-red/10 border-accent-red/25 text-accent-red"
          )}
        >
          {result.ok ? <CheckCircle2 size={16} /> : <span>⚠️</span>}
          {result.msg}
        </div>
      )}

      <form action={handleSubmit}>
        {/* Gizli tarih alanı */}
        <input type="hidden" name="date" value={date} />

        <div className="space-y-3">
          {/* ── ETSY & İŞ ── */}
          <div
            className="rounded-card border border-border overflow-hidden"
            style={{ backgroundColor: "#161920" }}
          >
            <SectionHeader
              icon={ShoppingBag}
              title="Etsy & İş"
              color="#F59E0B"
              open={openSections.etsy}
              onToggle={() => toggleSection("etsy")}
            />
            {openSections.etsy && (
              <div className="px-5 pb-5 border-t border-border">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                  <Field label="Sipariş" name="siparis" placeholder="0" defaultValue={e?.siparis} />
                  <Field label="Listing" name="listing" placeholder="0" defaultValue={e?.listing} />
                  <Field
                    label="Ciro (USD)"
                    name="ciro"
                    placeholder="0.00"
                    defaultValue={e?.ciro ?? ""}
                    step="0.01"
                    hint="Nokta ile ayır: 12.50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── KİŞİSEL GELİŞİM ── */}
          <div
            className="rounded-card border border-border overflow-hidden"
            style={{ backgroundColor: "#161920" }}
          >
            <SectionHeader
              icon={Dumbbell}
              title="Kişisel Gelişim"
              color="#2DC653"
              open={openSections.kisisel}
              onToggle={() => toggleSection("kisisel")}
            />
            {openSections.kisisel && (
              <div className="px-5 pb-5 border-t border-border">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  <Field
                    label="Uyku"
                    name="uyku"
                    type="text"
                    placeholder="7:30"
                    defaultValue={e?.uyku ?? ""}
                    hint="Saat:Dakika (ör. 7:30)"
                  />
                  <Field
                    label="Egzersiz (dk)"
                    name="egzersiz_dk"
                    placeholder="0"
                    defaultValue={e?.egzersiz_dk}
                    hint="Toplam dakika"
                  />
                  <Field
                    label="İngilizce (dk)"
                    name="ingilizce_dk"
                    placeholder="0"
                    defaultValue={e?.ingilizce_dk}
                  />
                  <Field
                    label="Okuma (sayfa)"
                    name="okuma_syf"
                    placeholder="0"
                    defaultValue={e?.okuma_syf}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── WEB AKTİVİTESİ ── */}
          <div
            className="rounded-card border border-border overflow-hidden"
            style={{ backgroundColor: "#161920" }}
          >
            <SectionHeader
              icon={Globe}
              title="Web Aktivitesi (dakika)"
              color="#4361EE"
              open={openSections.web}
              onToggle={() => toggleSection("web")}
            />
            {openSections.web && (
              <div className="px-5 pb-5 border-t border-border">
                <div className="pt-3 pb-2">
                  <p className="text-xs text-text-muted flex items-center gap-2">
                    <Monitor size={12} /> PC siteleri
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Field label="YouTube PC" name="yt_pc" defaultValue={e?.yt_pc} />
                  <Field label="Gmail/Docs" name="gmail_pc" defaultValue={e?.gmail_pc} />
                  <Field label="WhatsApp Web" name="wa_pc" defaultValue={e?.wa_pc} />
                  <Field label="Gmail Mob." name="gmail_mob" defaultValue={e?.gmail_mob} />
                </div>
                <div className="pt-4 pb-2">
                  <p className="text-xs text-text-muted flex items-center gap-2">
                    <Smartphone size={12} /> Mobil siteler
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Field label="YouTube Mob." name="yt_mob" defaultValue={e?.yt_mob} />
                  <Field label="Instagram" name="ig_mob" defaultValue={e?.ig_mob} />
                  <Field label="WhatsApp Mob." name="wa_mob" defaultValue={e?.wa_mob} />
                </div>
              </div>
            )}
          </div>

          {/* ── ARAÇLAR & AI ── */}
          <div
            className="rounded-card border border-border overflow-hidden"
            style={{ backgroundColor: "#161920" }}
          >
            <SectionHeader
              icon={Monitor}
              title="Araçlar & AI (dakika)"
              color="#7209B7"
              open={openSections.araclar}
              onToggle={() => toggleSection("araclar")}
            />
            {openSections.araclar && (
              <div className="px-5 pb-5 border-t border-border">
                <div className="pt-3 pb-2">
                  <p className="text-xs text-text-muted">Tasarım & Üretim</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Field label="Etsy Seller" name="etsy_seller" defaultValue={e?.etsy_seller} />
                  <Field label="Etsy Buyer" name="etsy_buyer" defaultValue={e?.etsy_buyer} />
                  <Field label="Printify" name="printify" defaultValue={e?.printify} />
                  <Field label="Kittl" name="kittl" defaultValue={e?.kittl} />
                  <Field label="Canva" name="canva" defaultValue={e?.canva} />
                </div>
                <div className="pt-4 pb-2">
                  <p className="text-xs text-text-muted">AI Araçları</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Field label="ChatGPT" name="chatgpt" defaultValue={e?.chatgpt} />
                  <Field label="Claude AI" name="claude_ai" defaultValue={e?.claude_ai} />
                  <Field label="Gemini" name="gemini" defaultValue={e?.gemini} />
                </div>
              </div>
            )}
          </div>

          {/* ── NOT ── */}
          <div
            className="rounded-card border border-border overflow-hidden"
            style={{ backgroundColor: "#161920" }}
          >
            <SectionHeader
              icon={StickyNote}
              title="Not"
              color="#7B8299"
              open={openSections.not_}
              onToggle={() => toggleSection("not_")}
            />
            {openSections.not_ && (
              <div className="px-5 pb-5 border-t border-border pt-4">
                <textarea
                  name="not_"
                  rows={3}
                  placeholder="Bugüne dair notlar..."
                  defaultValue={e?.not_ ?? ""}
                  className="input-base text-sm resize-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Kaydet butonu */}
        <div className="pt-2">
          <button type="submit" disabled={isPending} className="btn-primary">
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save size={16} />
                {e ? "Güncelle" : "Kaydet"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
