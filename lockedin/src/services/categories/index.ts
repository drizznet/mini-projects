import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import api from "@/config/axios";
import { hasLocalAuthSession } from "@/lib/auth";

import type {
  CategoryListResponse,
  CategoryResponse,
  CreateCategoryBody,
  UpdateCategoryBody,
} from "./types";

export const CATEGORIES_QUERY_KEY = ["lockedin", "categories"] as const;

export function categoryQueryKey(id: string) {
  return ["lockedin", "categories", id] as const;
}

export function categoryErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: unknown; error?: unknown }
      | undefined;
    const message = data?.message ?? data?.error;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

export async function listCategories(): Promise<CategoryListResponse> {
  const { data } = await api.get<CategoryListResponse>(
    "/api/lockedin/categories",
  );
  return data;
}

export async function createCategory(
  body: CreateCategoryBody,
): Promise<CategoryResponse> {
  const { data } = await api.post<CategoryResponse>(
    "/api/lockedin/categories",
    body,
  );
  return data;
}

export async function updateCategory(
  id: string,
  body: UpdateCategoryBody,
): Promise<CategoryResponse> {
  const { data } = await api.patch<CategoryResponse>(
    `/api/lockedin/categories/${id}`,
    body,
  );
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/api/lockedin/categories/${id}`);
}

export function useCategories(enabled = true) {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: listCategories,
    enabled: enabled && hasLocalAuthSession(),
    staleTime: 60_000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: (response) => {
      queryClient.setQueryData(categoryQueryKey(response.data.id), response);
      void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateCategoryBody }) =>
      updateCategory(id, body),
    onSuccess: (response) => {
      queryClient.setQueryData(categoryQueryKey(response.data.id), response);
      void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (_response, id) => {
      queryClient.removeQueries({ queryKey: categoryQueryKey(id) });
      void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}
