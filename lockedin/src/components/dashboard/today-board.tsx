import Link from "next/link";
import { Pause } from "lucide-react";

import { sessionActiveHours } from "@/lib/analytics";
import { getCheckInState } from "@/lib/check-in";
import { isPlanFailed, loggedHoursForGoal } from "@/lib/plan-result";
import { lineageFor, type EntityIndex } from "@/lib/selectors";
import { sessionCalendarDate } from "@/lib/session-calendar";
import type { FocusItem, FocusSession, Goal, PauseEvent, PlanAllocation } from "@/lib/types";
import { cn, formatTime } from "@/lib/utils";

export interface CheckInRow {
  id: string;
  name: string;
  goalTitle: string;
  categoryName: string;
  categoryColor: string;
  plannedHours: number;
  focusedHours: number;
  live: boolean;
  paused: boolean;
  status: string;
  href: string;
  cta: string;
}

export function buildCheckIns({
  allocations,
  focusItems,
  goals,
  sessions,
  activeSessionId,
  now,
  todayKey,
  index,
}: {
  allocations: PlanAllocation[];
  focusItems: FocusItem[];
  goals: Goal[];
  sessions: FocusSession[];
  activeSessionId: string | null;
  now: number;
  todayKey: string;
  index: EntityIndex;
}): CheckInRow[] {
  const goalById = new Map(goals.map((goal) => [goal.id, goal]));
  const hoursToday = new Map<string, number>();
  for (const session of sessions) {
    if (sessionCalendarDate(session) !== todayKey) continue;
    hoursToday.set(
      session.focusItemId,
      (hoursToday.get(session.focusItemId) ?? 0) + sessionActiveHours(session, now),
    );
  }

  const active = sessions.find(
    (session) =>
      session.id === activeSessionId &&
      (session.status === "running" || session.status === "paused"),
  );

  const source: { item: FocusItem; plannedHours: number }[] = [];

  if (allocations.length > 0) {
    for (const allocation of allocations) {
      const item = focusItems.find((entry) => entry.id === allocation.focusItemId);
      if (!item || item.archivedAt) continue;
      const goal = goalById.get(item.goalId);
      if (goal && goal.status !== "active" && item.id !== active?.focusItemId) continue;
      source.push({ item, plannedHours: allocation.plannedHours });
    }
  }

  const includedGoals = new Set(source.map((entry) => entry.item.goalId));
  for (const goal of goals) {
    if (goal.status !== "active" || includedGoals.has(goal.id)) continue;
    if (goal.startDate && goal.startDate > todayKey) continue;
    if (goal.targetDate && goal.targetDate < todayKey) continue;
    const item = focusItems.find((entry) => entry.goalId === goal.id && !entry.archivedAt);
    if (!item) continue;
    includedGoals.add(goal.id);
    source.push({
      item,
      plannedHours: (goal.dailyCommitmentMinutes ?? 0) / 60 || item.estimatedDailyHours,
    });
  }

  return source
    .map(({ item, plannedHours }) => {
      const lineage = lineageFor(index, item.id);
      const goal = lineage?.goal;
      if (!goal) return null;
      const focusedHours = hoursToday.get(item.id) ?? 0;
      const live = active?.focusItemId === item.id;
      if (
        isPlanFailed(goal, loggedHoursForGoal({ focusItems, sessions }, goal.id, now), todayKey) &&
        !live
      ) {
        return null;
      }
      const paused = live && active?.status === "paused";
      const checkIn = getCheckInState(goal, todayKey, now);
      const met = plannedHours > 0 && focusedHours >= plannedHours - 0.05;
      const minutes = Math.max(15, Math.round((plannedHours || item.estimatedDailyHours || 0.5) * 60));

      let status = "Not started";
      let href = `/lockin?item=${item.id}&minutes=${minutes}`;
      let cta = checkIn.enabled ? "Check in" : "Start";
      if (live && !paused) {
        status = "In session";
        href = "/lockin";
        cta = "Open";
      } else if (paused) {
        status = "Paused";
        href = "/lockin";
        cta = "Resume";
      } else if (met) {
        status = "Met";
        href = `/plans/${goal.id}`;
        cta = "Review";
      } else if (focusedHours > 0) {
        status = "In progress";
        cta = "Continue";
      } else if (checkIn.state === "upcoming") {
        status = `Opens ${formatTime(`1970-01-01T${checkIn.time}:00`)}`;
        cta = "Waiting";
      } else if (checkIn.state === "past") {
        status = `${checkIn.lateByMinutes}m late`;
        href = `/lockin?item=${item.id}&minutes=${minutes}&lateCheckIn=1&lateBy=${checkIn.lateByMinutes}`;
        cta = "Late check-in";
      }

      return {
        id: item.id,
        name: item.name,
        goalTitle: goal.title,
        categoryName: lineage.category?.name ?? "Uncategorised",
        categoryColor: lineage.category ? `var(--${lineage.category.color})` : "var(--chart-1)",
        plannedHours,
        focusedHours,
        live,
        paused,
        status,
        href,
        cta,
      } satisfies CheckInRow;
    })
    .filter((row): row is CheckInRow => row !== null)
    .sort((a, b) => Number(b.live) - Number(a.live) || b.focusedHours - a.focusedHours);
}

