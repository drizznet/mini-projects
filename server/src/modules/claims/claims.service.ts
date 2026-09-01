import { AppError } from "../../errors";
import { claimsStore, type ClaimsStore } from "./claims.store";
import type {
  ApprovalDecisionBody,
  ClaimListResponse,
  ClaimResponse,
  CreateClaimBody,
  PendingApprovalsResponse,
} from "./claim.types";

export class ClaimsService {
  constructor(private readonly store: ClaimsStore) {}

  listClaims(): ClaimListResponse {
    return {
      data: this.store.items,
      meta: { page: 1, total: this.store.items.length },
    };
  }

  getClaim(id: string): ClaimResponse {
    const claim = this.store.items.find((item) => item.id === id);
    if (!claim) {
      throw new AppError(404, "Claim not found");
    }
    return { data: claim };
  }

  createClaim(body: CreateClaimBody): ClaimResponse {
    const claim = {
      id: this.store.nextId(),
      employee: body.employee,
      amount: body.amount,
      currency: (body.currency ?? "USD").toUpperCase(),
      category: body.category,
      notes: body.notes,
      status: "pending_approval" as const,
      submittedAt: new Date().toISOString(),
    };

    this.store.items.unshift(claim);
    return { data: claim };
  }

  listPendingApprovals(): PendingApprovalsResponse {
    const pending = this.store.items.filter(
      (claim) => claim.status === "pending_approval",
    );
    return {
      data: pending,
      meta: { total: pending.length },
    };
  }

  decideApproval(id: string, body: ApprovalDecisionBody): ClaimResponse {
    const claim = this.store.items.find((item) => item.id === id);
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
}

export const claimsService = new ClaimsService(claimsStore);
