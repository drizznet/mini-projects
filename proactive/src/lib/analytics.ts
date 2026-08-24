import { SCORE_WEIGHTS, WEEKDAY_LABELS } from "./constants";
import {
  buildIndex,
  lineageFor,
  planForDate,
  sessionsForDate,
  type EntityIndex,
} from "./selectors";
import type {
  DayMetrics,
  FocusSession,
  FocusState,
  Priority,
} from "./types";
import {
  addDays,
  clamp,
  dateKeyRange,
  fromDateKey,
  round,
  sum,
  toDateKey,
} from "./utils";

/**
 * Analytics engine.
 *
 * Everything the dashboard shows is derived here from raw sessions and plans —
 * nothing aggregated is persisted. Functions are pure so they can be memoised
 * per render and later moved behind a Supabase view without UI changes.
 */

/** Active (non-paused) time in a session, including an in-flight pause. */
export function sessionActiveMs(
  session: FocusSession,
  now: number = Date.now(),
): number {
  const start = new Date(session.startedAt).getTime();
  const end = session.endedAt ? new Date(session.endedAt).getTime() : now;
  const openPauseMs = session.pausedAt
    ? Math.max(0, end - new Date(session.pausedAt).getTime())
    : 0;
  return Math.max(0, end - start - session.pausedMs - openPauseMs);
}

export function sessionActiveHours(
  session: FocusSession,
  now?: number,
): number {
  return sessionActiveMs(session, now) / 3_600_000;
}

export function isUnplannedPause(
  state: FocusState,
  reasonId: string,
): boolean {
  const reason = state.settings.pauseReasons.find(
    (option) => option.id === reasonId,
  );
  return reason ? !reason.planned : true;
}

export function countInterruptions(
  state: FocusState,
  session: FocusSession,
): number {
  return session.pauses.filter((pause) =>
    isUnplannedPause(state, pause.reasonId),
  ).length;
}

/**
 * Focus score (0–100) for a single day.
 *
 * Four weighted components (see `SCORE_WEIGHTS`):
 * - adherence: actual vs planned hours, capped at 1 so overwork is not a cheat
 * - completion: finished vs abandoned sessions
 * - consistency: how many planned items were actually touched
 * - distraction: inverse of unplanned interruptions per focused hour
 */
export function computeDayMetrics(
  state: FocusState,
  index: EntityIndex,
  dateKey: string,
  now: number = Date.now(),
): DayMetrics {
  const plan = planForDate(state, dateKey);
  const daySessions = sessionsForDate(index, dateKey);

  const plannedHours = plan
    ? round(sum(plan.allocations.map((entry) => entry.plannedHours)), 2)
    : 0;
  const actualHours = round(
    sum(daySessions.map((session) => sessionActiveHours(session, now))),
    2,
  );

  const closed = daySessions.filter((session) => session.endedAt !== null);
  const completedSessions = daySessions.filter(
    (session) => session.status === "completed",
  ).length;

  const interruptions = sum(
    daySessions.map((session) => countInterruptions(state, session)),
  );

  const longestSessionMinutes = daySessions.length
    ? Math.round(
        Math.max(...daySessions.map((session) => sessionActiveMs(session, now))) /
          60_000,
      )
    : 0;

  const touchedItems = new Set(
    daySessions.map((session) => session.focusItemId),
  );
  const plannedItems = plan?.allocations.length ?? 0;

  const adherence = plannedHours > 0 ? clamp(actualHours / plannedHours) : 0;
  const completion = closed.length > 0 ? completedSessions / closed.length : 0;
  const consistency =
    plannedItems > 0
      ? clamp(
          plan!.allocations.filter((entry) =>
            touchedItems.has(entry.focusItemId),
          ).length / plannedItems,
        )
      : 0;
  const distractionRate = actualHours > 0 ? interruptions / actualHours : 0;
  const distraction = 1 - clamp(distractionRate / 3);

  const hasActivity = daySessions.length > 0;
  const focusScore = hasActivity
    ? Math.round(
        100 *
          (adherence * SCORE_WEIGHTS.adherence +
            completion * SCORE_WEIGHTS.completion +
            consistency * SCORE_WEIGHTS.consistency +
            distraction * SCORE_WEIGHTS.distraction),
      )
    : 0;

  return {
    date: dateKey,
    plannedHours,
    actualHours,
    completionRate: plannedHours > 0 ? adherence : 0,
    focusScore,
    sessionCount: daySessions.length,
    completedSessions,
    longestSessionMinutes,
    interruptions,
    debtHours: round(Math.max(0, plannedHours - actualHours), 2),
    components: {
      adherence,
      completion,
      consistency,
      focusQuality: distraction,
    },
  };
}

