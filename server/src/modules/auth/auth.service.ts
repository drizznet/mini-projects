import { createHmac, timingSafeEqual } from "node:crypto";
import { AppError } from "../../errors";
import type { AuthUser, LoginResponse } from "./auth.types";

const SECRET = process.env.AUTH_SECRET ?? "dev-secret-change-me";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@drizznet.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "drizznet";
/** Token lifetime in seconds (default 24h). */
const TOKEN_TTL_SEC = Number(process.env.AUTH_TOKEN_TTL_SEC ?? 60 * 60 * 24);

type TokenPayload = {
  sub: string;
  role: "admin";
  exp: number;
};

function sign(payload: TokenPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verify(token: string): TokenPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = createHmac("sha256", SECRET).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as TokenPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function login(email: string, password: string): LoginResponse {
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    throw new AppError(401, "Invalid email or password");
  }

  const user: AuthUser = { email, role: "admin" };
  const token = sign({
    sub: email,
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SEC,
  });

  return { token, user };
}

export function getUserFromToken(token: string): AuthUser {
  const payload = verify(token);
  if (!payload) {
    throw new AppError(401, "Invalid or expired token");
  }
  return { email: payload.sub, role: payload.role };
}
