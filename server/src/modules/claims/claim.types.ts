/**
 * Claim shapes (in-memory until a Prisma `claims` table exists).
 */
export type ClaimStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected";

export interface ExpenseClaim {
  id: string;
  employee: string;
  amount: number;
  currency: string;
  category: string;
  status: ClaimStatus;
  submittedAt: string;
  notes?: string;
}

export interface CreateClaimBody {
  employee: string;
  /** @minimum 0.01 */
  amount: number;
  /**
   * ISO 4217 currency code
   * @minLength 3
   * @maxLength 3
   * @default "USD"
   */
  currency?: string;
  category: string;
  notes?: string;
}

export interface ClaimListResponse {
  data: ExpenseClaim[];
  meta: { page: number; total: number };
}

export interface ClaimResponse {
  data: ExpenseClaim;
}

export interface PendingApprovalsResponse {
  data: ExpenseClaim[];
  meta: { total: number };
}

export interface ApprovalDecisionBody {
  decision: "approved" | "rejected";
  note?: string;
}
