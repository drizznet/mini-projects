import {
  DEFAULT_CHECKLIST,
  DEFAULT_MUSIC_LINKS,
  DEFAULT_PAUSE_REASONS,
  STATE_VERSION,
} from "./constants";
import type {
  Category,
  DailyPlan,
  FocusItem,
  FocusSession,
  FocusState,
  Goal,
  PauseEvent,
  PlanAllocation,
  Settings,
} from "./types";
import { addDays, toDateKey } from "./utils";

/**
 * Deterministic demo data.
 *
 * The generator is seeded (mulberry32) so the same 8-week history is produced on
 * every load — that keeps charts, streaks and "best day" insights stable while
 * developing. It runs on the client only, from the store's hydration effect,
 * because day keys depend on the viewer's timezone.
 */
function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HISTORY_DAYS = 56;

interface Rng {
  (): number;
}

function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

function between(rng: Rng, min: number, max: number): number {
  return min + rng() * (max - min);
}

function chance(rng: Rng, probability: number): boolean {
  return rng() < probability;
}

const CATEGORY_SEED: Omit<Category, "createdAt">[] = [
  {
    id: "cat_learning",
    name: "Learning",
    description: "Skill acquisition, courses, deliberate practice.",
    color: "chart-1",
    icon: "graduation",
  },
  {
    id: "cat_client",
    name: "Client Work",
    description: "Billable delivery for external clients.",
    color: "chart-2",
    icon: "briefcase",
  },
  {
    id: "cat_job",
    name: "Main Job",
    description: "Core employment responsibilities and roadmap work.",
    color: "chart-3",
    icon: "building",
  },
  {
    id: "cat_projects",
    name: "Personal Projects",
    description: "Products and experiments I own end to end.",
    color: "chart-4",
    icon: "rocket",
  },
  {
    id: "cat_admin",
    name: "Admin Tasks",
    description: "Invoicing, inbox, planning, low-cognitive overhead.",
    color: "chart-5",
    icon: "clipboard",
  },
  {
    id: "cat_misc",
    name: "Miscellaneous",
    description: "Reading, research, anything that resists a bucket.",
    color: "chart-6",
    icon: "shapes",
  },
];

const GOAL_SEED: Omit<Goal, "createdAt">[] = [
  {
    id: "goal_csharp",
    categoryId: "cat_learning",
    title: "Learn C# and .NET",
    description:
      "Get production-comfortable with C#, ASP.NET Core and Entity Framework.",
    priority: "high",
    targetHours: 120,
    status: "active",
    targetDate: null,
  },
  {
    id: "goal_rn",
    categoryId: "cat_learning",
    title: "Learn React Native",
    description: "Ship one cross-platform app from scratch to store review.",
    priority: "medium",
    targetHours: 80,
    status: "active",
    targetDate: null,
  },
  {
    id: "goal_figma",
    categoryId: "cat_learning",
    title: "Master Figma",
    description:
      "Auto layout, variables, component APIs and prototype interactions.",
    priority: "medium",
    targetHours: 60,
    status: "active",
    targetDate: null,
  },
  {
    id: "goal_logistics",
    categoryId: "cat_projects",
    title: "Build a Logistics Platform",
    description:
      "Multi-tenant dispatch, tracking and settlement platform MVP.",
    priority: "critical",
    targetHours: 200,
    status: "active",
    targetDate: null,
  },
  {
    id: "goal_acme",
    categoryId: "cat_client",
    title: "Ship Acme dashboard redesign",
    description: "Analytics redesign, component library and handover docs.",
    priority: "high",
    targetHours: 90,
    status: "active",
    targetDate: null,
  },
  {
    id: "goal_billing",
    categoryId: "cat_job",
    title: "Migrate billing service",
    description:
      "Extract billing from the monolith without downtime or drift.",
    priority: "high",
    targetHours: 140,
    status: "active",
    targetDate: null,
  },
  {
    id: "goal_ops",
    categoryId: "cat_admin",
    title: "Keep the business boring",
    description: "Invoices out weekly, inbox to zero, books reconciled.",
    priority: "low",
    targetHours: 30,
    status: "active",
    targetDate: null,
  },
  {
    id: "goal_reading",
    categoryId: "cat_misc",
    title: "Read 6 systems-design books",
    description: "One book every three weeks with written notes.",
    priority: "low",
    targetHours: 45,
    status: "paused",
    targetDate: null,
  },
  {
    id: "goal_docker",
    categoryId: "cat_learning",
    title: "Learn Docker and CI basics",
    description: "Containerise every project and automate the release path.",
    priority: "medium",
    targetHours: 40,
    status: "completed",
    targetDate: null,
  },
];

