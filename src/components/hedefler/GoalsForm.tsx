"use client";

import { useState, useTransition } from "react";
import {
  ShoppingBag, LayoutGrid, DollarSign, Dumbbell,
  BookOpen, Moon, Save, Loader2, CheckCircle2, Info
} from "lucide-react";
import { saveGoals } from "@/app/(app)/hedefler/actions";
import type { UserGoals } from "@/types/database";
import { cn } from "@/lib/utils";

interface GoalFieldProps {
  name: string;
  label: string;
  value: number;
  hint: string;
  icon: React.ElementType;
  accent: string;
  step?: string;
  min?: string;
  max?: string;
}

function GoalField({
  name, label, value, hint, icon: Icon, accent, step = "1", min = "0", max
}: GoalFieldProps) {
  const [current, setCurrent] = useState(value);

  return (
    <div
      className="rounded-[10px] border border-border p-4 space-y-3"
      style={{ backgroundColor: "#1E2230" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0"
          style={{ background: `${accent}20` }}
        >
          <Icon size={15} style={{ color: accent }} />
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary leading-none">{label}</p>
          <p className="text-[11px] text-text-muted mt-0.5">{hint}</p>
        </div>
      </div>

      {/* Input + display */}
      <div className="flex items-center gap-3">
        <input
          name={name}
          type="number"
          step={step}
          min={min}
          max={max}
          value={current}
          onChange={(e) => setCurrent(parseFloat(e.target.value) || 0)}
          className="input-base text-lg font-bold tabular-nums text-center w-full"
          style={{ color: accent }}
        />
      </div>

      {/* Visual progress bar placeholder */}
      <div
        className="h-1.5 rounded-full"
        style={{ background: `${accent}20` }}
      >
        <div
          className="h-full rounded-full opacity-50"
          style={{ width: "40%", background: accent }}
        />
      </div>
    </div>
  );
}

interface GoalsFormProps {
  goals: Omit<UserGoals, "id" | "user_id" | "updated_at"> & {
    id: string | null;
    user_id: string | null;
    updated_at: string | null;
  };
}

export function GoalsForm({ goals }: GoalsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  function handleSubmit(formData: FormData) {
    setResult(null);
    startTransition(async () => {
      const res = await saveGoals(formData);
      if (res?.error) {
        setResult({ ok: false, msg: res.error });
      } else {
        setResult({ ok: true, msg: "Hedefler başarıyla kaydedildi!" });
      }
    });
  }

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div
        className="flex items-start gap-3 rounded-[10px] border border-accent-blue/25 bg-accent-blue/08 px-4 py-3"
      >
        <Info size={15} className="text-accent-blue mt-0.5 shrink-0" />
        <p className="text-sm text-text-muted">
          Bu hedefler Dashboard&apos;daki ilerleme çubuklarını besler.{" "}
          <span className="text-text-primary">Aylık hedef</span> olarak ayarlanır —
          her ay otomatik sıfırlanır.
        </p>
      </div>

      {/* Result */}
      {result && (
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-input border text-sm font-medium animate-slide-up",
            result.ok
              ? "bg-accent-green/10 border-accent-green/25 text-accent-green"
              : "bg-accent-red/10 border-accent-red/25 text-accent-red"
          )}
        >
          {result.ok ? <CheckCircle2 size={16} /> : "⚠️"}
          {result.msg}
        </div>
      )}

      <form action={handleSubmit} className="space-y-5">
        {/* Etsy Hedefleri */}
        <div>
          <h3 className="font-display font-bold text-sm text-text-muted uppercase tracking-wide mb-3">
            Etsy & Gelir
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <GoalField
              name="siparis_hedef"
              label="Aylık Sipariş"
              value={goals.siparis_hedef}
              hint="kaç adet sipariş"
              icon={ShoppingBag}
              accent="#4361EE"
            />
            <GoalField
              name="listing_hedef"
              label="Aylık Listing"
              value={goals.listing_hedef}
              hint="kaç listing ekle"
              icon={LayoutGrid}
              accent="#7209B7"
            />
            <GoalField
              name="ciro_hedef"
              label="Aylık Ciro"
              value={goals.ciro_hedef}
              hint="USD net gelir"
              icon={DollarSign}
              accent="#2DC653"
              step="10"
            />
          </div>
        </div>

        {/* Kişisel Hedefler */}
        <div>
          <h3 className="font-display font-bold text-sm text-text-muted uppercase tracking-wide mb-3">
            Kişisel Gelişim
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <GoalField
              name="egzersiz_hedef"
              label="Egzersiz"
              value={goals.egzersiz_hedef}
              hint="aylık toplam dakika"
              icon={Dumbbell}
              accent="#F59E0B"
              step="30"
            />
            <GoalField
              name="ingilizce_hedef"
              label="İngilizce"
              value={goals.ingilizce_hedef}
              hint="aylık toplam dakika"
              icon={BookOpen}
              accent="#E63946"
              step="30"
            />
            <GoalField
              name="okuma_hedef"
              label="Okuma"
              value={goals.okuma_hedef}
              hint="aylık toplam sayfa"
              icon={BookOpen}
              accent="#0EA5E9"
            />
            <GoalField
              name="uyku_hedef"
              label="Uyku Hedefi"
              value={goals.uyku_hedef}
              hint="günlük ortalama saat"
              icon={Moon}
              accent="#7209B7"
              step="0.5"
              min="4"
              max="12"
            />
          </div>
        </div>

        {/* Kaydet */}
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save size={16} />
              Hedefleri Kaydet
            </>
          )}
        </button>
      </form>
    </div>
  );
}
