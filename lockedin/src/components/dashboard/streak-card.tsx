"use client";

import { Award, Flame, Medal, Trophy } from "lucide-react";

import { ProgressDisplay } from "@/components/shared/progress-display";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { StreakSummary } from "@/lib/analytics";
import { healthFromRatio } from "@/lib/health";
import type { DayMetrics } from "@/lib/types";
import { cn, formatDayLabel, percent } from "@/lib/utils";

interface Badge {
  id: string;
  label: string;
  icon: typeof Flame;
  earned: boolean;
  requirement: string;
}

/**
 * Streaks and achievement badges.
 *
 * A day counts toward the streak at ≥60% of its planned hours (or ≥1h focused
 * when the day was unplanned) — see `computeStreaks`.
 */
export function StreakCard({
  streaks,
  days,
  longestSessionMinutes,
}: {
  streaks: StreakSummary;
  days: DayMetrics[];
  longestSessionMinutes: number;
}) {
  const last14 = days.slice(-14);
  const qualifying = new Set(streaks.qualifyingDays);
  const consistencyHealth = healthFromRatio(streaks.weeklyConsistency);

  const badges: Badge[] = [
    {
      id: "week",
      label: "Week warrior",
      icon: Flame,
      earned: streaks.longestStreak >= 7,
      requirement: "7-day focus streak",
    },
    {
      id: "fortnight",
      label: "Two-week run",
      icon: Medal,
      earned: streaks.longestStreak >= 14,
      requirement: "14-day focus streak",
    },
    {
      id: "deep",
      label: "Deep diver",
      icon: Trophy,
      earned: longestSessionMinutes >= 90,
      requirement: "A single 90-minute session",
    },
    {
      id: "consistent",
      label: "Fully consistent week",
      icon: Award,
      earned: streaks.weeklyConsistency >= 1,
      requirement: "Every workday this week met its bar",
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Streaks and consistency</CardTitle>
          <CardDescription>
            Days that hit at least 60% of their plan
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-end gap-6">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              <Flame className="size-3 text-health-behind" />
              Current
            </p>
            <p className="tabular mt-1 text-3xl leading-none font-semibold">
              {streaks.currentStreak}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                days
              </span>
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Longest
            </p>
            <p className="tabular mt-1 text-xl leading-none font-semibold text-muted-foreground">
              {streaks.longestStreak}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-muted-foreground">Weekly consistency</span>
            <span className={cn("tabular font-medium", consistencyHealth.text)}>
              {percent(streaks.weeklyConsistency)}
            </span>
          </div>
          <ProgressDisplay
            value={streaks.weeklyConsistency}
            barClassName={consistencyHealth.fill}
            color={consistencyHealth.cssVar}
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Last 14 days
          </p>
          <div className="flex gap-1">
            {last14.map((day) => {
              const met = qualifying.has(day.date);
              return (
                <Tooltip key={day.date}>
                  <TooltipTrigger asChild>
                    <span
                      className={cn(
                        "h-7 flex-1 rounded-[4px] transition-colors",
                        met
                          ? "bg-health-excellent/80"
                          : day.sessionCount > 0
                            ? "bg-health-slipping/45"
                            : "bg-secondary",
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {formatDayLabel(day.date)} — {day.actualHours}h of{" "}
                    {day.plannedHours}h
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-2">
          {badges.map((badge) => (
            <li
              key={badge.id}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-2.5 py-2",
                badge.earned
                  ? "border-primary/25 bg-primary/8 text-foreground"
                  : "border-border/60 text-muted-foreground",
              )}
              title={badge.requirement}
            >
              <badge.icon
                className={cn(
                  "size-3.5 shrink-0",
                  badge.earned ? "text-primary" : "opacity-50",
                )}
              />
              <span className="truncate text-[11px] font-medium">
                {badge.label}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
