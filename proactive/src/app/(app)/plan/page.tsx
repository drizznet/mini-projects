"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CopyPlus,
  Hourglass,
  Play,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { AddAllocationDialog } from "@/components/plan/add-allocation-dialog";
import { HoursStepper } from "@/components/plan/hours-stepper";
import { CategoryDot, PriorityBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useFocusData } from "@/hooks/use-focus-data";
import { computeDayMetrics, itemHoursForDate } from "@/lib/analytics";
import { healthFromRatio } from "@/lib/health";
import { activeItems, planForDate } from "@/lib/selectors";
import { lineageFor } from "@/lib/selectors";
import { useFocusStore } from "@/lib/store/focus-store";
import {
  addDays,
  formatHours,
  fromDateKey,
  toDateKey,
} from "@/lib/utils";

/**
 * Daily planning screen.
 *
 * The selected day is local component state (not a route param) so users can
 * scrub back and forth without churning history. Editing always writes to the
 * store immediately — there is no draft/save step.
 */
export default function PlanPage() {
  const { state, actions } = useFocusStore();
  const { index, now, todayKey, recommendations } = useFocusData({
    tickMs: 30_000,
  });
  const [selectedKey, setSelectedKey] = useState<string>(todayKey);

  const dateKey = selectedKey || todayKey;
  const plan = planForDate(state, dateKey);
  const allocations = plan?.allocations ?? [];

  const metrics = useMemo(
    () => computeDayMetrics(state, index, dateKey, now),
    [state, index, dateKey, now],
  );
  const actualByItem = useMemo(
    () => itemHoursForDate(state, dateKey, now),
    [state, dateKey, now],
  );

  const allocatedIds = new Set(allocations.map((entry) => entry.focusItemId));
  const candidates = activeItems(state).filter(
    (item) => !allocatedIds.has(item.id),
  );

  const target = state.settings.dailyTargetHours;
  const remaining = Math.max(0, metrics.plannedHours - metrics.actualHours);
  const budgetHealth = healthFromRatio(
    metrics.plannedHours > 0 ? metrics.actualHours / metrics.plannedHours : 0,
  );
  const isFuture = dateKey > todayKey;
  const isToday = dateKey === todayKey;

  const shiftDay = (delta: number) =>
    setSelectedKey(toDateKey(addDays(fromDateKey(dateKey), delta)));

  const copyPreviousDay = () => {
    const previousKey = toDateKey(addDays(fromDateKey(dateKey), -1));
    const previous = planForDate(state, previousKey);
    if (!previous || previous.allocations.length === 0) {
      toast.error("Nothing to copy", {
        description: "The previous day has no allocations.",
      });
      return;
    }
    for (const entry of previous.allocations) {
      actions.allocate(dateKey, entry.focusItemId, entry.plannedHours);
    }
    toast.success(`Copied ${previous.allocations.length} allocations`);
  };

  const applySuggestions = () => {
    const suggestions = recommendations.filter(
      (entry) => !allocatedIds.has(entry.item.id),
    );
    if (suggestions.length === 0) {
      toast.info("Everything recommended is already planned");
      return;
    }
    for (const suggestion of suggestions) {
      actions.allocate(
        dateKey,
        suggestion.item.id,
        suggestion.item.estimatedDailyHours,
      );
    }
    toast.success(`Added ${suggestions.length} recommended items`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily plan"
        description="Decide how much attention each piece of work gets before the day starts pulling at you."
        actions={
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              onClick={() => shiftDay(-1)}
              aria-label="Previous day"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant={isToday ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedKey(todayKey)}
              className="min-w-32"
            >
              {isToday
                ? "Today"
                : fromDateKey(dateKey).toLocaleDateString(undefined, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => shiftDay(1)}
              aria-label="Next day"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Planned"
          value={formatHours(metrics.plannedHours)}
          hint={
            metrics.plannedHours > target
              ? `${formatHours(metrics.plannedHours - target)} over your ${formatHours(target)} daily target`
              : `${formatHours(Math.max(0, target - metrics.plannedHours))} of your target still unallocated`
          }
          icon={Hourglass}
          accentClassName={
            metrics.plannedHours > target ? "text-health-slipping" : undefined
          }
        />
        <StatCard
          label="Actual"
          value={formatHours(metrics.actualHours)}
          hint={`${metrics.sessionCount} session${metrics.sessionCount === 1 ? "" : "s"} logged`}
          accentClassName={budgetHealth.text}
        />
        <StatCard
          label="Remaining"
          value={formatHours(remaining)}
          hint={
            isFuture
              ? "This day has not started yet"
              : remaining === 0 && metrics.plannedHours > 0
                ? "Plan fully delivered"
                : "Left in the plan"
          }
        />
        <StatCard
          label="Focus score"
          value={metrics.focusScore}
          hint="Recomputed as sessions land"
          accentClassName={budgetHealth.text}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Allocations</CardTitle>
              <CardDescription>
                {formatHours(metrics.plannedHours)} across {allocations.length}{" "}
                item{allocations.length === 1 ? "" : "s"}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Button size="sm" variant="ghost" onClick={copyPreviousDay}>
                <CopyPlus className="size-3.5" />
                Copy previous day
              </Button>
              <AddAllocationDialog
                candidates={candidates}
                index={index}
                onAdd={(item) =>
                  actions.allocate(dateKey, item.id, item.estimatedDailyHours)
                }
              />
            </div>
          </CardHeader>

          <CardContent>
            {allocations.length === 0 ? (
              <EmptyState
                icon={Hourglass}
                title="No allocations for this day"
                description="Add focus items and give each one an honest number of hours. Under-planning scores better than over-planning."
                action={
                  <Button size="sm" variant="subtle" onClick={applySuggestions}>
                    <Sparkles className="size-3.5" />
                    Use recommendations
                  </Button>
                }
              />
            ) : (
              <ul className="space-y-2.5">
                {allocations.map((allocation) => {
                  const lineage = lineageFor(index, allocation.focusItemId);
                  if (!lineage) return null;
                  const actual = actualByItem.get(allocation.focusItemId) ?? 0;
                  const ratio =
                    allocation.plannedHours > 0
                      ? actual / allocation.plannedHours
                      : 0;
                  const health = healthFromRatio(ratio);

                  return (
                    <li
                      key={allocation.focusItemId}
                      className="rounded-xl border border-border/70 bg-card-elevated/40 p-3.5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-1">
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

                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={lineage.item.priority} />
                          <HoursStepper
                            value={allocation.plannedHours}
                            onChange={(hours) =>
                              actions.allocate(
                                dateKey,
                                allocation.focusItemId,
                                hours,
                              )
                            }
                          />
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            asChild
                            aria-label={`Start a session for ${lineage.item.name}`}
                          >
                            <Link href={`/focus?item=${lineage.item.id}`}>
                              <Play className="size-3.5" />
                            </Link>
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() =>
                              actions.removeAllocation(
                                dateKey,
                                allocation.focusItemId,
                              )
                            }
                            aria-label={`Remove ${lineage.item.name} from the plan`}
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1.5">
                        <Progress
                          value={Math.min(100, ratio * 100)}
                          className="h-1"
                          indicatorClassName={health.fill}
                        />
                        <p className="tabular text-[11px] text-muted-foreground">
                          <span className={health.text}>
                            {formatHours(actual)}
                          </span>{" "}
                          of {formatHours(allocation.plannedHours)} delivered
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Intention</CardTitle>
                <CardDescription>
                  One sentence on how you want the day to go
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={plan?.intention ?? ""}
                onChange={(event) =>
                  actions.setIntention(dateKey, event.target.value)
                }
                placeholder="Protect the morning for the hardest thing on the list."
                className="min-h-24 text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Suggested for this day</CardTitle>
                <CardDescription>
                  From the recommendation engine
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {recommendations
                .filter((entry) => !allocatedIds.has(entry.item.id))
                .slice(0, 4)
                .map((entry) => (
                  <button
                    key={entry.item.id}
                    type="button"
                    onClick={() => {
                      actions.allocate(
                        dateKey,
                        entry.item.id,
                        entry.item.estimatedDailyHours,
                      );
                      toast.success(`Added ${entry.item.name}`);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg border border-border/60 px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    <CategoryDot color={entry.categoryColor} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium">
                        {entry.item.name}
                      </span>
                      <span className="block truncate text-[10px] text-muted-foreground">
                        {entry.reasons[0] ?? entry.goalTitle}
                      </span>
                    </span>
                    <span className="tabular text-[11px] text-muted-foreground">
                      +{formatHours(entry.item.estimatedDailyHours)}
                    </span>
                  </button>
                ))}
              {recommendations.every((entry) =>
                allocatedIds.has(entry.item.id),
              ) ? (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  Everything the engine recommends is already in this plan.
                </p>
              ) : null}
            </CardContent>
          </Card>

          {allocations.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-destructive hover:bg-destructive/10"
              onClick={() => {
                actions.clearPlan(dateKey);
                toast.success("Plan cleared");
              }}
            >
              <Trash2 className="size-3.5" />
              Clear this day&apos;s plan
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
