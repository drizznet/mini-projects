"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, formatHours } from "@/lib/utils";

/**
 * Quarter-hour budget stepper.
 *
 * Planning in 15-minute increments keeps allocations realistic and makes the
 * adherence maths readable; free-text hour entry invited noise.
 */
export function HoursStepper({
  value,
  onChange,
  step = 0.25,
  min = 0.25,
  max = 12,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  className?: string;
}) {
  const set = (next: number) =>
    onChange(Math.round(Math.min(max, Math.max(min, next)) * 100) / 100);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border border-border bg-card-elevated/60 p-0.5",
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => set(value - step)}
        disabled={value <= min}
        aria-label="Decrease allocation"
      >
        <Minus className="size-3.5" />
      </Button>
      <span className="tabular w-16 text-center text-xs font-medium">
        {formatHours(value)}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => set(value + step)}
        disabled={value >= max}
        aria-label="Increase allocation"
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
}
