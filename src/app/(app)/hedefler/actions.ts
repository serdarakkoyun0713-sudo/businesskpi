"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveGoals(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum bulunamadı." };

  function getNum(key: string): number {
    const v = formData.get(key);
    if (!v) return 0;
    return parseFloat(v as string) || 0;
  }

  const goals = {
    user_id:         user.id,
    siparis_hedef:   getNum("siparis_hedef"),
    listing_hedef:   getNum("listing_hedef"),
    ciro_hedef:      getNum("ciro_hedef"),
    egzersiz_hedef:  getNum("egzersiz_hedef"),
    ingilizce_hedef: getNum("ingilizce_hedef"),
    okuma_hedef:     getNum("okuma_hedef"),
    uyku_hedef:      getNum("uyku_hedef"),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase
    .from("user_goals")
    .upsert(goals as any, { onConflict: "user_id" });

  if (error) return { error: "Kaydedilemedi: " + error.message };

  revalidatePath("/hedefler");
  revalidatePath("/dashboard");
  return { success: true };
}
