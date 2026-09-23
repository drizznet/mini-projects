"use client";

import { useMemo } from "react";

import { DashboardGreeting } from "@/components/dashboard/greeting";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { TodaysPlanCard } from "@/components/dashboard/todays-plan-card";
import { useFocusData } from "@/hooks/use-focus-data";
import { itemHoursForDate } from "@/lib/analytics";
import { planForDate } from "@/lib/selectors";
import { useCurrentUser } from "@/services/auth";

/**
 * One-screen dashboard: today's numbers, the plan, and what to do next.
 * Charts, debt, streaks and history live on Analytics / Sessions / Goals.
 */
export default function DashboardPage() {
  const data = useFocusData({ tickMs: 15_000 });
  const { data: user } = useCurrentUser();
  const { state, index, now, todayKey, today, streaks, recommendations } = data;

  const plan = planForDate(state, todayKey);
  const actualByItem = useMemo(
    () => itemHoursForDate(state, todayKey, now),
    [state, todayKey, now],
  );

  const remaining = Math.max(0, today.plannedHours - today.actualHours);

  return (
    <div className="flex min-h-0 flex-col gap-4 lg:h-[calc(100svh-7.5rem)]">
      <DashboardGreeting
        name={user?.name ?? user?.email?.split("@")[0] ?? state.settings.displayName}
        todayKey={todayKey}
        focusScore={today.focusScore}
        intention={plan?.intention ?? ""}
        now={now}
        focusedHours={today.actualHours}
        remainingHours={remaining}
        streak={streaks.currentStreak}
        interruptions={today.interruptions}
      />

      <section className="grid min-h-0 flex-1 gap-4 lg:grid-cols-5">
        <div className="min-h-0 lg:col-span-3">
          <TodaysPlanCard
            plan={plan}
            index={index}
            actualByItem={actualByItem}
          />
        </div>
        <div className="min-h-0 lg:col-span-2">
          <RecommendationCard recommendations={recommendations} compact />
        </div>
      </section>
    </div>
  );
}
