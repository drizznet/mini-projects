/**
 * Shared PrismaClient for the API.
 *
 * Reuse one client in dev (hot reload) so you don't exhaust Postgres connections.
 * Import this from repositories — do not `new PrismaClient()` in feature code.
 *
 * @example
 * import { prisma } from "../db/prisma";
 * const todos = await prisma.todo.findMany();
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
