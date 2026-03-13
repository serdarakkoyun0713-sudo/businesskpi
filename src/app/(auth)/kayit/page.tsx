import { RegisterForm } from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kayıt Ol — BusinessKPI",
  description: "Ücretsiz hesap oluştur",
};

export default function KayitPage() {
  return <RegisterForm />;
}
