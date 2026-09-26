import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: LucideIcon;
  /** Signed percentage/absolute delta versus the previous period. */
  delta?: number;
  /** Set when a rising delta is bad (e.g. focus debt, interruptions). */
  invertDelta?: boolean;
  deltaSuffix?: string;
  /** Tailwind text colour class for the value, usually from a health band. */
  accentClassName?: string;
  footer?: ReactNode;
  className?: string;
}

/** Compact KPI tile used across the dashboard and analytics pages. */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  delta,
  invertDelta = false,
  deltaSuffix = "%",
  accentClassName,
  footer,
  className,
}: StatCardProps) {
  const hasDelta = typeof delta === "number" && Number.isFinite(delta);
  const positive = hasDelta ? (invertDelta ? delta < 0 : delta > 0) : false;
  const flat = hasDelta ? Math.abs(delta) < 0.5 : false;
  const DeltaIcon = flat ? ArrowRight : positive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className={cn("gap-0 p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        {Icon ? (
          <span className="rounded-md bg-secondary/70 p-1.5 text-muted-foreground">
            <Icon className="size-3.5" />
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-end gap-2">
        <span
          className={cn(
            "tabular text-2xl leading-none font-semibold",
            accentClassName,
          )}
        >
          {value}
        </span>
        {hasDelta ? (
          <span
            className={cn(
              "mb-0.5 inline-flex items-center gap-0.5 text-xs font-medium",
              flat
                ? "text-muted-foreground"
                : positive
                  ? "text-health-excellent"
                  : "text-health-critical",
            )}
          >
            <DeltaIcon className="size-3" />
            {Math.abs(Math.round(delta))}
            {deltaSuffix}
          </span>
        ) : null}
      </div>

      {hint ? (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {footer ? <div className="mt-3">{footer}</div> : null}
    </Card>
  );
}
