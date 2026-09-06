import type {
  ChecklistTemplateItem,
  FocusItemStatus,
  GoalStatus,
  MusicLink,
  PauseReasonOption,
  Priority,
} from "./types";

export const STORAGE_KEY = "lockin:state";
export const LEGACY_STORAGE_KEYS = ["proactive:state", "focus-os:state"] as const;
export const STATE_VERSION = 1;

export const PRIORITIES: Priority[] = ["critical", "high", "medium", "low"];

export const GOAL_STATUSES: GoalStatus[] = ["active", "paused", "completed"];

export const FOCUS_ITEM_STATUSES: FocusItemStatus[] = [
  "not_started",
  "in_progress",
  "blocked",
  "done",
];

export const FOCUS_ITEM_STATUS_LABEL: Record<FocusItemStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  blocked: "Blocked",
  done: "Done",
};

export const GOAL_STATUS_LABEL: Record<GoalStatus, string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
};

export const DEFAULT_CHECKLIST: ChecklistTemplateItem[] = [
  { id: "chk_internet", label: "Internet is stable", enabled: true },
  { id: "chk_power", label: "Power source available", enabled: true },
  { id: "chk_workspace", label: "Workspace cleared", enabled: true },
  { id: "chk_water", label: "Water within reach", enabled: true },
  { id: "chk_phone", label: "Phone on silent, face down", enabled: true },
  { id: "chk_headphones", label: "Headphones connected", enabled: true },
  { id: "chk_tabs", label: "Distracting tabs closed", enabled: false },
  { id: "chk_outcome", label: "Session outcome written down", enabled: false },
];

export const DEFAULT_PAUSE_REASONS: PauseReasonOption[] = [
  { id: "pause_break", label: "Planned break", planned: true },
  { id: "pause_food", label: "Food / drink", planned: true },
  { id: "pause_meeting", label: "Meeting", planned: true },
  { id: "pause_phone", label: "Phone distraction", planned: false },
  { id: "pause_social", label: "Social media", planned: false },
  { id: "pause_internet", label: "Internet issue", planned: false },
  { id: "pause_power", label: "Power issue", planned: false },
  { id: "pause_switch", label: "Context switch", planned: false },
  { id: "pause_other", label: "Other", planned: false },
];

export const DEFAULT_MUSIC_LINKS: MusicLink[] = [
  {
    id: "music_lofi",
    label: "Lofi Deep Focus",
    url: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ",
  },
  {
    id: "music_brain",
    label: "Brain Food",
    url: "https://open.spotify.com/playlist/37i9dQZF1DWXLeA8Omikj7",
  },
  {
    id: "music_ambient",
    label: "Ambient Relaxation",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY",
  },
];

export const SESSION_PRESETS = [25, 45, 60, 90, 120] as const;

export const MOTIVATION_QUOTES = [
  "Attention is the rarest and purest form of generosity.",
  "You do not rise to the level of your goals. You fall to the level of your systems.",
  "Deep work is the ability to focus without distraction on a cognitively demanding task.",
  "Where attention goes, energy flows and results show.",
  "The successful warrior is the average person with laser-like focus.",
  "Starve your distractions, feed your focus.",
  "Concentration is the secret of strength.",
  "Slow is smooth, smooth is fast.",
  "Nothing will work unless you do.",
  "One session, done well, beats a week of half-attention.",
] as const;

/** Score weights — see `computeFocusScore`. Must sum to 1. */
export const SCORE_WEIGHTS = {
  adherence: 0.4,
  completion: 0.25,
  consistency: 0.15,
  distraction: 0.2,
} as const;

export const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const WEEKDAY_SHORT = ["S", "M", "T", "W", "T", "F", "S"] as const;