interface ItemSeed extends Omit<FocusItem, "createdAt" | "archivedAt"> {
  /** Relative likelihood of being planned on any given day. */
  cadence: number;
}

const ITEM_SEED: ItemSeed[] = [
  {
    id: "item_di",
    goalId: "goal_csharp",
    name: "Dependency injection module",
    notes: "Service lifetimes, scoped vs singleton, keyed services.",
    priority: "high",
    estimatedDailyHours: 1.5,
    status: "in_progress",
    cadence: 0.75,
  },
  {
    id: "item_ef",
    goalId: "goal_csharp",
    name: "EF Core migrations lab",
    notes: "Model-first migrations, seeding, query splitting.",
    priority: "medium",
    estimatedDailyHours: 1,
    status: "in_progress",
    cadence: 0.5,
  },
  {
    id: "item_minimal",
    goalId: "goal_csharp",
    name: "Minimal API auth walkthrough",
    notes: "JWT bearer, refresh rotation, policy-based authorisation.",
    priority: "medium",
    estimatedDailyHours: 1,
    status: "not_started",
    cadence: 0.32,
  },
  {
    id: "item_nav",
    goalId: "goal_rn",
    name: "React Navigation tutorial",
    notes: "Native stack, typed routes, deep linking.",
    priority: "medium",
    estimatedDailyHours: 1,
    status: "in_progress",
    cadence: 0.55,
  },
  {
    id: "item_reanimated",
    goalId: "goal_rn",
    name: "Reanimated gesture playground",
    notes: "Shared values, worklets, bottom-sheet interactions.",
    priority: "low",
    estimatedDailyHours: 0.75,
    status: "not_started",
    cadence: 0.28,
  },
  {
    id: "item_autolayout",
    goalId: "goal_figma",
    name: "Auto layout practice",
    notes: "Rebuild three real product screens with pure auto layout.",
    priority: "medium",
    estimatedDailyHours: 1,
    status: "in_progress",
    cadence: 0.45,
  },
  {
    id: "item_authscreen",
    goalId: "goal_figma",
    name: "Authentication screen design",
    notes: "Sign in, sign up, recovery, error and empty states.",
    priority: "low",
    estimatedDailyHours: 0.75,
    status: "not_started",
    cadence: 0.26,
  },
  {
    id: "item_variables",
    goalId: "goal_figma",
    name: "Design tokens with variables",
    notes: "Colour modes, spacing scale, semantic aliasing.",
    priority: "medium",
    estimatedDailyHours: 1,
    status: "not_started",
    cadence: 0.24,
  },
  {
    id: "item_dispatch",
    goalId: "goal_logistics",
    name: "Dispatch assignment engine",
    notes: "Driver scoring, capacity windows, retry semantics.",
    priority: "critical",
    estimatedDailyHours: 2,
    status: "in_progress",
    cadence: 0.72,
  },
  {
    id: "item_tracking",
    goalId: "goal_logistics",
    name: "Live tracking pipeline",
    notes: "Location ingest, dedupe, websocket fan-out.",
    priority: "high",
    estimatedDailyHours: 1.5,
    status: "in_progress",
    cadence: 0.5,
  },
  {
    id: "item_settlement",
    goalId: "goal_logistics",
    name: "Settlement and payout ledger",
    notes: "Double-entry ledger, payout batching, reconciliation.",
    priority: "high",
    estimatedDailyHours: 1.5,
    status: "blocked",
    cadence: 0.3,
  },
  {
    id: "item_tenant",
    goalId: "goal_logistics",
    name: "Multi-tenant data isolation",
    notes: "Row-level security policies plus integration tests.",
    priority: "high",
    estimatedDailyHours: 1.25,
    status: "not_started",
    cadence: 0.3,
  },
  {
    id: "item_acme_charts",
    goalId: "goal_acme",
    name: "Analytics charts rebuild",
    notes: "Recharts migration, responsive legends, export.",
    priority: "high",
    estimatedDailyHours: 2,
    status: "in_progress",
    cadence: 0.6,
  },
  {
    id: "item_acme_review",
    goalId: "goal_acme",
    name: "Client review and revisions",
    notes: "Weekly walkthrough, feedback triage, changelog.",
    priority: "medium",
    estimatedDailyHours: 1,
    status: "in_progress",
    cadence: 0.35,
  },
  {
    id: "item_acme_handover",
    goalId: "goal_acme",
    name: "Handover documentation",
    notes: "Component docs, deploy runbook, support matrix.",
    priority: "medium",
    estimatedDailyHours: 1,
    status: "not_started",
    cadence: 0.22,
  },
  {
    id: "item_billing_extract",
    goalId: "goal_billing",
    name: "Extract billing domain",
    notes: "Anti-corruption layer, contract tests, feature flags.",
    priority: "high",
    estimatedDailyHours: 2,
    status: "in_progress",
    cadence: 0.68,
  },
  {
    id: "item_billing_backfill",
    goalId: "goal_billing",
    name: "Historical invoice backfill",
    notes: "Idempotent batch job with drift reporting.",
    priority: "medium",
    estimatedDailyHours: 1.5,
    status: "in_progress",
    cadence: 0.4,
  },
  {
    id: "item_billing_oncall",
    goalId: "goal_billing",
    name: "On-call and incident review",
    notes: "Alert tuning, postmortems, runbook updates.",
    priority: "medium",
    estimatedDailyHours: 1,
    status: "in_progress",
    cadence: 0.3,
  },
  {
    id: "item_invoices",
    goalId: "goal_ops",
    name: "Invoicing and expenses",
    notes: "Send invoices, chase receivables, file receipts.",
    priority: "low",
    estimatedDailyHours: 0.5,
    status: "in_progress",
    cadence: 0.42,
  },
  {
    id: "item_inbox",
    goalId: "goal_ops",
    name: "Inbox and scheduling sweep",
    notes: "Triage to zero, confirm next week's calendar.",
    priority: "low",
    estimatedDailyHours: 0.5,
    status: "in_progress",
    cadence: 0.5,
  },
  {
    id: "item_reading",
    goalId: "goal_reading",
    name: "Designing Data-Intensive Applications",
    notes: "One chapter with written notes per sitting.",
    priority: "low",
    estimatedDailyHours: 0.75,
    status: "in_progress",
    cadence: 0.24,
  },
  {
    id: "item_docker",
    goalId: "goal_docker",
    name: "Compose and CI pipeline",
    notes: "Multi-stage builds, cached layers, GitHub Actions.",
    priority: "medium",
    estimatedDailyHours: 1,
    status: "done",
    cadence: 0,
  },
];

