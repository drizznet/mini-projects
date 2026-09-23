"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Productivity rating display or input.
 *
 * Pass `onChange` to make it interactive (session reflection); omit it for a
 * read-only rendering in lists and tables.
 */
export function RatingStars({
  value,
  onChange,
  size = "sm",
  className,
}: {
  value: number | null;
  onChange?: (value: number) => void;
  size?: "sm" | "lg";
  className?: string;
}) {
  const interactive = typeof onChange === "function";
  const starSize = size === "lg" ? "size-7" : "size-3.5";

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role={interactive ? "radiogroup" : undefined}
      aria-label={interactive ? "Productivity rating" : undefined}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (value ?? 0) >= star;
        const content = (
          <Star
            className={cn(
              starSize,
              filled
                ? "fill-health-slipping text-health-slipping"
                : "text-muted-foreground/40",
            )}
          />
        );

        return interactive ? (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            onClick={() => onChange?.(star)}
            className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {content}
          </button>
        ) : (
          <span key={star}>{content}</span>
        );
      })}
    </div>
  );
}
