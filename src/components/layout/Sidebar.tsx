"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  PieChart,
  Target,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/giris-yap", icon: CalendarDays, label: "Günlük Giriş" },
  { href: "/ozetler", icon: BarChart3, label: "Özetler" },
  { href: "/zaman", icon: PieChart, label: "Zaman Dağılımı" },
  { href: "/hedefler", icon: Target, label: "Hedefler" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/giris");
    router.refresh();
  }

  return (
    <aside
      className="hidden md:flex flex-col w-[220px] min-h-screen border-r border-border shrink-0"
      style={{ background: "#161920" }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <Logo size="sm" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-150 group
                ${active
                  ? "bg-accent-blue/15 text-accent-blue"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-surface2"
                }`}
            >
              <Icon
                size={17}
                className={`shrink-0 transition-colors ${active ? "text-accent-blue" : "text-text-disabled group-hover:text-text-muted"}`}
              />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-blue" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium
                     text-text-muted hover:text-accent-red hover:bg-accent-red/10
                     transition-all duration-150 w-full group"
        >
          <LogOut size={17} className="shrink-0 transition-colors" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
