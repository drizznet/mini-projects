"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { CategoryDot, PriorityBadge } from "@/components/shared/badges";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { lineageFor, type EntityIndex } from "@/lib/selectors";
import type { FocusItem } from "@/lib/types";
import { formatHours } from "@/lib/utils";

/**
 * Picker for adding a focus item to a day's plan.
 *
 * Items already allocated are filtered out by the caller so the list only ever
 * offers something that changes the plan.
 */
export function AddAllocationDialog({
  candidates,
  index,
  onAdd,
}: {
  candidates: FocusItem[];
  index: EntityIndex;
  onAdd: (item: FocusItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return candidates;
    return candidates.filter((item) => {
      const lineage = lineageFor(index, item.id);
      return [item.name, lineage?.goal?.title, lineage?.category?.name]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(term));
    });
  }, [candidates, index, query]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="subtle" disabled={candidates.length === 0}>
          <Plus className="size-3.5" />
          Add focus item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add to today&apos;s budget</DialogTitle>
          <DialogDescription>
            Pick the work you intend to sit down and do. The suggested hours come
            from each item&apos;s daily estimate.
          </DialogDescription>
        </DialogHeader>

        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search focus items, goals or categories"
          autoFocus
        />

        <ScrollArea className="max-h-80">
          <ul className="space-y-1 pr-2">
            {results.map((item) => {
              const lineage = lineageFor(index, item.id);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onAdd(item);
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary/70"
                  >
                    <CategoryDot
                      color={
                        lineage?.category
                          ? `var(--${lineage.category.color})`
                          : "var(--chart-1)"
                      }
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {item.name}
                      </span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {lineage?.category?.name} · {lineage?.goal?.title}
                      </span>
                    </span>
                    <PriorityBadge priority={item.priority} />
                    <span className="tabular w-14 text-right text-xs text-muted-foreground">
                      {formatHours(item.estimatedDailyHours)}
                    </span>
                  </button>
                </li>
              );
            })}
            {results.length === 0 ? (
              <li className="px-3 py-6 text-center text-xs text-muted-foreground">
                Nothing matches that search.
              </li>
            ) : null}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
