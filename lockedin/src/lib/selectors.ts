import type {
  Category,
  FocusItem,
  FocusSession,
  FocusState,
  Goal,
} from "./types";
import { toDateKey } from "./utils";

/**
 * Lookup helpers over the flat store.
 *
 * Build the index maps once per render (see `useFocusData`) and pass them down
 * rather than calling `find` inside list renders.
 */
export interface EntityIndex {
  categoryById: Map<string, Category>;
  goalById: Map<string, Goal>;
  itemById: Map<string, FocusItem>;
  sessionsByDate: Map<string, FocusSession[]>;
}

export function buildIndex(state: FocusState): EntityIndex {
  const sessionsByDate = new Map<string, FocusSession[]>();
  for (const session of state.sessions) {
    const key = toDateKey(session.startedAt);
    const bucket = sessionsByDate.get(key);
    if (bucket) bucket.push(session);
    else sessionsByDate.set(key, [session]);
  }

  return {
    categoryById: new Map(state.categories.map((item) => [item.id, item])),
    goalById: new Map(state.goals.map((item) => [item.id, item])),
    itemById: new Map(state.focusItems.map((item) => [item.id, item])),
    sessionsByDate,
  };
}

/** Item → goal → category chain, tolerant of deleted parents. */
export interface ItemLineage {
  item: FocusItem;
  goal: Goal | undefined;
  category: Category | undefined;
}

export function lineageFor(
  index: EntityIndex,
  itemId: string,
): ItemLineage | undefined {
  const item = index.itemById.get(itemId);
  if (!item) return undefined;
  const goal = index.goalById.get(item.goalId);
  const category = goal ? index.categoryById.get(goal.categoryId) : undefined;
  return { item, goal, category };
}

export function categoryIdForSession(
  index: EntityIndex,
  session: FocusSession,
): string | undefined {
  const lineage = lineageFor(index, session.focusItemId);
  return lineage?.category?.id;
}

export function activeItems(state: FocusState): FocusItem[] {
  return state.focusItems.filter(
    (item) => !item.archivedAt && item.status !== "done",
  );
}

export function itemsForGoal(state: FocusState, goalId: string): FocusItem[] {
  return state.focusItems.filter((item) => item.goalId === goalId);
}

export function goalsForCategory(state: FocusState, categoryId: string): Goal[] {
  return state.goals.filter((goal) => goal.categoryId === categoryId);
}

export function planForDate(
  state: FocusState,
  dateKey: string,
): FocusState["plans"][number] | undefined {
  return state.plans.find((plan) => plan.date === dateKey);
}

export function sessionsForDate(
  index: EntityIndex,
  dateKey: string,
): FocusSession[] {
  return index.sessionsByDate.get(dateKey) ?? [];
}

export function sessionsForItem(
  state: FocusState,
  itemId: string,
): FocusSession[] {
  return state.sessions.filter((session) => session.focusItemId === itemId);
}

export function dailySessionsForDate(
  state: FocusState,
  dateKey: string,
) {
  return state.dailySessions
    .filter((session) => session.date === dateKey)
    .sort((a, b) => a.goalId.localeCompare(b.goalId));
}
