import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ErrorRecord = Record<string, unknown>;

function isErrorRecord(value: unknown): value is ErrorRecord {
  return typeof value === "object" && value !== null;
}

/** Extracts the user-facing message from common API and Axios error shapes. */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (typeof error === "string" && error.trim()) return error;

  const response = isErrorRecord(error) ? error.response : undefined;
  const responseData = isErrorRecord(response) ? response.data : undefined;
  const payload = isErrorRecord(responseData)
    ? responseData
    : isErrorRecord(error)
      ? error
      : undefined;

  const errorValue = payload?.error;
  if (typeof errorValue === "string" && errorValue.trim()) return errorValue;
  if (isErrorRecord(errorValue) && typeof errorValue.message === "string") {
    return errorValue.message;
  }

  const message = payload?.message;
  if (typeof message === "string" && message.trim()) return message;
  if (Array.isArray(message)) {
    const messages = message.filter(
      (value): value is string => typeof value === "string" && value.trim().length > 0,
    );
    if (messages.length) return messages.join(". ");
  }

  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}

/** Stable id generator — crypto when available, counter fallback for SSR. */
let idCounter = 0;
export function createId(prefix = "id"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
  }
  idCounter += 1;
  return `${prefix}_${idCounter.toString(36)}`;
}

/** Local (not UTC) `YYYY-MM-DD` key — analytics group by the user's own day. */
export function toDateKey(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${value.getFullYear()}-${month}-${day}`;
}

export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Inclusive list of day keys between two dates. */
export function dateKeyRange(from: Date, to: Date): string[] {
  const keys: string[] = [];
  let cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  while (cursor <= end) {
    keys.push(toDateKey(cursor));
    cursor = addDays(cursor, 1);
  }
  return keys;
}

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

export function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** `2h 45m` / `45m` / `12s` — compact duration for cards and tables. */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${totalSeconds}s`;
}

/** `01:24:35` — monospaced clock for the live session timer. */
export function formatClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}

export function formatHours(hours: number): string {
  if (hours === 0) return "0h";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  const whole = Math.floor(hours);
  const minutes = Math.round((hours - whole) * 60);
  return minutes === 0 ? `${whole}h` : `${whole}h ${minutes}m`;
}

export function formatDayLabel(key: string): string {
  return fromDateKey(key).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatShortDay(key: string): string {
  return fromDateKey(key).toLocaleDateString(undefined, { weekday: "short" });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatRelativeDay(key: string): string {
  const today = toDateKey(new Date());
  const yesterday = toDateKey(addDays(new Date(), -1));
  if (key === today) return "Today";
  if (key === yesterday) return "Yesterday";
  return formatDayLabel(key);
}

export function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function groupBy<T, K extends string>(
  items: T[],
  key: (item: T) => K,
): Record<K, T[]> {
  return items.reduce(
    (acc, item) => {
      const group = key(item);
      (acc[group] ??= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
}
