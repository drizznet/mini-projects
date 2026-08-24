"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  AXIS_PROPS,
  ChartFrame,
  ChartLegend,
  ChartTooltip,
  GRID_PROPS,
} from "@/components/charts/chart-kit";
import type { DayMetrics } from "@/lib/types";
import { formatDayLabel, formatShortDay } from "@/lib/utils";

/** Planned vs. actual focus hours per day, with planned drawn as a guide line. */
export function FocusHoursChart({
  days,
  height = 280,
}: {
  days: DayMetrics[];
  height?: number;
}) {
  const data = days.map((day) => ({
    date: day.date,
    label: formatShortDay(day.date),
    actual: day.actualHours,
    planned: day.plannedHours,
  }));

  return (
    <div className="space-y-3">
      <ChartLegend
        items={[
          { label: "Actual", color: "var(--chart-1)" },
          { label: "Planned", color: "var(--chart-4)" },
        ]}
      />
      <ChartFrame height={height}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
            <defs>
              <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.42} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid {...GRID_PROPS} />
            <XAxis
              dataKey="label"
              {...AXIS_PROPS}
              interval="preserveStartEnd"
              minTickGap={16}
            />
            <YAxis {...AXIS_PROPS} width={44} unit="h" />
            <Tooltip
              cursor={{ stroke: "var(--border)" }}
              content={
                <ChartTooltip
                  labelFormatter={(label) => {
                    const match = data.find((entry) => entry.label === label);
                    return match ? formatDayLabel(match.date) : String(label);
                  }}
                  valueFormatter={(value) => `${value}h`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#actualFill)"
              dot={false}
              activeDot={{ r: 3.5, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="planned"
              name="Planned"
              stroke="var(--chart-4)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartFrame>
    </div>
  );
}
