"use client";

import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY_ICON_KEYS, resolveCategoryIcon } from "@/lib/icons";
import type { Category, ColorToken } from "@/lib/types";
import { cn, createId } from "@/lib/utils";

const COLOR_TOKENS: ColorToken[] = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "chart-6",
];

/**
 * Create/edit form for categories.
 *
 * Colour and icon are stored as tokens (`chart-3`, `rocket`) rather than raw
 * values so the palette stays themeable and state stays serialisable.
 */
export function CategoryDialog({
  trigger,
  category,
  onSave,
}: {
  trigger: ReactNode;
  category?: Category;
  onSave: (category: Category) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [color, setColor] = useState<ColorToken>(category?.color ?? "chart-1");
  const [icon, setIcon] = useState(category?.icon ?? "layers");

  // Re-seed the form whenever it reopens so stale edits never leak between rows.
  useEffect(() => {
    if (!open) return;
    setName(category?.name ?? "");
    setDescription(category?.description ?? "");
    setColor(category?.color ?? "chart-1");
    setIcon(category?.icon ?? "layers");
  }, [open, category]);

  const submit = () => {
    if (!name.trim()) return;
    onSave({
      id: category?.id ?? createId("cat"),
      name: name.trim(),
      description: description.trim(),
      color,
      icon,
      createdAt: category?.createdAt ?? new Date().toISOString(),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit category" : "New category"}
          </DialogTitle>
          <DialogDescription>
            Categories are the top-level areas your attention gets divided
            between.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Client Work"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Billable delivery for external clients."
              className="min-h-20"
            />
          </div>

          <div className="space-y-2">
            <Label>Colour</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_TOKENS.map((token) => (
                <button
                  key={token}
                  type="button"
                  onClick={() => setColor(token)}
                  aria-label={`Use colour ${token}`}
                  aria-pressed={color === token}
                  className={cn(
                    "size-7 rounded-full ring-offset-2 ring-offset-popover transition-transform hover:scale-110",
                    color === token && "ring-2 ring-ring",
                  )}
                  style={{ backgroundColor: `var(--${token})` }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_ICON_KEYS.map((key) => {
                const Icon = resolveCategoryIcon(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIcon(key)}
                    aria-label={`Use ${key} icon`}
                    aria-pressed={icon === key}
                    className={cn(
                      "grid size-8 place-items-center rounded-lg border transition-colors",
                      icon === key
                        ? "border-primary/50 bg-primary/12 text-primary"
                        : "border-border/70 text-muted-foreground hover:bg-secondary/70",
                    )}
                  >
                    <Icon className="size-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!name.trim()}>
            {category ? "Save changes" : "Create category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
