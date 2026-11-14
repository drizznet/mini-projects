"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { STATE_VERSION } from "../constants";
import { createEmptyState, createSeedState } from "../seed";
import {
  createLocalRepository,
  type FocusRepository,
} from "../repository";
import type {
  Category,
  DailyPlan,
  DailySession,
  FocusItem,
  FocusSession,
  FocusState,
  Goal,
  SessionChecklistEntry,
  Settings,
} from "../types";
import { createId, dateKeyRange, fromDateKey, toDateKey } from "../utils";

/**
 * Client-side source of truth for planning and session state.
 *
 * A reducer holds the graph and a localStorage repository persists it. Categories
 * and commitments are synchronized from the authenticated API.
 *
 * Hydration happens in an effect (never during render) because the seed data is
 * keyed to the viewer's local calendar days, which the server cannot know.
 */

type Action =
  | { type: "hydrate"; state: FocusState }
  | { type: "reset"; state: FocusState }
  | { type: "settings/update"; patch: Partial<Settings> }
  | { type: "category/replace"; categories: Category[] }
  | { type: "category/upsert"; category: Category }
  | { type: "category/remove"; id: string }
  | { type: "goal/upsert"; goal: Goal }
  | { type: "goal/replace"; goals: Goal[] }
  | { type: "goal/remove"; id: string }
  | { type: "item/upsert"; item: FocusItem }
  | { type: "item/remove"; id: string }
  | { type: "plan/allocate"; date: string; focusItemId: string; hours: number }
  | { type: "plan/remove"; date: string; focusItemId: string }
  | { type: "plan/intention"; date: string; intention: string }
  | { type: "plan/clear"; date: string }
  | { type: "session/start"; session: FocusSession }
  | {
      type: "session/pause";
      id: string;
      reasonId: string;
      note: string;
      at: string;
    }
  | { type: "session/resume"; id: string; at: string }
  | {
      type: "session/end";
      id: string;
      at: string;
      status: "completed" | "abandoned";
      rating: number | null;
      reflection: string;
    }
  | { type: "session/discard"; id: string }
  | { type: "session/checklist"; id: string; entryId: string; checked: boolean };

function upsertPlan(
  plans: DailyPlan[],
  date: string,
  update: (plan: DailyPlan) => DailyPlan,
): DailyPlan[] {
  const existing = plans.find((plan) => plan.date === date);
  const base: DailyPlan = existing ?? { date, allocations: [], intention: "" };
  const next = update(base);
  return existing
    ? plans.map((plan) => (plan.date === date ? next : plan))
    : [...plans, next].sort((a, b) => a.date.localeCompare(b.date));
}

function dailySessionsForGoal(goal: Goal): DailySession[] {
  if (
    !goal.startDate ||
    !goal.targetDate ||
    !goal.dailyCommitmentMinutes ||
    goal.dailyCommitmentMinutes <= 0
  ) {
    return [];
  }

  return dateKeyRange(fromDateKey(goal.startDate), fromDateKey(goal.targetDate)).map(
    (date) => ({
      id: `daily_${goal.id}_${date}`,
      goalId: goal.id,
      date,
      commitmentMinutes: goal.dailyCommitmentMinutes ?? 0,
      scheduledCheckInEnabled: goal.scheduledCheckInEnabled ?? false,
      scheduledCheckInTime: goal.scheduledCheckInTime ?? null,
      strictCheckIn: goal.strictCheckIn ?? false,
    }),
  );
}

function focusItemForGoal(goal: Goal, id: string): FocusItem {
  return {
    id,
    goalId: goal.id,
    name: goal.title,
    notes: "",
    priority: goal.priority,
    estimatedDailyHours: (goal.dailyCommitmentMinutes ?? 60) / 60,
    status: "not_started",
    focusMode: goal.workFocusMode ?? "flexible",
    createdAt: goal.createdAt,
    archivedAt: null,
  };
}

