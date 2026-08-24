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
import { formatDayLabel, formatShortDay, round } from "@/lib/utils";

/**
 * Cumulative focus debt.
 *
 * Each day adds `planned - actual`, so the curve rises while you under-deliver
 * and falls when you overshoot the plan. Crossing zero means the debt is repaid.
 */
export function FocusDebtChart({
  days,
  height = 240,
}: {
  days: DayMetrics[];
  height?: number;
}) {
  let running = 0;
  const data = days.map((day) => {
    running += day.plannedHours - day.actualHours;
    return {
      date: day.date,
      label: formatShortDay(day.date),
      debt: round(running, 2),
    };
  });

  return (
    <ChartFrame height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="debtFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--health-behind)" stopOpacity={0.4} />
              <stop
                offset="100%"
                stopColor="var(--health-behind)"
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis
            dataKey="label"
            {...AXIS_PROPS}
            interval="preserveStartEnd"
            minTickGap={20}
          />
          <YAxis {...AXIS_PROPS} width={44} unit="h" />
          <ReferenceLine y={0} stroke="var(--health-excellent)" strokeOpacity={0.7} />
          <Tooltip
            cursor={{ stroke: "var(--border)" }}
            content={
              <ChartTooltip
                labelFormatter={(label) => {
                  const match = data.find((entry) => entry.label === label);
                  return match ? formatDayLabel(match.date) : String(label);
                }}
                valueFormatter={(value) =>
                  value >= 0 ? `${value}h owed` : `${Math.abs(value)}h ahead`
                }
              />
            }
          />
          <Area
            type="monotone"
            dataKey="debt"
            name="Cumulative debt"
            stroke="var(--health-behind)"
            strokeWidth={2}
            fill="url(#debtFill)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
