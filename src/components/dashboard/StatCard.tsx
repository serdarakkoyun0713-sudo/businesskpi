import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  change?: { value: string; positive: boolean; neutral: boolean };
  icon: LucideIcon;
  accent?: "blue" | "green" | "amber" | "red" | "purple" | "sky";
  size?: "default" | "lg";
}

const ACCENT_MAP = {
  blue:   { bg: "rgba(67,97,238,0.12)",   text: "#4361EE", glow: "rgba(67,97,238,0.2)" },
  green:  { bg: "rgba(45,198,83,0.12)",   text: "#2DC653", glow: "rgba(45,198,83,0.2)" },
  amber:  { bg: "rgba(245,158,11,0.12)",  text: "#F59E0B", glow: "rgba(245,158,11,0.2)" },
  red:    { bg: "rgba(230,57,70,0.12)",   text: "#E63946", glow: "rgba(230,57,70,0.2)" },
  purple: { bg: "rgba(114,9,183,0.12)",   text: "#7209B7", glow: "rgba(114,9,183,0.2)" },
  sky:    { bg: "rgba(14,165,233,0.12)",  text: "#0EA5E9", glow: "rgba(14,165,233,0.2)" },
};

export function StatCard({
  label,
  value,
  sub,
  change,
  icon: Icon,
  accent = "blue",
  size = "default",
}: StatCardProps) {
  const colors = ACCENT_MAP[accent];

  return (
    <div
      className="relative rounded-card border border-border overflow-hidden group
                 hover:border-opacity-70 transition-all duration-200"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)",
        backgroundColor: "#161920",
        boxShadow: "0 1px 3px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.18)",
      }}
    >
      {/* Subtle left border accent */}
      <div
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full opacity-70"
        style={{ background: colors.text }}
      />

      <div className={cn("flex items-start justify-between", size === "lg" ? "p-6" : "p-5")}>
        {/* Left content */}
        <div className="min-w-0">
          <p className="text-xs font-semibold text-text-muted tracking-wide uppercase mb-2.5">
            {label}
          </p>
          <p
            className={cn(
              "font-display font-bold text-text-primary leading-none tabular-nums",
              size === "lg" ? "text-3xl" : "text-2xl"
            )}
          >
            {value}
          </p>
          {sub && (
            <p className="text-xs text-text-muted mt-1.5">{sub}</p>
          )}
          {change && !change.neutral && (
            <div
              className={cn(
                "inline-flex items-center gap-1 mt-2.5 px-2 py-0.5 rounded-badge text-xs font-semibold",
                change.positive
                  ? "bg-accent-green/12 text-accent-green"
                  : "bg-accent-red/12 text-accent-red"
              )}
            >
              {change.positive
                ? <TrendingUp size={11} />
                : <TrendingDown size={11} />}
              {change.value}
              <span className="text-[10px] font-normal opacity-70 ml-0.5">geçen aya göre</span>
            </div>
          )}
          {change?.neutral && (
            <div className="inline-flex items-center gap-1 mt-2.5 px-2 py-0.5 rounded-badge text-xs font-semibold bg-border/60 text-text-disabled">
              <Minus size={11} />
              Karşılaştırma yok
            </div>
          )}
        </div>

        {/* Icon */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-[10px] flex items-center justify-center ml-3"
          style={{
            background: colors.bg,
            boxShadow: `0 0 16px ${colors.glow}`,
          }}
        >
          <Icon size={18} style={{ color: colors.text }} />
        </div>
      </div>
    </div>
  );
}
