"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  CalendarCheck,
  Clock,
  Gauge,
  Sunrise,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";

import { CategoryDonut } from "@/components/charts/category-donut";
import { FocusDebtChart } from "@/components/charts/focus-debt-chart";
import { FocusHoursChart } from "@/components/charts/focus-hours-chart";
import { FocusScoreChart } from "@/components/charts/focus-score-chart";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { CategoryDot } from "@/components/shared/badges";
import { PageHeader } from "@/components/shared/page-header";
import { ProgressDisplay } from "@/components/shared/progress-display";
import { StatCard } from "@/components/shared/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFocusData } from "@/hooks/use-focus-data";
import {
  categoryDistribution,
  focusPatterns,
  summarise,
} from "@/lib/analytics";
import { healthFromRatio, healthFromScore } from "@/lib/health";
import { cn, formatHours, percent, round, toDateKey } from "@/lib/utils";

const RANGES = [
  { id: "7", label: "7 days", days: 7 },
  { id: "30", label: "30 days", days: 30 },
  { id: "56", label: "8 weeks", days: 56 },
] as const;

/**
 * Analytics.
 *
 * The range selector slices the same 8-week window `useFocusData` already
 * computed, then re-derives summary, patterns and distribution for that slice —
 * cheaper and more consistent than refetching per range.
 */
