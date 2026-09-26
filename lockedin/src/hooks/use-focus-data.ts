"use client";

import { useMemo } from "react";

import {
  buildInsights,
  categoryDistribution,
  computeDayMetrics,
  computeRange,
  computeStreaks,
  focusPatterns,
  goalProgress,
  summarise,
  type CategorySlice,
  type FocusPatterns,
  type GoalProgress,
  type Insight,
  type RangeSummary,
  type StreakSummary,
} from "@/lib/analytics";
import { recommendNext, type Recommendation } from "@/lib/recommend";
import { buildIndex, type EntityIndex } from "@/lib/selectors";
import { useFocusStore } from "@/lib/store/focus-store";
import type { DayMetrics, FocusSession, FocusState } from "@/lib/types";
import { addDays, toDateKey } from "@/lib/utils";

import { useNow } from "./use-now";

export interface FocusData {
  state: FocusState;
  index: EntityIndex;
  now: number;
  todayKey: string;
  today: DayMetrics;
  /** Metrics for the requested window, oldest first, ending today. */
  days: DayMetrics[];
  last7: DayMetrics[];
  last30: DayMetrics[];
  rangeSessions: FocusSession[];
  summary: RangeSummary;
  summary7: RangeSummary;
  summary30: RangeSummary;
  goals: GoalProgress[];
  categories: CategorySlice[];
  patterns: FocusPatterns;
  streaks: StreakSummary;
  insights: Insight[];
  recommendations: Recommendation[];
  activeSession: FocusSession | null;
}

/**
 * Single entry point for every derived number in the app.
 *
 * Recomputes only when the store changes or the coarse clock ticks, so pages can
 * call it freely. `rangeDays` controls the analytics window (default 8 weeks).
 *
 * @example
 * const { today, streaks, recommendations } = useFocusData();
 */
export function useFocusData(options?: {
  rangeDays?: number;
  tickMs?: number;
}): FocusData {
  const rangeDays = options?.rangeDays ?? 56;
  const { state } = useFocusStore();
  const now = useNow(options?.tickMs ?? 30_000);

  return useMemo<FocusData>(() => {
    const index = buildIndex(state);
    const today = new Date(now);
    const todayKey = toDateKey(today);

    const days = computeRange(
      state,
      index,
      addDays(today, -(rangeDays - 1)),
      today,
      now,
    );
    const last7 = days.slice(-7);
    const last30 = days.slice(-30);
    const todayMetrics =
      days[days.length - 1] ?? computeDayMetrics(state, index, todayKey, now);

    const rangeKeys = new Set(days.map((day) => day.date));
    const rangeSessions = state.sessions.filter((session) =>
      rangeKeys.has(toDateKey(session.startedAt)),
    );

    const goals = goalProgress(state, index, now);
    const patterns = focusPatterns(state, index, rangeSessions, days, now);
    const streaks = computeStreaks(days, state.settings.workdays, todayKey);
    const summary = summarise(days);
    const summary7 = summarise(last7);
    const summary30 = summarise(last30);

    return {
      state,
      index,
      now,
      todayKey,
      today: todayMetrics,
      days,
      last7,
      last30,
      rangeSessions,
      summary,
      summary7,
      summary30,
      goals,
      categories: categoryDistribution(state, index, rangeSessions, now),
      patterns,
      streaks,
      insights: buildInsights(summary30, patterns, streaks, todayMetrics),
      recommendations: recommendNext({
        state,
        index,
        goals,
        todayKey,
        now,
      }),
      activeSession:
        state.sessions.find(
          (session) => session.id === state.activeSessionId,
        ) ?? null,
    };
  }, [state, now, rangeDays]);
}
