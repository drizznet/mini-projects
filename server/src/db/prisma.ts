/**
 * Shared PrismaClient for the API.
 *
 * Reuse one client in dev (hot reload) so you don't exhaust Postgres connections.
 * Import this from repositories — do not `new PrismaClient()` in feature code.
 *
 * @example
 * import { prisma } from "../db/prisma";
 * Use this shared client from feature repositories; keep Prisma access out of controllers.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { configureDatabaseUrl } from "../config/database";

const connectionString = configureDatabaseUrl();
const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
