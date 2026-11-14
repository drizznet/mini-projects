"use client";

import Link from "next/link";
import { BadgeCheck } from "lucide-react";

import { CategoryDot, PriorityBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { ProgressDisplay } from "@/components/shared/progress-display";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { GoalProgress } from "@/lib/analytics";
import { healthFromRatio } from "@/lib/health";
import { formatHours, percent } from "@/lib/utils";

/** Active plans ranked by progress, with hours logged against target. */
export function ActiveCommitmentsCard({ goals }: { goals: GoalProgress[] }) {
  const active = goals.filter((goal) => goal.status === "active").slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Active plans</CardTitle>
          <CardDescription>Hours logged against target hours</CardDescription>
        </div>
        <Button size="sm" variant="ghost" asChild>
          <Link href="/plans">View all plans</Link>
        </Button>
      </CardHeader>

      <CardContent>
        {active.length === 0 ? (
          <EmptyState
            icon={BadgeCheck}
            title="No active plans"
            description="Plans give your sessions a destination. Create one to start tracking progress."
            action={
              <Button size="sm" asChild>
                <Link href="/plans">New plan</Link>
              </Button>
            }
          />
        ) : (
          <ul className="space-y-4">
            {active.map((goal) => {
              const health = healthFromRatio(goal.progress);
              return (
                <li key={goal.goalId} className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <CategoryDot color={goal.color} />
                        {goal.categoryName}
                      </p>
                      <p className="truncate text-sm font-medium">{goal.title}</p>
                    </div>
                    <PriorityBadge priority={goal.priority} />
                  </div>
                  <ProgressDisplay
                    value={goal.progress}
                    className="h-1.5"
                    barClassName={health.fill}
                    color={health.cssVar}
                  />
                  <div className="flex items-baseline justify-between text-[11px] text-muted-foreground">
                    <span className="tabular">
                      {formatHours(goal.loggedHours)} of{" "}
                      {formatHours(goal.targetHours)}
                    </span>
                    <span className="tabular font-medium text-foreground">
                      {percent(goal.progress)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
