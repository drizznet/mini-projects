"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Eye,
  LayoutGrid,
  ListChecks,
  List,
  MoreHorizontal,
  Pencil,
  Plus,
  Target,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { GoalDialog } from "@/components/goals/goal-dialog";
import { ItemDialog } from "@/components/items/item-dialog";
import {
  CategoryDot,
  GoalStatusBadge,
  PriorityBadge,
} from "@/components/shared/badges";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { ProgressRing } from "@/components/shared/progress-ring";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFocusData } from "@/hooks/use-focus-data";
import { healthFromRatio } from "@/lib/health";
import { itemsForGoal, planForDate } from "@/lib/selectors";
import { useFocusStore } from "@/lib/store/focus-store";
import type { GoalStatus } from "@/lib/types";
import {
  formatHours,
  formatRelativeDay,
  percent,
  toDateKey,
} from "@/lib/utils";

type Filter = GoalStatus | "all";
type ViewMode = "grid" | "list";

/** Goal catalogue with progress against target hours. */
export default function GoalsPage() {
  const { state, actions } = useFocusStore();
  const { goals, todayKey } = useFocusData({ tickMs: 60_000 });
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<ViewMode>("grid");

  const progressById = useMemo(
    () => new Map(goals.map((goal) => [goal.goalId, goal])),
    [goals],
  );

  const visible = state.goals.filter(
    (goal) => filter === "all" || goal.status === filter,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goals"
        description="Turn meaningful goals into daily commitments, then track planned time against focused sessions."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border/70 p-0.5">
              <Button size="icon-sm" variant={view === "grid" ? "secondary" : "ghost"} onClick={() => setView("grid")} aria-label="Grid view" aria-pressed={view === "grid"}>
                <LayoutGrid className="size-3.5" />
              </Button>
              <Button size="icon-sm" variant={view === "list" ? "secondary" : "ghost"} onClick={() => setView("list")} aria-label="List view" aria-pressed={view === "list"}>
                <List className="size-3.5" />
              </Button>
            </div>
            <GoalDialog
              categories={state.categories}
              trigger={
                <Button size="sm" disabled={state.categories.length === 0}>
                  <Plus className="size-3.5" />
                  New goal
                </Button>
              }
              onSave={(goal) => {
                actions.saveGoal(goal);
                toast.success(`Created ${goal.title}`);
              }}
            />
          </div>
        }
      />

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as Filter)}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {visible.length === 0 ? (
        <EmptyState
          icon={Target}
          title={
            state.goals.length === 0 ? "No goals yet" : "Nothing in this view"
          }
          description={
            state.goals.length === 0
              ? "Create a category first, then turn a meaningful goal into a daily commitment."
              : "Try a different status filter."
          }
          className="py-16"
        />
      ) : (
        <div className={view === "grid" ? "grid gap-4 md:grid-cols-2" : "space-y-3"}>
          {visible.map((goal) => {
            const progress = progressById.get(goal.id);
            const items = itemsForGoal(state, goal.id);
            const health = healthFromRatio(progress?.progress ?? 0);
            const category = state.categories.find(
              (entry) => entry.id === goal.categoryId,
            );
            const todayPlan = planForDate(state, todayKey);
            const todayWorkItem = todayPlan?.allocations.find((allocation) =>
              items.some((item) => item.id === allocation.focusItemId),
            );
            const focusItem =
              items.find((item) => item.id === todayWorkItem?.focusItemId) ??
              items[0];

            return (
              <Card
                key={goal.id}
                className="group relative h-full overflow-hidden border-border/80 bg-card shadow-xs transition-[border-color,box-shadow] hover:border-primary/20 hover:shadow-sm"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
                  style={{
                    background: `linear-gradient(to top, color-mix(in oklab, ${health.cssVar} 11%, transparent), transparent)`,
                  }}
                />
                <CardContent className="relative z-10 space-y-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1.5">
                      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <CategoryDot
                          color={
                            category
                              ? `var(--${category.color})`
                              : "var(--chart-1)"
                          }
                        />
                        {category?.name ?? "Uncategorised"}
                        {progress?.lastSessionAt ? (
                          <>
                            <span className="opacity-50">·</span>
                            last touched{" "}
                            {formatRelativeDay(
                              toDateKey(progress.lastSessionAt),
                            ).toLowerCase()}
                          </>
                        ) : null}
                      </p>
                      <Link
                        href={`/goals/${goal.id}`}
                        className="block text-base font-semibold tracking-tight hover:text-primary"
                      >
                        {goal.title}
                      </Link>
                      {goal.description ? (
                        <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
                          {goal.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <PriorityBadge priority={goal.priority} />
                      <GoalStatusBadge status={goal.status} />
                      <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              aria-label={`More actions for ${goal.title}`}
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-48">
                            <DropdownMenuItem asChild>
                              <Link href={`/goals/${goal.id}`}>
                                <Eye /> View goal
                              </Link>
                            </DropdownMenuItem>
                            {todayWorkItem ? (
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/dashboard?goal=${encodeURIComponent(goal.id)}&focus=${encodeURIComponent(focusItem?.id ?? "")}`}
                                >
                                  <CalendarDays /> Open in Today
                                </Link>
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuSeparator />
                            <ItemDialog
                              goals={state.goals}
                              defaultGoalId={goal.id}
                              trigger={
                                <DropdownMenuItem>
                                  <ListChecks /> Add work item
                                </DropdownMenuItem>
                              }
                              onSave={(item) => {
                                actions.saveItem(item);
                                toast.success(`Added ${item.name}`);
                              }}
                            />
                            <GoalDialog
                              goal={goal}
                              categories={state.categories}
                              trigger={
                                <DropdownMenuItem>
                                  <Pencil /> Edit goal
                                </DropdownMenuItem>
                              }
                              onSave={(updated) => {
                                actions.saveGoal(updated);
                                toast.success("Goal updated");
                              }}
                            />
                            <DropdownMenuSeparator />
                            <ConfirmDialog
                              title={`Delete ${goal.title}?`}
                              description={`Its ${items.length} work item${items.length === 1 ? "" : "s"} will be deleted too.`}
                              onConfirm={() => {
                                actions.removeGoal(goal.id);
                                toast.success("Goal deleted");
                              }}
                            >
                              <DropdownMenuItem variant="destructive">
                                <Trash2 /> Delete goal
                              </DropdownMenuItem>
                            </ConfirmDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  {state.settings.goalProgressDisplay === "bar" ? (
                    <div className="space-y-1.5">
                      <Progress
                        value={(progress?.progress ?? 0) * 100}
                        className="h-2"
                        indicatorClassName={health.fill}
                      />
                      <div className="flex flex-wrap items-baseline justify-between gap-2 text-[11px]">
                        <span className="tabular text-muted-foreground">
                          {formatHours(progress?.loggedHours ?? 0)} of {formatHours(goal.targetHours)} · {items.length} work item{items.length === 1 ? "" : "s"}
                        </span>
                        <span className={`tabular font-medium ${health.text}`}>
                          {percent(progress?.progress ?? 0)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <ProgressRing
                        value={progress?.progress ?? 0}
                        size={72}
                        strokeWidth={8}
                        color={health.cssVar}
                        className="shrink-0"
                      >
                        <span className={`tabular text-sm font-semibold ${health.text}`}>
                          {percent(progress?.progress ?? 0)}
                        </span>
                      </ProgressRing>
                      <div className="min-w-0 space-y-1">
                        <p className="text-xs font-medium text-foreground">Goal progress</p>
                        <p className="tabular text-xs text-muted-foreground">
                          {formatHours(progress?.loggedHours ?? 0)} of {formatHours(goal.targetHours)}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {items.length} work item{items.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                  )}

                  {items.length > 0 ? (
                    <ul className="flex flex-wrap gap-1.5">
                      {items.slice(0, 6).map((item) => (
                        <li key={item.id}>
                          <Link
                            href={`/focus?item=${item.id}`}
                            className="inline-flex items-center gap-1.5 rounded-md border border-border/70 px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                      {items.length > 6 ? (
                        <li className="px-1 py-1 text-[11px] text-muted-foreground">
                          +{items.length - 6} more
                        </li>
                      ) : null}
                    </ul>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
