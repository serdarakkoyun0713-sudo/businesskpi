import { Suspense } from "react";
import { GirisYapClient } from "@/components/giris/GirisYapClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Günlük Giriş — BusinessKPI",
};

export default function GirisYapPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-text-primary">Günlük Veri Girişi</h2>
        <p className="text-sm text-text-muted mt-1">
          Manuel giriş yap ya da Web Activity Tracker CSV dosyasını yükle
        </p>
      </div>
      <Suspense fallback={<div className="h-40 rounded-card bg-bg-surface animate-pulse" />}>
        <GirisYapClient />
      </Suspense>
    </div>
  );
}
