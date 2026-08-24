"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CircleSlash2, MessageSquareQuote, Star, Timer, Zap } from "lucide-react";

import { CategoryDot } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { RatingStars } from "@/components/sessions/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFocusData } from "@/hooks/use-focus-data";
import { countInterruptions, sessionActiveMs } from "@/lib/analytics";
import { lineageFor } from "@/lib/selectors";
import type { FocusSession } from "@/lib/types";
import {
  cn,
  formatDuration,
  formatRelativeDay,
  formatTime,
  groupBy,
  round,
  toDateKey,
} from "@/lib/utils";

type StatusFilter = "all" | "completed" | "abandoned";

/** Session history grouped by day, with reflections and pause detail. */
export default function SessionsPage() {
  const { state, index, now, rangeSessions, summary } = useFocusData({
    tickMs: 60_000,
  });
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    return rangeSessions
      .filter((session) => {
        if (statusFilter !== "all" && session.status !== statusFilter) {
          return false;
        }
        if (categoryFilter === "all") return true;
        const lineage = lineageFor(index, session.focusItemId);
        return lineage?.category?.id === categoryFilter;
      })
      .sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
      );
  }, [rangeSessions, statusFilter, categoryFilter, index]);

  const byDay = useMemo(
    () => groupBy(filtered, (session) => toDateKey(session.startedAt)),
    [filtered],
  );
  const dayKeys = Object.keys(byDay).sort((a, b) => b.localeCompare(a));

  const rated = rangeSessions.filter((session) => session.productivityRating);
  const averageRating = rated.length
    ? round(
        rated.reduce(
          (total, session) => total + (session.productivityRating ?? 0),
          0,
        ) / rated.length,
        1,
      )
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sessions"
        description="Every focus block from the last eight weeks, with the reflection you wrote when you closed it."
        actions={
          <Button size="sm" asChild>
            <Link href="/focus">Start a session</Link>
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Sessions"
          value={summary.sessionCount}
          hint={`${summary.completedSessions} completed`}
          icon={Timer}
        />
        <StatCard
          label="Focused time"
          value={`${summary.actualHours}h`}
          hint={`Average block ${summary.averageSessionMinutes} min`}
        />
        <StatCard
          label="Average rating"
          value={averageRating || "—"}
          hint={`${rated.length} sessions rated`}
          icon={Star}
        />
        <StatCard
          label="Interruptions"
          value={summary.interruptions}
          hint={`${round(summary.interruptions / Math.max(summary.actualHours, 1), 2)} per focused hour`}
          icon={Zap}
        />
      </section>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {state.categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All outcomes</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="abandoned">Abandoned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {dayKeys.length === 0 ? (
        <EmptyState
          icon={Timer}
          title="No sessions match those filters"
          description="Widen the filters, or start a session and it will appear here immediately."
          className="py-16"
        />
      ) : (
        <div className="space-y-4">
          {dayKeys.map((dayKey) => {
            const daySessions = byDay[dayKey];
            const dayMs = daySessions.reduce(
              (total, session) => total + sessionActiveMs(session, now),
              0,
            );

            return (
              <Card key={dayKey}>
                <CardHeader>
                  <div>
                    <CardTitle>{formatRelativeDay(dayKey)}</CardTitle>
                    <CardDescription>
                      {daySessions.length} session
                      {daySessions.length === 1 ? "" : "s"} ·{" "}
                      {formatDuration(dayMs)} focused
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {daySessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      lineage={lineageFor(index, session.focusItemId)}
                      interruptions={countInterruptions(state, session)}
                      pauseLabel={(reasonId) =>
                        state.settings.pauseReasons.find(
                          (option) => option.id === reasonId,
                        )?.label ?? "Other"
                      }
                      now={now}
                    />
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SessionCard({
  session,
  lineage,
  interruptions,
  pauseLabel,
  now,
}: {
  session: FocusSession;
  lineage: ReturnType<typeof lineageFor>;
  interruptions: number;
  pauseLabel: (reasonId: string) => string;
  now: number;
}) {
  const elapsed = sessionActiveMs(session, now);
  const target = session.plannedMinutes * 60_000;
  const abandoned = session.status === "abandoned";

  return (
    <article className="rounded-xl border border-border/70 bg-card-elevated/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <CategoryDot
              color={
                lineage?.category
                  ? `var(--${lineage.category.color})`
                  : "var(--muted-foreground)"
              }
            />
            {lineage?.category?.name ?? "Uncategorised"} ·{" "}
            {lineage?.goal?.title ?? "No goal"}
          </p>
          <p className="text-sm font-medium">
            {lineage?.item.name ?? "Deleted focus item"}
          </p>
          <p className="tabular text-[11px] text-muted-foreground">
            {formatTime(session.startedAt)}
            {session.endedAt ? ` – ${formatTime(session.endedAt)}` : ""} · target{" "}
            {session.plannedMinutes} min
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="flex items-center gap-2">
            {abandoned ? (
              <Badge variant="destructive">
                <CircleSlash2 />
                Abandoned
              </Badge>
            ) : null}
            <span
              className={cn(
                "tabular text-sm font-semibold",
                elapsed >= target
                  ? "text-health-excellent"
                  : elapsed >= target * 0.6
                    ? "text-health-on-track"
                    : "text-health-behind",
              )}
            >
              {formatDuration(elapsed)}
            </span>
          </div>
          <RatingStars value={session.productivityRating} />
        </div>
      </div>

      {session.pauses.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {session.pauses.map((pause) => (
            <li
              key={pause.id}
              className="inline-flex items-center gap-1 rounded-md border border-border/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              <Zap className="size-2.5" />
              {pauseLabel(pause.reasonId)}
              {pause.endedAt ? (
                <span className="tabular opacity-70">
                  {formatDuration(
                    new Date(pause.endedAt).getTime() -
                      new Date(pause.startedAt).getTime(),
                  )}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {session.reflection ? (
        <p className="mt-3 flex gap-2 border-t border-border/60 pt-3 text-xs leading-relaxed text-muted-foreground">
          <MessageSquareQuote className="mt-0.5 size-3.5 shrink-0 opacity-60" />
          {session.reflection}
        </p>
      ) : null}

      {interruptions > 0 ? (
        <p className="mt-2 text-[10px] text-health-behind">
          {interruptions} unplanned interruption
          {interruptions === 1 ? "" : "s"} counted against this session
        </p>
      ) : null}
    </article>
  );
}
