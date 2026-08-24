"use client";

import { FolderTree, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { CategoryDialog } from "@/components/categories/category-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useFocusData } from "@/hooks/use-focus-data";
import { resolveCategoryIcon } from "@/lib/icons";
import { goalsForCategory } from "@/lib/selectors";
import { useFocusStore } from "@/lib/store/focus-store";
import { formatHours, percent } from "@/lib/utils";

/** Category catalogue with 8-week time share per area. */
export default function CategoriesPage() {
  const { state, actions } = useFocusStore();
  const { categories: slices, goals } = useFocusData({ tickMs: 60_000 });

  const shareByCategory = new Map(
    slices.map((slice) => [slice.categoryId, slice]),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="The top-level areas your attention gets divided between. Time share is measured over the last eight weeks."
        actions={
          <CategoryDialog
            trigger={
              <Button size="sm">
                <Plus className="size-3.5" />
                New category
              </Button>
            }
            onSave={(category) => {
              actions.saveCategory(category);
              toast.success(`Created ${category.name}`);
            }}
          />
        }
      />

      {state.categories.length === 0 ? (
        <EmptyState
          icon={FolderTree}
          title="No categories yet"
          description="Start with three or four broad areas — learning, client work, your main job — then add goals inside them."
          className="py-16"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {state.categories.map((category) => {
            const Icon = resolveCategoryIcon(category.icon);
            const slice = shareByCategory.get(category.id);
            const categoryGoals = goalsForCategory(state, category.id);
            const activeGoals = categoryGoals.filter(
              (goal) => goal.status === "active",
            ).length;
            const loggedHours = goals
              .filter((goal) =>
                categoryGoals.some((entry) => entry.id === goal.goalId),
              )
              .reduce((total, goal) => total + goal.loggedHours, 0);

            return (
              <Card key={category.id} className="group">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-lg"
                        style={{
                          backgroundColor: `color-mix(in oklab, var(--${category.color}) 18%, transparent)`,
                          color: `var(--${category.color})`,
                        }}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {category.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {categoryGoals.length} goal
                          {categoryGoals.length === 1 ? "" : "s"} · {activeGoals}{" "}
                          active
                        </p>
                      </div>
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
                          actions.saveCategory(updated);
                          toast.success("Category updated");
                        }}
                      />
                      <ConfirmDialog
                        title={`Delete ${category.name}?`}
                        description="Its goals and focus items are deleted too. Logged sessions stay in your history but lose their category."
                        onConfirm={() => {
                          actions.removeCategory(category.id);
                          toast.success(`Deleted ${category.name}`);
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
                  </div>

                  {category.description ? (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {category.description}
                    </p>
                  ) : null}

                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between text-[11px]">
                      <span className="text-muted-foreground">
                        Share of focus
                      </span>
                      <span className="tabular font-medium">
                        {percent(slice?.share ?? 0)}
                      </span>
                    </div>
                    <Progress
                      value={(slice?.share ?? 0) * 100}
                      className="h-1.5"
                      indicatorStyle={{
                        backgroundColor: `var(--${category.color})`,
                      }}
                    />
                    <div className="flex items-baseline justify-between text-[11px] text-muted-foreground">
                      <span className="tabular">
                        {formatHours(slice?.hours ?? 0)} in 8 weeks
                      </span>
                      <span className="tabular">
                        {formatHours(loggedHours)} all time
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