function allocateGoalAcrossPlan(
  plans: DailyPlan[],
  goal: Goal,
  focusItemId: string,
): DailyPlan[] {
  if (
    !goal.startDate ||
    !goal.targetDate ||
    !goal.dailyCommitmentMinutes ||
    goal.dailyCommitmentMinutes <= 0
  ) {
    return plans;
  }

  const plannedHours = goal.dailyCommitmentMinutes / 60;
  return dateKeyRange(
    fromDateKey(goal.startDate),
    fromDateKey(goal.targetDate),
  ).reduce(
    (nextPlans, date) =>
      upsertPlan(nextPlans, date, (plan) => ({
        ...plan,
        allocations: plan.allocations.some(
          (allocation) => allocation.focusItemId === focusItemId,
        )
          ? plan.allocations
          : [
              ...plan.allocations,
              { focusItemId, plannedHours },
            ],
      })),
    plans,
  );
}

/** The live session is the one `activeSessionId` points at. If that pointer is empty or stale, attach it to a session that is still running, then the newest paused one. */
function reconcileActiveSession(state: FocusState): FocusState {
  const live = state.sessions.filter(
    (session) => session.status === "running" || session.status === "paused",
  );
  if (live.some((session) => session.id === state.activeSessionId)) return state;
  const next = [...live].sort((a, b) => {
    if (a.status !== b.status) return a.status === "running" ? -1 : 1;
    return b.startedAt.localeCompare(a.startedAt);
  })[0];
  const activeSessionId = next?.id ?? null;
  return activeSessionId === state.activeSessionId ? state : { ...state, activeSessionId };
}

