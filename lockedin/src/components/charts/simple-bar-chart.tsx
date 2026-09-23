"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  AXIS_PROPS,
  ChartFrame,
  ChartTooltip,
  GRID_PROPS,
} from "@/components/charts/chart-kit";

export interface BarDatum {
  label: string;
  value: number;
  /** Optional per-bar colour; falls back to `color`. */
  fill?: string;
}

/**
 * Generic vertical bar chart used for weekday output, hour-of-day distribution
 * and distraction counts. The tallest bar is highlighted so the takeaway reads
 * at a glance.
 */
export function SimpleBarChart({
  data,
  height = 220,
  color = "var(--chart-2)",
  highlightMax = true,
  unit = "",
  valueFormatter,
  seriesName = "Value",
}: {
  data: BarDatum[];
  height?: number;
  color?: string;
  highlightMax?: boolean;
  unit?: string;
  valueFormatter?: (value: number) => string;
  seriesName?: string;
}) {
  const max = Math.max(...data.map((entry) => entry.value), 0);

  return (
    <ChartFrame height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis
            dataKey="label"
            {...AXIS_PROPS}
            interval="preserveStartEnd"
            minTickGap={4}
          />
          <YAxis {...AXIS_PROPS} width={40} unit={unit} />
          <Tooltip
            cursor={{ fill: "var(--grid-line)" }}
            content={
              <ChartTooltip
                valueFormatter={(value) =>
                  valueFormatter ? valueFormatter(value) : `${value}${unit}`
                }
              />
            }
          />
          <Bar dataKey="value" name={seriesName} radius={[5, 5, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`${entry.label}-${index}`}
                fill={
                  entry.fill ??
                  (highlightMax && entry.value === max && max > 0
                    ? "var(--chart-1)"
                    : color)
                }
                fillOpacity={
                  highlightMax && entry.value === max && max > 0 ? 1 : 0.65
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
