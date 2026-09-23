/**
 * lockIn domain model.
 *
 * Frontend domain model for the local Focus OS state.
 * All timestamps are ISO strings; all `date` fields are `YYYY-MM-DD` local days.
 */

export type Priority = "critical" | "high" | "medium" | "low";

export type GoalStatus = "active" | "paused" | "completed";

export type FocusItemStatus =
  | "not_started"
  | "in_progress"
  | "blocked"
  | "done";

export type SessionStatus = "running" | "paused" | "completed" | "abandoned";

/** Health band used for adaptive dashboard colouring. */
export type HealthLevel =
  | "excellent"
  | "on-track"
  | "slipping"
  | "behind"
  | "critical";

/** Chart token slot — keeps category colours inside the design system. */
export type ColorToken =
  | "chart-1"
  | "chart-2"
  | "chart-3"
  | "chart-4"
  | "chart-5"
  | "chart-6";

export interface Category {
  id: string;
  name: string;
  description: string;
  color: ColorToken;
  /** Lucide icon key resolved through `src/lib/icons.ts`. */
  icon: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  priority: Priority;
  targetHours: number;
  status: GoalStatus;
  targetDate: string | null;
  createdAt: string;
}

export interface FocusItem {
  id: string;
  goalId: string;
  name: string;
  notes: string;
  priority: Priority;
  estimatedDailyHours: number;
  status: FocusItemStatus;
  createdAt: string;
  archivedAt: string | null;
}

export interface PauseReasonOption {
  id: string;
  label: string;
  /** Planned breaks are excluded from the distraction penalty. */
  planned: boolean;
}

export interface PauseEvent {
  id: string;
  reasonId: string;
  note: string;
  startedAt: string;
  endedAt: string | null;
}

export interface SessionChecklistEntry {
  id: string;
  label: string;
  checked: boolean;
}

export interface FocusSession {
  id: string;
  focusItemId: string;
  plannedMinutes: number;
  startedAt: string;
  endedAt: string | null;
  /** Accumulated completed pause time in ms. */
  pausedMs: number;
  /** Set while the session sits in the `paused` state. */
  pausedAt: string | null;
  status: SessionStatus;
  pauses: PauseEvent[];
  checklist: SessionChecklistEntry[];
  productivityRating: number | null;
  reflection: string;
}

export interface PlanAllocation {
  focusItemId: string;
  plannedHours: number;
}

export interface DailyPlan {
  date: string;
  allocations: PlanAllocation[];
  intention: string;
}

export interface ChecklistTemplateItem {
  id: string;
  label: string;
  enabled: boolean;
}

export interface MusicLink {
  id: string;
  label: string;
  url: string;
}

export type ThemePreference = "light";

export type SessionIslandPosition =
  | "top-left" | "top" | "top-right"
  | "bottom-left" | "bottom" | "bottom-right";

export interface Settings {
  displayName: string;
  dailyTargetHours: number;
  /** 0 = Sunday … 6 = Saturday. */
  workdays: number[];
  defaultSessionMinutes: number;
  theme: ThemePreference;
  /** Where the floating active-session island is anchored in the viewport. */
  sessionIslandPosition?: SessionIslandPosition;
  checklistTemplate: ChecklistTemplateItem[];
  pauseReasons: PauseReasonOption[];
  musicLinks: MusicLink[];
}

export interface FocusState {
  version: number;
  settings: Settings;
  categories: Category[];
  goals: Goal[];
  focusItems: FocusItem[];
  plans: DailyPlan[];
  sessions: FocusSession[];
  activeSessionId: string | null;
}

/** The four normalised inputs behind a day's focus score (each 0–1). */
export interface ScoreComponents {
  adherence: number;
  completion: number;
  consistency: number;
  focusQuality: number;
}

/** Derived per-day rollup consumed by the dashboard and analytics screens. */
export interface DayMetrics {
  date: string;
  plannedHours: number;
  actualHours: number;
  completionRate: number;
  focusScore: number;
  sessionCount: number;
  completedSessions: number;
  longestSessionMinutes: number;
  interruptions: number;
  debtHours: number;
  components: ScoreComponents;
}
