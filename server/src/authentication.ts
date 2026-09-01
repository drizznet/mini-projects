/**
 * TSOA security hook — referenced from tsoa.json `authenticationModule`.
 * Controllers use `@Security("bearerAuth")`; TSOA calls this before the handler.
 */
import type { Request } from "express";
import { authService } from "./modules/auth/auth.service";
import type { AuthUser } from "./modules/auth/auth.types";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  _scopes?: string[],
): Promise<AuthUser> {
  if (securityName !== "bearerAuth") {
    throw new Error(`Unknown security scheme: ${securityName}`);
  }

  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw Object.assign(new Error("Missing Bearer token"), { status: 401 });
  }

  const token = header.slice("Bearer ".length).trim();
  return authService.getUserFromToken(token);
}
