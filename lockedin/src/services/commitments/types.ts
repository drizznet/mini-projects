/** API contract for `/api/lockedin/commitments` (matches server `commitment.types.ts`). */

export type CommitmentPriority = "critical" | "high" | "medium" | "low";
export type CommitmentStatus = "ongoing" | "paused" | "completed";
export type CommitmentPeriod = "3d" | "1w" | "1m";
export type WorkFocusMode = "continuous" | "flexible";

export interface Commitment {
  id: string;
  categoryId?: string | null;
  title: string;
  description?: string | null;
  priority: CommitmentPriority;
  status: CommitmentStatus;
  targetHours: number;
  targetDate?: string | null;
  startDate?: string | null;
  commitmentPeriod?: CommitmentPeriod | null;
  dailyCommitmentMinutes?: number | null;
  scheduledCheckInEnabled: boolean;
  scheduledCheckInTime?: string | null;
  strictCheckIn: boolean;
  workFocusMode: WorkFocusMode;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommitmentBody {
  title: string;
  description?: string | null;
  categoryId?: string | null;
  priority?: CommitmentPriority;
  status?: CommitmentStatus;
  targetHours?: number;
  targetDate?: string | null;
  startDate?: string | null;
  commitmentPeriod?: CommitmentPeriod | null;
  dailyCommitmentMinutes?: number | null;
  scheduledCheckInEnabled?: boolean;
  scheduledCheckInTime?: string | null;
  strictCheckIn?: boolean;
  workFocusMode?: WorkFocusMode;
}

export type UpdateCommitmentBody = Partial<CreateCommitmentBody>;

export interface CommitmentResponse {
  data: Commitment;
}

export interface CommitmentListResponse {
  data: Commitment[];
  meta: { total: number };
}