function pauseDuration(pause: PauseEvent, now: number) {
  const start = new Date(pause.startedAt).getTime();
  const end = pause.endedAt ? new Date(pause.endedAt).getTime() : now;
  return Math.max(0, end - start);
}

function formatBreak(ms: number) {
  const minutes = Math.max(0, Math.round(ms / 60_000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

/** How the day is going: the figures, then every plan still open today. */
export function TodayPulse({
  rows,
  sessions,
  activeCount,
  now,
  todayKey,
}: {
  rows: CheckInRow[];
  sessions: FocusSession[];
  activeCount: number;
  now: number;
  todayKey: string;
}) {
  const done = rows.filter((row) => row.status === "Met").length;
  const total = rows.length;
  const planned = rows.reduce((sum, row) => sum + row.plannedHours, 0);
  const focused = rows.reduce((sum, row) => sum + row.focusedHours, 0);
  const percent = planned > 0 ? Math.min(100, Math.round((focused / planned) * 100)) : 0;
  const breakMs = sessions.reduce((sum, session) => {
    if (sessionCalendarDate(session) !== todayKey) return sum;
    return sum + session.pauses.reduce((pauseSum, pause) => pauseSum + pauseDuration(pause, now), 0);
  }, 0);
  const openRows = rows.filter((row) => row.live || row.status !== "Met");

  const figures = [
    { label: "Check-ins done", value: String(done), suffix: `/ ${total}`, meter: false },
    { label: "Today's goals", value: String(percent), suffix: "%", meter: true },
    { label: "Break so far", value: formatBreak(breakMs), suffix: "", meter: false },
    {
      label: activeCount === 1 ? "Active session" : "Active sessions",
      value: String(activeCount),
      suffix: "",
      meter: false,
    },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs">
      <p className="px-6 pt-5 text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase sm:px-7">
        How the day is going
      </p>
      <dl className="mt-1 grid grid-cols-2 lg:grid-cols-4">
        {figures.map((figure) => (
          <div
            key={figure.label}
            className="border-border/60 px-6 py-5 sm:px-7 max-lg:even:border-l max-lg:[&:nth-child(n+3)]:border-t lg:border-l lg:first:border-l-0"
          >
            <dt className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {figure.label}
            </dt>
            <dd className="mt-3 flex items-baseline gap-1.5 text-[3.25rem] leading-none font-medium tracking-[-0.045em] text-muted-foreground tabular">
              {figure.value}
              {figure.suffix ? (
                <span className="text-xl font-normal tracking-normal text-muted-foreground">
                  {figure.suffix}
                </span>
              ) : null}
            </dd>
            <div
              className="mt-4 h-px bg-border"
              {...(figure.meter
                ? {
                    role: "meter" as const,
                    "aria-valuemin": 0,
                    "aria-valuemax": 100,
                    "aria-valuenow": percent,
                    "aria-label": "Today's goals done",
                  }
                : { "aria-hidden": true })}
            >
              {figure.meter ? (
                <div className="h-px bg-foreground" style={{ width: `${percent}%` }} />
              ) : null}
            </div>
          </div>
        ))}
      </dl>
      {openRows.length > 0 ? (
        <ul className="border-t border-border/60">
          {openRows.map((row) => {
            const level =
              row.plannedHours > 0
                ? Math.min(100, Math.round((row.focusedHours / row.plannedHours) * 100))
                : 0;
            return (
            <li key={row.id} className="border-b border-border/60 last:border-b-0">
              <Link
                href={row.href}
                aria-label={`${/check/i.test(row.cta) ? "Check in" : "Lock in"} on ${row.name}`}
                className="group relative flex items-stretch overflow-hidden"
              >
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-y-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100",
                    row.paused ? "bg-health-slipping/10" : "bg-foreground/[0.06]",
                  )}
                  style={{ width: `${level}%` }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 z-10 -translate-x-full -translate-y-1/2 pr-3 text-sm font-medium tabular text-muted-foreground/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{ left: `min(${Math.max(level, 8)}%, calc(100% - 3rem))` }}
                >
                  {level}%
                </span>
                <div className="relative z-10 min-w-0 flex-1 px-6 py-4 sm:px-7">
                  <p className="truncate text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                    {row.goalTitle}
                  </p>
                  <p className="mt-1 truncate text-[15px] font-medium">{row.name}</p>
                  {row.paused ? (
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-health-slipping/10 px-2 py-0.5 text-[11px] font-medium text-health-slipping">
                      <Pause className="size-3" />
                      Paused
                    </span>
                  ) : row.live ? (
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-foreground/8 px-2 py-0.5 text-[11px] font-medium">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground/40" />
                        <span className="relative size-1.5 rounded-full bg-foreground" />
                      </span>
                      Live
                    </span>
                  ) : (
                    <p className="mt-1 truncate text-xs text-muted-foreground">{row.status}</p>
                  )}
                </div>
              </Link>
            </li>
            );
          })}
        </ul>
      ) : (
        <p className="border-t border-border/60 px-6 py-4 text-sm text-muted-foreground sm:px-7">
          Nothing is waiting to be checked in.
        </p>
      )}
    </section>
  );
}
