/**
 * Smoke-test the Postgres connection from this codebase.
 * Usage: `pnpm db:ping` (DB must be up via `pnpm docker:up`).
 */
import "dotenv/config";
import { db } from "./client";

async function main() {
  const result = await db.query<{
    ok: number;
    db: string;
    user: string;
    now: Date;
  }>("select 1 as ok, current_database() as db, current_user as user, now() as now");

  const row = result.rows[0];
  console.log("[db:ping] connected", {
    ok: row?.ok,
    database: row?.db,
    user: row?.user,
    now: row?.now,
  });
}

main()
  .catch((error) => {
    console.error("[db:ping] failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.end();
  });
