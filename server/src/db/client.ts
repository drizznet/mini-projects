/**
 * Postgres pool shared by repositories.
 *
 * Requires DATABASE_URL (see .env.example).
 * Brew: `brew services start postgresql@16` then `pnpm db:migrate` / `pnpm db:ping`.
 * Docker: `pnpm docker:up` (port 5433) with the Docker URL in .env.
 *
 * @example
 * import { db } from "../db/client";
 * const result = await db.query("select 1 as ok");
 */
import { Pool } from "pg";

function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example → .env and run `pnpm docker:up`.",
    );
  }
  return url;
}

export const db = new Pool({
  connectionString: requireDatabaseUrl(),
});

db.on("error", (error) => {
  console.error("[db] unexpected pool error", error);
});
