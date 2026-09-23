/**
 * Auth persistence — Prisma Client → Postgres.
 */
import { prisma } from "../../db/prisma";
import type { AuthCreateInput } from "./auth.types";

const publicUserSelect = {
  id: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} as const;

const publicProfileSelect = {
  userId: true,
  displayName: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

const GOOGLE = "google";

export class AuthRepository {
  async create(input: AuthCreateInput) {
    return prisma.user.create({
      data: {
        email: input.email,
        passwordHarsh: input.passwordHash,
        profile: {
          create: {
            displayName: input.displayName ?? undefined,
            avatarUrl: input.avatarUrl ?? undefined,
          },
        },
      },
      select: publicUserSelect,
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByEmailWithProfile(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        ...publicUserSelect,
        profile: {
          select: publicProfileSelect,
        },
      },
    });
  }

  async findGoogleAccount(providerAccountId: string) {
    return prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: GOOGLE,
          providerAccountId,
        },
      },
      include: { user: true },
    });
  }

  async linkGoogleAccount(userId: string, providerAccountId: string) {
    return prisma.account.create({
      data: {
        userId,
        provider: GOOGLE,
        providerAccountId,
      },
    });
  }

  async createGoogleUser(input: {
    email: string;
    providerAccountId: string;
    displayName?: string | null;
    avatarUrl?: string | null;
  }) {
    return prisma.user.create({
      data: {
        email: input.email,
        passwordHarsh: null,
        profile: {
          create: {
            displayName: input.displayName ?? undefined,
            avatarUrl: input.avatarUrl ?? undefined,
          },
        },
        accounts: {
          create: {
            provider: GOOGLE,
            providerAccountId: input.providerAccountId,
          },
        },
      },
      select: publicUserSelect,
    });
  }
}

export const authRepository = new AuthRepository();