/** Human-readable breakdown of a day's score, for the dashboard tooltip. */
export const SCORE_COMPONENT_LABELS: {
  key: keyof DayMetrics["components"];
  label: string;
  weight: number;
  hint: string;
}[] = [
  {
    key: "adherence",
    label: "Time adherence",
    weight: SCORE_WEIGHTS.adherence,
    hint: "Focused hours delivered against the hours you planned.",
  },
  {
    key: "completion",
    label: "Session completion",
    weight: SCORE_WEIGHTS.completion,
    hint: "Sessions finished rather than abandoned part-way.",
  },
  {
    key: "consistency",
    label: "Consistency",
    weight: SCORE_WEIGHTS.consistency,
    hint: "How many of the items you planned were actually touched.",
  },
  {
    key: "focusQuality",
    label: "Distraction control",
    weight: SCORE_WEIGHTS.distraction,
    hint: "Inverse of unplanned interruptions per focused hour.",
  },
];

/** Focused hours per focus item on a given day — drives plan progress rows. */
export function itemHoursForDate(
  state: FocusState,
  dateKey: string,
  now: number = Date.now(),
): Map<string, number> {
  const hours = new Map<string, number>();
  for (const session of state.sessions) {
    if (toDateKey(session.startedAt) !== dateKey) continue;
    hours.set(
      session.focusItemId,
      (hours.get(session.focusItemId) ?? 0) + sessionActiveHours(session, now),
    );
  }
  return hours;
}

export function computeRange(
  state: FocusState,
  index: EntityIndex,
  from: Date,
  to: Date,
  now: number = Date.now(),
): DayMetrics[] {
  return dateKeyRange(from, to).map((key) =>
    computeDayMetrics(state, index, key, now),
  );
}

export interface RangeSummary {
  plannedHours: number;
  actualHours: number;
  /** Positive = behind, negative = surplus. */
  netDebtHours: number;
  focusScore: number;
  sessionCount: number;
  completedSessions: number;
  interruptions: number;
  averageSessionMinutes: number;
  activeDays: number;
}

export function summarise(days: DayMetrics[]): RangeSummary {
  const active = days.filter((day) => day.sessionCount > 0);
  const plannedHours = round(sum(days.map((day) => day.plannedHours)), 2);
  const actualHours = round(sum(days.map((day) => day.actualHours)), 2);
  const sessionCount = sum(days.map((day) => day.sessionCount));

  return {
    plannedHours,
    actualHours,
    netDebtHours: round(plannedHours - actualHours, 2),
    focusScore: active.length
      ? Math.round(sum(active.map((day) => day.focusScore)) / active.length)
      : 0,
    sessionCount,
    completedSessions: sum(days.map((day) => day.completedSessions)),
    interruptions: sum(days.map((day) => day.interruptions)),
    averageSessionMinutes: sessionCount
      ? Math.round((actualHours * 60) / sessionCount)
      : 0,
    activeDays: active.length,
  };
}

export interface CategorySlice {
  categoryId: string;
  name: string;
  color: string;
  hours: number;
  share: number;
  sessionCount: number;
  averageRating: number;
}

