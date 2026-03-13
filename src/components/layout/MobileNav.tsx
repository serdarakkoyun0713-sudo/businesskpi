"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  PieChart,
  Target,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Ana" },
  { href: "/giris-yap", icon: CalendarDays, label: "Giriş" },
  { href: "/ozetler", icon: BarChart3, label: "Özet" },
  { href: "/zaman", icon: PieChart, label: "Zaman" },
  { href: "/hedefler", icon: Target, label: "Hedef" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 border-t border-border z-50 flex items-center"
      style={{ background: "#161920" }}
    >
      {NAV.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors
              ${active ? "text-accent-blue" : "text-text-disabled"}`}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
