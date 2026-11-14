import type { DayMetrics } from "@/lib/types";
import { cn, formatHours } from "@/lib/utils";

function greetingFor(hour: number) {
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Winding down";
}

function dayLetter(dateKey: string) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "narrow",
  });
}

function dayName(dateKey: string) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
  });
}

/**
 * Landing band: who the day is for, whether the plan is being kept, and the
 * last seven days as fires. A day is lit only when it met its planned work.
 */
export function TodayLanding({
  name,
  now,
  todayKey,
  days,
  qualifyingDays,
  focusedHours,
  plannedHours,
  read,
}: {
  name: string;
  now: number;
  todayKey: string;
  days: DayMetrics[];
  qualifyingDays: string[];
  focusedHours: number;
  plannedHours: number;
  read: string;
}) {
  const date = new Date(`${todayKey}T12:00:00`);
  const qualifying = new Set(qualifyingDays);
  const lit = days.filter((day) => qualifying.has(day.date)).length;
  const ratio = plannedHours > 0 ? Math.min(1, focusedHours / plannedHours) : 0;

  return (
    <section className="rounded-2xl border border-border/70 bg-card px-6 py-5 shadow-xs sm:px-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 max-w-xl">
          <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            {date.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-[1.75rem]">
            {greetingFor(new Date(now).getHours())}, {name}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{read}</p>
        </div>

        <div className="shrink-0">
          <ol className="grid grid-cols-7 gap-1" aria-label="Last seven days">
            {days.map((day) => {
              const on = qualifying.has(day.date);
              const isToday = day.date === todayKey;
              return (
                <li
                  key={day.date}
                  aria-label={`${dayName(day.date)}${isToday ? ", today" : ""}, ${on ? "plan met" : "plan missed"}`}
                  className={cn(
                    "flex w-9 flex-col items-center gap-1 rounded-xl py-1.5",
                    isToday && "bg-secondary",
                  )}
                >
                  <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    {dayLetter(day.date)}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "text-lg leading-none",
                      on ? "" : "opacity-25 grayscale",
                    )}
                  >
                    🔥
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="mt-2 text-right text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{lit} of 7</span> days met the plan
          </p>
        </div>
      </div>

      {plannedHours > 0 ? (
        <div className="mt-5 border-t border-border/60 pt-4">
          <div className="flex items-baseline justify-between gap-3 text-xs">
            <span className="text-muted-foreground">Today&apos;s plan</span>
            <span className="tabular font-medium">
              {formatHours(focusedHours)} of {formatHours(plannedHours)}
            </span>
          </div>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(ratio * 100)}
            aria-label="Today's plan protected"
          >
            <div
              className="h-full rounded-full bg-foreground"
              style={{ width: `${Math.round(ratio * 100)}%` }}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