function focusReducer(state: FocusState, action: Action): FocusState {
  switch (action.type) {
    case "hydrate":
    case "reset":
      return reconcileActiveSession(action.state);

    case "settings/update":
      return { ...state, settings: { ...state.settings, ...action.patch } };

    case "category/replace":
      return { ...state, categories: action.categories };

    case "category/upsert": {
      const exists = state.categories.some((c) => c.id === action.category.id);
      return {
        ...state,
        categories: exists
          ? state.categories.map((c) =>
              c.id === action.category.id ? action.category : c,
            )
          : [...state.categories, action.category],
      };
    }

    case "category/remove": {
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.id),
        goals: state.goals.map((goal) =>
          goal.categoryId === action.id ? { ...goal, categoryId: "" } : goal,
        ),
      };
    }

    case "goal/upsert": {
      const exists = state.goals.some((goal) => goal.id === action.goal.id);
      const focusItemId = createId("item");
      const newFocusItem = focusItemForGoal(action.goal, focusItemId);
      return {
        ...state,
        goals: exists
          ? state.goals.map((goal) =>
              goal.id === action.goal.id ? action.goal : goal,
            )
          : [...state.goals, action.goal],
        dailySessions: exists
          ? state.dailySessions
          : [...state.dailySessions, ...dailySessionsForGoal(action.goal)],
        plans: exists
          ? state.plans
          : allocateGoalAcrossPlan(state.plans, action.goal, focusItemId),
        focusItems: exists
          ? state.focusItems
          : [...state.focusItems, newFocusItem],
      };
    }

    case "goal/replace": {
      const goals = action.goals;
      const goalIds = new Set(goals.map((goal) => goal.id));
      const kept = state.focusItems.filter(
        (item) => goalIds.has(item.goalId) && !item.archivedAt,
      );
      const covered = new Set(kept.map((item) => item.goalId));
      const created = goals
        .filter((goal) => !covered.has(goal.id))
        .map((goal) => focusItemForGoal(goal, `item_${goal.id}`));
      const focusItems = [...kept, ...created];
      const focusItemIds = new Set(focusItems.map((item) => item.id));
      const plans = goals.reduce((nextPlans, goal) => {
        if (goal.status !== "active") return nextPlans;
        const item = focusItems.find((entry) => entry.goalId === goal.id);
        return item ? allocateGoalAcrossPlan(nextPlans, goal, item.id) : nextPlans;
      }, state.plans.map((plan) => ({
        ...plan,
        allocations: plan.allocations.filter((allocation) =>
          focusItemIds.has(allocation.focusItemId),
        ),
      })));
      return {
        ...state,
        goals,
        focusItems,
        dailySessions: goals.flatMap(dailySessionsForGoal),
        plans,
      };
    }

    case "goal/remove":
      return {
        ...state,
        goals: state.goals.filter((goal) => goal.id !== action.id),
        focusItems: state.focusItems.filter(
          (item) => item.goalId !== action.id,
        ),
        dailySessions: state.dailySessions.filter(
          (session) => session.goalId !== action.id,
        ),
      };

    case "item/upsert": {
      const exists = state.focusItems.some((item) => item.id === action.item.id);
      return {
        ...state,
        focusItems: exists
          ? state.focusItems.map((item) =>
              item.id === action.item.id ? action.item : item,
            )
          : [...state.focusItems, action.item],
      };
    }

    case "item/remove":
      return {
        ...state,
        focusItems: state.focusItems.filter((item) => item.id !== action.id),
        plans: state.plans.map((plan) => ({
          ...plan,
          allocations: plan.allocations.filter(
            (entry) => entry.focusItemId !== action.id,
          ),
        })),
      };

    case "plan/allocate":
      return {
        ...state,
        plans: upsertPlan(state.plans, action.date, (plan) => {
          const exists = plan.allocations.some(
            (entry) => entry.focusItemId === action.focusItemId,
          );
          return {
            ...plan,
            allocations: exists
              ? plan.allocations.map((entry) =>
                  entry.focusItemId === action.focusItemId
                    ? { ...entry, plannedHours: action.hours }
                    : entry,
                )
              : [
                  ...plan.allocations,
                  {
                    focusItemId: action.focusItemId,
                    plannedHours: action.hours,
                  },
                ],
          };
        }),
      };

    case "plan/remove":
      return {
        ...state,
        plans: upsertPlan(state.plans, action.date, (plan) => ({
          ...plan,
          allocations: plan.allocations.filter(
            (entry) => entry.focusItemId !== action.focusItemId,
          ),
        })),
      };

    case "plan/intention":
      return {
        ...state,
        plans: upsertPlan(state.plans, action.date, (plan) => ({
          ...plan,
          intention: action.intention,
        })),
      };

    case "plan/clear":
      return {
        ...state,
        plans: state.plans.filter((plan) => plan.date !== action.date),
      };

    case "session/start":
      return {
        ...state,
        sessions: [...state.sessions, action.session],
        activeSessionId: action.session.id,
        focusItems: state.focusItems.map((item) =>
          item.id === action.session.focusItemId
            ? { ...item, status: "in_progress" }
            : item,
        ),
      };

    case "session/pause":
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session.id === action.id && session.status === "running"
            ? {
                ...session,
                status: "paused",
                pausedAt: action.at,
                pauses: [
                  ...session.pauses,
                  {
                    id: createId("pause"),
                    reasonId: action.reasonId,
                    note: action.note,
                    startedAt: action.at,
                    endedAt: null,
                  },
                ],
              }
            : session,
        ),
      };

    case "session/resume":
      if (
        state.sessions.some(
          (session) =>
            session.id !== action.id && session.status === "running",
        )
      ) {
        return state;
      }
      return {
        ...state,
        activeSessionId: action.id,
        sessions: state.sessions.map((session) => {
          if (session.id !== action.id || session.status !== "paused") {
            return session;
          }
          const pausedFor = session.pausedAt
            ? new Date(action.at).getTime() -
              new Date(session.pausedAt).getTime()
            : 0;
          return {
            ...session,
            status: "running",
            pausedAt: null,
            pausedMs: session.pausedMs + Math.max(0, pausedFor),
            pauses: session.pauses.map((pause, index) =>
              index === session.pauses.length - 1 && pause.endedAt === null
                ? { ...pause, endedAt: action.at }
                : pause,
            ),
          };
        }),
      };

    case "session/end":
      return reconcileActiveSession({
        ...state,
        activeSessionId:
          state.activeSessionId === action.id ? null : state.activeSessionId,
        sessions: state.sessions.map((session) => {
          if (session.id !== action.id) return session;
          // Close an open pause first so paused time is not counted as focus.
          const pausedFor =
            session.status === "paused" && session.pausedAt
              ? new Date(action.at).getTime() -
                new Date(session.pausedAt).getTime()
              : 0;
          return {
            ...session,
            status: action.status,
            endedAt: action.at,
            pausedAt: null,
            pausedMs: session.pausedMs + Math.max(0, pausedFor),
            pauses: session.pauses.map((pause, index) =>
              index === session.pauses.length - 1 && pause.endedAt === null
                ? { ...pause, endedAt: action.at }
                : pause,
            ),
            productivityRating: action.rating,
            reflection: action.reflection,
          };
        }),
      });

    case "session/discard":
      return reconcileActiveSession({
        ...state,
        sessions: state.sessions.filter((session) => session.id !== action.id),
        activeSessionId:
          state.activeSessionId === action.id ? null : state.activeSessionId,
      });

    case "session/checklist":
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session.id === action.id
            ? {
                ...session,
                checklist: session.checklist.map((entry) =>
                  entry.id === action.entryId
                    ? { ...entry, checked: action.checked }
                    : entry,
                ),
              }
            : session,
        ),
      };

    default:
      return state;
  }
}

