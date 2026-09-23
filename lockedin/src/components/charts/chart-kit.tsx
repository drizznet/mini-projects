"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Shared Recharts styling.
 *
 * Charts across the app pull their axis, grid and tooltip presentation from
 * here so every visualisation reads from the same design tokens. Spread
 * `AXIS_PROPS` onto XAxis/YAxis and pass `<ChartTooltip />` to `content`.
 */
export const AXIS_PROPS = {
  stroke: "var(--muted-foreground)",
  tickLine: false,
  axisLine: false,
  tick: { fontSize: 11, fill: "var(--muted-foreground)" },
} as const;

export const GRID_PROPS = {
  stroke: "var(--grid-line)",
  strokeDasharray: "3 3",
  vertical: false,
} as const;

interface TooltipEntry {
  name?: string | number;
  value?: string | number | (string | number)[];
  color?: string;
  dataKey?: string | number;
  payload?: Record<string, unknown>;
}

/** Tooltip body matching the popover surface. All props are Recharts-injected. */
export function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  hideLabel = false,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  labelFormatter?: (label: string | number) => string;
  valueFormatter?: (value: number, entry: TooltipEntry) => string;
  hideLabel?: boolean;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-36 rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      {!hideLabel && label !== undefined ? (
        <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      ) : null}
      <div className="space-y-1">
        {payload.map((entry, index) => {
          const numeric =
            typeof entry.value === "number" ? entry.value : Number(entry.value);
          return (
            <div
              key={`${entry.dataKey}-${index}`}
              className="flex items-center gap-2 text-xs"
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}</span>
              <span className="tabular ml-auto font-medium">
                {valueFormatter && Number.isFinite(numeric)
                  ? valueFormatter(numeric, entry)
                  : String(entry.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Fixed-height wrapper so ResponsiveContainer always has a parent size. */
export function ChartFrame({
  height = 260,
  className,
  children,
}: {
  height?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      {children}
    </div>
  );
}

export function ChartLegend({
  items,
  className,
}: {
  items: { label: string; color: string; value?: string }[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}>
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
          {item.value ? (
            <span className="tabular font-medium text-foreground">
              {item.value}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