const REFLECTIONS_GOOD = [
  "Closed every tab except the editor and the docs — flow arrived in under five minutes.",
  "Wrote the outcome down before starting, so I never had to ask what came next.",
  "Morning slot with headphones on is consistently my best block.",
  "Breaking the task into three checkpoints kept momentum between pauses.",
  "Phone in another room. Zero pull toward it the whole session.",
];

const REFLECTIONS_MIXED = [
  "Good start, but a Slack thread pulled me out around the halfway mark.",
  "Energy dipped after lunch; the last twenty minutes were mostly re-reading.",
  "Ambient noise was rough — noise-cancelling helped but not entirely.",
  "Spent too long choosing an approach instead of writing something and iterating.",
  "Split attention between two files; should have finished one first.",
];

const REFLECTIONS_POOR = [
  "Power cut forced a hard stop; lost the thread completely.",
  "Started without a clear outcome and drifted into reading unrelated docs.",
  "Too many notifications. Focus never actually landed.",
  "Under-slept — comprehension was low, so I stopped early rather than fake it.",
];

const INTENTIONS = [
  "Protect the morning for the hardest thing on the list.",
  "One deep block before anything reactive.",
  "Finish the dispatch engine slice, then everything else.",
  "Fewer contexts today: two projects maximum.",
  "Ship something small and complete instead of starting three things.",
  "",
];

