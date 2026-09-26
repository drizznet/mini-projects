"use client";

import { useEffect, useState } from "react";

import { DashboardGreeting } from "@/components/dashboard/greeting";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { TodaysWorkItemsCard } from "@/components/dashboard/todays-work-items-card";
import { useFocusData } from "@/hooks/use-focus-data";
import { countInterruptions, sessionActiveMs } from "@/lib/analytics";
import { lineageFor, planForDate } from "@/lib/selectors";
import { useCurrentUser } from "@/services/auth";

/**
 * One-screen dashboard: today's numbers, the plan, and what to do next.
 * Charts, debt, streaks and history live on Analytics / Sessions / Goals.
 */
export default function DashboardPage() {
  const data = useFocusData({ tickMs: 15_000 });
  const { data: user } = useCurrentUser();
  const { state, index, now, todayKey, today, streaks, recommendations } = data;

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
  const dailyCommitmentHours = (todayPlan?.allocations ?? []).reduce(
    (total, allocation) => total + allocation.plannedHours,
    0,
  );
  const remaining = Math.max(0, dailyCommitmentHours - today.actualHours);
  const [highlightedFocusItemId, setHighlightedFocusItemId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const focusItemId = params.get("focus");
    setHighlightedFocusItemId(focusItemId);

    if (!focusItemId) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(`today-work-item-${focusItemId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="flex min-h-0 flex-col gap-4 lg:h-[calc(100svh-7.5rem)]">
      <DashboardGreeting
        name={
          user?.profile?.displayName ??
          user?.email?.split("@")[0] ??
          state.settings.displayName
        }
        todayKey={todayKey}
        focusScore={today.focusScore}
        intention=""
        now={now}
        focusedHours={today.actualHours}
        remainingHours={remaining}
        streak={streaks.currentStreak}
        interruptions={today.interruptions}
        activeWork={
          activeSession
            ? {
                focusItemId: activeSession.focusItemId,
                itemName: activeLineage?.item.name ?? "Focus session",
                goalName: activeLineage?.goal?.title ?? "No goal",
                elapsedMs: sessionActiveMs(activeSession, now),
                plannedMinutes: activeSession.plannedMinutes,
                sessionId: activeSession.id,
                interruptions: countInterruptions(state, activeSession),
                paused: activeSession.status === "paused",
              }
            : null
        }
      />

      <section className="grid min-h-0 flex-1 gap-4 lg:grid-cols-5">
        <div className="min-h-0 lg:col-span-3">
          <TodaysWorkItemsCard
            allocations={todayPlan?.allocations ?? []}
            categories={state.categories}
            focusItems={state.focusItems}
            sessions={state.sessions}
            activeSessionId={state.activeSessionId}
            now={now}
            dateKey={todayKey}
            highlightedFocusItemId={highlightedFocusItemId}
          />
        </div>
        <div className="min-h-0 lg:col-span-2">
          <RecommendationCard recommendations={recommendations} compact />
        </div>
      </section>
    </div>
  );
}
