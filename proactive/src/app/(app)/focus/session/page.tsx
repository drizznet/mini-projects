"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  Pause,
  Play,
  Quote,
  Square,
  Timer,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { FocusMusic } from "@/components/focus/focus-music";
import { PauseDialog } from "@/components/focus/pause-dialog";
import { ReflectionDialog } from "@/components/focus/reflection-dialog";
import { CategoryDot, PriorityBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { ProgressRing } from "@/components/shared/progress-ring";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNow } from "@/hooks/use-now";
import { countInterruptions, sessionActiveMs } from "@/lib/analytics";
import { MOTIVATION_QUOTES } from "@/lib/constants";
import { buildIndex, lineageFor } from "@/lib/selectors";
import { useFocusStore } from "@/lib/store/focus-store";
import { cn, formatClock, formatDuration, formatTime } from "@/lib/utils";

/**
 * Active focus session.
 *
 * The timer is derived, never stored: elapsed = wall clock − paused time (see
 * `sessionActiveMs`). That means a refresh, a crash or a closed laptop cannot
 * desynchronise the count, and the session survives navigation.
 */
export default function ActiveSessionPage() {
  const router = useRouter();
  const { state, actions } = useFocusStore();
  const now = useNow(1000);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [reflectionOpen, setReflectionOpen] = useState(false);

  const index = useMemo(() => buildIndex(state), [state]);
  const session = state.sessions.find(
    (entry) => entry.id === state.activeSessionId,
  );

  if (!session) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={Timer}
          title="No session running"
          description="Prepare a focus session and the live timer will appear here."
          action={
            <Button asChild>
              <Link href="/focus">Prepare a session</Link>
            </Button>
          }
          className="py-20"
        />
      </div>
    );
  }

  const lineage = lineageFor(index, session.focusItemId);
  const plannedMs = session.plannedMinutes * 60_000;
  const elapsed = sessionActiveMs(session, now);
  const remaining = Math.max(0, plannedMs - elapsed);
  const overtime = elapsed > plannedMs;
  const progress = plannedMs > 0 ? elapsed / plannedMs : 0;
  const paused = session.status === "paused";
  const interruptions = countInterruptions(state, session);
  const quote =
    MOTIVATION_QUOTES[
      new Date(session.startedAt).getMinutes() % MOTIVATION_QUOTES.length
    ];

  const ringColor = paused
    ? "var(--health-slipping)"
    : overtime
      ? "var(--health-excellent)"
      : "var(--primary)";

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card className="relative overflow-hidden">
          <div className="aurora pointer-events-none absolute inset-0 opacity-70" />
          <CardContent className="relative flex flex-col items-center gap-6 py-8">
            <div className="space-y-1.5 text-center">
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <CategoryDot
                  color={
                    lineage?.category
                      ? `var(--${lineage.category.color})`
                      : "var(--chart-1)"
                  }
                />
                {lineage?.category?.name ?? "Uncategorised"} ·{" "}
                {lineage?.goal?.title ?? "No goal"}
              </p>
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {lineage?.item.name ?? "Focus session"}
              </h1>
              <div className="flex items-center justify-center gap-2">
                {lineage ? (
                  <PriorityBadge priority={lineage.item.priority} />
                ) : null}
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium",
                    paused
                      ? "border-health-slipping/30 bg-health-slipping/12 text-health-slipping"
                      : "border-primary/30 bg-primary/12 text-primary",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      paused ? "bg-health-slipping" : "animate-pulse bg-primary",
                    )}
                  />
                  {paused ? "Paused" : "Focusing"}
                </span>
              </div>
            </div>

            <ProgressRing
              value={Math.min(1, progress)}
              size={228}
              strokeWidth={14}
              color={ringColor}
              pulse={!paused}
            >
              <span className="tabular font-mono text-4xl font-semibold tracking-tight">
                {formatClock(elapsed)}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                {overtime
                  ? `${formatDuration(elapsed - plannedMs)} past target`
                  : `${formatDuration(remaining)} remaining`}
              </span>
              <span className="mt-0.5 text-[11px] text-muted-foreground/80">
                target {session.plannedMinutes} min
              </span>
            </ProgressRing>

            <div className="flex items-center gap-2.5">
              {paused ? (
                <Button
                  size="lg"
                  onClick={() => {
                    actions.resumeSession(session.id);
                    toast.success("Back to focus");
                  }}
                >
                  <Play className="size-4" />
                  Resume
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="subtle"
                  onClick={() => setPauseOpen(true)}
                >
                  <Pause className="size-4" />
                  Pause
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                onClick={() => setReflectionOpen(true)}
              >
                <Square className="size-4" />
                End session
              </Button>
            </div>

            <p className="flex max-w-md items-start justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <Quote className="mt-0.5 size-3 shrink-0 opacity-60" />
              {quote}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Session detail</CardTitle>
                <CardDescription>
                  Started {formatTime(session.startedAt)}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <dl className="grid grid-cols-2 gap-3">
                <Detail label="Focused" value={formatDuration(elapsed)} />
                <Detail
                  label="Paused"
                  value={formatDuration(
                    session.pausedMs +
                      (session.pausedAt
                        ? now - new Date(session.pausedAt).getTime()
                        : 0),
                  )}
                />
                <Detail label="Pauses" value={`${session.pauses.length}`} />
                <Detail
                  label="Interruptions"
                  value={`${interruptions}`}
                  className={
                    interruptions > 0 ? "text-health-behind" : undefined
                  }
                />
              </dl>

              {session.pauses.length > 0 ? (
                <div className="space-y-1.5 border-t border-border/70 pt-3">
                  <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                    Pause log
                  </p>
                  <ul className="space-y-1">
                    {session.pauses.map((pause) => {
                      const reason = state.settings.pauseReasons.find(
                        (option) => option.id === pause.reasonId,
                      );
                      return (
                        <li
                          key={pause.id}
                          className="flex items-center gap-2 text-[11px]"
                        >
                          <Zap
                            className={cn(
                              "size-3 shrink-0",
                              reason?.planned
                                ? "text-muted-foreground"
                                : "text-health-behind",
                            )}
                          />
                          <span className="min-w-0 flex-1 truncate">
                            {reason?.label ?? "Other"}
                            {pause.note ? ` — ${pause.note}` : ""}
                          </span>
                          <span className="tabular shrink-0 text-muted-foreground">
                            {pause.endedAt
                              ? formatDuration(
                                  new Date(pause.endedAt).getTime() -
                                    new Date(pause.startedAt).getTime(),
                                )
                              : "ongoing"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              {session.checklist.length > 0 ? (
                <div className="space-y-1.5 border-t border-border/70 pt-3">
                  <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                    Preparation
                  </p>
                  <ul className="space-y-1">
                    {session.checklist.map((entry) => (
                      <li
                        key={entry.id}
                        className="flex items-center gap-2 text-[11px]"
                      >
                        {entry.checked ? (
                          <CheckCircle2 className="size-3 shrink-0 text-health-excellent" />
                        ) : (
                          <Circle className="size-3 shrink-0 text-muted-foreground/50" />
                        )}
                        <span
                          className={cn(
                            "truncate",
                            entry.checked
                              ? "text-muted-foreground"
                              : "text-muted-foreground/60",
                          )}
                        >
                          {entry.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <FocusMusic links={state.settings.musicLinks} />
        </div>
      </div>

      <PauseDialog
        open={pauseOpen}
        onOpenChange={setPauseOpen}
        reasons={state.settings.pauseReasons}
        onConfirm={(reasonId, note) => {
          actions.pauseSession(session.id, reasonId, note);
          toast.info("Session paused", {
            description: "The clock stops until you resume.",
          });
        }}
      />

      <ReflectionDialog
        open={reflectionOpen}
        onOpenChange={setReflectionOpen}
        elapsedMs={elapsed}
        interruptions={interruptions}
        onComplete={(rating, reflection) => {
          actions.endSession(session.id, {
            // Sessions that never reached a third of their target read as
            // abandoned in the analytics, regardless of how they were closed.
            status: elapsed < plannedMs / 3 ? "abandoned" : "completed",
            rating,
            reflection,
          });
          toast.success("Session logged", {
            description: `${formatDuration(elapsed)} of focus recorded.`,
          });
          router.push("/");
        }}
        onDiscard={() => {
          actions.discardSession(session.id);
          toast.info("Session discarded");
          router.push("/");
        }}
      />
    </div>
  );
}

function Detail({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card-elevated/50 px-3 py-2">
      <dt className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className={cn("tabular mt-0.5 text-sm font-semibold", className)}>
        {value}
      </dd>
    </div>
  );
}
