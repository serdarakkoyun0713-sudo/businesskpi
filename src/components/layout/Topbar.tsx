"use client";

import { usePathname } from "next/navigation";
import { AYLAR } from "@/lib/utils";
import { Bell } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/giris-yap": "Günlük Giriş",
  "/ozetler": "Özetler",
  "/zaman": "Zaman Dağılımı",
  "/hedefler": "Hedefler",
};

interface TopbarProps {
  email?: string;
}

export function Topbar({ email }: TopbarProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  const now = new Date();
  const dateStr = `${now.getDate()} ${AYLAR[now.getMonth()]} ${now.getFullYear()}`;

  const initials = email
    ? email.slice(0, 2).toUpperCase()
    : "?";

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b border-border"
      style={{ background: "#161920" }}
    >
      {/* Left */}
      <div>
        <h1 className="font-display text-lg font-bold text-text-primary leading-none">
          {title}
        </h1>
        <p className="text-xs text-text-muted mt-1">{dateStr}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Bell placeholder */}
        <button className="w-9 h-9 flex items-center justify-center rounded-[10px] border border-border text-text-muted hover:text-text-primary hover:bg-bg-surface2 transition-all">
          <Bell size={16} />
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{
            background: "linear-gradient(135deg, #4361EE 0%, #7209B7 100%)",
          }}
          title={email}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
