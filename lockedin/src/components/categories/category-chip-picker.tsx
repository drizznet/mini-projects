"use client";

import { Pencil, Plus } from "lucide-react";

import { CategoryDialog } from "@/components/categories/category-dialog";
import { useCategoryActions } from "@/hooks/use-category-actions";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Selectable category pills with inline create (+) and hover edit. */
export function CategoryChipPicker({
  categories,
  value,
  onChange,
  loading = false,
  emptyHint = "Add a category to continue.",
}: {
  categories: Category[];
  value: string;
  onChange: (categoryId: string) => void;
  loading?: boolean;
  emptyHint?: string;
}) {
  const { persistCreate, persistUpdate } = useCategoryActions();

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading categories…</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyHint}</p>
      ) : (
        categories.map((item) => {
          const selected = value === item.id;
          return (
            <div
              key={item.id}
              className={cn(
                "group/chip inline-flex h-9 max-w-full items-center rounded-full transition-colors",
                selected
                  ? "bg-card text-foreground shadow-sm ring-1 ring-foreground/20"
                  : "bg-secondary text-foreground hover:bg-secondary/70",
              )}
            >
              <button
                type="button"
                onClick={() => onChange(item.id)}
                className="inline-flex min-w-0 items-center gap-2 rounded-full py-0 pl-3.5 pr-1 text-sm"
              >
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: `var(--${item.color})` }}
                />
                <span className="truncate">{item.name}</span>
              </button>
              <CategoryDialog
                category={item}
                trigger={
                  <button
                    type="button"
                    aria-label={`Edit ${item.name}`}
                    className="mr-1.5 grid size-6 shrink-0 place-items-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-background/60 hover:text-foreground group-hover/chip:opacity-100 focus-visible:opacity-100"
                  >
                    <Pencil className="size-3" />
                  </button>
                }
                onSave={(updated) => {
                  void persistUpdate(updated);
                }}
              />
            </div>
          );
        })
      )}

      <CategoryDialog
        trigger={
          <button
            type="button"
            aria-label="Add category"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
          >
            <Plus className="size-4" />
          </button>
        }
        onSave={async (category) => {
          const saved = await persistCreate(category);
          if (saved) onChange(saved.id);
        }}
      />
    </div>
  );
}