export function categoryDistribution(
  state: FocusState,
  index: EntityIndex,
  sessions: FocusSession[],
  now: number = Date.now(),
): CategorySlice[] {
  const buckets = new Map<
    string,
    { hours: number; sessions: number; ratingTotal: number; rated: number }
  >();

  for (const session of sessions) {
    const lineage = lineageFor(index, session.focusItemId);
    const categoryId = lineage?.category?.id ?? "uncategorised";
    const bucket = buckets.get(categoryId) ?? {
      hours: 0,
      sessions: 0,
      ratingTotal: 0,
      rated: 0,
    };
    bucket.hours += sessionActiveHours(session, now);
    bucket.sessions += 1;
    if (session.productivityRating) {
      bucket.ratingTotal += session.productivityRating;
      bucket.rated += 1;
    }
    buckets.set(categoryId, bucket);
  }

  const total = sum([...buckets.values()].map((bucket) => bucket.hours));

  return [...buckets.entries()]
    .map(([categoryId, bucket]) => {
      const category = index.categoryById.get(categoryId);
      return {
        categoryId,
        name: category?.name ?? "Uncategorised",
        color: category ? `var(--${category.color})` : "var(--muted-foreground)",
        hours: round(bucket.hours, 2),
        share: total > 0 ? bucket.hours / total : 0,
        sessionCount: bucket.sessions,
        averageRating: bucket.rated
          ? round(bucket.ratingTotal / bucket.rated, 1)
          : 0,
      };
    })
    .sort((a, b) => b.hours - a.hours);
}

export interface GoalProgress {
  goalId: string;
  title: string;
  categoryName: string;
  color: string;
  priority: Priority;
  status: string;
  targetHours: number;
  loggedHours: number;
  progress: number;
  lastSessionAt: string | null;
  itemCount: number;
}

export function goalProgress(
  state: FocusState,
  index: EntityIndex,
  now: number = Date.now(),
): GoalProgress[] {
  const logged = new Map<string, { hours: number; last: number }>();

  for (const session of state.sessions) {
    const lineage = lineageFor(index, session.focusItemId);
    if (!lineage?.goal) continue;
    const bucket = logged.get(lineage.goal.id) ?? { hours: 0, last: 0 };
    bucket.hours += sessionActiveHours(session, now);
    bucket.last = Math.max(bucket.last, new Date(session.startedAt).getTime());
    logged.set(lineage.goal.id, bucket);
  }

  return state.goals
    .map((goal) => {
      const bucket = logged.get(goal.id);
      const category = index.categoryById.get(goal.categoryId);
      const loggedHours = round(bucket?.hours ?? 0, 1);
      return {
        goalId: goal.id,
        title: goal.title,
        categoryName: category?.name ?? "Uncategorised",
        color: category ? `var(--${category.color})` : "var(--chart-1)",
        priority: goal.priority,
        status: goal.status,
        targetHours: goal.targetHours,
        loggedHours,
        progress:
          goal.status === "completed"
            ? 1
            : clamp(goal.targetHours > 0 ? loggedHours / goal.targetHours : 0),
        lastSessionAt: bucket?.last ? new Date(bucket.last).toISOString() : null,
        itemCount: state.focusItems.filter((item) => item.goalId === goal.id)
          .length,
      };
    })
    .sort((a, b) => b.progress - a.progress);
}

export interface FocusPatterns {
  bestWindowLabel: string;
  bestWindowHours: number;
  averageSessionMinutes: number;
  bestCategoryName: string;
  bestCategoryRating: number;
  topDistractionLabel: string;
  topDistractionCount: number;
  bestWeekdayLabel: string;
  bestWeekdayHours: number;
  hourly: { hour: number; label: string; hours: number }[];
  weekday: { weekday: number; label: string; hours: number; score: number }[];
  distractions: { reasonId: string; label: string; count: number; minutes: number }[];
}

