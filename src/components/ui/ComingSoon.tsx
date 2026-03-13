import type { LucideIcon } from "lucide-react";
import { Hammer } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  accent?: string;
}

export function ComingSoon({
  title,
  description,
  icon: Icon = Hammer,
  accent = "#4361EE",
}: ComingSoonProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4 max-w-sm">
        <div
          className="w-16 h-16 rounded-card mx-auto flex items-center justify-center"
          style={{ background: `${accent}20` }}
        >
          <Icon size={28} style={{ color: accent }} />
        </div>
        <h2 className="font-display text-xl font-bold text-text-primary">{title}</h2>
        <p className="text-text-muted text-sm leading-relaxed">{description}</p>
        <div
          className="inline-block px-3 py-1.5 rounded-badge text-xs font-semibold"
          style={{ background: `${accent}15`, color: accent }}
        >
          Yakında
        </div>
      </div>
    </div>
  );
}
