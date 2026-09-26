import { useQuery } from "@tanstack/react-query";

import api from "@/config/axios";
import { hasLocalAuthSession } from "@/lib/auth";
import type {
  AuthCredentials,
  AuthResponse,
  CurrentUser,
  MeResponse,
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

export async function getCurrentUser(): Promise<CurrentUser> {
  const { data } = await api.get<MeResponse>("/api/auth/me");
  return data.user;
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