export function focusPatterns(
  state: FocusState,
  index: EntityIndex,
  sessions: FocusSession[],
  days: DayMetrics[],
  now: number = Date.now(),
): FocusPatterns {
  const hourly = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    label: formatHourLabel(hour),
    hours: 0,
  }));

  for (const session of sessions) {
    const hour = new Date(session.startedAt).getHours();
    hourly[hour].hours += sessionActiveHours(session, now);
  }

  // Best 2-hour window smooths out the noise of a single lucky hour.
  let bestWindowStart = 0;
  let bestWindowHours = 0;
  for (let hour = 0; hour < 23; hour += 1) {
    const windowHours = hourly[hour].hours + hourly[hour + 1].hours;
    if (windowHours > bestWindowHours) {
      bestWindowHours = windowHours;
      bestWindowStart = hour;
    }
  }

  const weekdayBuckets = WEEKDAY_LABELS.map((label, weekday) => ({
    weekday,
    label,
    hours: 0,
    score: 0,
    dayCount: 0,
  }));

  for (const day of days) {
    const weekday = fromDateKey(day.date).getDay();
    const bucket = weekdayBuckets[weekday];
    bucket.hours += day.actualHours;
    if (day.sessionCount > 0) {
      bucket.score += day.focusScore;
      bucket.dayCount += 1;
    }
  }

  const weekday = weekdayBuckets.map((bucket) => ({
    weekday: bucket.weekday,
    label: bucket.label,
    hours: round(bucket.dayCount ? bucket.hours / bucket.dayCount : 0, 2),
    score: bucket.dayCount ? Math.round(bucket.score / bucket.dayCount) : 0,
  }));

  const bestWeekday = [...weekday].sort((a, b) => b.hours - a.hours)[0];

  const distractionBuckets = new Map<string, { count: number; minutes: number }>();
  for (const session of sessions) {
    for (const pause of session.pauses) {
      if (!isUnplannedPause(state, pause.reasonId)) continue;
      const bucket = distractionBuckets.get(pause.reasonId) ?? {
        count: 0,
        minutes: 0,
      };
      bucket.count += 1;
      if (pause.endedAt) {
        bucket.minutes +=
          (new Date(pause.endedAt).getTime() -
            new Date(pause.startedAt).getTime()) /
          60_000;
      }
      distractionBuckets.set(pause.reasonId, bucket);
    }
  }

  const distractions = [...distractionBuckets.entries()]
    .map(([reasonId, bucket]) => ({
      reasonId,
      label:
        state.settings.pauseReasons.find((option) => option.id === reasonId)
          ?.label ?? "Other",
      count: bucket.count,
      minutes: Math.round(bucket.minutes),
    }))
    .sort((a, b) => b.count - a.count);

  const categories = categoryDistribution(state, index, sessions, now).filter(
    (slice) => slice.sessionCount >= 3,
  );
  const bestCategory = [...categories].sort(
    (a, b) => b.averageRating - a.averageRating,
  )[0];

  const totalHours = sum(sessions.map((s) => sessionActiveHours(s, now)));

  return {
    bestWindowLabel: `${formatHourLabel(bestWindowStart)} – ${formatHourLabel(
      bestWindowStart + 2,
    )}`,
    bestWindowHours: round(bestWindowHours, 1),
    averageSessionMinutes: sessions.length
      ? Math.round((totalHours * 60) / sessions.length)
      : 0,
    bestCategoryName: bestCategory?.name ?? "Not enough data",
    bestCategoryRating: bestCategory?.averageRating ?? 0,
    topDistractionLabel: distractions[0]?.label ?? "No distractions logged",
    topDistractionCount: distractions[0]?.count ?? 0,
    bestWeekdayLabel: bestWeekday?.label ?? "—",
    bestWeekdayHours: bestWeekday?.hours ?? 0,
    hourly: hourly.map((entry) => ({ ...entry, hours: round(entry.hours, 2) })),
    weekday,
    distractions,
  };
}

function formatHourLabel(hour: number): string {
  const normalised = ((hour % 24) + 24) % 24;
  const suffix = normalised < 12 ? "am" : "pm";
  const display = normalised % 12 === 0 ? 12 : normalised % 12;
  return `${display}${suffix}`;
}

export interface StreakSummary {
  currentStreak: number;
  longestStreak: number;
  weeklyConsistency: number;
  /** Day keys that met the daily bar, newest last. */
  qualifyingDays: string[];
}

/** A day counts toward the streak at ≥60% adherence, or ≥1h when unplanned. */
function meetsDailyBar(day: DayMetrics): boolean {
  if (day.plannedHours > 0) return day.actualHours >= day.plannedHours * 0.6;
  return day.actualHours >= 1;
}

