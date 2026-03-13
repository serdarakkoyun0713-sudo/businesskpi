import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { YearlyCards } from "@/components/ozetler/YearlyCards";
import { MonthlyTable } from "@/components/ozetler/MonthlyTable";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Özetler — BusinessKPI" };

async function getAllYearData(yil: number) {
  const supabase = await createClient();

  const start = `${yil}-01-01`;
  const end   = `${yil}-12-31`;

  const [{ data: entries }, { data: netList }] = await Promise.all([
    supabase.from("daily_entries").select("*").gte("date", start).lte("date", end).order("date"),
    supabase.from("monthly_net").select("*").eq("yil", yil).order("ay"),
  ]);

  return { entries: entries ?? [], netList: netList ?? [] };
}

export default async function OzetlerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  const yil = new Date().getFullYear();
  const { entries, netList } = await getAllYearData(yil);

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div>
        <h2 className="font-display text-xl font-bold text-text-primary">Özetler</h2>
        <p className="text-sm text-text-muted mt-1">Yıllık ve aylık performans özeti</p>
      </div>

      <YearlyCards entries={entries} netList={netList} yil={yil} />
      <MonthlyTable entries={entries} netList={netList} yil={yil} />
    </div>
  );
}