export default function AnalyticsPage() {
  const { state, index, now, days, goals } = useFocusData({ tickMs: 60_000 });
  const [rangeId, setRangeId] = useState<(typeof RANGES)[number]["id"]>("30");

  const rangeDays = RANGES.find((range) => range.id === rangeId)!.days;

  const view = useMemo(() => {
    const slice = days.slice(-rangeDays);
    const keys = new Set(slice.map((day) => day.date));
    const sessions = state.sessions.filter((session) =>
      keys.has(toDateKey(session.startedAt)),
    );
    return {
      slice,
      sessions,
      summary: summarise(slice),
      patterns: focusPatterns(state, index, sessions, slice, now),
      categories: categoryDistribution(state, index, sessions, now),
      previous: summarise(days.slice(-(rangeDays * 2), -rangeDays)),
    };
  }, [days, rangeDays, state, index, now]);

  const { summary, patterns, previous } = view;
  const adherence =
    summary.plannedHours > 0 ? summary.actualHours / summary.plannedHours : 0;
  const scoreHealth = healthFromScore(summary.focusScore);
  const adherenceHealth = healthFromRatio(adherence);

  const hoursDelta =
    previous.actualHours > 0
      ? ((summary.actualHours - previous.actualHours) / previous.actualHours) *
        100
      : 0;
  const scoreDelta =
    previous.focusScore > 0 ? summary.focusScore - previous.focusScore : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Where your attention actually went, how consistent it was, and what keeps interrupting it."
        actions={
          <Tabs
            value={rangeId}
            onValueChange={(value) =>
              setRangeId(value as (typeof RANGES)[number]["id"])
            }
          >
            <TabsList>
              {RANGES.map((range) => (
                <TabsTrigger key={range.id} value={range.id}>
                  {range.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Focused hours"
          value={formatHours(summary.actualHours)}
          hint={`${formatHours(summary.plannedHours)} planned`}
          icon={Clock}
          delta={hoursDelta}
        />
        <StatCard
          label="Focus score"
          value={summary.focusScore}
          hint={`Averaged across ${summary.activeDays} active days`}
          icon={Gauge}
          accentClassName={scoreHealth.text}
          delta={scoreDelta}
          deltaSuffix=" pts"
        />
        <StatCard
          label="Plan adherence"
          value={percent(adherence)}
          hint={
            summary.netDebtHours > 0
              ? `${formatHours(summary.netDebtHours)} of focus debt`
              : `${formatHours(Math.abs(summary.netDebtHours))} surplus`
          }
          icon={CalendarCheck}
          accentClassName={adherenceHealth.text}
        />
        <StatCard
          label="Interruptions"
          value={summary.interruptions}
          hint={`${round(summary.interruptions / Math.max(summary.actualHours, 1), 2)} per focused hour`}
          icon={Zap}
          delta={
            previous.interruptions > 0
              ? ((summary.interruptions - previous.interruptions) /
                  previous.interruptions) *
                100
              : 0
          }
          invertDelta
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Planned versus delivered</CardTitle>
              <CardDescription>
                Daily focus hours against the budget you set
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <FocusHoursChart days={view.slice} height={268} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Focus score trend</CardTitle>
              <CardDescription>
                Rest days excluded · dashed line is the 75 target
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <FocusScoreChart days={view.slice} height={252} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Category distribution</CardTitle>
              <CardDescription>
                Where the {formatHours(summary.actualHours)} went
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <CategoryDonut slices={view.categories} height={236} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Cumulative focus debt</CardTitle>
              <CardDescription>Above zero means you owe hours</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <FocusDebtChart days={view.slice} height={236} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Output by day of week</CardTitle>
              <CardDescription>
                Average focused hours per active day
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={patterns.weekday.map((entry) => ({
                label: entry.label.slice(0, 3),
                value: entry.hours,
              }))}
              seriesName="Average hours"
              unit="h"
              valueFormatter={(value) => `${value}h`}
              height={216}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Time of day</CardTitle>
              <CardDescription>
                Peak window is {patterns.bestWindowLabel}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={patterns.hourly
                .filter((entry) => entry.hour >= 5 && entry.hour <= 23)
                .map((entry) => ({
                  label: entry.label.replace(/(am|pm)/, ""),
                  value: entry.hours,
                }))}
              seriesName="Hours"
              unit="h"
              color="var(--chart-3)"
              valueFormatter={(value) => `${value}h`}
              height={216}
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Focus patterns</CardTitle>
              <CardDescription>
                What the data says about how you work
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3.5">
              <Pattern
                icon={Sunrise}
                label="Most productive window"
                value={patterns.bestWindowLabel}
                detail={`${patterns.bestWindowHours}h of focus landed there`}
              />
              <Pattern
                icon={Timer}
                label="Average session length"
                value={`${patterns.averageSessionMinutes} min`}
                detail={
                  patterns.averageSessionMinutes >= 45
                    ? "Long enough for genuinely deep work"
                    : "Consider consolidating into fewer, longer blocks"
                }
              />
              <Pattern
                icon={TrendingUp}
                label="Highest performing category"
                value={patterns.bestCategoryName}
                detail={
                  patterns.bestCategoryRating > 0
                    ? `${patterns.bestCategoryRating} average productivity rating`
                    : "Needs at least three rated sessions"
                }
              />
              <Pattern
                icon={Zap}
                label="Most common distraction"
                value={patterns.topDistractionLabel}
                detail={
                  patterns.topDistractionCount > 0
                    ? `${patterns.topDistractionCount} interruptions in this period`
                    : "Nothing logged — impressive"
                }
              />
              <Pattern
                icon={Activity}
                label="Most productive day"
                value={patterns.bestWeekdayLabel}
                detail={`${patterns.bestWeekdayHours}h on an average ${patterns.bestWeekdayLabel}`}
              />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>What breaks your focus</CardTitle>
              <CardDescription>
                Unplanned pauses, ranked by frequency
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {patterns.distractions.length === 0 ? (
              <p className="py-10 text-center text-xs text-muted-foreground">
                No unplanned pauses logged in this period.
              </p>
            ) : (
              <ul className="space-y-3">
                {patterns.distractions.slice(0, 6).map((entry) => {
                  const share =
                    entry.count / (patterns.distractions[0]?.count || 1);
                  return (
                    <li key={entry.reasonId} className="space-y-1.5">
                      <div className="flex items-baseline justify-between text-xs">
                        <span>{entry.label}</span>
                        <span className="tabular text-muted-foreground">
                          {entry.count}× · {entry.minutes}m
                        </span>
                      </div>
                      <ProgressDisplay
                        value={share}
                        className="h-1.5"
                        barClassName="bg-health-behind"
                        color="var(--health-behind)"
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Goal progress</CardTitle>
              <CardDescription>Hours logged against target</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {goals
                .filter((goal) => goal.status !== "completed")
                .slice(0, 7)
                .map((goal) => {
                  const health = healthFromRatio(goal.progress);
                  return (
                    <li key={goal.goalId} className="space-y-1.5">
                      <div className="flex items-baseline justify-between gap-2 text-xs">
                        <span className="flex min-w-0 items-center gap-1.5">
                          <CategoryDot color={goal.color} />
                          <span className="truncate">{goal.title}</span>
                        </span>
                        <span
                          className={cn("tabular shrink-0 font-medium", health.text)}
                        >
                          {percent(goal.progress)}
                        </span>
                      </div>
                      <ProgressDisplay
                        value={goal.progress}
                        className="h-1.5"
                        color={goal.color}
                      />
                    </li>
                  );
                })}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Pattern({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Sunrise;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-secondary/70 text-muted-foreground">
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] text-muted-foreground">{label}</dt>
        <dd className="truncate text-sm font-medium">{value}</dd>
        <dd className="text-[11px] text-muted-foreground">{detail}</dd>
      </div>
    </div>
  );
}
