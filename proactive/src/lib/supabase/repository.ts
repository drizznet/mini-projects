import type { SupabaseClient } from "@supabase/supabase-js";

import { LEGACY_STORAGE_KEYS, STATE_VERSION, STORAGE_KEY } from "../constants";
import type {
  Category,
  DailyPlan,
  FocusItem,
  FocusSession,
  FocusState,
  Goal,
  Settings,
} from "../types";

/**
 * Persistence boundary.
 *
 * The store talks to a `FocusRepository`, never to storage directly. Today the
 * local implementation is used; pointing the app at Supabase means swapping the
 * instance passed to `FocusStoreProvider` — no reducer or component changes.
 *
 * Both implementations load and save the whole graph. That is deliberate for an
 * MVP: the dataset is small (weeks of sessions), and it keeps writes atomic.
 * Split into per-entity mutations once collaborative editing matters.
 */
export interface FocusRepository {
  load(): Promise<FocusState | null>;
  save(state: FocusState): Promise<void>;
  clear(): Promise<void>;
}

export function createLocalRepository(): FocusRepository {
  return {
    async load() {
      try {
        const raw =
          window.localStorage.getItem(STORAGE_KEY) ??
          LEGACY_STORAGE_KEYS.map((key) => window.localStorage.getItem(key)).find(
            Boolean,
          );
        if (!raw) return null;
        const state = JSON.parse(raw) as FocusState;
        if (!window.localStorage.getItem(STORAGE_KEY)) {
          window.localStorage.setItem(STORAGE_KEY, raw);
          for (const key of LEGACY_STORAGE_KEYS) {
            window.localStorage.removeItem(key);
          }
        }
        return state;
      } catch {
        return null;
      }
    },
    async save(state) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        for (const key of LEGACY_STORAGE_KEYS) {
          window.localStorage.removeItem(key);
        }
      } catch {
        // Quota exceeded or private mode: keep running from memory.
      }
    },
    async clear() {
      window.localStorage.removeItem(STORAGE_KEY);
      for (const key of LEGACY_STORAGE_KEYS) {
        window.localStorage.removeItem(key);
      }
    },
  };
}

/** Column names mirror `supabase/schema.sql` (snake_case). */
interface SettingsRow {
  user_id: string;
  display_name: string;
  daily_target_hours: number;
  workdays: number[];
  default_session_minutes: number;
  theme: Settings["theme"];
  checklist_template: Settings["checklistTemplate"];
  pause_reasons: Settings["pauseReasons"];
  music_links: Settings["musicLinks"];
}

interface CategoryRow {
  id: string;
  user_id: string;
  name: string;
  description: string;
  color: Category["color"];
  icon: string;
  created_at: string;
}

interface GoalRow {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  description: string;
  priority: Goal["priority"];
  target_hours: number;
  status: Goal["status"];
  target_date: string | null;
  created_at: string;
}

interface FocusItemRow {
  id: string;
  user_id: string;
  goal_id: string;
  name: string;
  notes: string;
  priority: FocusItem["priority"];
  estimated_daily_hours: number;
  status: FocusItem["status"];
  created_at: string;
  archived_at: string | null;
}

interface DailyPlanRow {
  user_id: string;
  date: string;
  allocations: DailyPlan["allocations"];
  intention: string;
}

interface SessionRow {
  id: string;
  user_id: string;
  focus_item_id: string;
  planned_minutes: number;
  started_at: string;
  ended_at: string | null;
  paused_ms: number;
  paused_at: string | null;
  status: FocusSession["status"];
  pauses: FocusSession["pauses"];
  checklist: FocusSession["checklist"];
  productivity_rating: number | null;
  reflection: string;
}

/**
 * Supabase-backed repository.
 *
 * Enable it by configuring the env vars, then constructing it with the signed-in
 * user's id. Row-level security in `schema.sql` scopes every table by `user_id`,
 * so the client can only ever read and write its own rows.
 */
