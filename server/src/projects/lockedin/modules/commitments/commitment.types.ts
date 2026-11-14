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
  /** @minLength 1 @maxLength 200 */
  title: string;
  /** @maxLength 2000 */
  description?: string | null;
  categoryId?: string | null;
  priority?: CommitmentPriority;
  status?: CommitmentStatus;
  /** @minimum 0 */
  targetHours?: number;
  targetDate?: string | null;
  startDate?: string | null;
  commitmentPeriod?: CommitmentPeriod | null;
  /** @minimum 1 */
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

export interface CommitmentListQuery {
  status?: CommitmentStatus;
  priority?: CommitmentPriority;
}
