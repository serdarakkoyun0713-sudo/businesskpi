"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { DbColumn } from "@/lib/csvParser";

// ─── Manuel form kaydetme ─────────────────────────────────────────────────────

export async function saveManualEntry(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum bulunamadı." };

  const date = formData.get("date") as string;
  if (!date) return { error: "Tarih zorunludur." };

  function getInt(key: string): number | null {
    const v = formData.get(key);
    if (!v || v === "") return null;
    const n = parseInt(v as string, 10);
    return isNaN(n) ? null : n;
  }
  function getFloat(key: string): number | null {
    const v = formData.get(key);
    if (!v || v === "") return null;
    const n = parseFloat(v as string);
    return isNaN(n) ? null : n;
  }
  function getText(key: string): string | null {
    const v = formData.get(key);
    return v && (v as string).trim() !== "" ? (v as string).trim() : null;
  }

  const entry = {
    user_id:      user.id,
    date,
    siparis:      getInt("siparis"),
    listing:      getInt("listing"),
    ciro:         getFloat("ciro"),
    uyku:         getText("uyku"),
    egzersiz_dk:  getInt("egzersiz_dk"),
    ingilizce_dk: getInt("ingilizce_dk"),
    okuma_syf:    getInt("okuma_syf"),
    yt_pc:        getInt("yt_pc"),
    yt_mob:       getInt("yt_mob"),
    ig_mob:       getInt("ig_mob"),
    gmail_pc:     getInt("gmail_pc"),
    gmail_mob:    getInt("gmail_mob"),
    wa_mob:       getInt("wa_mob"),
    wa_pc:        getInt("wa_pc"),
    kittl:        getInt("kittl"),
    canva:        getInt("canva"),
    printify:     getInt("printify"),
    etsy_seller:  getInt("etsy_seller"),
    etsy_buyer:   getInt("etsy_buyer"),
    chatgpt:      getInt("chatgpt"),
    claude_ai:    getInt("claude_ai"),
    gemini:       getInt("gemini"),
    not_:         getText("not_"),
  };

  // Upsert: aynı tarih varsa güncelle, yoksa ekle
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase
    .from("daily_entries")
    .upsert(entry as any, { onConflict: "user_id,date" });

  if (error) {
    console.error("saveManualEntry error:", error);
    return { error: "Kayıt sırasında hata oluştu: " + error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/giris-yap");
  return { success: true };
}

// ─── CSV verisi kaydetme (merge: mevcut değere ekle) ─────────────────────────

export interface CsvDayPayload {
  date: string;
  columnTotals: Partial<Record<DbColumn, number>>;
}

export async function saveCsvEntries(days: CsvDayPayload[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum bulunamadı." };
  if (days.length === 0) return { error: "Kaydedilecek veri yok." };

  const errors: string[] = [];
  let saved = 0;

  for (const day of days) {
    // Mevcut kaydı çek
    const { data: existing } = await supabase
      .from("daily_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", day.date)
      .single();

    // Merge: mevcut + yeni dakikaları topla
    const merged: Record<string, number | null> = {};
    for (const [col, minutes] of Object.entries(day.columnTotals)) {
      const prevVal = existing ? (existing[col as keyof typeof existing] as number | null) : null;
      merged[col] = (prevVal ?? 0) + (minutes ?? 0);
    }

    const upsertData = {
      user_id: user.id,
      date: day.date,
      ...merged,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase
      .from("daily_entries")
      .upsert(upsertData as any, { onConflict: "user_id,date" });

    if (error) {
      errors.push(`${day.date}: ${error.message}`);
    } else {
      saved++;
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/giris-yap");

  if (errors.length > 0) {
    return { error: `${saved} gün kaydedildi, ${errors.length} hata: ${errors.join("; ")}` };
  }
  return { success: true, saved };
}

// ─── Belirli bir tarihin mevcut kaydını getir ─────────────────────────────────

export async function getEntryForDate(date: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("daily_entries")
    .select("*")
    .eq("date", date)
    .single();
  return data ?? null;
}
