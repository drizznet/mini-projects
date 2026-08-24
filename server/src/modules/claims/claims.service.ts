import { AppError } from "../../errors";
import { claims, nextClaimId } from "./claims.store";
import type {
  ApprovalDecisionBody,
  ClaimListResponse,
  ClaimResponse,
  CreateClaimBody,
  PendingApprovalsResponse,
} from "./claim.types";

export function listClaims(): ClaimListResponse {
  return {
    data: claims,
    meta: { page: 1, total: claims.length },
  };
}

export function getClaim(id: string): ClaimResponse {
  const claim = claims.find((item) => item.id === id);
  if (!claim) {
    throw new AppError(404, "Claim not found");
  }
  return { data: claim };
}

export function createClaim(body: CreateClaimBody): ClaimResponse {
  const claim = {
    id: nextClaimId(),
    employee: body.employee,
    amount: body.amount,
    currency: (body.currency ?? "USD").toUpperCase(),
    category: body.category,
    notes: body.notes,
    status: "pending_approval" as const,
    submittedAt: new Date().toISOString(),
  };

  claims.unshift(claim);
  return { data: claim };
}

export function listPendingApprovals(): PendingApprovalsResponse {
  const pending = claims.filter((claim) => claim.status === "pending_approval");
  return {
    data: pending,
    meta: { total: pending.length },
  };
}

export function decideApproval(
  id: string,
  body: ApprovalDecisionBody,
): ClaimResponse {
  const claim = claims.find((item) => item.id === id);
  if (!claim) {
    throw new AppError(404, "Claim not found");
  }
  if (claim.status !== "pending_approval") {
    throw new AppError(409, "Claim is not pending approval");
  }

  claim.status = body.decision;
  if (body.note) {
    claim.notes = body.note;
  }

  return { data: claim };
}
