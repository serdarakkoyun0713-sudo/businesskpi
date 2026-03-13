"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function register(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("passwordConfirm") as string;

  if (!email || !password) {
    return { error: "E-posta ve şifre gereklidir." };
  }

  if (password.length < 6) {
    return { error: "Şifre en az 6 karakter olmalıdır." };
  }

  if (password !== passwordConfirm) {
    return { error: "Şifreler eşleşmiyor." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes("User already registered")) {
      return { error: "Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin." };
    }
    return { error: "Kayıt olunamadı. Lütfen tekrar deneyin." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
