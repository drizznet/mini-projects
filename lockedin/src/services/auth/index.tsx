import { useQuery } from "@tanstack/react-query";

import api from "@/config/axios";
import { hasLocalAuthSession } from "@/lib/auth";
import type {
  AuthCredentials,
  AuthResponse,
  AuthUser,
  CurrentUserResponse,
} from "./types";

export const CURRENT_USER_QUERY_KEY = ["auth", "me"] as const;

export async function login(credentials: AuthCredentials) {
  const { data } = await api.post<AuthResponse>(
    "/api/auth/login",
    credentials,
  );
  return data;
}

export async function register(credentials: AuthCredentials) {
  const { data } = await api.post<AuthResponse>(
    "/api/auth/register",
    credentials,
  );
  return data;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<CurrentUserResponse>("/api/auth/me");
  const payload: unknown = data;

  if (isRecord(payload) && isRecord(payload.user)) {
    return payload.user as AuthUser;
  }
  if (isRecord(payload) && isRecord(payload.data)) {
    return isRecord(payload.data.user)
      ? (payload.data.user as AuthUser)
      : (payload.data as AuthUser);
  }
  return payload as AuthUser;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Server profile state lives in the React Query cache instead of a duplicate store. */
export function useCurrentUser() {
  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
    enabled: hasLocalAuthSession(),
    staleTime: 5 * 60 * 1_000,
  });
}

/** Supports common token names while the backend response contract settles. */
export function getAuthAccessToken(response: AuthResponse) {
  return (
    response.accessToken ??
    response.access_token ??
    response.token ??
    response.data?.accessToken ??
    response.data?.access_token ??
    response.data?.token
  );
}