export function createSupabaseRepository(
  client: SupabaseClient,
  userId: string,
): FocusRepository {
  return {
    async load() {
      const [settings, categories, goals, items, plans, sessions] =
        await Promise.all([
          client
            .from("settings")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle<SettingsRow>(),
          client
            .from("categories")
            .select("*")
            .eq("user_id", userId)
            .returns<CategoryRow[]>(),
          client
            .from("goals")
            .select("*")
            .eq("user_id", userId)
            .returns<GoalRow[]>(),
          client
            .from("focus_items")
            .select("*")
            .eq("user_id", userId)
            .returns<FocusItemRow[]>(),
          client
            .from("daily_plans")
            .select("*")
            .eq("user_id", userId)
            .returns<DailyPlanRow[]>(),
          client
            .from("focus_sessions")
            .select("*")
            .eq("user_id", userId)
            .returns<SessionRow[]>(),
        ]);

      // No settings row means the account has never been provisioned.
      if (!settings.data) return null;

      return {
        version: STATE_VERSION,
        settings: {
          displayName: settings.data.display_name,
          dailyTargetHours: settings.data.daily_target_hours,
          workdays: settings.data.workdays,
          defaultSessionMinutes: settings.data.default_session_minutes,
          theme: settings.data.theme,
          checklistTemplate: settings.data.checklist_template,
          pauseReasons: settings.data.pause_reasons,
          musicLinks: settings.data.music_links,
        },
        categories: (categories.data ?? []).map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description,
          color: row.color,
          icon: row.icon,
          createdAt: row.created_at,
        })),
        goals: (goals.data ?? []).map((row) => ({
          id: row.id,
          categoryId: row.category_id,
          title: row.title,
          description: row.description,
          priority: row.priority,
          targetHours: row.target_hours,
          status: row.status,
          targetDate: row.target_date,
          createdAt: row.created_at,
        })),
        focusItems: (items.data ?? []).map((row) => ({
          id: row.id,
          goalId: row.goal_id,
          name: row.name,
          notes: row.notes,
          priority: row.priority,
          estimatedDailyHours: row.estimated_daily_hours,
          status: row.status,
          createdAt: row.created_at,
          archivedAt: row.archived_at,
        })),
        plans: (plans.data ?? []).map((row) => ({
          date: row.date,
          allocations: row.allocations,
          intention: row.intention,
        })),
        sessions: (sessions.data ?? []).map((row) => ({
          id: row.id,
          focusItemId: row.focus_item_id,
          plannedMinutes: row.planned_minutes,
          startedAt: row.started_at,
          endedAt: row.ended_at,
          pausedMs: row.paused_ms,
          pausedAt: row.paused_at,
          status: row.status,
          pauses: row.pauses,
          checklist: row.checklist,
          productivityRating: row.productivity_rating,
          reflection: row.reflection,
        })),
        activeSessionId:
          (sessions.data ?? []).find(
            (row) => row.status === "running" || row.status === "paused",
          )?.id ?? null,
      } satisfies FocusState;
    },

    async save(state) {
      // Upserts only; deletions are handled by the caller that removed the row.
      await Promise.all([
        client.from("settings").upsert({
          user_id: userId,
          display_name: state.settings.displayName,
          daily_target_hours: state.settings.dailyTargetHours,
          workdays: state.settings.workdays,
          default_session_minutes: state.settings.defaultSessionMinutes,
          theme: state.settings.theme,
          checklist_template: state.settings.checklistTemplate,
          pause_reasons: state.settings.pauseReasons,
          music_links: state.settings.musicLinks,
        } satisfies SettingsRow),
        client.from("categories").upsert(
          state.categories.map((category) => ({
            id: category.id,
            user_id: userId,
            name: category.name,
            description: category.description,
            color: category.color,
            icon: category.icon,
            created_at: category.createdAt,
          })),
        ),
        client.from("goals").upsert(
          state.goals.map((goal) => ({
            id: goal.id,
            user_id: userId,
            category_id: goal.categoryId,
            title: goal.title,
            description: goal.description,
            priority: goal.priority,
            target_hours: goal.targetHours,
            status: goal.status,
            target_date: goal.targetDate,
            created_at: goal.createdAt,
          })),
        ),
        client.from("focus_items").upsert(
          state.focusItems.map((item) => ({
            id: item.id,
            user_id: userId,
            goal_id: item.goalId,
            name: item.name,
            notes: item.notes,
            priority: item.priority,
            estimated_daily_hours: item.estimatedDailyHours,
            status: item.status,
            created_at: item.createdAt,
            archived_at: item.archivedAt,
          })),
        ),
        client.from("daily_plans").upsert(
          state.plans.map((plan) => ({
            user_id: userId,
            date: plan.date,
            allocations: plan.allocations,
            intention: plan.intention,
          })),
        ),
        client.from("focus_sessions").upsert(
          state.sessions.map((session) => ({
            id: session.id,
            user_id: userId,
            focus_item_id: session.focusItemId,
            planned_minutes: session.plannedMinutes,
            started_at: session.startedAt,
            ended_at: session.endedAt,
            paused_ms: session.pausedMs,
            paused_at: session.pausedAt,
            status: session.status,
            pauses: session.pauses,
            checklist: session.checklist,
            productivity_rating: session.productivityRating,
            reflection: session.reflection,
          })),
        ),
      ]);
    },

    async clear() {
      await Promise.all(
        [
          "focus_sessions",
          "daily_plans",
          "focus_items",
          "goals",
          "categories",
        ].map((table) => client.from(table).delete().eq("user_id", userId)),
      );
    },
  };
}
