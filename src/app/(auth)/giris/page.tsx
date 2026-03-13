import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş Yap — BusinessKPI",
  description: "Hesabına giriş yap",
};

export default function GirisPage() {
  return <LoginForm />;
}
