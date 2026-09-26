"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarRange,
  Clock,
  Flame,
  PauseCircle,
  Quote,
  Radio,
  Timer,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { PauseDialog } from "@/components/focus/pause-dialog";
import { ReflectionDialog } from "@/components/focus/reflection-dialog";
import { HealthBadge } from "@/components/shared/badges";
import { Button } from "@/components/ui/button";
import { MOTIVATION_QUOTES } from "@/lib/constants";
import { useFocusStore } from "@/lib/store/focus-store";
import { formatClock, formatHours, fromDateKey } from "@/lib/utils";

function greetingFor(hour: number): string {
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Winding down";
}

/** Compact dashboard hero: greeting, intention, and today's numbers. */
export function DashboardGreeting({
  name,
  todayKey,
  focusScore,
  intention,
  now,
  focusedHours,
  remainingHours,
  streak,
  interruptions,
  activeWork,
}: {
  name: string;
  todayKey: string;
  focusScore: number;
  intention: string;
  now: number;
  focusedHours: number;
  remainingHours: number;
  streak: number;
  interruptions: number;
  activeWork?: {
    focusItemId: string;
    itemName: string;
    goalName: string;
    elapsedMs: number;
    plannedMinutes: number;
    sessionId: string;
    interruptions: number;
    paused: boolean;
  } | null;
}) {
  const date = fromDateKey(todayKey);
  const { state, actions } = useFocusStore();
  const [pauseOpen, setPauseOpen] = useState(false);
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const quote =
    MOTIVATION_QUOTES[
      Math.floor(date.getTime() / 86_400_000) % MOTIVATION_QUOTES.length
    ];

  const metrics = [
    { label: "Focused", value: formatHours(focusedHours), icon: Clock },
    { label: "Remaining", value: formatHours(remainingHours), icon: Timer },
    { label: "Streak", value: `${streak}d`, icon: Flame },
    { label: "Interruptions", value: String(interruptions), icon: Zap },
  ];

  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div
        className={`aurora pointer-events-none absolute inset-0 transition-opacity duration-300 ${activeWork ? "opacity-40" : "opacity-70"}`}
      />
      <div className="relative flex min-h-[300px] flex-col justify-between gap-5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarRange className="size-3.5" />
              {date.toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {activeWork
                ? "In focus."
                : `${greetingFor(new Date(now).getHours())}, ${name}.`}
            </h1>
            {activeWork ? (
              <p className="flex max-w-xl items-start gap-1.5 text-sm text-muted-foreground">
                <Radio className="mt-0.5 size-3.5 shrink-0 text-primary" />
                Your attention is currently on one thing. Keep the momentum going.
              </p>
            ) : intention ? (
              <p className="max-w-xl text-sm text-muted-foreground">
                <span className="text-foreground/80">Today&apos;s intention: </span>
                {intention}
              </p>
            ) : (
              <p className="flex max-w-xl items-start gap-1.5 text-sm text-muted-foreground">
                <Quote className="mt-0.5 size-3.5 shrink-0 opacity-60" />
                {quote}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-col items-start gap-2.5 lg:items-end">
            <HealthBadge score={focusScore} />
            {!activeWork ? (
              <div className="flex gap-2">
                <Button size="sm" variant="subtle" asChild>
                  <Link href="/goals">View goals</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/focus">Start a session</Link>
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {activeWork ? (
          <motion.div
            layoutId={`work-item-${activeWork.focusItemId}`}
            transition={{ layout: { duration: 0.35, ease: "easeInOut" } }}
            className="relative overflow-hidden rounded-2xl border border-primary/25 bg-background/35 p-4 shadow-sm backdrop-blur-sm"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
            <div className="flex flex-col gap-4">
              <div className="flex min-w-0 items-center gap-3.5">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/12 text-primary">
                  {activeWork.paused ? (
                    <PauseCircle className="size-5" />
                  ) : (
                    <Radio className="size-5 animate-pulse" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                    {activeWork.paused ? "Session paused" : "Live focus"}
                  </p>
                  <h2 className="mt-1 truncate text-lg font-semibold tracking-tight">{activeWork.itemName}</h2>
                  <p className="truncate text-sm text-muted-foreground">{activeWork.goalName}</p>
                </div>
                <div className="ml-auto shrink-0 text-right">
                  <p className="text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Focused time</p>
                  <time className="mt-1 block tabular font-mono text-2xl font-semibold tracking-[0.08em] text-primary">
                    {formatClock(activeWork.elapsedMs)}
                  </time>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-primary/15 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground">Remaining</p>
                    <p className="tabular mt-0.5 font-semibold">
                      {formatClock(
                        Math.max(
                          0,
                          activeWork.plannedMinutes * 60_000 - activeWork.elapsedMs,
                        ),
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Interruptions</p>
                    <p className="tabular mt-0.5 font-semibold">{activeWork.interruptions}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  {activeWork.paused ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        actions.resumeSession(activeWork.sessionId);
                        toast.success("Back to focus");
                      }}
                    >
                      <Radio className="size-3.5" />
                      Resume
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setPauseOpen(true)}>
                      <PauseCircle className="size-3.5" />
                      Pause
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-health-behind hover:text-health-behind"
                    onClick={() => setReflectionOpen(true)}
                  >
                    End session
                  </Button>
                  <Button size="sm" variant="subtle" asChild>
                    <Link href="/focus/session">
                      Open workspace
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}

        {!activeWork ? (
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 sm:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex items-center gap-2.5 bg-card/80 px-3 py-2.5"
              >
                <metric.icon className="size-3.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    {metric.label}
                  </p>
                  <p className="tabular text-sm font-semibold">{metric.value}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {activeWork ? (
        <>
          <PauseDialog
            open={pauseOpen}
            onOpenChange={setPauseOpen}
            reasons={state.settings.pauseReasons}
            onConfirm={(reasonId, note) => {
              actions.pauseSession(activeWork.sessionId, reasonId, note);
              toast.info("Session paused", { description: "The clock stops until you resume." });
            }}
          />
          <ReflectionDialog
            open={reflectionOpen}
            onOpenChange={setReflectionOpen}
            elapsedMs={activeWork.elapsedMs}
            interruptions={activeWork.interruptions}
            onComplete={() => {
              actions.endSession(activeWork.sessionId, {
                status: activeWork.elapsedMs < (activeWork.plannedMinutes * 60_000) / 3 ? "abandoned" : "completed",
                rating: null,
                reflection: "",
              });
              toast.success("Session logged");
            }}
          />
        </>
      ) : null}
    </div>
  );
}
