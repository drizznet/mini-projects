"use client";

const AUTH_STORAGE_KEY = "lockin-auth-session";

type LocalAuthSession = {
  email: string;
  accessToken?: string;
  signedInAt: string;
};

/**
 * Temporary frontend-only auth boundary.
 *
 * The login screen is still a preview, so this marker is intentionally local
 * to the browser. A real auth provider can replace these helpers later
 * without changing the route boundary.
 */
export function createLocalAuthSession(email: string, accessToken?: string) {
  if (typeof window === "undefined") return;

  const session: LocalAuthSession = {
    email,
    accessToken,
    signedInAt: new Date().toISOString(),
  };
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function getLocalAuthToken() {
  if (typeof window === "undefined") return undefined;

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return undefined;
    const session = JSON.parse(raw) as LocalAuthSession;
    return session.accessToken;
  } catch {
    return undefined;
  }
}

export function hasLocalAuthSession() {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(AUTH_STORAGE_KEY));
}

export function clearLocalAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
