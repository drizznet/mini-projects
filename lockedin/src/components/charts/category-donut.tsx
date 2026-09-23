"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ChartFrame, ChartTooltip } from "@/components/charts/chart-kit";
import type { CategorySlice } from "@/lib/analytics";
import { formatHours, percent } from "@/lib/utils";

/** Category time distribution with the total rendered inside the ring. */
export function CategoryDonut({
  slices,
  height = 240,
}: {
  slices: CategorySlice[];
  height?: number;
}) {
  const total = slices.reduce((acc, slice) => acc + slice.hours, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
      <div className="relative">
        <ChartFrame height={height}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={
                  <ChartTooltip
                    hideLabel
                    valueFormatter={(value) => formatHours(value)}
                  />
                }
              />
              <Pie
                data={slices}
                dataKey="hours"
                nameKey="name"
                innerRadius="62%"
                outerRadius="92%"
                paddingAngle={2}
                strokeWidth={0}
              >
                {slices.map((slice) => (
                  <Cell key={slice.categoryId} fill={slice.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartFrame>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="tabular text-2xl font-semibold">
            {formatHours(total)}
          </span>
          <span className="text-[11px] text-muted-foreground">total focus</span>
        </div>
      </div>

      <ul className="space-y-2.5">
        {slices.map((slice) => (
          <li key={slice.categoryId} className="flex items-center gap-2.5">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            <span className="min-w-0 flex-1 truncate text-xs">{slice.name}</span>
            <span className="tabular text-xs font-medium">
              {formatHours(slice.hours)}
            </span>
            <span className="tabular w-9 text-right text-[11px] text-muted-foreground">
              {percent(slice.share)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
