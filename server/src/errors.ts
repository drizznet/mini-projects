/** Thrown from services/controllers; mapped to HTTP status in the Express error handler. */
export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

const DATABASE_CONNECTION_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "EAI_AGAIN",
  "ENOTFOUND",
  "08001",
  "08003",
  "08004",
  "08006",
  "08007",
  "57P03",
]);

const PRISMA_DATABASE_CONNECTION_CODES = new Set([
  "P1001", // Cannot reach database server
  "P1002", // Database server timed out
  "P1017", // Server has closed the connection
]);

type ErrorWithDetails = {
  code?: unknown;
  message?: unknown;
  cause?: unknown;
  originalError?: unknown;
};

function errorDetails(error: unknown): ErrorWithDetails {
  return error && typeof error === "object"
    ? (error as ErrorWithDetails)
    : {};
}

/** True when the API cannot reach Postgres, such as when Docker is stopped. */
export function isDatabaseConnectionError(error: unknown): boolean {
  const details = errorDetails(error);
  const code = typeof details.code === "string" ? details.code : "";
  if (
    DATABASE_CONNECTION_CODES.has(code) ||
    PRISMA_DATABASE_CONNECTION_CODES.has(code)
  ) {
    return true;
  }

  const nested = [details.cause, details.originalError]
    .map(errorDetails)
    .find((candidate) => {
      const nestedCode =
        typeof candidate.code === "string" ? candidate.code : "";
      return DATABASE_CONNECTION_CODES.has(nestedCode);
    });
  if (nested) return true;

  const message = typeof details.message === "string" ? details.message : "";
  return /can't reach database server|connection refused|connect econnrefused|database system is starting up|server closed the connection|connection terminated unexpectedly|connection timeout/i.test(
    message,
  );
}
