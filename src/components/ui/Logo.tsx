import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const iconSizes = { sm: 28, md: 36, lg: 48 };
  const textSizes = { sm: "text-base", md: "text-xl", lg: "text-2xl" };
  const s = iconSizes[size];

  return (
    <div className="flex items-center gap-3">
      {/* Icon mark */}
      <div
        className="relative flex-shrink-0 rounded-[10px] flex items-center justify-center"
        style={{
          width: s,
          height: s,
          background: "linear-gradient(135deg, #4361EE 0%, #7209B7 100%)",
          boxShadow: "0 4px 16px rgba(67, 97, 238, 0.4)",
        }}
      >
        {/* Bar chart icon */}
        <svg
          width={s * 0.55}
          height={s * 0.55}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="1" y="10" width="4" height="8" rx="1.5" fill="white" fillOpacity="0.9" />
          <rect x="8" y="6" width="4" height="12" rx="1.5" fill="white" />
          <rect x="15" y="2" width="4" height="16" rx="1.5" fill="white" fillOpacity="0.7" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-display font-800 tracking-tight ${textSizes[size]} text-text-primary`}
          >
            Business
            <span
              style={{
                background: "linear-gradient(90deg, #4361EE, #0EA5E9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              KPI
            </span>
          </span>
          {size !== "sm" && (
            <span className="text-[10px] text-text-muted tracking-widest uppercase font-medium mt-0.5">
              Etsy POD Tracker
            </span>
          )}
        </div>
      )}
    </div>
  );
}
