import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import api from "@/config/axios";
import { hasLocalAuthSession } from "@/lib/auth";
import { TODAY_QUERY_KEY } from "@/services/today";

import type {
  CommitmentListResponse,
  CommitmentResponse,
  CreateCommitmentBody,
  UpdateCommitmentBody,
} from "./types";

export const COMMITMENTS_QUERY_KEY = ["lockedin", "commitments"] as const;

export function commitmentQueryKey(id: string) {
  return ["lockedin", "commitments", id] as const;
}

export function commitmentErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: unknown; error?: unknown } | undefined;
    const message = data?.message ?? data?.error;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

export async function listCommitments(): Promise<CommitmentListResponse> {
  const { data } = await api.get<CommitmentListResponse>(
    "/api/lockedin/plans",
  );
  return data;
}

export async function getCommitment(id: string): Promise<CommitmentResponse> {
  const { data } = await api.get<CommitmentResponse>(
    `/api/lockedin/plans/${id}`,
  );
  return data;
}

export async function createCommitment(
  body: CreateCommitmentBody,
): Promise<CommitmentResponse> {
  const { data } = await api.post<CommitmentResponse>(
    "/api/lockedin/plans",
    body,
  );
  return data;
}

export async function updateCommitment(
  id: string,
  body: UpdateCommitmentBody,
): Promise<CommitmentResponse> {
  const { data } = await api.patch<CommitmentResponse>(
    `/api/lockedin/plans/${id}`,
    body,
  );
  return data;
}

export function useCommitments(enabled = true) {
  return useQuery({
    queryKey: COMMITMENTS_QUERY_KEY,
    queryFn: listCommitments,
    enabled: enabled && hasLocalAuthSession(),
    staleTime: 60_000,
  });
}

export function useCommitment(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: commitmentQueryKey(id ?? ""),
    queryFn: () => getCommitment(id!),
    enabled: enabled && Boolean(id) && hasLocalAuthSession(),
    staleTime: 30_000,
  });
}

export function useCreateCommitment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCommitment,
    onSuccess: (response) => {
      queryClient.setQueryData(commitmentQueryKey(response.data.id), response);
      void queryClient.invalidateQueries({ queryKey: COMMITMENTS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: TODAY_QUERY_KEY });
    },
  });
}

export function useUpdateCommitment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateCommitmentBody }) =>
      updateCommitment(id, body),
    onSuccess: (response) => {
      queryClient.setQueryData(commitmentQueryKey(response.data.id), response);
      void queryClient.invalidateQueries({ queryKey: COMMITMENTS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: TODAY_QUERY_KEY });
    },
  });
}

/** True while signed-in commitments are still loading from the API. */
export function useCommitmentsLoading(hydrated: boolean) {
  const authed = hasLocalAuthSession();
  const { isLoading, isFetched } = useCommitments(hydrated);
  return authed && hydrated && (isLoading || !isFetched);
}
