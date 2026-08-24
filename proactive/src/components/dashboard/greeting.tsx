"use client";

import Link from "next/link";
import { CalendarRange, Clock, Flame, Quote, Timer, Zap } from "lucide-react";

import { HealthBadge } from "@/components/shared/badges";
import { Button } from "@/components/ui/button";
import { MOTIVATION_QUOTES } from "@/lib/constants";
import { formatHours, fromDateKey } from "@/lib/utils";

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
}) {
  const date = fromDateKey(todayKey);
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
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aurora pointer-events-none absolute inset-0" />
      <div className="relative space-y-4 p-5">
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
            <h1 className="text-2xl font-semibold tracking-tight">
              {greetingFor(new Date(now).getHours())}, {name}.
            </h1>
            {intention ? (
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
            <div className="flex gap-2">
              <Button size="sm" variant="subtle" asChild>
                <Link href="/plan">Adjust plan</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/focus">Start a session</Link>
              </Button>
            </div>
          </div>
        </div>

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
      </div>
    </div>
  );
}
