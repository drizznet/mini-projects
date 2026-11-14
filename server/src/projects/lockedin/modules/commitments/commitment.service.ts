import { AppError } from "../../../../errors";
import {
  commitmentRepository,
  type CommitmentRepository,
} from "./commitment.repository";
import type {
  Commitment,
  CommitmentListResponse,
  CommitmentListQuery,
  CommitmentResponse,
  CreateCommitmentBody,
  UpdateCommitmentBody,
} from "./commitment.types";

function normalizeInput(body: CreateCommitmentBody): Omit<Commitment, "id" | "createdAt" | "updatedAt"> {
  const title = body.title.trim();
  if (!title) throw new AppError(400, "Title is required");
  if (body.targetHours !== undefined && body.targetHours < 0) {
    throw new AppError(400, "Target hours cannot be negative");
  }
  if (body.dailyCommitmentMinutes !== undefined && body.dailyCommitmentMinutes !== null && body.dailyCommitmentMinutes < 1) {
    throw new AppError(400, "Daily commitment must be at least one minute");
  }

  return {
    title,
    description: body.description?.trim() || null,
    categoryId: body.categoryId ?? null,
    priority: body.priority ?? "medium",
    status: body.status ?? "ongoing",
    targetHours: body.targetHours ?? 0,
    targetDate: body.targetDate ?? null,
    startDate: body.startDate ?? null,
    commitmentPeriod: body.commitmentPeriod ?? null,
    dailyCommitmentMinutes: body.dailyCommitmentMinutes ?? null,
    scheduledCheckInEnabled: body.scheduledCheckInEnabled ?? false,
    scheduledCheckInTime: body.scheduledCheckInTime ?? null,
    strictCheckIn: body.strictCheckIn ?? false,
    workFocusMode: body.workFocusMode ?? "flexible",
  };
}

export class CommitmentService {
  constructor(private readonly repository: CommitmentRepository) {}

  async list(
    email: string,
    query: CommitmentListQuery = {},
  ): Promise<CommitmentListResponse> {
    const data = await this.repository.listForUser(email, query);
    return { data, meta: { total: data.length } };
  }

  async get(email: string, id: string): Promise<CommitmentResponse> {
    const data = await this.repository.findForUser(email, id);
    if (!data) throw new AppError(404, "Commitment not found");
    return { data };
  }

  async create(email: string, body: CreateCommitmentBody): Promise<CommitmentResponse> {
    const data = await this.repository.createForUser(email, normalizeInput(body));
    return { data };
  }

  async update(email: string, id: string, body: UpdateCommitmentBody): Promise<CommitmentResponse> {
    const existing = await this.repository.findForUser(email, id);
    if (!existing) throw new AppError(404, "Commitment not found");
    const data = await this.repository.updateForUser(email, id, normalizeInput({ ...existing, ...body }));
    if (!data) throw new AppError(404, "Commitment not found");
    return { data };
  }

  async delete(email: string, id: string): Promise<void> {
    if (!(await this.repository.deleteForUser(email, id))) {
      throw new AppError(404, "Commitment not found");
    }
  }
}

export const commitmentService = new CommitmentService(commitmentRepository);
