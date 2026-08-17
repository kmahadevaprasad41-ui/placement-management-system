import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  showLabel?: boolean;
  color?: "blue" | "emerald" | "amber" | "rose" | "purple";
  size?: "sm" | "md" | "lg";
}

export function Progress({
  value,
  showLabel = false,
  color = "blue",
  size = "md",
  className,
  ...props
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const colors = {
    blue: "bg-blue-600",
    emerald: "bg-emerald-600",
    amber: "bg-amber-500",
    rose: "bg-rose-600",
    purple: "bg-purple-600",
  };

  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className={cn("w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800", sizes[size])}>
        <div
          className={cn("h-full transition-all duration-500 rounded-full", colors[color])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
