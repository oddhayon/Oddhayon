import React from "react";

interface ProgressBarProps {
  progress: number; // 0 - 100
  color?: "indigo" | "emerald" | "amber" | "rose" | "purple";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = "indigo",
  size = "md",
  showLabel = false,
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const heightClass = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3.5",
  }[size];

  const colorClass = {
    indigo: "bg-indigo-600 dark:bg-indigo-500",
    emerald: "bg-emerald-600 dark:bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-600 dark:bg-rose-500",
    purple: "bg-purple-600 dark:bg-purple-500",
  }[color];

  return (
    <div className="w-full space-y-1">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-stone-600 dark:text-stone-400">
          <span>{clamped}% Complete</span>
        </div>
      )}

      <div
        className={`w-full bg-stone-200/80 dark:bg-stone-800 rounded-full overflow-hidden ${heightClass}`}
      >
        <div
          className={`${heightClass} ${colorClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
