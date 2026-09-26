"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ListTodo,
  RotateCcw,
  Timer,
} from "lucide-react";
import { toast } from "sonner";

import { AddAllocationDialog } from "@/components/plan/add-allocation-dialog";
import {
  CategoryDot,
  ItemStatusBadge,
  PriorityBadge,
} from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { ProgressDisplay } from "@/components/shared/progress-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFocusData } from "@/hooks/use-focus-data";
import { itemHoursForDate } from "@/lib/analytics";
import { getCheckInState } from "@/lib/check-in";
import { lineageFor, planForDate } from "@/lib/selectors";
import { useFocusStore } from "@/lib/store/focus-store";
import type { FocusItem } from "@/lib/types";
import {
  addDays,
  formatDayLabel,
  formatHours,
  formatShortDay,
  formatTime,
  fromDateKey,
  toDateKey,
} from "@/lib/utils";

/** Day-based planning surface for atomic work attached to goals. */
export default function WorkItemsPage() {
  const { state, actions } = useFocusStore();
  const { index, now, todayKey } = useFocusData({ tickMs: 30_000 });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const currentDate = selectedDate ?? todayKey;
  const calendarDays = useMemo(() => {
    if (!currentDate) return [];
    return Array.from({ length: 7 }, (_, offset) =>
      toDateKey(addDays(fromDateKey(currentDate), offset - 3)),
    );
  }, [currentDate]);

  useEffect(() => {
    if (!selectedDate && todayKey) setSelectedDate(todayKey);
  }, [selectedDate, todayKey]);

  const plan = currentDate ? planForDate(state, currentDate) : undefined;
  const actualByItem = currentDate
    ? itemHoursForDate(state, currentDate, now)
    : new Map<string, number>();
  const scheduledItems = useMemo(
    () =>
      (plan?.allocations ?? [])
        .map((allocation) => {
          const item = state.focusItems.find(
            (entry) => entry.id === allocation.focusItemId,
          );
          return item ? { item, plannedHours: allocation.plannedHours } : null;
        })
        .filter(
          (entry): entry is { item: FocusItem; plannedHours: number } =>
            Boolean(entry),
        ),
    [plan, state.focusItems],
  );
  const candidates = state.focusItems.filter(
    (item) =>
      !item.archivedAt &&
      item.status !== "done" &&
      !scheduledItems.some((entry) => entry.item.id === item.id),
  );
  const plannedHours = scheduledItems.reduce(
    (total, entry) => total + entry.plannedHours,
    0,
  );
  const focusedHours = Array.from(actualByItem.values()).reduce(
    (total, hours) => total + hours,
    0,
  );
  const daySessions = state.sessions.filter(
    (session) => currentDate && toDateKey(session.startedAt) === currentDate,
  );
  const completion = plannedHours > 0 ? Math.min(1, focusedHours / plannedHours) : 0;

  const moveWeek = (amount: number) => {
    if (!currentDate) return;
    setSelectedDate(toDateKey(addDays(fromDateKey(currentDate), amount * 7)));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work items"
        description="Plan the concrete pieces of your goals, then open a focus session when you are ready to work."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            Planning calendar
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            {currentDate ? formatDayLabel(currentDate) : "Choose a day"}
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => moveWeek(-1)}
            aria-label="Previous week"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="subtle"
            onClick={() => setSelectedDate(todayKey)}
          >
            Today
          </Button>
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => moveWeek(1)}
            aria-label="Next week"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {calendarDays.map((dateKey) => {
          const dayPlan = planForDate(state, dateKey);
          const dayPlanned = (dayPlan?.allocations ?? []).reduce(
            (total, allocation) => total + allocation.plannedHours,
            0,
          );
          const dayFocused = itemHoursForDate(state, dateKey, now);
          const focused = Array.from(dayFocused.values()).reduce(
            (total, hours) => total + hours,
            0,
          );
          const isSelected = dateKey === currentDate;
          const isToday = dateKey === todayKey;

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => setSelectedDate(dateKey)}
              className={`min-h-28 rounded-xl border p-3 text-left transition-[border-color,background-color,box-shadow] ${
                isSelected
                  ? "border-primary/60 bg-primary/8 shadow-sm ring-1 ring-primary/15"
                  : "border-border/70 bg-card hover:border-primary/30 hover:bg-secondary/45"
              }`}
              aria-pressed={isSelected}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  {formatShortDay(dateKey)}
                </span>
                {isToday ? (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                    Today
                  </Badge>
                ) : null}
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {fromDateKey(dateKey).getDate()}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {dayPlanned > 0 ? `${formatHours(dayPlanned)} planned` : "Open day"}
              </p>
              {focused > 0 ? (
                <p className="mt-0.5 text-[11px] font-medium text-primary">
                  {formatHours(focused)} focused
                </p>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={CalendarDays} label="Scheduled" value={`${scheduledItems.length} items`} />
        <Metric icon={Clock3} label="Planned" value={formatHours(plannedHours)} />
        <Metric icon={Timer} label="Focused" value={formatHours(focusedHours)} />
        <Metric icon={ListTodo} label="Delivery" value={`${Math.round(completion * 100)}%`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{currentDate ? formatDayLabel(currentDate) : "Selected day"}</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Work scheduled for this day. Sessions are recorded against these items.
              </p>
            </div>
            <AddAllocationDialog
              candidates={candidates}
              index={index}
              onAdd={(item) => {
                if (!currentDate) return;
                actions.allocate(currentDate, item.id, item.estimatedDailyHours);
                toast.success(`Scheduled ${item.name}`);
              }}
            />
          </CardHeader>
          <CardContent>
            {scheduledItems.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No work scheduled"
                description="Add a work item to turn this day into a concrete commitment."
                className="py-12"
              />
            ) : (
              <div className="space-y-3">
                {scheduledItems.map(({ item, plannedHours: allocation }) => {
                  const lineage = lineageFor(index, item.id);
                  const focused = actualByItem.get(item.id) ?? 0;
                  const progress = allocation > 0 ? Math.min(1, focused / allocation) : 0;
                  const complete = progress >= 1;
                  const checkIn = lineage?.goal
                    ? getCheckInState(lineage.goal, currentDate, now)
                    : null;
                  const focusHref = `/focus?item=${encodeURIComponent(item.id)}&minutes=${Math.max(1, Math.round(allocation * 60))}`;
                  const lateHref = checkIn
                    ? `${focusHref}&lateCheckIn=1&lateBy=${checkIn.lateByMinutes}`
                    : focusHref;
                  const itemSessionCount = state.sessions.filter(
                    (session) =>
                      session.focusItemId === item.id &&
                      currentDate &&
                      toDateKey(session.startedAt) === currentDate,
                  ).length;

                  return (
                    <article
                      key={item.id}
                      className="rounded-xl border border-border/70 bg-card-elevated/35 p-4 transition-colors hover:border-primary/30"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                            <ListTodo className="size-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              <CategoryDot
                                color={
                                  lineage?.category
                                    ? `var(--${lineage.category.color})`
                                    : "var(--chart-1)"
                                }
                              />
                              {lineage?.goal?.title ?? "No goal"}
                            </p>
                            <h3 className="mt-1 truncate text-sm font-semibold">{item.name}</h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {itemSessionCount} session{itemSessionCount === 1 ? "" : "s"} · {formatHours(focused)} focused
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PriorityBadge priority={item.priority} />
                          <ItemStatusBadge status={item.status} />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <ProgressDisplay value={progress} className="h-2 flex-1" />
                        <span className="tabular w-20 text-right text-xs font-medium">
                          {formatHours(focused)} / {formatHours(allocation)}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                        {complete ? (
                          <Badge className="h-8 rounded-lg px-3" variant="secondary">
                            <CheckCircle2 className="size-3.5 text-health-excellent" />
                            Commitment met
                          </Badge>
                        ) : checkIn?.state === "past" ? (
                          <>
                            <Badge
                              variant="outline"
                              className="h-8 gap-1.5 rounded-lg border-health-behind/25 bg-health-behind/10 px-3 text-health-behind"
                            >
                              <Clock3 className="size-3.5" />
                              Window passed · {checkIn.lateByMinutes}m late
                            </Badge>
                            <Button size="sm" variant="subtle" asChild>
                              <Link href={lateHref}>
                                <RotateCcw className="size-3.5" />
                                Late check-in
                              </Link>
                            </Button>
                          </>
                        ) : checkIn?.state === "upcoming" ? (
                          <Badge
                            variant="outline"
                            className="h-8 gap-1.5 rounded-lg border-border bg-muted px-3 text-muted-foreground"
                          >
                            <Clock3 className="size-3.5" />
                            Opens at {formatTime(`1970-01-01T${checkIn.time}:00`)}
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant={focused > 0 ? "subtle" : "default"}
                            className={
                              focused > 0
                                ? undefined
                                : "bg-gradient-to-r from-primary to-primary/80 shadow-sm shadow-primary/15"
                            }
                            asChild
                          >
                            <Link href={focusHref}>
                              {focused > 0 ? <RotateCcw className="size-3.5" /> : <ListTodo className="size-3.5" />}
                              {focused > 0 ? "Continue" : checkIn?.enabled ? "Check in" : "Start session"}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <div>
              <CardTitle>Day at a glance</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">A planning view, not a session log.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border/70 bg-secondary/30 p-4">
              <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">Focus delivered</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">{Math.round(completion * 100)}%</p>
              <ProgressDisplay value={completion} className="mt-3 h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {formatHours(focusedHours)} of {formatHours(plannedHours)} planned
              </p>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>{daySessions.length} focus session{daySessions.length === 1 ? "" : "s"} recorded</p>
              <p>Sessions remain available in the Sessions history.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-border/70 bg-card-elevated/35">
      <CardContent className="flex items-center gap-3 p-4">
        <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">{label}</p>
          <p className="mt-0.5 text-sm font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
