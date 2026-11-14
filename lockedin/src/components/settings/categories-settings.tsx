"use client";

import { FolderTree, Pencil, Plus, Trash2 } from "lucide-react";

import { CategoryDialog } from "@/components/categories/category-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCategoryActions } from "@/hooks/use-category-actions";
import { resolveCategoryIcon } from "@/lib/icons";
import { useFocusStore } from "@/lib/store/focus-store";

/** Manage categories from Settings instead of a dedicated sidebar route. */
export function CategoriesSettings() {
  const { state } = useFocusStore();
  const { persistCreate, persistUpdate, persistDelete } = useCategoryActions();

  return (
    <Card id="categories" className="scroll-mt-20">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="size-4" />
              Categories
            </CardTitle>
            <CardDescription>
              Top-level areas your plans roll up to. You can also add or
              edit categories while creating a plan.
            </CardDescription>
          </div>
          <CategoryDialog
            trigger={
              <Button size="sm" variant="secondary" className="shrink-0">
                <Plus className="size-3.5" />
                New category
              </Button>
            }
            onSave={(category) => {
              void persistCreate(category);
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {state.categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No categories yet. Create one here or use the + control in a
              plan form.
          </p>
        ) : (
          <ul className="divide-y divide-border/60 rounded-xl border border-border/70">
            {state.categories.map((category) => {
              const Icon = resolveCategoryIcon(category.icon);
              return (
                <li
                  key={category.id}
                  className="group flex items-start gap-3 px-4 py-3"
                >
                  <span
                    className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg"
                    style={{
                      backgroundColor: `color-mix(in oklab, var(--${category.color}) 18%, transparent)`,
                      color: `var(--${category.color})`,
                    }}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {category.name}
                    </p>
                    {category.description ? (
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {category.description}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        No description
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <CategoryDialog
                      category={category}
                      trigger={
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Edit ${category.name}`}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                      }
                      onSave={(updated) => {
                        void persistUpdate(updated);
                      }}
                    />
                    <ConfirmDialog
                      title={`Delete ${category.name}?`}
                      description="Its plans and focus items are removed too. Logged sessions stay in history but lose their category."
                      onConfirm={() => {
                        void persistDelete(category.id, category.name);
                      }}
                    >
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        aria-label={`Delete ${category.name}`}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </ConfirmDialog>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
