import { useQuery } from "@tanstack/react-query";

import api from "@/config/axios";
import { hasLocalAuthSession } from "@/lib/auth";

import type { TodayResponse } from "./types";

export const TODAY_QUERY_KEY = ["lockedin", "today"] as const;

export async function getToday(): Promise<TodayResponse> {
  const { data } = await api.get<TodayResponse>("/api/lockedin/today");
  return data;
}

export function useToday(enabled = true) {
  return useQuery({
    queryKey: TODAY_QUERY_KEY,
    queryFn: getToday,
    enabled: enabled && hasLocalAuthSession(),
    staleTime: 60_000,
  });
}

export type { TodayResponse } from "./types";
