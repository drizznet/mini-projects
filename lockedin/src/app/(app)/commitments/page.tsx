"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutGrid, List, Plus, Target } from "lucide-react";
import { toast } from "sonner";

import { CommitmentDialog } from "@/components/commitments/commitment-dialog";
import { CommitmentRowActions } from "@/components/commitments/commitment-row-actions";
import { CommitmentsTable } from "@/components/commitments/commitments-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFocusData } from "@/hooks/use-focus-data";
import { sessionActiveHours, type GoalProgress } from "@/lib/analytics";
import { sessionCalendarDate } from "@/lib/session-calendar";
import { GOAL_STATUS_LABEL } from "@/lib/constants";
import { PRIORITY_META } from "@/lib/health";
import { isPlanFailed } from "@/lib/plan-result";
import { itemsForGoal, planForDate } from "@/lib/selectors";
import { useFocusStore, type FocusStoreValue } from "@/lib/store/focus-store";
import type { FocusState, Goal, GoalStatus } from "@/lib/types";
import {
  addDays,
  cn,
  dateKeyRange,
  formatDayLabel,
  formatHours,
  formatRelativeDay,
  fromDateKey,
  toDateKey,
} from "@/lib/utils";
import { useCommitments, useCommitmentsLoading } from "@/services/commitments";

type Filter = GoalStatus | "all" | "failed";
type ViewMode = "grid" | "list";

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "failed", label: "Failed" },
  { value: "completed", label: "Completed" },
];

