/**
 * Local dummy rows for an empty `todos` table.
 * Does not create tables — run `pnpm db:push` or `pnpm db:migrate` first.
 *
 * Usage: `pnpm db:seed`
 * Safe to re-run: wipes existing todos then inserts this set (local/dev only).
 */
import { prisma } from "../src/db/prisma";

const todos = [
  {
    title: "Read Prisma schema",
    description: "See how Todo maps to the todos table.",
    completed: true,
    completedAt: new Date("2026-08-14T10:00:00Z"),
  },
  {
    title: "Hit GET /api/todos",
    description: "Confirm the API returns seeded rows.",
    completed: false,
  },
  {
    title: "Open Prisma Studio",
    description: "Browse rows with `pnpm db:studio`.",
    completed: false,
  },
];

async function main() {
  await prisma.todo.deleteMany();
  const created = await prisma.todo.createMany({ data: todos });
  console.log("[db:seed] inserted", created.count, "todos");
}

main()
  .catch((error) => {
    console.error("[db:seed] failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
