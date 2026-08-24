import { sessionActiveHours, type GoalProgress } from "./analytics";
import { PRIORITY_META } from "./health";
import { lineageFor, planForDate, type EntityIndex } from "./selectors";
import type { FocusItem, FocusState } from "./types";
import { addDays, round, toDateKey } from "./utils";

/**
 * Recommendation engine — "What should I focus on next?".
 *
 * Candidates are scored on five signals and the top result is surfaced on the
 * dashboard with a human-readable rationale. Weights live in `WEIGHTS` so the
 * behaviour can be tuned in one place; every signal is normalised to 0–1 first.
 */
const WEIGHTS = {
  /** Unspent hours in today's plan for this item. */
  remainingAllocation: 0.34,
  priority: 0.22,
  /** How far the parent goal is from its target. */
  goalDeficit: 0.16,
  /** Days since the item was last touched. */
  staleness: 0.16,
  /** Shortfall against the item's own daily estimate over the last week. */
  weeklyDebt: 0.12,
} as const;

export interface Recommendation {
  item: FocusItem;
  goalTitle: string;
  categoryName: string;
  categoryColor: string;
  score: number;
  /** Suggested block length in minutes. */
  suggestedMinutes: number;
  remainingHours: number;
  reasons: string[];
}

export interface RecommendationContext {
  state: FocusState;
  index: EntityIndex;
  goals: GoalProgress[];
  todayKey: string;
  now: number;
}

export function recommendNext(
  context: RecommendationContext,
  limit = 3,
): Recommendation[] {
  const { state, index, goals, todayKey, now } = context;
  const plan = planForDate(state, todayKey);
  const goalById = new Map(goals.map((goal) => [goal.goalId, goal]));

  const actualByItemToday = new Map<string, number>();
  for (const session of state.sessions) {
    if (toDateKey(session.startedAt) !== todayKey) continue;
    actualByItemToday.set(
      session.focusItemId,
      (actualByItemToday.get(session.focusItemId) ?? 0) +
        sessionActiveHours(session, now),
    );
  }

  const weekStart = addDays(new Date(now), -6).getTime();
  const weeklyHoursByItem = new Map<string, number>();
  const lastTouchedByItem = new Map<string, number>();
  for (const session of state.sessions) {
    const startedAt = new Date(session.startedAt).getTime();
    lastTouchedByItem.set(
      session.focusItemId,
      Math.max(lastTouchedByItem.get(session.focusItemId) ?? 0, startedAt),
    );
    if (startedAt < weekStart) continue;
    weeklyHoursByItem.set(
      session.focusItemId,
      (weeklyHoursByItem.get(session.focusItemId) ?? 0) +
        sessionActiveHours(session, now),
    );
  }

  const candidates = state.focusItems.filter((item) => {
    if (item.archivedAt || item.status === "done") return false;
    const goal = index.goalById.get(item.goalId);
    return goal ? goal.status === "active" : false;
  });

  const scored = candidates.map((item) => {
    const lineage = lineageFor(index, item.id);
    const allocation = plan?.allocations.find(
      (entry) => entry.focusItemId === item.id,
    );
    const plannedToday = allocation?.plannedHours ?? 0;
    const doneToday = actualByItemToday.get(item.id) ?? 0;
    const remainingHours = Math.max(0, plannedToday - doneToday);

    const remainingSignal = plannedToday > 0 ? remainingHours / plannedToday : 0;
    const prioritySignal = PRIORITY_META[item.priority].weight / 4;
    const goalDeficitSignal = 1 - (goalById.get(item.goalId)?.progress ?? 0);

    const lastTouched = lastTouchedByItem.get(item.id);
    const daysSince = lastTouched
      ? Math.floor((now - lastTouched) / 86_400_000)
      : 14;
    const stalenessSignal = Math.min(1, daysSince / 7);

    const expectedWeekly = item.estimatedDailyHours * 5;
    const weeklyDebtSignal =
      expectedWeekly > 0
        ? Math.min(
            1,
            Math.max(
              0,
              (expectedWeekly - (weeklyHoursByItem.get(item.id) ?? 0)) /
                expectedWeekly,
            ),
          )
        : 0;

    let score =
      remainingSignal * WEIGHTS.remainingAllocation +
      prioritySignal * WEIGHTS.priority +
      goalDeficitSignal * WEIGHTS.goalDeficit +
      stalenessSignal * WEIGHTS.staleness +
      weeklyDebtSignal * WEIGHTS.weeklyDebt;

    // Blocked work should surface only when nothing else is available.
    if (item.status === "blocked") score *= 0.35;
    // Anything already satisfied today drops behind untouched work.
    if (plannedToday > 0 && remainingHours === 0) score *= 0.4;

    const reasons: string[] = [];
    if (remainingHours > 0) {
      reasons.push(
        `${round(remainingHours, 2)}h left in today's budget for this item`,
      );
    }
    if (item.priority === "critical" || item.priority === "high") {
      reasons.push(`${PRIORITY_META[item.priority].label} priority`);
    }
    if (daysSince >= 3) {
      reasons.push(
        lastTouched ? `Untouched for ${daysSince} days` : "Never started",
      );
    }
    if (goalDeficitSignal > 0.5 && lineage?.goal) {
      reasons.push(
        `${Math.round(goalDeficitSignal * 100)}% of "${lineage.goal.title}" still remaining`,
      );
    }
    if (weeklyDebtSignal > 0.5) {
      reasons.push("Behind its weekly rhythm");
    }
    if (item.status === "blocked") {
      reasons.push("Currently blocked — unblock before committing a session");
    }

    const suggestedMinutes = Math.max(
      25,
      Math.min(
        120,
        Math.round(
          ((remainingHours > 0 ? remainingHours : item.estimatedDailyHours) *
            60) /
            5,
        ) * 5,
      ),
    );

    return {
      item,
      goalTitle: lineage?.goal?.title ?? "Unassigned goal",
      categoryName: lineage?.category?.name ?? "Uncategorised",
      categoryColor: lineage?.category
        ? `var(--${lineage.category.color})`
        : "var(--chart-1)",
      score: round(score, 3),
      suggestedMinutes,
      remainingHours: round(remainingHours, 2),
      reasons: reasons.slice(0, 3),
    } satisfies Recommendation;
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}
