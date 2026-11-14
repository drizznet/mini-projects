import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/** Match runtime DB selection in src/config/database.ts (local Docker vs Neon). */
function migrationDatabaseUrl(): string {
  const environment = (
    process.env.ENVIRONMENT ??
    process.env.ENVIROMENT ??
    process.env.NODE_ENV ??
    "local"
  ).toLowerCase();

  const isProduction =
    environment === "production" || environment === "prod";

  if (!isProduction) {
    const localUrl = process.env.DATABASE_URL_LOCAL?.trim();
    if (localUrl) return localUrl;

    const fallback = process.env.DATABASE_URL?.trim();
    if (fallback?.includes("localhost")) return fallback;
  }

  const unpooled = process.env.DATABASE_URL_UNPOOLED?.trim();
  if (unpooled) return unpooled;

  return env("DATABASE_URL");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: migrationDatabaseUrl(),
  },
});
