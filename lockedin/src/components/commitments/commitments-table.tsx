"use client";

import { useMemo } from "react";

import {
  createCommitmentsColumns,
  type CommitmentTableRow,
  type CommitmentsColumnsContext,
} from "@/components/commitments/commitments-columns";
import { DataTable } from "@/components/ui/data-table";
import type { GoalProgress } from "@/lib/analytics";
import { itemsForGoal, planForDate } from "@/lib/selectors";
import { isPlanFailed } from "@/lib/plan-result";
import type { Goal } from "@/lib/types";
import { formatRelativeDay, toDateKey } from "@/lib/utils";

type CommitmentsTableProps = CommitmentsColumnsContext & {
  goals: Goal[];
  progressById: Map<string, GoalProgress>;
  todayKey: string;
};

export function CommitmentsTable({
  goals,
  progressById,
  todayKey,
  state,
  actions,
}: CommitmentsTableProps) {
  const columns = useMemo(
    () => createCommitmentsColumns({ state, actions }),
    [state, actions],
  );

  const data = useMemo<CommitmentTableRow[]>(() => {
    return goals.map((goal) => {
      const progress = progressById.get(goal.id);
      const items = itemsForGoal(state, goal.id);
      const category = state.categories.find(
        (entry) => entry.id === goal.categoryId,
      );
      const todayPlan = planForDate(state, todayKey);
      const todayWorkItem = todayPlan?.allocations.find((allocation) =>
        items.some((item) => item.id === allocation.focusItemId),
      );
      const focusItem =
        items.find((item) => item.id === todayWorkItem?.focusItemId) ??
        items[0];

      return {
        goal,
        categoryName: category?.name ?? "Uncategorised",
        categoryColor: category
          ? `var(--${category.color})`
          : "var(--chart-1)",
        progress,
        itemCount: items.length,
        lastTouchedLabel: progress?.lastSessionAt
          ? formatRelativeDay(toDateKey(progress.lastSessionAt)).toLowerCase()
          : null,
        hasTodayWorkItem: Boolean(todayWorkItem),
        todayFocusItemId: focusItem?.id ?? null,
        failed: isPlanFailed(goal, progress?.loggedHours ?? 0, todayKey),
      };
    });
  }, [goals, progressById, state, todayKey]);

  return <DataTable columns={columns} data={data} />;
}
