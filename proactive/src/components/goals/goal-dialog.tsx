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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  GOAL_STATUS_LABEL,
  GOAL_STATUSES,
  PRIORITIES,
} from "@/lib/constants";
import { PRIORITY_META } from "@/lib/health";
import type { Category, Goal, GoalStatus, Priority } from "@/lib/types";
import { createId } from "@/lib/utils";

/** Create/edit form for long-term goals. */
export function GoalDialog({
  trigger,
  goal,
  categories,
  defaultCategoryId,
  onSave,
}: {
  trigger: ReactNode;
  goal?: Goal;
  categories: Category[];
  defaultCategoryId?: string;
  onSave: (goal: Goal) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<GoalStatus>("active");
  const [targetHours, setTargetHours] = useState("40");

  useEffect(() => {
    if (!open) return;
    setTitle(goal?.title ?? "");
    setDescription(goal?.description ?? "");
    setCategoryId(
      goal?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? "",
    );
    setPriority(goal?.priority ?? "medium");
    setStatus(goal?.status ?? "active");
    setTargetHours(`${goal?.targetHours ?? 40}`);
  }, [open, goal, defaultCategoryId, categories]);

  const parsedTarget = Number(targetHours);
  const valid =
    title.trim().length > 0 &&
    categoryId.length > 0 &&
    Number.isFinite(parsedTarget) &&
    parsedTarget > 0;

  const submit = () => {
    if (!valid) return;
    onSave({
      id: goal?.id ?? createId("goal"),
      categoryId,
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      targetHours: parsedTarget,
      targetDate: goal?.targetDate ?? null,
      createdAt: goal?.createdAt ?? new Date().toISOString(),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{goal ? "Edit goal" : "New goal"}</DialogTitle>
          <DialogDescription>
            A goal is a destination measured in hours. Focus items are how you
            get there.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="goal-title">Title</Label>
            <Input
              id="goal-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Learn C# and .NET"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="goal-description">Description</Label>
            <Textarea
              id="goal-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Get production-comfortable with ASP.NET Core and EF Core."
              className="min-h-20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pick a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: `var(--${category.color})` }}
                      />
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="goal-target">Target hours</Label>
              <Input
                id="goal-target"
                type="number"
                min={1}
                step={5}
                value={targetHours}
                onChange={(event) => setTargetHours(event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as Priority)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {PRIORITY_META[option].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as GoalStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_STATUSES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {GOAL_STATUS_LABEL[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!valid}>
            {goal ? "Save changes" : "Create goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
