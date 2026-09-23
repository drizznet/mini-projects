"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ListChecks, Pencil, Plus, Target, Trash2 } from "lucide-react";
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
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFocusData } from "@/hooks/use-focus-data";
import { healthFromRatio } from "@/lib/health";
import { itemsForGoal } from "@/lib/selectors";
import { useFocusStore } from "@/lib/store/focus-store";
import type { GoalStatus } from "@/lib/types";
import { formatHours, formatRelativeDay, percent, toDateKey } from "@/lib/utils";

type Filter = GoalStatus | "all";

/** Goal catalogue with progress against target hours. */
export default function GoalsPage() {
  const { state, actions } = useFocusStore();
  const { goals } = useFocusData({ tickMs: 60_000 });
  const [filter, setFilter] = useState<Filter>("all");

  const progressById = useMemo(
    () => new Map(goals.map((goal) => [goal.goalId, goal])),
    [goals],
  );

  const visible = state.goals.filter(
    (goal) => filter === "all" || goal.status === filter,
  );

  const totals = {
    target: state.goals.reduce((sum, goal) => sum + goal.targetHours, 0),
    logged: goals.reduce((sum, goal) => sum + goal.loggedHours, 0),
    active: state.goals.filter((goal) => goal.status === "active").length,
    completed: state.goals.filter((goal) => goal.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goals"
        description="Long-term objectives measured in hours. Progress comes from the sessions logged against their focus items."
        actions={
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
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active goals" value={totals.active} icon={Target} />
        <StatCard label="Completed" value={totals.completed} />
        <StatCard label="Hours logged" value={formatHours(totals.logged)} />
        <StatCard
          label="Total committed"
          value={formatHours(totals.target)}
          hint={`${percent(totals.target > 0 ? totals.logged / totals.target : 0)} of everything you have signed up for`}
        />
      </section>

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
              ? "Create a category first, then give it a goal with a target number of hours."
              : "Try a different status filter."
          }
          className="py-16"
        />
      ) : (
        <div className="space-y-3">
          {visible.map((goal) => {
            const progress = progressById.get(goal.id);
            const items = itemsForGoal(state, goal.id);
            const health = healthFromRatio(progress?.progress ?? 0);
            const category = state.categories.find(
              (entry) => entry.id === goal.categoryId,
            );

            return (
              <Card key={goal.id} className="group">
                <CardContent className="space-y-4 p-5">
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
                      <h2 className="text-base font-semibold tracking-tight">
                        {goal.title}
                      </h2>
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
                        <ItemDialog
                          goals={state.goals}
                          defaultGoalId={goal.id}
                          trigger={
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              aria-label={`Add focus item to ${goal.title}`}
                            >
                              <ListChecks className="size-3.5" />
                            </Button>
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
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              aria-label={`Edit ${goal.title}`}
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                          }
                          onSave={(updated) => {
                            actions.saveGoal(updated);
                            toast.success("Goal updated");
                          }}
                        />
                        <ConfirmDialog
                          title={`Delete ${goal.title}?`}
                          description={`Its ${items.length} focus item${items.length === 1 ? "" : "s"} will be deleted too.`}
                          onConfirm={() => {
                            actions.removeGoal(goal.id);
                            toast.success("Goal deleted");
                          }}
                        >
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10"
                            aria-label={`Delete ${goal.title}`}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </ConfirmDialog>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Progress
                      value={(progress?.progress ?? 0) * 100}
                      className="h-2"
                      indicatorClassName={health.fill}
                    />
                    <div className="flex flex-wrap items-baseline justify-between gap-2 text-[11px]">
                      <span className="tabular text-muted-foreground">
                        {formatHours(progress?.loggedHours ?? 0)} of{" "}
                        {formatHours(goal.targetHours)} ·{" "}
                        {items.length} focus item{items.length === 1 ? "" : "s"}
                      </span>
                      <span className={`tabular font-medium ${health.text}`}>
                        {percent(progress?.progress ?? 0)}
                      </span>
                    </div>
                  </div>

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
