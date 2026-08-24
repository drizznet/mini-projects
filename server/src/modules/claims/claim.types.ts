import type { ExpenseClaim } from "../../types/claim";

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
