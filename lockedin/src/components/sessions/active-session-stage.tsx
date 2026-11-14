"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Headphones, Pause, Play, Quote, Square } from "lucide-react";
import { toast } from "sonner";

import { PauseDialog } from "@/components/focus/pause-dialog";
import { FocusBackdrop } from "@/components/sessions/focus-backdrop";
import { ReflectionDialog } from "@/components/focus/reflection-dialog";
import { Button } from "@/components/ui/button";
import { useNow } from "@/hooks/use-now";
import { countInterruptions, sessionActiveMs } from "@/lib/analytics";
import { MOTIVATION_QUOTES } from "@/lib/constants";
import { notifyDevice } from "@/lib/notifications";
import { buildIndex, lineageFor } from "@/lib/selectors";
import { useFocusStore } from "@/lib/store/focus-store";
import { cn, formatClock, formatDuration } from "@/lib/utils";

/**
 * Live focus room. Sits above session history and fills about half the screen
 * while a session is running or paused.
 */
export function ActiveSessionStage() {
  const { state, actions } = useFocusStore();
  const now = useNow(1000);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [reflectionOpen, setReflectionOpen] = useState(false);

  const index = useMemo(() => buildIndex(state), [state]);
  const session = state.sessions.find((entry) => entry.id === state.activeSessionId);

  if (!session || (session.status !== "running" && session.status !== "paused")) {
    return null;
  }

  const lineage = lineageFor(index, session.focusItemId);
  const plannedMs = session.plannedMinutes * 60_000;
  const elapsed = sessionActiveMs(session, now);
  const remaining = Math.max(0, plannedMs - elapsed);
  const overtime = elapsed > plannedMs;
  const progress = plannedMs > 0 ? Math.min(1, elapsed / plannedMs) : 0;
  const paused = session.status === "paused";
  const interruptions = countInterruptions(state, session);
  const quote =
    MOTIVATION_QUOTES[new Date(session.startedAt).getMinutes() % MOTIVATION_QUOTES.length];
  const backdrop = state.settings.focusBackdrop ?? "gradient";

  return (
    <section
      className="relative min-h-[50svh] overflow-hidden rounded-[1.75rem] text-white shadow-[0_24px_60px_-36px_rgba(0,0,0,0.65)]"
      aria-label={paused ? "Paused focus session" : "Active focus session"}
    >
      <FocusBackdrop variant={backdrop} paused={paused} />

      <div className="relative flex min-h-[50svh] flex-col justify-between px-6 py-7 sm:px-10 sm:py-9">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-white/70">
            {lineage?.category?.name ?? "Uncategorised"}
            <span className="px-1.5 text-white/35">/</span>
            {lineage?.goal?.title ?? "No plan"}
          </p>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <span className={cn("size-1.5 rounded-full", paused ? "bg-amber-300" : "animate-pulse bg-white")} />
            {paused ? "Paused" : "In focus"}
          </span>
        </div>

        <div className="mx-auto w-full max-w-xl space-y-4 py-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {lineage?.item.name ?? "Focus session"}
          </h1>
          <p className="tabular font-mono text-6xl font-semibold tracking-tight sm:text-7xl">
            {formatClock(elapsed)}
          </p>
          <p className="text-sm text-white/65">
            {overtime
              ? `${formatDuration(elapsed - plannedMs)} past the ${session.plannedMinutes} min target`
              : `${formatDuration(remaining)} left of ${session.plannedMinutes} min`}
          </p>
          <div className="mx-auto h-1 w-full max-w-xs overflow-hidden rounded-full bg-white/15">
            <div
              className={cn("h-full rounded-full transition-[width] duration-700", overtime ? "bg-emerald-300" : "bg-white")}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {paused ? (
              <Button
                size="lg"
                className="rounded-full bg-white text-neutral-900 hover:bg-white/90"
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
                variant="outline"
                className="rounded-full border-white/25 bg-white/10 text-white hover:bg-white/15 hover:text-white"
                onClick={() => setPauseOpen(true)}
              >
                <Pause className="size-4" />
                Pause
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
              onClick={() => setReflectionOpen(true)}
            >
              <Square className="size-4" />
              End session
            </Button>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="flex max-w-md items-start gap-2 text-xs leading-relaxed text-white/55">
              <Quote className="mt-0.5 size-3 shrink-0" />
              {quote}
            </p>
            {state.settings.musicLinks.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Headphones className="size-3.5 text-white/45" />
                {state.settings.musicLinks.slice(0, 2).map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/80 hover:bg-white/15"
                  >
                    {link.label}
                    <ExternalLink className="size-3" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <PauseDialog
        open={pauseOpen}
        onOpenChange={setPauseOpen}
        reasons={state.settings.pauseReasons}
        onConfirm={(reasonId, note) => {
          actions.pauseSession(session.id, reasonId, note);
          void notifyDevice(
            "Focus session paused",
            "Your focus timer is paused. Resume when you are ready.",
            "lockin-session-paused",
          );
          toast.info("Break started", {
            description: "Break time is tracked separately from focus time.",
          });
        }}
      />

      <ReflectionDialog
        open={reflectionOpen}
        onOpenChange={setReflectionOpen}
        elapsedMs={elapsed}
        interruptions={interruptions}
        onComplete={() => {
          actions.endSession(session.id, {
            status: elapsed < plannedMs / 3 ? "abandoned" : "completed",
            rating: null,
            reflection: "",
          });
          void notifyDevice(
            "Focus session ended",
            `${formatDuration(elapsed)} of focus was recorded.`,
            "lockin-session-ended",
          );
          toast.success("Session logged", {
            description: `${formatDuration(elapsed)} of focus recorded.`,
          });
        }}
      />
    </section>
  );
}

/** Quiet stand-in when nothing is running, so history still has a place to start. */
export function IdleSessionStage() {
  return (
    <section className="flex min-h-36 items-center justify-between gap-4 rounded-[1.75rem] border border-border/70 bg-card px-6 py-6 sm:px-8">
      <div className="space-y-1">
        <p className="text-sm font-medium">No live session</p>
        <p className="text-sm text-muted-foreground">Start one and this half of the page becomes your focus room.</p>
      </div>
      <Button asChild className="shrink-0 rounded-full">
        <Link href="/lockin">Start a session</Link>
      </Button>
    </section>
  );
}
