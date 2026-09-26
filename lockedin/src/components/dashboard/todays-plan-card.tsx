"use client";

import { Target } from "lucide-react";

import { DailySessionCard } from "@/components/sessions/daily-session-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sessionActiveMs } from "@/lib/analytics";
import type { Category, DailySession, FocusItem, FocusSession, Goal } from "@/lib/types";

export function TodaysPlanCard({
  dailySessions,
  goals,
  categories,
  focusItems,
  sessions,
  activeSessionId,
  now,
  highlightedGoalId,
  highlightedFocusItemId,
}: {
  dailySessions: DailySession[];
  goals: Goal[];
  categories: Category[];
  focusItems: FocusItem[];
  sessions: FocusSession[];
  activeSessionId: string | null;
  now: number;
  highlightedGoalId?: string | null;
  highlightedFocusItemId?: string | null;
}) {
  const visibleDailySessions = dailySessions.filter((dailySession) => {
    const isActive = sessions.some(
      (entry) =>
        entry.dailySessionId === dailySession.id &&
        entry.id === activeSessionId &&
        (entry.status === "running" || entry.status === "paused"),
    );
    return !isActive;
  });

  return (
    <Card className="h-full min-h-0 overflow-hidden">
      <CardHeader>
        <CardTitle>Today</CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 space-y-3 overflow-y-auto">
        {dailySessions.length === 0 ? (
          <EmptyState
            icon={Target}
            title="Nothing scheduled for today"
            description="Create a goal and its focus work will appear here automatically."
          />
        ) : visibleDailySessions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-primary/25 bg-primary/5 px-4 py-8 text-center">
            <p className="text-sm font-medium text-primary">Your active work is shown above.</p>
            <p className="mt-1 text-xs text-muted-foreground">Other commitments will appear here when available.</p>
          </div>
        ) : (
          visibleDailySessions.map((dailySession) => {
            const goal = goals.find((entry) => entry.id === dailySession.goalId);
            if (!goal) return null;
            const category = categories.find(
              (entry) => entry.id === goal.categoryId,
            );
            const focusItem = focusItems.find((item) => item.goalId === goal.id);
            const linked = sessions.filter(
              (entry) => entry.dailySessionId === dailySession.id,
            );
            return (
              <DailySessionCard
                key={dailySession.id}
                session={dailySession}
                goal={goal}
                focusItem={focusItem}
                category={category}
                focusedMs={linked.reduce(
                  (total, entry) => total + sessionActiveMs(entry, now),
                  0,
                )}
                active={linked.some(
                  (entry) =>
                    entry.id === activeSessionId &&
                    (entry.status === "running" || entry.status === "paused"),
                )}
                now={now}
                highlighted={
                  goal.id === highlightedGoalId ||
                  focusItem?.id === highlightedFocusItemId
                }
              />
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
