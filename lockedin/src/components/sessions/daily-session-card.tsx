"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, Play, RotateCcw } from "lucide-react";

import { CategoryDot } from "@/components/shared/badges";
import { ProgressDisplay } from "@/components/shared/progress-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFocusStore } from "@/lib/store/focus-store";
import type { Category, DailySession, FocusItem, Goal } from "@/lib/types";
import { cn, formatDuration, formatTime, fromDateKey } from "@/lib/utils";

export function DailySessionCard({
  session,
  goal,
  focusItem,
  category,
  focusedMs,
  active,
  now,
  highlighted = false,
}: {
  session: DailySession;
  goal: Goal;
  focusItem?: FocusItem;
  category?: Category;
  focusedMs: number;
  active: boolean;
  now: number;
  highlighted?: boolean;
}) {
  const { state } = useFocusStore();
  const ringDisplay = (state.settings.goalProgressDisplay ?? "ring") === "ring";
  const commitmentMs = session.commitmentMinutes * 60_000;
  const complete = focusedMs >= commitmentMs;
  const inProgress = active || focusedMs > 0;
  const status = complete ? "completed" : inProgress ? "in_progress" : "not_started";
  const remainingMs = Math.max(0, commitmentMs - focusedMs);
  const progress = commitmentMs > 0 ? Math.min(100, (focusedMs / commitmentMs) * 100) : 0;
  const href = active
    ? "/focus/session"
    : `/focus?dailySession=${encodeURIComponent(session.id)}&goal=${encodeURIComponent(goal.id)}`;
  const checkIn = (() => {
    if (!session.scheduledCheckInEnabled || !session.scheduledCheckInTime || active) {
      return null;
    }
    const scheduled = fromDateKey(session.date);
    const [hours, minutes] = session.scheduledCheckInTime.split(":").map(Number);
    scheduled.setHours(hours, minutes, 0, 0);
    const minutesFromCheckIn = (now - scheduled.getTime()) / 60_000;
    const grace = session.strictCheckIn ? 5 : 1;
    if (minutesFromCheckIn < -3) return { state: "upcoming" as const, lateByMinutes: 0 };
    if (minutesFromCheckIn > grace) {
      return { state: "past" as const, lateByMinutes: Math.max(1, Math.round(minutesFromCheckIn)) };
    }
    return { state: "open" as const, lateByMinutes: 0 };
  })();
  const lateHref = `${href}&lateCheckIn=1&lateBy=${checkIn?.lateByMinutes ?? 0}`;

  return (
    <article
      id={`daily-session-${goal.id}`}
      className={cn(
        "rounded-2xl border border-border/50 bg-gradient-to-b from-card via-card to-primary/5 p-5 shadow-xs transition-shadow",
        active
          ? "animate-active-session-card border-primary/45 shadow-lg shadow-primary/10 motion-reduce:animate-none"
          : highlighted
          ? "border-primary/50 ring-2 ring-primary/15 shadow-md"
          : "border-border/70",
      )}
      style={
        active
          ? {
              background:
                "linear-gradient(120deg, color-mix(in oklab, var(--primary) 10%, var(--card)), var(--card), color-mix(in oklab, var(--primary) 4%, var(--card)))",
              backgroundSize: "200% 200%",
            }
          : undefined
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CategoryDot
              color={category ? `var(--${category.color})` : "var(--chart-1)"}
            />
            {category?.name ?? "Uncategorised"}
          </p>
          <h2 className="text-base font-semibold tracking-tight">
            {focusItem?.name ?? goal.title}
          </h2>
          {focusItem ? (
            <p className="text-xs text-muted-foreground">{goal.title}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-3.5" />
              {formatDuration(commitmentMs)} commitment
            </span>
            {session.scheduledCheckInEnabled && session.scheduledCheckInTime ? (
              <span>Check in · {formatTime(`1970-01-01T${session.scheduledCheckInTime}:00`)}</span>
            ) : null}
          </div>
        </div>

        <Badge
          variant="outline"
          className={cn(
            status === "completed" && "border-health-excellent/30 bg-health-excellent/10 text-health-excellent",
            status === "in_progress" && "border-health-on-track/30 bg-health-on-track/10 text-health-on-track",
            status === "not_started" && "border-border bg-muted text-muted-foreground",
          )}
        >
          {status === "completed"
            ? "Completed"
            : status === "in_progress"
              ? "In progress"
              : "Not started"}
        </Badge>
      </div>

      <div className={cn("mt-5", ringDisplay ? "flex items-center justify-between gap-4" : "space-y-2")}>
        <div className={cn("flex items-baseline justify-between gap-3 text-xs", ringDisplay && "min-w-0 flex-1")}>
          <span className="tabular font-medium">{formatDuration(focusedMs)} focused</span>
          <span className="tabular text-muted-foreground">
            {complete ? "Commitment met" : `${formatDuration(remainingMs)} remaining`}
          </span>
        </div>
        {ringDisplay ? (
          <ProgressDisplay
            value={progress / 100}
            size={64}
            strokeWidth={7}
            color={complete ? "var(--health-excellent)" : "var(--primary)"}
            ringClassName="shrink-0"
          >
            <span className="tabular text-xs font-semibold">{Math.round(progress)}%</span>
          </ProgressDisplay>
        ) : (
          <ProgressDisplay
            value={progress / 100}
            className="h-2"
            barClassName={complete ? "bg-health-excellent" : "bg-primary"}
            color={complete ? "var(--health-excellent)" : "var(--primary)"}
          />
        )}
      </div>

      <div className="mt-5 flex justify-end">
        {complete ? (
          <Badge className="h-8 rounded-lg px-3" variant="secondary">
            <CheckCircle2 className="size-3.5 text-health-excellent" />
            Completed
          </Badge>
        ) : checkIn?.state === "past" ? (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Badge
                variant="outline"
                className="h-8 gap-1.5 rounded-lg border-health-behind/25 bg-health-behind/10 px-3 text-health-behind"
              >
                <Clock3 className="size-3.5" />
                Window passed · {checkIn.lateByMinutes}m late
              </Badge>
              <Button asChild size="sm" variant="subtle">
                <Link href={lateHref}>
                  <RotateCcw className="size-3.5" />
                  Late check-in
                </Link>
              </Button>
            </div>
          ) : checkIn?.state === "upcoming" ? (
            <Badge
              variant="outline"
              className="h-8 gap-1.5 rounded-lg border-border bg-muted px-3 text-muted-foreground"
            >
              <Clock3 className="size-3.5" />
              Opens at {formatTime(`1970-01-01T${session.scheduledCheckInTime ?? "00:00"}:00`)}
            </Badge>
          ) : (
            <Button asChild size="sm" variant="subtle">
              <Link href={href}>
                {inProgress ? <RotateCcw className="size-3.5" /> : <Play className="size-3.5" />}
                {inProgress ? "Continue" : "Start focus"}
              </Link>
            </Button>
          )}
      </div>
    </article>
  );
}
