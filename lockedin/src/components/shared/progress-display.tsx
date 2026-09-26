"use client";

import type { ReactNode } from "react";

import { ProgressRing } from "@/components/shared/progress-ring";
import { useFocusStore } from "@/lib/store/focus-store";
import { cn } from "@/lib/utils";

/** Shared progress visualization that follows the user's ring/bar preference. */
export function ProgressDisplay({
  value,
  className,
  barClassName,
  ringClassName,
  color = "var(--primary)",
  size = 56,
  strokeWidth = 7,
  children,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  ringClassName?: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
}) {
  const { state } = useFocusStore();
  const progress = Math.max(0, Math.min(1, value));

  if ((state.settings.goalProgressDisplay ?? "ring") === "ring") {
    return (
      <ProgressRing
        value={progress}
        size={size}
        strokeWidth={strokeWidth}
        color={color}
        className={cn(ringClassName, className)}
      >
        {children ?? (
          <span className="tabular text-xs font-semibold">
            {Math.round(progress * 100)}%
          </span>
        )}
      </ProgressRing>
    );
  }

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className={cn("h-full rounded-full transition-[width]", barClassName)}
        style={{ width: `${progress * 100}%`, backgroundColor: barClassName ? undefined : color }}
      />
    </div>
  );
}
