import { createHmac, timingSafeEqual } from "node:crypto";

const SECRET = process.env.AUTH_SECRET ?? "dev-secret-change-me";

/** Token lifetime in seconds (default 24h). */
export const TOKEN_TTL_SEC = Number(
  process.env.AUTH_TOKEN_TTL_SEC ?? 60 * 60 * 24,
);

export type TokenPayload = {
  sub: string;
  exp: number;
};

export function signToken(payload: TokenPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyToken(token: string): TokenPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = createHmac("sha256", SECRET)
    .update(body)
    .digest("base64url");
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
