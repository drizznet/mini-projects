import type { AuthUser } from "../modules/auth/auth.types";

declare global {
  namespace Express {
    interface Request {
      /** Set by TSOA `@Security("bearerAuth")` via expressAuthentication. */
      user?: AuthUser;
    }
  }
}

export {};
