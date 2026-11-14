"use client";

import { useMemo } from "react";

import { TodayLanding } from "@/components/dashboard/today-briefing";
import { buildCheckIns, TodayPulse } from "@/components/dashboard/today-board";
import { useFocusData } from "@/hooks/use-focus-data";
import { lineageFor, planForDate } from "@/lib/selectors";
import { formatHours } from "@/lib/utils";
import { useCurrentUser } from "@/services/auth";
import { useToday } from "@/services/today";

/**
 * Today is the landing surface: the week's kept days, and how the day is going.
 */
export default function DashboardPage() {
  const data = useFocusData({ tickMs: 15_000 });
  const { data: user } = useCurrentUser();
  const { data: todayResponse } = useToday();
  const { state, index, now, todayKey, today, last7, streaks } = data;

  const activeSession =
    state.sessions.find(
      (session) =>
        session.id === state.activeSessionId &&
        (session.status === "running" || session.status === "paused"),
    ) ?? null;
  const activeLineage = activeSession
    ? lineageFor(index, activeSession.focusItemId)
    : undefined;

  const todayPlan = planForDate(state, todayKey);
  const allocations = todayPlan?.allocations ?? [];
  const localPlannedHours = allocations.reduce(
    (total, allocation) => total + allocation.plannedHours,
    0,
  );
  const plannedHours = todayResponse
    ? todayResponse.data.summary.plannedMinutes / 60
    : localPlannedHours;
  const liveName = activeSession ? activeLineage?.item.name ?? "this session" : null;

  const rows = useMemo(
    () =>
      buildCheckIns({
        allocations: todayPlan?.allocations ?? [],
        focusItems: state.focusItems,
        goals: state.goals,
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
        now,
        todayKey,
        index,
      }),
    [index, now, state.activeSessionId, state.focusItems, state.goals, state.sessions, todayKey, todayPlan],
  );

  const open = rows.filter((row) => row.status !== "Met" && !row.live).length;
  const read = liveName
    ? `You are ${activeSession?.status === "paused" ? "paused on" : "in"} ${liveName}. Leave it only when the block is finished.`
    : plannedHours > 0
      ? today.actualHours + 0.05 >= plannedHours
        ? "Today's planned time is covered."
        : `${open} still open. ${formatHours(today.actualHours)} of ${formatHours(plannedHours)} is protected.`
      : "Nothing is planned for today. The work still in motion is what the day is for.";

  const activeCount = state.sessions.filter(
    (session) => session.status === "running" || session.status === "paused",
  ).length;

  return (
    <div className="space-y-4">
      <TodayLanding
        name={
          user?.profile?.displayName ??
          user?.email?.split("@")[0] ??
          state.settings.displayName
        }
        now={now}
        todayKey={todayKey}
        days={last7}
        qualifyingDays={streaks.qualifyingDays}
        focusedHours={today.actualHours}
        plannedHours={plannedHours}
        read={read}
      />
      <TodayPulse
        rows={rows}
        sessions={state.sessions}
        activeCount={activeCount}
        now={now}
        todayKey={todayKey}
      />
    </div>
  );
}