export function computeStreaks(
  days: DayMetrics[],
  workdays: number[],
  todayKey: string,
): StreakSummary {
  const qualifying = days.filter(meetsDailyBar).map((day) => day.date);
  const qualifyingSet = new Set(qualifying);

  let longest = 0;
  let running = 0;
  for (const day of days) {
    if (qualifyingSet.has(day.date)) {
      running += 1;
      longest = Math.max(longest, running);
    } else {
      running = 0;
    }
  }

  // Today only breaks the streak once it is over, so start from yesterday
  // unless today already qualifies.
  let cursor = fromDateKey(todayKey);
  if (!qualifyingSet.has(todayKey)) cursor = addDays(cursor, -1);
  let current = 0;
  while (qualifyingSet.has(toDateKey(cursor))) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  const weekStart = startOfWeek(fromDateKey(todayKey));
  const weekKeys = dateKeyRange(weekStart, fromDateKey(todayKey));
  const expected = weekKeys.filter((key) =>
    workdays.includes(fromDateKey(key).getDay()),
  );
  const achieved = expected.filter((key) => qualifyingSet.has(key));

  return {
    currentStreak: current,
    longestStreak: longest,
    weeklyConsistency: expected.length ? achieved.length / expected.length : 0,
    qualifyingDays: qualifying,
  };
}

export function startOfWeek(date: Date): Date {
  const day = date.getDay();
  // Weeks start Monday; Sunday belongs to the week that just ended.
  const delta = day === 0 ? -6 : 1 - day;
  return addDays(date, delta);
}

export interface Insight {
  id: string;
  tone: "positive" | "neutral" | "warning";
  title: string;
  detail: string;
}

/** Narrative takeaways for the dashboard's insight strip. */
export function buildInsights(
  summary: RangeSummary,
  patterns: FocusPatterns,
  streaks: StreakSummary,
  today: DayMetrics,
): Insight[] {
  const insights: Insight[] = [];

  if (patterns.bestWindowHours > 0) {
    insights.push({
      id: "insight-window",
      tone: "positive",
      title: `Your peak window is ${patterns.bestWindowLabel}`,
      detail: `${patterns.bestWindowHours}h of focused time landed in that window. Protect it before scheduling anything reactive.`,
    });
  }

  if (patterns.topDistractionCount > 0) {
    insights.push({
      id: "insight-distraction",
      tone: "warning",
      title: `${patterns.topDistractionLabel} is your top distraction`,
      detail: `It interrupted ${patterns.topDistractionCount} sessions. Removing half of those would return roughly ${Math.round(
        (patterns.distractions[0]?.minutes ?? 0) / 2,
      )} minutes.`,
    });
  }

  if (summary.netDebtHours > 2) {
    insights.push({
      id: "insight-debt",
      tone: "warning",
      title: `You are carrying ${summary.netDebtHours}h of focus debt`,
      detail:
        "Plan slightly less than you think you can do — adherence beats ambition for the score.",
    });
  } else if (summary.netDebtHours <= 0) {
    insights.push({
      id: "insight-surplus",
      tone: "positive",
      title: "You are ahead of your plan",
      detail: `${Math.abs(summary.netDebtHours)}h of surplus focus this period. Consider raising your daily budget.`,
    });
  }

  if (streaks.currentStreak >= 3) {
    insights.push({
      id: "insight-streak",
      tone: "positive",
      title: `${streaks.currentStreak}-day focus streak`,
      detail: `Longest streak so far is ${streaks.longestStreak} days. Consistency is the fastest lever on your score.`,
    });
  }

  if (today.plannedHours > 0 && today.actualHours < today.plannedHours * 0.5) {
    insights.push({
      id: "insight-today",
      tone: "neutral",
      title: "Today is still open",
      detail: `${round(today.plannedHours - today.actualHours, 1)}h of today's budget is unspent. One session closes most of the gap.`,
    });
  }

  if (summary.averageSessionMinutes > 0) {
    insights.push({
      id: "insight-length",
      tone: "neutral",
      title: `Average session runs ${summary.averageSessionMinutes} minutes`,
      detail:
        summary.averageSessionMinutes < 40
          ? "Short blocks fragment deep work. Try one 90-minute block per day."
          : "That is a healthy block length for cognitively demanding work.",
    });
  }

  return insights;
}