export interface StartSessionInput {
  focusItemId: string;
  plannedMinutes: number;
  checklist: SessionChecklistEntry[];
  /** Calendar day this check-in/session should count toward. */
  checkInDate?: string;
  dailySessionId?: string;
  lateCheckInMinutes?: number;
}

export interface FocusStoreValue {
  state: FocusState;
  /** False until localStorage/seed data has been read on the client. */
  hydrated: boolean;
  actions: {
    updateSettings: (patch: Partial<Settings>) => void;
    resetToDemo: () => void;
    resetToEmpty: () => void;
    replaceCategories: (categories: Category[]) => void;
    saveCategory: (category: Category) => void;
    removeCategory: (id: string) => void;
    saveGoal: (goal: Goal) => void;
    /** Replace all goals (e.g. after loading commitments from the API). */
    replaceGoals: (goals: Goal[]) => void;
    removeGoal: (id: string) => void;
    saveItem: (item: FocusItem) => void;
    removeItem: (id: string) => void;
    allocate: (date: string, focusItemId: string, hours: number) => void;
    removeAllocation: (date: string, focusItemId: string) => void;
    setIntention: (date: string, intention: string) => void;
    clearPlan: (date: string) => void;
    startSession: (input: StartSessionInput) => string;
    pauseSession: (id: string, reasonId: string, note?: string) => void;
    resumeSession: (id: string) => void;
    endSession: (
      id: string,
      payload: {
        status: "completed" | "abandoned";
        rating: number | null;
        reflection: string;
      },
    ) => void;
    discardSession: (id: string) => void;
    toggleSessionChecklist: (
      id: string,
      entryId: string,
      checked: boolean,
    ) => void;
  };
}

const FocusStoreContext = createContext<FocusStoreValue | null>(null);

