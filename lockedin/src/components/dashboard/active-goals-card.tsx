"use client";

import Link from "next/link";
import { Target } from "lucide-react";

import { CategoryDot, PriorityBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { GoalProgress } from "@/lib/analytics";
import { healthFromRatio } from "@/lib/health";
import { formatHours, percent } from "@/lib/utils";

/** Active goals ranked by progress, with hours logged against target. */
export function ActiveGoalsCard({ goals }: { goals: GoalProgress[] }) {
  const active = goals.filter((goal) => goal.status === "active").slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Active goals</CardTitle>
          <CardDescription>Hours logged against target hours</CardDescription>
        </div>
        <Button size="sm" variant="ghost" asChild>
          <Link href="/goals">View all</Link>
        </Button>
      </CardHeader>

      <CardContent>
        {active.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No active goals"
            description="Goals give your sessions a destination. Create one to start tracking long-term progress."
            action={
              <Button size="sm" asChild>
                <Link href="/goals">Create a goal</Link>
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
                  <Progress
                    value={goal.progress * 100}
                    className="h-1.5"
                    indicatorClassName={health.fill}
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
