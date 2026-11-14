import type {
  Commitment,
  CommitmentStatus,
  CreateCommitmentBody,
} from "@/services/commitments/types";
import type { Goal, GoalStatus } from "@/lib/types";

const API_STATUS_TO_GOAL: Record<CommitmentStatus, GoalStatus> = {
  ongoing: "active",
  paused: "paused",
  completed: "completed",
};

const GOAL_STATUS_TO_API: Record<GoalStatus, CommitmentStatus> = {
  active: "ongoing",
  paused: "paused",
  completed: "completed",
};

/** Map a server commitment into the local focus-store `Goal` shape. */
export function commitmentToGoal(commitment: Commitment): Goal {
  return {
    id: commitment.id,
    categoryId: commitment.categoryId ?? "",
    title: commitment.title,
    description: commitment.description ?? "",
    priority: commitment.priority,
    status: API_STATUS_TO_GOAL[commitment.status],
    targetHours: commitment.targetHours,
    targetDate: commitment.targetDate ?? null,
    workFocusMode: commitment.workFocusMode,
    createdAt: commitment.createdAt,
    startDate: commitment.startDate ?? null,
    commitmentPeriod: commitment.commitmentPeriod ?? undefined,
    dailyCommitmentMinutes: commitment.dailyCommitmentMinutes ?? undefined,
    scheduledCheckInEnabled: commitment.scheduledCheckInEnabled,
    scheduledCheckInTime: commitment.scheduledCheckInTime ?? null,
    strictCheckIn: commitment.strictCheckIn,
  };
}

export function goalStatusToApiStatus(status: GoalStatus): CommitmentStatus {
  return GOAL_STATUS_TO_API[status];
}

/** Map a local goal into the create/update request body. */
export function goalToCommitmentBody(goal: Goal): CreateCommitmentBody {
  return {
    title: goal.title,
    description: goal.description || null,
    categoryId: goal.categoryId || null,
    priority: goal.priority,
    status: goalStatusToApiStatus(goal.status),
    targetHours: goal.targetHours,
    targetDate: goal.targetDate,
    startDate: goal.startDate ?? null,
    commitmentPeriod: goal.commitmentPeriod ?? null,
    dailyCommitmentMinutes: goal.dailyCommitmentMinutes ?? null,
    scheduledCheckInEnabled: goal.scheduledCheckInEnabled ?? false,
    scheduledCheckInTime: goal.scheduledCheckInTime ?? null,
    strictCheckIn: goal.strictCheckIn ?? false,
    workFocusMode: goal.workFocusMode ?? "flexible",
  };
}
