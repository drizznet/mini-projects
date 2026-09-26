"use client";

import { CircleSlash2, Zap } from "lucide-react";

import { CategoryDot } from "@/components/shared/badges";
import { RatingStars } from "@/components/sessions/rating-stars";
import { Badge } from "@/components/ui/badge";
import { sessionActiveMs } from "@/lib/analytics";
import { lineageFor, type EntityIndex } from "@/lib/selectors";
import type { FocusSession } from "@/lib/types";
import { cn, formatDuration, formatRelativeDay, formatTime, toDateKey } from "@/lib/utils";

/** Compact session feed shared by the dashboard and the sessions page. */
export function SessionList({
  sessions,
  index,
  now,
  interruptionsFor,
  className,
}: {
  sessions: FocusSession[];
  index: EntityIndex;
  now: number;
  interruptionsFor: (session: FocusSession) => number;
  className?: string;
}) {
  return (
    <ul className={cn("divide-y divide-border/70", className)}>
      {sessions.map((session) => {
        const lineage = lineageFor(index, session.focusItemId);
        const interruptions = interruptionsFor(session);
        const abandoned = session.status === "abandoned";

        return (
          <li key={session.id} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-1.5">
                <CategoryDot
                  color={
                    lineage?.category
                      ? `var(--${lineage.category.color})`
                      : "var(--muted-foreground)"
                  }
                />
                <p className="truncate text-sm font-medium">
                  {lineage?.item.name ?? "Deleted focus item"}
                </p>
                {abandoned ? (
                  <Badge variant="destructive" className="shrink-0">
                    <CircleSlash2 />
                    Abandoned
                  </Badge>
                ) : null}
              </div>
              <p className="truncate text-[11px] text-muted-foreground">
                {formatRelativeDay(toDateKey(session.startedAt))} ·{" "}
                {formatTime(session.startedAt)}
                {lineage?.goal ? ` · ${lineage.goal.title}` : ""}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              {interruptions > 0 ? (
                <span
                  className="inline-flex items-center gap-1 text-[11px] text-health-behind"
                  title={`${interruptions} unplanned interruption${interruptions === 1 ? "" : "s"}`}
                >
                  <Zap className="size-3" />
                  {interruptions}
                </span>
              ) : null}
              <RatingStars value={session.productivityRating} />
              <span className="tabular w-14 text-right text-xs font-medium">
                {formatDuration(sessionActiveMs(session, now))}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
