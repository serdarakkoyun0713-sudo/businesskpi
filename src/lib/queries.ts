import { createClient } from "@/lib/supabase/server";
import type { DailyEntry, MonthlyNet } from "@/types/database";

/** Bu ayki tüm daily_entries kayıtları */
export async function getMonthEntries(yil: number, ay: number): Promise<DailyEntry[]> {
  const supabase = await createClient();
  const start = `${yil}-${String(ay).padStart(2, "0")}-01`;
  const end = `${yil}-${String(ay).padStart(2, "0")}-31`;

  const { data } = await supabase
    .from("daily_entries")
    .select("*")
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: true });

  return data ?? [];
}

/** Geçen ayki kayıtlar */
export async function getPrevMonthEntries(yil: number, ay: number): Promise<DailyEntry[]> {
  const d = new Date(yil, ay - 2, 1);
  return getMonthEntries(d.getFullYear(), d.getMonth() + 1);
}

/** Son 14 günlük kayıtlar */
export async function getLast14Days(): Promise<DailyEntry[]> {
  const supabase = await createClient();
  const d = new Date();
  d.setDate(d.getDate() - 13);
  const start = d.toISOString().slice(0, 10);

  const { data } = await supabase
    .from("daily_entries")
    .select("*")
    .gte("date", start)
    .order("date", { ascending: true });

  return data ?? [];
}

/** Bugünün kaydı */
export async function getTodayEntry(): Promise<DailyEntry | null> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from("daily_entries")
    .select("*")
    .eq("date", today)
    .single();

  return data ?? null;
}

/** Bu yılın tüm monthly_net kayıtları */
export async function getYearlyNet(yil: number): Promise<MonthlyNet[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("monthly_net")
    .select("*")
    .eq("yil", yil)
    .order("ay", { ascending: true });

  return data ?? [];
}

/** Bu ay ve geçen ayın monthly_net kaydı */
export async function getMonthlyNet(yil: number, ay: number): Promise<MonthlyNet | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("monthly_net")
    .select("*")
    .eq("yil", yil)
    .eq("ay", ay)
    .single();

  return data ?? null;
}

/** Hedefler tablosu yoksa localStorage ile çalış — sadece client-side */
export const DEFAULT_GOALS = {
  siparis_hedef: 100,
  listing_hedef: 50,
  ciro_hedef: 500,
  egzersiz_hedef: 600, // dakika / ay
};