/** Plan catalogue. The page reads like Today: a line of figures, then the work. */
export default function PlansPage() {
  const { state, actions, hydrated } = useFocusStore();
  const { goals, now, todayKey } = useFocusData({ tickMs: 60_000 });
  const commitmentsLoading = useCommitmentsLoading(hydrated);
  const { isError: commitmentsError } = useCommitments(hydrated);
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<ViewMode>("grid");

  const progressById = useMemo(
    () => new Map(goals.map((goal) => [goal.goalId, goal])),
    [goals],
  );

  const failedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const goal of state.goals) {
      const logged = progressById.get(goal.id)?.loggedHours ?? 0;
      if (isPlanFailed(goal, logged, todayKey)) ids.add(goal.id);
    }
    return ids;
  }, [progressById, state.goals, todayKey]);

  const counts = useMemo(() => {
    const tally = { all: state.goals.length, active: 0, paused: 0, failed: failedIds.size, completed: 0 };
    for (const goal of state.goals) {
      if (failedIds.has(goal.id)) continue;
      tally[goal.status] += 1;
    }
    return tally;
  }, [failedIds, state.goals]);

  const visible = state.goals.filter((goal) => {
    const failed = failedIds.has(goal.id);
    if (filter === "failed") return failed;
    if (failed) return filter === "all";
    return filter === "all" || goal.status === filter;
  });

  const read = useMemo(
    () => catalogueRead(state.goals, progressById, todayKey),
    [progressById, state.goals, todayKey],
  );

  useEffect(() => {
    if (commitmentsError) {
      toast.error("Could not load plans from the server.");
    }
  }, [commitmentsError]);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-border/70 bg-card px-6 py-5 shadow-xs sm:px-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 max-w-xl">
            <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
              What you are showing up for
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
              My plans
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {commitmentsLoading ? "Loading your plans…" : read}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center rounded-full bg-secondary p-1">
              <Button
                size="icon-sm"
                variant={view === "grid" ? "secondary" : "ghost"}
                className={cn("rounded-full", view === "grid" && "bg-card shadow-sm")}
                onClick={() => setView("grid")}
                aria-label="Grid view"
                aria-pressed={view === "grid"}
              >
                <LayoutGrid className="size-3.5" />
              </Button>
              <Button
                size="icon-sm"
                variant={view === "list" ? "secondary" : "ghost"}
                className={cn("rounded-full", view === "list" && "bg-card shadow-sm")}
                onClick={() => setView("list")}
                aria-label="List view"
                aria-pressed={view === "list"}
              >
                <List className="size-3.5" />
              </Button>
            </div>
            <CommitmentDialog
              categories={state.categories}
              trigger={
                <Button size="sm" disabled={commitmentsLoading}>
                  <Plus className="size-3.5" />
                  New plan
                </Button>
              }
              onSave={(goal) => {
                actions.saveGoal(goal);
                toast.success(`Created ${goal.title}`);
              }}
            />
          </div>
        </div>
      </section>

      {commitmentsLoading ? (
        <CommitmentsLoading view={view} />
      ) : (
        <>
          <section
            className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs"
            role="radiogroup"
            aria-label="Filter plans"
          >
            <div className="grid grid-cols-2 lg:grid-cols-5">
              {FILTERS.map((item) => {
                const selected = filter === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setFilter(item.value)}
                    className={cn(
                      "border-border/60 px-6 py-5 text-left transition-colors sm:px-7",
                      "max-lg:even:border-l max-lg:[&:nth-child(n+3)]:border-t lg:border-l lg:first:border-l-0",
                      selected ? "bg-secondary/70" : "hover:bg-secondary/40",
                    )}
                  >
                    <span className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                      {item.label}
                    </span>
                    <span className="mt-3 block text-[3.25rem] leading-none font-medium tracking-[-0.045em] text-muted-foreground tabular">
                      {counts[item.value]}
                    </span>
                    <span className="mt-4 block h-px bg-border" aria-hidden>
                      <span
                        className="block h-px bg-foreground"
                        style={{ width: selected ? "100%" : "0%" }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {visible.length === 0 ? (
            <EmptyState
              icon={Target}
              title={
                state.goals.length === 0
                  ? "No plans yet"
                  : "Nothing in this view"
              }
              description={
                state.goals.length === 0
                  ? "Create a category first, then add a plan with a daily time budget."
                  : "Try a different status filter."
              }
              className="rounded-2xl border-border/70 py-16"
            />
          ) : view === "list" ? (
            <CommitmentsTable
              goals={visible}
              progressById={progressById}
              todayKey={todayKey}
              state={state}
              actions={actions}
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {visible.map((goal) => (
                <CommitmentCard
                  key={goal.id}
                  goal={goal}
                  progress={progressById.get(goal.id)}
                  state={state}
                  actions={actions}
                  now={now}
                  todayKey={todayKey}
                  failed={failedIds.has(goal.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function catalogueRead(goals: Goal[], progressById: Map<string, GoalProgress>, todayKey: string) {
  const active = goals.filter(
    (goal) =>
      goal.status === "active" &&
      !isPlanFailed(goal, progressById.get(goal.id)?.loggedHours ?? 0, todayKey),
  );
  if (goals.length === 0) {
    return "A plan is the thing you show up for. Add one when you know what deserves the time.";
  }
  if (active.length === 0) {
    return "Nothing is active right now. Paused and finished work stays here.";
  }
  const logged = active.reduce(
    (sum, goal) => sum + (progressById.get(goal.id)?.loggedHours ?? 0),
    0,
  );
  const target = active.reduce((sum, goal) => sum + goal.targetHours, 0);
  return `${active.length} active. ${formatHours(logged)} of ${formatHours(target)} is on the books.`;
}

type DayTone = "ahead" | "open" | "light" | "kept" | "missed";

const DAY_TONE_CLASS: Record<DayTone, string> = {
  ahead: "border border-foreground/20 bg-transparent",
  open: "border border-foreground/20 bg-transparent",
  light: "bg-health-excellent/40",
  kept: "bg-health-excellent",
  missed: "bg-health-critical",
};

function planDateKeys(goal: Goal) {
  if (goal.startDate && goal.targetDate && goal.targetDate >= goal.startDate) {
    return dateKeyRange(fromDateKey(goal.startDate), fromDateKey(goal.targetDate));
  }
  const start = fromDateKey(goal.startDate ?? toDateKey(goal.createdAt));
  const count = goal.commitmentPeriod === "3d" ? 3 : goal.commitmentPeriod === "1m" ? 30 : 7;
  return Array.from({ length: count }, (_, index) => toDateKey(addDays(start, index)));
}

function dayTone(date: string, todayKey: string, hours: number, targetHours: number): DayTone {
  const kept = targetHours > 0 ? hours + 0.02 >= targetHours : hours > 0.02;
  const light = !kept && hours > 0.02;
  if (date > todayKey) return "ahead";
  if (date === todayKey) {
    if (kept) return "kept";
    if (light) return "light";
    return "open";
  }
  if (kept) return "kept";
  if (light) return "light";
  return "missed";
}

function dayCaption(tone: DayTone, date: string, hours: number, targetHours: number) {
  const when = formatDayLabel(date);
  if (tone === "ahead") return `${when}, ahead`;
  if (tone === "open") return `${when}, still open`;
  if (tone === "missed") return `${when}, missed`;
  if (tone === "light") {
    return `${when}, light day, ${formatHours(hours)} of ${formatHours(targetHours)}`;
  }
  return `${when}, kept, ${formatHours(hours)}`;
}

function CommitmentCard({
  goal,
  progress,
  state,
  actions,
  now,
  todayKey,
  failed,
}: {
  goal: Goal;
  progress: GoalProgress | undefined;
  state: FocusState;
  actions: FocusStoreValue["actions"];
  now: number;
  todayKey: string;
  failed: boolean;
}) {
  const items = itemsForGoal(state, goal.id);
  const category = state.categories.find((entry) => entry.id === goal.categoryId);
  const todayPlan = planForDate(state, todayKey);
  const todayWorkItem = todayPlan?.allocations.find((allocation) =>
    items.some((item) => item.id === allocation.focusItemId),
  );
  const focusItem =
    items.find((item) => item.id === todayWorkItem?.focusItemId) ?? items[0];
  const days = planDateKeys(goal);
  const targetHours =
    (goal.dailyCommitmentMinutes ??
      (days.length > 0 ? Math.round((goal.targetHours * 60) / days.length) : 60)) / 60;
  const itemIds = new Set(items.map((item) => item.id));
  const hoursByDay = new Map<string, number>();
  for (const session of state.sessions) {
    if (!itemIds.has(session.focusItemId)) continue;
    const key = sessionCalendarDate(session);
    hoursByDay.set(key, (hoursByDay.get(key) ?? 0) + sessionActiveHours(session, now));
  }
  const squares = days.map((date) => {
    const hours = hoursByDay.get(date) ?? 0;
    const tone = dayTone(date, todayKey, hours, targetHours);
    return { date, hours, tone };
  });
  const kept = squares.filter((square) => square.tone === "kept").length;
  const priority =
    goal.priority === "critical" || goal.priority === "high"
      ? PRIORITY_META[goal.priority].label
      : null;
  const eyebrow = [
    category?.name ?? "Uncategorised",
    failed ? "Failed" : GOAL_STATUS_LABEL[goal.status],
    priority,
  ]
    .filter(Boolean)
    .join(" · ");
  const touched = progress?.lastSessionAt
    ? formatRelativeDay(toDateKey(progress.lastSessionAt))
    : null;

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border shadow-xs",
        failed
          ? "border-health-critical/30 bg-secondary/50"
          : "border-border/70 bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6">
        <p className="pt-1.5 text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <CommitmentRowActions
          goal={goal}
          state={state}
          actions={actions}
          itemCount={items.length}
          hasTodayWorkItem={Boolean(todayWorkItem)}
          todayFocusItemId={focusItem?.id ?? null}
          failed={failed}
        />
      </div>

      <div className="px-5 sm:px-6">
        <Link
                  href={`/plans/${goal.id}`}
          className={cn(
            "block text-[1.35rem] leading-tight font-semibold tracking-tight",
            failed ? "text-muted-foreground" : "hover:text-foreground/80",
          )}
        >
          {goal.title}
        </Link>
        {goal.description ? (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {goal.description}
          </p>
        ) : null}
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 px-5 pt-6 sm:px-6">
        <ol className="flex min-w-0 flex-wrap gap-[3px]" aria-label={`${goal.title} days`}>
          {squares.map((square) => (
            <li key={square.date}>
              <span
                title={dayCaption(square.tone, square.date, square.hours, targetHours)}
                aria-label={dayCaption(square.tone, square.date, square.hours, targetHours)}
                className={cn(
                  "block size-2.5 rounded-[2px]",
                  DAY_TONE_CLASS[square.tone],
                  square.date === todayKey && "ring-1 ring-foreground/45 ring-offset-1 ring-offset-card",
                )}
              />
            </li>
          ))}
        </ol>
        <p className="shrink-0 text-[11px] text-muted-foreground tabular">
          {kept} of {squares.length}
        </p>
      </div>

      <Link
        href={`/plans/${goal.id}`}
        className="group mt-5 flex items-center justify-between gap-4 border-t border-border/60 px-5 py-4 transition-colors hover:bg-secondary/50 sm:px-6"
      >
        <span className="min-w-0 truncate text-xs text-muted-foreground">
          {failed ? (
            "Unachieved · under 70% of the planned time"
          ) : (
            <>
              {formatHours(progress?.loggedHours ?? 0)} of {formatHours(goal.targetHours)}
              <span className="px-1.5 opacity-50">·</span>
              {items.length === 0
                ? "No work items yet"
                : `${items.length} work item${items.length === 1 ? "" : "s"}`}
              {touched ? (
                <>
                  <span className="px-1.5 opacity-50">·</span>
                  {touched}
                </>
              ) : null}
            </>
          )}
        </span>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </Link>
    </article>
  );
}

function CommitmentsLoading({ view }: { view: ViewMode }) {
  if (view === "list") {
    return (
      <div
        className="overflow-hidden rounded-2xl border border-border/70 bg-card"
        aria-busy="true"
        aria-label="Loading plans"
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {["Plan", "Priority", "Status", "Progress", "Hours"].map((label) => (
                <TableHead key={label}>{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }, (_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-1.5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div aria-busy="true" aria-label="Loading plans" className="space-y-4">
      <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border/70 bg-card lg:grid-cols-5">
        {FILTERS.map((item) => (
          <div
            key={item.value}
            className="border-border/60 px-6 py-5 sm:px-7 max-lg:even:border-l max-lg:[&:nth-child(n+3)]:border-t lg:border-l lg:first:border-l-0"
          >
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-4 h-12 w-12" />
            <Skeleton className="mt-4 h-px w-full" />
          </div>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-2xl border border-border/70 bg-card px-5 py-5 sm:px-6"
          >
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-6 w-3/4" />
            <div className="flex gap-[3px]">
              {Array.from({ length: 7 }, (_, cube) => (
                <Skeleton key={cube} className="size-2.5 rounded-[2px]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
