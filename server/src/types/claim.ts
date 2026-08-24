/**
 * Claim row shape. In-memory until a `claims` table exists in Prisma.
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
