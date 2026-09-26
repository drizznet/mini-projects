"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";

import { CategoryDot, PriorityBadge } from "@/components/shared/badges";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import type { Recommendation } from "@/lib/recommend";

/**
 * "What should I focus on next?" widget.
 *
 * The leading recommendation gets the primary CTA; runners-up are listed so the
 * suggestion never feels like a black box the user cannot argue with.
 */
export function RecommendationCard({
  recommendations,
  compact = false,
}: {
  recommendations: Recommendation[];
  compact?: boolean;
}) {
  const [top, ...rest] = recommendations;
  const extras = compact ? rest.slice(0, 2) : rest;

  return (
    <Card className="h-full min-h-0 overflow-hidden border-primary/10 bg-card-elevated/60 shadow-sm">
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-1.5">
            <Wand2 className="size-3.5 text-primary" />
            What should I focus on next?
          </CardTitle>
          {compact ? null : (
            <CardDescription>
              Ranked by remaining budget, priority, goal progress and staleness
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 space-y-4 overflow-y-auto">
        {!top ? (
          <EmptyState
            icon={Sparkles}
            title="Nothing to recommend yet"
            description="Create a goal with at least one focus item and the engine will start ranking your work."
            action={
              <Button size="sm" variant="subtle" asChild>
                <Link href="/goals">Create a goal</Link>
              </Button>
            }
          />
        ) : (
          <>
            <div className="rounded-xl border border-primary/25 bg-primary/6 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <CategoryDot color={top.categoryColor} />
                    {top.categoryName} · {top.goalTitle}
                  </p>
                  <p className="truncate text-sm font-semibold">
                    {top.item.name}
                  </p>
                </div>
                <PriorityBadge priority={top.item.priority} />
              </div>

              <ul className="mt-3 space-y-1">
                {(compact ? top.reasons.slice(0, 2) : top.reasons).map(
                  (reason) => (
                    <li
                      key={reason}
                      className="flex items-start gap-1.5 text-xs text-muted-foreground"
                    >
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/70" />
                      {reason}
                    </li>
                  ),
                )}
              </ul>

              <div className="mt-4 flex items-center gap-2">
                <Button size="sm" variant="subtle" asChild>
                  <Link
                    href={`/focus?item=${top.item.id}&minutes=${top.suggestedMinutes}`}
                  >
                    Focus for {top.suggestedMinutes} min
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
                {compact ? null : (
                  <span className="text-[11px] text-muted-foreground">
                    match score {Math.round(top.score * 100)}
                  </span>
                )}
              </div>
            </div>

            {extras.length > 0 ? (
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                  Also worth your attention
                </p>
                {extras.map((entry) => (
                  <Link
                    key={entry.item.id}
                    href={`/focus?item=${entry.item.id}&minutes=${entry.suggestedMinutes}`}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-secondary/60"
                  >
                    <CategoryDot color={entry.categoryColor} />
                    <span className="min-w-0 flex-1 truncate text-xs">
                      {entry.item.name}
                    </span>
                    <span className="tabular text-[11px] text-muted-foreground">
                      {entry.suggestedMinutes}m
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
