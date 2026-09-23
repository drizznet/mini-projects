import "dotenv/config";

export type AppEnvironment = "local" | "development" | "production";

function resolveEnvironment(): AppEnvironment {
  const value = (
    process.env.ENVIRONMENT ??
    process.env.ENVIROMENT ??
    process.env.NODE_ENV ??
    "local"
  ).toLowerCase();

  if (value === "production" || value === "prod") return "production";
  if (value === "development" || value === "dev") return "development";
  return "local";
}

export const APP_ENVIRONMENT = resolveEnvironment();

/**
 * Selects the database before Prisma or node-postgres creates a client.
 *
 * Runtime connections use the pooled Neon URL in production. Migrations
 * should use DATABASE_URL_UNPOOLED because Neon recommends a direct URL for
 * schema changes.
 */
export function configureDatabaseUrl(): string {
  const localUrl = process.env.DATABASE_URL_LOCAL?.trim();
  const neonUrl = (
    process.env.DATABASE_URL_NEON ?? process.env.DATABASE_URL
  )?.trim();

  const selectedUrl =
    APP_ENVIRONMENT === "production"
      ? neonUrl
      : localUrl ??
        (process.env.DATABASE_URL?.includes("localhost")
          ? process.env.DATABASE_URL.trim()
          : undefined);

  if (!selectedUrl) {
    const variable =
      APP_ENVIRONMENT === "production"
        ? "DATABASE_URL_NEON (or DATABASE_URL)"
        : "DATABASE_URL_LOCAL";
    throw new Error(
      `${variable} is required for the ${APP_ENVIRONMENT} environment.`,
    );
  }

  process.env.DATABASE_URL = selectedUrl;
  return selectedUrl;
}