export function FocusStoreProvider({
  children,
  repository,
}: {
  children: ReactNode;
  /** Defaults to the browser's localStorage repository. */
  repository?: FocusRepository;
}) {
  const [state, dispatch] = useReducer(focusReducer, createEmptyState());
  const [hydrated, setHydrated] = useState(false);
  const skipPersist = useRef(true);
  const repoRef = useRef<FocusRepository>(
    repository ?? createLocalRepository(),
  );

  useEffect(() => {
    let cancelled = false;
    void repoRef.current.load().then((persisted) => {
      if (cancelled) return;
      // A version mismatch means the shape changed; reseed rather than migrate.
      const usable =
        persisted && persisted.version === STATE_VERSION ? persisted : null;
      dispatch({
        type: "hydrate",
        state: usable
          ? {
              ...usable,
              // Categories are now server-owned; discard legacy local/mock values.
              categories: [],
              dailySessions: usable.dailySessions ?? [],
            }
          : createSeedState(),
      });
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    // The hydrate dispatch itself must not immediately write back.
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    void repoRef.current.save(state);
  }, [state, hydrated]);

  const startSession = useCallback((input: StartSessionInput) => {
    const id = createId("ses");
    dispatch({
      type: "session/start",
      session: {
        id,
        focusItemId: input.focusItemId,
        checkInDate: input.checkInDate ?? null,
        dailySessionId: input.dailySessionId ?? null,
        lateCheckInMinutes: input.lateCheckInMinutes,
        plannedMinutes: input.plannedMinutes,
        startedAt: new Date().toISOString(),
        endedAt: null,
        pausedMs: 0,
        pausedAt: null,
        status: "running",
        pauses: [],
        checklist: input.checklist,
        productivityRating: null,
        reflection: "",
      },
    });
    return id;
  }, []);

  const actions = useMemo<FocusStoreValue["actions"]>(
    () => ({
      updateSettings: (patch) => dispatch({ type: "settings/update", patch }),
      resetToDemo: () => dispatch({ type: "reset", state: createSeedState() }),
      resetToEmpty: () => dispatch({ type: "reset", state: createEmptyState() }),
      replaceCategories: (categories) =>
        dispatch({ type: "category/replace", categories }),
      saveCategory: (category) => dispatch({ type: "category/upsert", category }),
      removeCategory: (id) => dispatch({ type: "category/remove", id }),
      saveGoal: (goal) => dispatch({ type: "goal/upsert", goal }),
      replaceGoals: (goals) => dispatch({ type: "goal/replace", goals }),
      removeGoal: (id) => dispatch({ type: "goal/remove", id }),
      saveItem: (item) => dispatch({ type: "item/upsert", item }),
      removeItem: (id) => dispatch({ type: "item/remove", id }),
      allocate: (date, focusItemId, hours) =>
        dispatch({ type: "plan/allocate", date, focusItemId, hours }),
      removeAllocation: (date, focusItemId) =>
        dispatch({ type: "plan/remove", date, focusItemId }),
      setIntention: (date, intention) =>
        dispatch({ type: "plan/intention", date, intention }),
      clearPlan: (date) => dispatch({ type: "plan/clear", date }),
      startSession,
      pauseSession: (id, reasonId, note = "") =>
        dispatch({
          type: "session/pause",
          id,
          reasonId,
          note,
          at: new Date().toISOString(),
        }),
      resumeSession: (id) =>
        dispatch({ type: "session/resume", id, at: new Date().toISOString() }),
      endSession: (id, payload) =>
        dispatch({
          type: "session/end",
          id,
          at: new Date().toISOString(),
          ...payload,
        }),
      discardSession: (id) => dispatch({ type: "session/discard", id }),
      toggleSessionChecklist: (id, entryId, checked) =>
        dispatch({ type: "session/checklist", id, entryId, checked }),
    }),
    [startSession],
  );

  const value = useMemo<FocusStoreValue>(
    () => ({ state, hydrated, actions }),
    [state, hydrated, actions],
  );

  return (
    <FocusStoreContext.Provider value={value}>
      {children}
    </FocusStoreContext.Provider>
  );
}

export function useFocusStore(): FocusStoreValue {
  const context = useContext(FocusStoreContext);
  if (!context) {
    throw new Error("useFocusStore must be used inside <FocusStoreProvider>");
  }
  return context;
}

/** Convenience: today's key recomputed on every render (cheap, always fresh). */
export function useTodayKey(): string {
  const { hydrated } = useFocusStore();
  // Before hydration the server-rendered value would disagree with the client.
  return hydrated ? toDateKey(new Date()) : "";
}
