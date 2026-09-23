import type { HealthLevel, Priority } from "./types";

/**
 * Adaptive colour system.
 *
 * The dashboard changes colour with performance, so every widget resolves its
 * palette from a single score → band mapping instead of hardcoding classes.
 * Add new surfaces by extending `HEALTH_STYLES`, never by inlining colours.
 */
export interface HealthStyle {
  level: HealthLevel;
  label: string;
  /** Text colour class. */
  text: string;
  /** Tinted background for pills and stat tiles. */
  bg: string;
  /** Border colour matched to the band. */
  border: string;
  /** Solid fill for progress bars and rings. */
  fill: string;
  /** CSS custom property, for Recharts and inline gradients. */
  cssVar: string;
}

export const HEALTH_STYLES: Record<HealthLevel, HealthStyle> = {
  excellent: {
    level: "excellent",
    label: "Excellent",
    text: "text-health-excellent",
    bg: "bg-health-excellent/12",
    border: "border-health-excellent/30",
    fill: "bg-health-excellent",
    cssVar: "var(--health-excellent)",
  },
  "on-track": {
    level: "on-track",
    label: "On track",
    text: "text-health-on-track",
    bg: "bg-health-on-track/12",
    border: "border-health-on-track/30",
    fill: "bg-health-on-track",
    cssVar: "var(--health-on-track)",
  },
  slipping: {
    level: "slipping",
    label: "Slightly behind",
    text: "text-health-slipping",
    bg: "bg-health-slipping/12",
    border: "border-health-slipping/30",
    fill: "bg-health-slipping",
    cssVar: "var(--health-slipping)",
  },
  behind: {
    level: "behind",
    label: "Falling behind",
    text: "text-health-behind",
    bg: "bg-health-behind/12",
    border: "border-health-behind/30",
    fill: "bg-health-behind",
    cssVar: "var(--health-behind)",
  },
  critical: {
    level: "critical",
    label: "Significantly behind",
    text: "text-health-critical",
    bg: "bg-health-critical/12",
    border: "border-health-critical/30",
    fill: "bg-health-critical",
    cssVar: "var(--health-critical)",
  },
};

/** Maps a 0–100 score to a health band. */
export function healthLevelFromScore(score: number): HealthLevel {
  if (score >= 85) return "excellent";
  if (score >= 70) return "on-track";
  if (score >= 55) return "slipping";
  if (score >= 40) return "behind";
  return "critical";
}

export function healthFromScore(score: number): HealthStyle {
  return HEALTH_STYLES[healthLevelFromScore(score)];
}

/** Ratio-based variant (progress vs. target) reusing the same bands. */
export function healthFromRatio(ratio: number): HealthStyle {
  return healthFromScore(Math.min(100, ratio * 100));
}

export const PRIORITY_META: Record<
  Priority,
  { label: string; weight: number; text: string; bg: string; border: string }
> = {
  critical: {
    label: "Critical",
    weight: 4,
    text: "text-health-critical",
    bg: "bg-health-critical/12",
    border: "border-health-critical/30",
  },
  high: {
    label: "High",
    weight: 3,
    text: "text-health-behind",
    bg: "bg-health-behind/12",
    border: "border-health-behind/30",
  },
  medium: {
    label: "Medium",
    weight: 2,
    text: "text-health-on-track",
    bg: "bg-health-on-track/12",
    border: "border-health-on-track/30",
  },
  low: {
    label: "Low",
    weight: 1,
    text: "text-muted-foreground",
    bg: "bg-muted",
    border: "border-border",
  },
};

export const CHART_COLOR_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
] as const;

/** Resolves a category colour token to a CSS variable for Recharts. */
export function colorTokenVar(token: string): string {
  return `var(--${token})`;
}
