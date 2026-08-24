"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

import { FocusDebtChart } from "@/components/charts/focus-debt-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { healthFromRatio } from "@/lib/health";
import type { RangeSummary } from "@/lib/analytics";
import type { DayMetrics } from "@/lib/types";
import { cn, formatHours } from "@/lib/utils";

/**
 * Focus debt: the running gap between hours planned and hours delivered.
 *
 * Debt is shown against the 30-day window; the chart accumulates the daily
 * difference so repayment is visible as a downward slope.
 */
export function FocusDebtCard({
  summary,
  days,
}: {
  summary: RangeSummary;
  days: DayMetrics[];
}) {
  const debt = summary.netDebtHours;
  const inDebt = debt > 0;
  // Adherence ratio drives the colour: delivering everything reads as healthy.
  const health = healthFromRatio(
    summary.plannedHours > 0 ? summary.actualHours / summary.plannedHours : 1,
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Focus debt</CardTitle>
          <CardDescription>Last 30 days, planned versus delivered</CardDescription>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium",
            health.text,
            health.bg,
            health.border,
          )}
        >
          {inDebt ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          {inDebt ? "Accruing" : "Repaid"}
        </span>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-3 gap-3">
          <Metric label="Planned" value={formatHours(summary.plannedHours)} />
          <Metric label="Actual" value={formatHours(summary.actualHours)} />
          <Metric
            label={inDebt ? "Debt" : "Surplus"}
            value={formatHours(Math.abs(debt))}
            className={health.text}
          />
        </div>
        <FocusDebtChart days={days} height={180} />
      </CardContent>
    </Card>
  );
}

function Metric({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-card-elevated/60 px-3 py-2.5">
      <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className={cn("tabular mt-1 text-lg font-semibold", className)}>
        {value}
      </p>
    </div>
  );
}
