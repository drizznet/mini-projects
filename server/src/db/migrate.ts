/**
 * Applies `schema.sql` to whatever DATABASE_URL points at (brew or Docker).
 * Usage: `pnpm db:migrate` (run from the `server/` package root).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import "dotenv/config";
import { db } from "./client";

async function main() {
  const sql = readFileSync(join(process.cwd(), "src/db/schema.sql"), "utf8");
  await db.query(sql);
  console.log("[db:migrate] applied schema.sql");
}

main()
  .catch((error) => {
    console.error("[db:migrate] failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.end();
  });
