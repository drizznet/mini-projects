"use client";

import Link from "next/link";
import { CalendarPlus, CheckCircle2, Play } from "lucide-react";

import { CategoryDot, PriorityBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { healthFromRatio } from "@/lib/health";
import type { EntityIndex } from "@/lib/selectors";
import { lineageFor } from "@/lib/selectors";
import type { DailyPlan } from "@/lib/types";
import { cn, formatHours } from "@/lib/utils";

/** Today's allocations with live progress and a one-click session launcher. */
export function TodaysPlanCard({
  plan,
  index,
  actualByItem,
}: {
  plan: DailyPlan | undefined;
  index: EntityIndex;
  actualByItem: Map<string, number>;
}) {
  const allocations = plan?.allocations ?? [];

  return (
    <Card className="h-full min-h-0 overflow-hidden">
      <CardHeader>
        <div>
          <CardTitle>Today&apos;s planned work</CardTitle>
          <CardDescription>
            {allocations.length} item{allocations.length === 1 ? "" : "s"} in
            today&apos;s focus budget
          </CardDescription>
        </div>
        <Button size="sm" variant="ghost" asChild>
          <Link href="/plan">Edit plan</Link>
        </Button>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-y-auto">
        {allocations.length === 0 ? (
          <EmptyState
            icon={CalendarPlus}
            title="No plan for today"
            description="Allocate a few hours across your focus items and the dashboard will start tracking adherence."
            action={
              <Button size="sm" asChild>
                <Link href="/plan">Plan today</Link>
              </Button>
            }
          />
        ) : (
          <ul className="space-y-3">
            {allocations.map((allocation) => {
              const lineage = lineageFor(index, allocation.focusItemId);
              if (!lineage) return null;
              const actual = actualByItem.get(allocation.focusItemId) ?? 0;
              const ratio =
                allocation.plannedHours > 0
                  ? actual / allocation.plannedHours
                  : 0;
              const health = healthFromRatio(ratio);
              const done = ratio >= 1;

              return (
                <li
                  key={allocation.focusItemId}
                  className="rounded-lg border border-border/70 bg-card-elevated/50 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <CategoryDot
                          color={
                            lineage.category
                              ? `var(--${lineage.category.color})`
                              : "var(--chart-1)"
                          }
                        />
                        {lineage.category?.name ?? "Uncategorised"} ·{" "}
                        {lineage.goal?.title ?? "No goal"}
                      </p>
                      <p className="truncate text-sm font-medium">
                        {lineage.item.name}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <PriorityBadge priority={lineage.item.priority} />
                      <Button
                        size="icon-sm"
                        variant={done ? "ghost" : "subtle"}
                        asChild
                      >
                        <Link
                          href={`/focus?item=${lineage.item.id}`}
                          aria-label={`Start focus session for ${lineage.item.name}`}
                        >
                          {done ? (
                            <CheckCircle2 className="size-3.5 text-health-excellent" />
                          ) : (
                            <Play className="size-3.5" />
                          )}
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="mt-2.5 space-y-1.5">
                    <Progress
                      value={Math.min(100, ratio * 100)}
                      className="h-1"
                      indicatorClassName={health.fill}
                    />
                    <div className="flex items-baseline justify-between text-[11px]">
                      <span className={cn("tabular font-medium", health.text)}>
                        {formatHours(actual)} focused
                      </span>
                      <span className="tabular text-muted-foreground">
                        {formatHours(allocation.plannedHours)} planned
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
