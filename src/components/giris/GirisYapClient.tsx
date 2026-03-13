"use client";

import { useState } from "react";
import { PenLine, Upload } from "lucide-react";
import { ManualEntryForm } from "./ManualEntryForm";
import { CsvUploader } from "./CsvUploader";
import { cn } from "@/lib/utils";

type Tab = "manuel" | "csv";

export function GirisYapClient() {
  const [tab, setTab] = useState<Tab>("manuel");

  return (
    <div className="space-y-5">
      {/* Tab seçici */}
      <div
        className="flex p-1 rounded-input gap-1"
        style={{ background: "#1E2230" }}
      >
        <TabButton
          active={tab === "manuel"}
          icon={PenLine}
          label="Manuel Giriş"
          onClick={() => setTab("manuel")}
        />
        <TabButton
          active={tab === "csv"}
          icon={Upload}
          label="CSV Yükle"
          onClick={() => setTab("csv")}
          badge="Web Activity Tracker"
        />
      </div>

      {/* İçerik */}
      <div className="animate-fade-in">
        {tab === "manuel" ? <ManualEntryForm /> : <CsvUploader />}
      </div>
    </div>
  );
}

function TabButton({
  active,
  icon: Icon,
  label,
  onClick,
  badge,
}: {
  active: boolean;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[8px] text-sm font-semibold",
        "transition-all duration-200",
        active
          ? "bg-accent-blue text-white shadow-sm"
          : "text-text-muted hover:text-text-primary hover:bg-bg-surface2"
      )}
    >
      <Icon size={15} />
      <span>{label}</span>
      {badge && !active && (
        <span
          className="hidden sm:inline text-[10px] font-bold px-1.5 py-0.5 rounded-[5px]"
          style={{ background: "rgba(67,97,238,0.2)", color: "#4361EE" }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
