import { sessionActiveHours } from "./analytics";
import type { FocusState, Goal } from "./types";

/** A finished plan is kept when focused time reaches this share of the plan. */
export const PLAN_KEPT_RATIO = 0.7;

export function planWindowClosed(goal: Goal, todayKey: string) {
  return Boolean(goal.targetDate && todayKey > goal.targetDate);
}

export function loggedHoursForGoal(
  state: Pick<FocusState, "focusItems" | "sessions">,
  goalId: string,
  now: number,
) {
  const itemIds = new Set(
    state.focusItems.filter((item) => item.goalId === goalId).map((item) => item.id),
  );
  let hours = 0;
  for (const session of state.sessions) {
    if (!itemIds.has(session.focusItemId)) continue;
    hours += sessionActiveHours(session, now);
  }
  return hours;
}

/**
 * The plan's dates are over and focused time stayed under 70% of the plan.
 * A plan marked completed stays completed.
 */
export function isPlanFailed(goal: Goal, loggedHours: number, todayKey: string) {
  if (goal.status === "completed") return false;
  if (!planWindowClosed(goal, todayKey)) return false;
  if (goal.targetHours <= 0) return loggedHours <= 0;
  return loggedHours / goal.targetHours < PLAN_KEPT_RATIO;
}
