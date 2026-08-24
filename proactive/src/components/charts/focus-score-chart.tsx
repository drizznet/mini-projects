"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
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
import type { DayMetrics } from "@/lib/types";
import { formatDayLabel, formatShortDay } from "@/lib/utils";

/**
 * Focus score trend. Days with no activity are dropped rather than plotted as
 * zero so rest days do not read as failures.
 */
export function FocusScoreChart({
  days,
  height = 240,
  target = 75,
}: {
  days: DayMetrics[];
  height?: number;
  target?: number;
}) {
  const data = days
    .filter((day) => day.sessionCount > 0)
    .map((day) => ({
      date: day.date,
      label: formatShortDay(day.date),
      score: day.focusScore,
    }));

  return (
    <ChartFrame height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
          <defs>
            <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-5)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--chart-5)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis
            dataKey="label"
            {...AXIS_PROPS}
            interval="preserveStartEnd"
            minTickGap={20}
          />
          <YAxis {...AXIS_PROPS} width={40} domain={[0, 100]} />
          <ReferenceLine
            y={target}
            stroke="var(--health-on-track)"
            strokeDasharray="4 4"
            strokeOpacity={0.7}
          />
          <Tooltip
            cursor={{ stroke: "var(--border)" }}
            content={
              <ChartTooltip
                labelFormatter={(label) => {
                  const match = data.find((entry) => entry.label === label);
                  return match ? formatDayLabel(match.date) : String(label);
                }}
                valueFormatter={(value) => `${value} / 100`}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="score"
            name="Focus score"
            stroke="var(--chart-5)"
            strokeWidth={2}
            fill="url(#scoreFill)"
            dot={false}
            activeDot={{ r: 3.5, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
