"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";

import { CommitmentRowActions } from "@/components/commitments/commitment-row-actions";
import {
  CategoryDot,
  GoalStatusBadge,
  PriorityBadge,
} from "@/components/shared/badges";
import { Progress } from "@/components/ui/progress";
import type { GoalProgress } from "@/lib/analytics";
import { healthFromRatio } from "@/lib/health";
import type { FocusStoreValue } from "@/lib/store/focus-store";
import type { FocusState, Goal } from "@/lib/types";
import { formatHours, percent } from "@/lib/utils";

export type CommitmentTableRow = {
  goal: Goal;
  categoryName: string;
  categoryColor: string;
  progress: GoalProgress | undefined;
  itemCount: number;
  lastTouchedLabel: string | null;
  hasTodayWorkItem: boolean;
  todayFocusItemId: string | null;
  failed: boolean;
};

export type CommitmentsColumnsContext = {
  state: FocusState;
  actions: FocusStoreValue["actions"];
};

export function createCommitmentsColumns(
  ctx: CommitmentsColumnsContext,
): ColumnDef<CommitmentTableRow>[] {
  return [
    {
      id: "commitment",
      header: "Plan",
      cell: ({ row }) => {
        const { goal, categoryName, categoryColor } = row.original;
        return (
          <div className="min-w-[12rem] max-w-xs space-y-0.5">
            <Link
              href={`/plans/${goal.id}`}
              className="font-medium text-foreground hover:text-primary"
            >
              {goal.title}
            </Link>
            {goal.description ? (
              <p className="line-clamp-1 text-xs text-muted-foreground">
                {goal.description}
              </p>
            ) : null}
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <CategoryDot color={categoryColor} />
              {categoryName}
            </p>
          </div>
        );
      },
    },
    {
      id: "priority",
      header: "Priority",
      cell: ({ row }) => <PriorityBadge priority={row.original.goal.priority} />,
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.failed ? (
          <span className="text-xs font-medium text-health-critical">Failed</span>
        ) : (
          <GoalStatusBadge status={row.original.goal.status} />
        ),
    },
    {
      id: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const ratio = row.original.progress?.progress ?? 0;
        const health = healthFromRatio(ratio);
        return (
          <div className="min-w-[8rem] space-y-1.5">
            <Progress
              value={ratio * 100}
              className="h-1.5"
              indicatorClassName={health.fill}
            />
            <span className={`tabular text-xs font-medium ${health.text}`}>
              {percent(ratio)}
            </span>
          </div>
        );
      },
    },
    {
      id: "hours",
      header: "Hours",
      cell: ({ row }) => {
        const logged = row.original.progress?.loggedHours ?? 0;
        const target = row.original.goal.targetHours;
        return (
          <span className="tabular text-sm text-muted-foreground">
            {formatHours(logged)}
            <span className="text-muted-foreground/60"> / </span>
            {formatHours(target)}
          </span>
        );
      },
    },
    {
      id: "workItems",
      header: "Work items",
      cell: ({ row }) => (
        <span className="tabular text-sm text-muted-foreground">
          {row.original.itemCount}
        </span>
      ),
    },
    {
      id: "lastTouched",
      header: "Last touched",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.lastTouchedLabel ?? "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const {
          goal,
          itemCount,
          hasTodayWorkItem,
          todayFocusItemId,
          failed,
        } = row.original;
        return (
          <CommitmentRowActions
            goal={goal}
            state={ctx.state}
            actions={ctx.actions}
            itemCount={itemCount}
            hasTodayWorkItem={hasTodayWorkItem}
            todayFocusItemId={todayFocusItemId}
            failed={failed}
          />
        );
      },
    },
  ];
}