function buildSettings(): Settings {
  return {
    displayName: "Idris",
    dailyTargetHours: 7,
    workdays: [1, 2, 3, 4, 5],
    defaultSessionMinutes: 60,
    theme: "light",
    goalProgressDisplay: "ring",
    sessionIslandPosition: "bottom",
    sessionIslandDisplay: "floating",
    checklistTemplate: DEFAULT_CHECKLIST,
    pauseReasons: DEFAULT_PAUSE_REASONS,
    musicLinks: DEFAULT_MUSIC_LINKS,
  };
}

/**
 * Builds the full demo state: catalogue plus an 8-week planning and session
 * history whose discipline trends upward with a mid-period dip.
 */
export function createSeedState(now: Date = new Date()): FocusState {
  const rng = mulberry32(0x0c7ea1);
  const createdBase = addDays(now, -(HISTORY_DAYS + 14)).toISOString();

  const categories: Category[] = CATEGORY_SEED.map((category) => ({
    ...category,
    createdAt: createdBase,
  }));

  const goals: Goal[] = GOAL_SEED.map((goal) => ({
    ...goal,
    createdAt: createdBase,
  }));

  const focusItems: FocusItem[] = ITEM_SEED.map(({ cadence, ...item }) => ({
    ...item,
    createdAt: createdBase,
    archivedAt: cadence === 0 ? addDays(now, -21).toISOString() : null,
  }));

  const plans: DailyPlan[] = [];
  const sessions: FocusSession[] = [];
  const activeItems = ITEM_SEED.filter((item) => item.cadence > 0);
  const checklistLabels = DEFAULT_CHECKLIST.filter((entry) => entry.enabled);

  for (let offset = HISTORY_DAYS - 1; offset >= 0; offset -= 1) {
    const day = addDays(now, -offset);
    const dateKey = toDateKey(day);
    const weekday = day.getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const isToday = offset === 0;

    // Discipline ramps up over the period, with a slump around weeks 4–5.
    const progressRatio = (HISTORY_DAYS - offset) / HISTORY_DAYS;
    const slump = offset > 14 && offset < 26 ? -0.22 : 0;
    const discipline = Math.min(
      0.96,
      Math.max(0.24, 0.44 + progressRatio * 0.42 + slump),
    );

    // Occasional fully off day keeps streak logic honest.
    if (!isToday && chance(rng, isWeekend ? 0.34 : 0.07)) continue;

    const budget = isWeekend
      ? between(rng, 1.5, 3.5)
      : between(rng, 5.5, 8.5);

    const candidates = activeItems.filter((item) =>
      chance(rng, isWeekend ? item.cadence * 0.5 : item.cadence),
    );
    const chosen = (candidates.length > 0 ? candidates : [activeItems[0]]).slice(
      0,
      isWeekend ? 2 : 4,
    );

    const allocations: PlanAllocation[] = [];
    let remaining = budget;
    for (const item of chosen) {
      if (remaining <= 0.25) break;
      const planned = Math.min(
        remaining,
        Math.max(0.5, Math.round(item.estimatedDailyHours * 4) / 4),
      );
      allocations.push({
        focusItemId: item.id,
        plannedHours: Math.round(planned * 4) / 4,
      });
      remaining -= planned;
    }

    if (allocations.length === 0) continue;

    plans.push({
      date: dateKey,
      allocations,
      intention: pick(rng, INTENTIONS),
    });

    // Sessions for the day: not every allocation gets executed.
    let clockHour = isWeekend ? between(rng, 9.5, 11) : between(rng, 7.75, 9.25);

    for (const allocation of allocations) {
      const executed = chance(rng, discipline);
      if (!executed) continue;

      // Today is partially complete: only slots before "now" exist.
      if (isToday && clockHour > now.getHours() - 0.5) break;

      const attainment = between(
        rng,
        0.45 + discipline * 0.25,
        0.7 + discipline * 0.45,
      );
      const activeMinutes = Math.max(
        12,
        Math.round(allocation.plannedHours * 60 * Math.min(attainment, 1.25)),
      );

      const startedAt = new Date(day);
      startedAt.setHours(
        Math.floor(clockHour),
        Math.round((clockHour % 1) * 60),
        0,
        0,
      );

      const pauses: PauseEvent[] = [];
      let pausedMs = 0;
      const pauseCount = Math.floor(
        between(rng, 0, 1.6 + (1 - discipline) * 3.4),
      );
      let pauseCursor = startedAt.getTime() + activeMinutes * 60_000 * 0.3;

      for (let index = 0; index < pauseCount; index += 1) {
        const reason = pick(
          rng,
          // Low-discipline days skew toward unplanned interruptions.
          chance(rng, discipline * 0.62)
            ? DEFAULT_PAUSE_REASONS.filter((entry) => entry.planned)
            : DEFAULT_PAUSE_REASONS.filter((entry) => !entry.planned),
        );
        const durationMs = Math.round(between(rng, 2, 16)) * 60_000;
        pauses.push({
          id: `pause_${dateKey}_${allocation.focusItemId}_${index}`,
          reasonId: reason.id,
          note: "",
          startedAt: new Date(pauseCursor).toISOString(),
          endedAt: new Date(pauseCursor + durationMs).toISOString(),
        });
        pausedMs += durationMs;
        pauseCursor += durationMs + activeMinutes * 60_000 * 0.25;
      }

      const endedAt = new Date(
        startedAt.getTime() + activeMinutes * 60_000 + pausedMs,
      );

      const abandoned = chance(rng, 0.09 + (1 - discipline) * 0.16);
      const ratingBase = abandoned
        ? between(rng, 1, 3)
        : between(rng, 2.2 + discipline * 2, 3.4 + discipline * 2);
      const rating = Math.max(1, Math.min(5, Math.round(ratingBase)));

      const reflectionPool =
        rating >= 4
          ? REFLECTIONS_GOOD
          : rating === 3
            ? REFLECTIONS_MIXED
            : REFLECTIONS_POOR;

      sessions.push({
        id: `ses_${dateKey}_${allocation.focusItemId}`,
        focusItemId: allocation.focusItemId,
        plannedMinutes: Math.round(allocation.plannedHours * 60),
        startedAt: startedAt.toISOString(),
        endedAt: endedAt.toISOString(),
        pausedMs,
        pausedAt: null,
        status: abandoned ? "abandoned" : "completed",
        pauses,
        checklist: checklistLabels.map((entry) => ({
          id: entry.id,
          label: entry.label,
          checked: chance(rng, 0.6 + discipline * 0.38),
        })),
        productivityRating: rating,
        reflection: chance(rng, 0.72) ? pick(rng, reflectionPool) : "",
      });

      clockHour +=
        (activeMinutes * 60_000 + pausedMs) / 3_600_000 + between(rng, 0.3, 1.4);
    }
  }

  return {
    version: STATE_VERSION,
    settings: buildSettings(),
    categories,
    goals,
    focusItems,
    plans,
    dailySessions: [],
    sessions,
    activeSessionId: null,
  };
}

/** Empty-but-valid state for the "reset all data" path in Settings. */
export function createEmptyState(): FocusState {
  return {
    version: STATE_VERSION,
    settings: buildSettings(),
    categories: [],
    goals: [],
    focusItems: [],
    plans: [],
    dailySessions: [],
    sessions: [],
    activeSessionId: null,
  };
}
