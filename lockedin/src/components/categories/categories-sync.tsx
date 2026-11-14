"use client";

import { useLayoutEffect } from "react";

import { hasLocalAuthSession } from "@/lib/auth";
import { useFocusStore } from "@/lib/store/focus-store";
import { useCategories } from "@/services/categories";

/** Keeps the shared focus graph's categories synchronized with the API. */
export function CategoriesSync() {
  const { hydrated, actions } = useFocusStore();
  const { data, isFetched } = useCategories(hydrated);

  useLayoutEffect(() => {
    if (!hasLocalAuthSession() || !isFetched || !data) return;
    actions.replaceCategories(
      data.data.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description ?? "",
        color: category.color,
        icon: category.icon,
        createdAt: category.createdAt,
      })),
    );
  }, [actions, data, isFetched]);

  return null;
}
