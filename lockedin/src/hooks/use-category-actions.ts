"use client";

import { toast } from "sonner";

import { hasLocalAuthSession } from "@/lib/auth";
import { useFocusStore } from "@/lib/store/focus-store";
import type { Category, ColorToken } from "@/lib/types";
import { createId } from "@/lib/utils";
import {
  categoryErrorMessage,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/services/categories";

export type CategoryFormInput = {
  id?: string;
  name: string;
  description: string;
  color: ColorToken;
  icon: string;
};

function mapApiCategory(saved: {
  id: string;
  name: string;
  description: string | null;
  color: ColorToken;
  icon: string;
  createdAt: string;
}): Category {
  return {
    id: saved.id,
    name: saved.name,
    description: saved.description ?? "",
    color: saved.color,
    icon: saved.icon,
    createdAt: saved.createdAt,
  };
}

/** Create, update, and delete categories (API when signed in, local store otherwise). */
export function useCategoryActions() {
  const { state, actions } = useFocusStore();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const persistCreate = async (
    input: CategoryFormInput,
  ): Promise<Category | undefined> => {
    try {
      if (hasLocalAuthSession()) {
        const response = await createCategory.mutateAsync({
          name: input.name,
          description: input.description || null,
          color: input.color,
          icon: input.icon,
        });
        const category = mapApiCategory(response.data);
        actions.saveCategory(category);
        toast.success(`Created ${category.name}`);
        return category;
      }

      const category: Category = {
        id: createId(),
        name: input.name,
        description: input.description,
        color: input.color,
        icon: input.icon,
        createdAt: new Date().toISOString(),
      };
      actions.saveCategory(category);
      toast.success(`Created ${category.name}`);
      return category;
    } catch (error) {
      toast.error(categoryErrorMessage(error, "Could not create category."));
      return undefined;
    }
  };

  const persistUpdate = async (
    input: CategoryFormInput,
  ): Promise<Category | undefined> => {
    if (!input.id) return undefined;
    try {
      if (hasLocalAuthSession()) {
        const response = await updateCategory.mutateAsync({
          id: input.id,
          body: {
            name: input.name,
            description: input.description || null,
            color: input.color,
            icon: input.icon,
          },
        });
        const category = mapApiCategory(response.data);
        actions.saveCategory(category);
        toast.success("Category updated");
        return category;
      }

      const prior = state.categories.find((entry) => entry.id === input.id);
      const category: Category = {
        id: input.id,
        name: input.name,
        description: input.description,
        color: input.color,
        icon: input.icon,
        createdAt: prior?.createdAt ?? new Date().toISOString(),
      };
      actions.saveCategory(category);
      toast.success("Category updated");
      return category;
    } catch (error) {
      toast.error(categoryErrorMessage(error, "Could not update category."));
      return undefined;
    }
  };

  const persistDelete = async (id: string, name: string) => {
    try {
      if (hasLocalAuthSession()) {
        await deleteCategory.mutateAsync(id);
      }
      actions.removeCategory(id);
      toast.success(`Deleted ${name}`);
    } catch (error) {
      toast.error(categoryErrorMessage(error, "Could not delete category."));
    }
  };

  return {
    persistCreate,
    persistUpdate,
    persistDelete,
    isPending:
      createCategory.isPending ||
      updateCategory.isPending ||
      deleteCategory.isPending,
  };
}
