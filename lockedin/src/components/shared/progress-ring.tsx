import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * SVG progress ring used by the focus score widget and the live session timer.
 *
 * `value` is 0–1. Colour comes from `color` (a CSS custom property string) so
 * callers can pass a health token and stay inside the design system.
 *
 * @example
 * <ProgressRing value={0.62} color="var(--health-on-track)">62%</ProgressRing>
 */
export function ProgressRing({
  value,
  size = 168,
  strokeWidth = 12,
  color = "var(--primary)",
  trackClassName,
  className,
  children,
  pulse = false,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackClassName?: string;
  className?: string;
  children?: ReactNode;
  pulse?: boolean;
}) {
  const clamped = Math.max(0, Math.min(1, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {pulse ? (
        <span
          className="absolute inset-2 animate-pulse-ring rounded-full"
          style={{
            background: `radial-gradient(circle, color-mix(in oklab, ${color} 22%, transparent), transparent 70%)`,
          }}
        />
      ) : null}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={cn("stroke-secondary", trackClassName)}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          style={{ transition: "stroke-dashoffset 600ms ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        {children}
      </div>
    </div>
  );
}
