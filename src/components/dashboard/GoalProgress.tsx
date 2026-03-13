import { Target, TrendingUp } from "lucide-react";
import { fmtNum, fmtUsd, fmtDuration, ayAdi } from "@/lib/utils";

interface Goal {
  label: string;
  current: number;
  target: number;
  format: "num" | "usd" | "duration";
  accent: "blue" | "green" | "amber" | "purple";
}

interface GoalProgressProps {
  goals: Goal[];
  ay: number;
  yil: number;
}

const ACCENT_COLORS = {
  blue:   { bar: "#4361EE", bg: "rgba(67,97,238,0.12)",  text: "#4361EE" },
  green:  { bar: "#2DC653", bg: "rgba(45,198,83,0.12)",  text: "#2DC653" },
  amber:  { bar: "#F59E0B", bg: "rgba(245,158,11,0.12)", text: "#F59E0B" },
  purple: { bar: "#7209B7", bg: "rgba(114,9,183,0.12)",  text: "#7209B7" },
};

function formatValue(value: number, format: Goal["format"]): string {
  if (format === "usd") return fmtUsd(value);
  if (format === "duration") return fmtDuration(value);
  return fmtNum(value);
}

function GoalBar({ goal }: { goal: Goal }) {
  const pct = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
  const colors = ACCENT_COLORS[goal.accent];
  const done = pct >= 100;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary">{goal.label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted tabular-nums">
            {formatValue(goal.current, goal.format)}
            <span className="text-text-disabled"> / {formatValue(goal.target, goal.format)}</span>
          </span>
          <span
            className="text-xs font-bold tabular-nums"
            style={{ color: done ? "#2DC653" : colors.text }}
          >
            {pct.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: done
              ? "linear-gradient(90deg, #2DC653, #0EA5E9)"
              : colors.bar,
            boxShadow: done
              ? "0 0 8px rgba(45,198,83,0.5)"
              : `0 0 8px ${colors.bg}`,
          }}
        />
      </div>
    </div>
  );
}

export function GoalProgress({ goals, ay, yil }: GoalProgressProps) {
  const allDone = goals.every((g) => g.current >= g.target && g.target > 0);
  const hasGoals = goals.some((g) => g.target > 0);

  return (
    <div
      className="rounded-card border border-border p-5"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        backgroundColor: "#161920",
        boxShadow: "0 1px 3px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.18)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-[8px] flex items-center justify-center"
            style={{ background: "rgba(67,97,238,0.15)" }}
          >
            <Target size={15} className="text-accent-blue" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-text-primary leading-none">
              Hedef Takibi
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              {ayAdi(ay)} {yil}
            </p>
          </div>
        </div>

        {allDone && hasGoals && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-green bg-accent-green/12 px-2.5 py-1 rounded-badge">
            <TrendingUp size={12} />
            Tüm hedefler tamam!
          </div>
        )}
      </div>

      {!hasGoals ? (
        <div className="py-8 text-center">
          <Target size={28} className="text-text-disabled mx-auto mb-2" />
          <p className="text-sm text-text-muted">Henüz hedef belirlenmedi</p>
          <p className="text-xs text-text-disabled mt-1">Hedefler sayfasından ekleyebilirsin</p>
        </div>
      ) : (
        <div className="space-y-5">
          {goals.map((goal) => (
            <GoalBar key={goal.label} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
}
