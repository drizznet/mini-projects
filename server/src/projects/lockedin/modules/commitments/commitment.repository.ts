import {
  CommitmentPeriod as PrismaCommitmentPeriod,
  type Commitment as PrismaCommitment,
} from "../../../../generated/prisma/client";
import { prisma } from "../../../../db/prisma";
import type {
  Commitment,
  CommitmentListQuery,
} from "./commitment.types";

type CommitmentInput = Omit<
  Commitment,
  "id" | "createdAt" | "updatedAt"
>;

const periodToDatabase = {
  "3d": PrismaCommitmentPeriod.THREE_D,
  "1w": PrismaCommitmentPeriod.ONE_W,
  "1m": PrismaCommitmentPeriod.ONE_M,
} as const;

const periodFromDatabase = {
  THREE_D: "3d",
  ONE_W: "1w",
  ONE_M: "1m",
} as const;

function mapCommitment(row: PrismaCommitment): Commitment {
  return {
    id: row.id,
    categoryId: row.categoryId,
    title: row.title,
    description: row.description,
    priority: row.priority as Commitment["priority"],
    status: row.status as Commitment["status"],
    targetHours: row.targetHours,
    targetDate: row.targetDate,
    startDate: row.startDate,
    commitmentPeriod: row.commitmentPeriod
      ? periodFromDatabase[row.commitmentPeriod]
      : null,
    dailyCommitmentMinutes: row.dailyCommitmentMinutes,
    scheduledCheckInEnabled: row.scheduledCheckInEnabled,
    scheduledCheckInTime: row.scheduledCheckInTime,
    strictCheckIn: row.strictCheckIn,
    workFocusMode: row.workFocusMode as Commitment["workFocusMode"],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export class CommitmentRepository {
  private async userIdForEmail(email: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return user?.id ?? null;
  }

  async listForUser(
    email: string,
    filter: CommitmentListQuery = {},
  ): Promise<Commitment[]> {
    const userId = await this.userIdForEmail(email);
    if (!userId) return [];
    const rows = await prisma.commitment.findMany({
      where: {
        userId,
        ...(filter.status ? { status: filter.status } : {}),
        ...(filter.priority ? { priority: filter.priority } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapCommitment);
  }

  async findForUser(email: string, id: string): Promise<Commitment | null> {
    const userId = await this.userIdForEmail(email);
    if (!userId) return null;
    const row = await prisma.commitment.findFirst({ where: { id, userId } });
    return row ? mapCommitment(row) : null;
  }

  async createForUser(email: string, input: CommitmentInput): Promise<Commitment> {
    const userId = await this.userIdForEmail(email);
    if (!userId) throw new Error("Authenticated user not found");
    const row = await prisma.commitment.create({
      data: {
        ...input,
        commitmentPeriod: input.commitmentPeriod
          ? periodToDatabase[input.commitmentPeriod]
          : null,
        userId,
      },
    });
    return mapCommitment(row);
  }

  async updateForUser(
    email: string,
    id: string,
    input: Partial<CommitmentInput>,
  ): Promise<Commitment | null> {
    const userId = await this.userIdForEmail(email);
    if (!userId) return null;
    const existing = await prisma.commitment.findFirst({ where: { id, userId } });
    if (!existing) return null;
    const row = await prisma.commitment.update({
      where: { id },
      data: {
        ...input,
        ...(input.commitmentPeriod !== undefined
          ? {
              commitmentPeriod: input.commitmentPeriod
                ? periodToDatabase[input.commitmentPeriod]
                : null,
            }
          : {}),
      },
    });
    return mapCommitment(row);
  }

  async deleteForUser(email: string, id: string): Promise<boolean> {
    const userId = await this.userIdForEmail(email);
    if (!userId) return false;
    const result = await prisma.commitment.deleteMany({ where: { id, userId } });
    return result.count === 1;
  }
}

export const commitmentRepository = new CommitmentRepository();
