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
  FOCUS_ITEM_STATUS_LABEL,
  FOCUS_ITEM_STATUSES,
  PRIORITIES,
} from "@/lib/constants";
import { PRIORITY_META } from "@/lib/health";
import type { FocusItem, FocusItemStatus, Goal, Priority } from "@/lib/types";
import { createId } from "@/lib/utils";

/** Create/edit form for focus items — the units of work sessions attach to. */
export function ItemDialog({
  trigger,
  item,
  goals,
  defaultGoalId,
  onSave,
}: {
  trigger: ReactNode;
  item?: FocusItem;
  goals: Goal[];
  defaultGoalId?: string;
  onSave: (item: FocusItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [goalId, setGoalId] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<FocusItemStatus>("not_started");
  const [dailyHours, setDailyHours] = useState("1");

  useEffect(() => {
    if (!open) return;
    setName(item?.name ?? "");
    setNotes(item?.notes ?? "");
    setGoalId(item?.goalId ?? defaultGoalId ?? goals[0]?.id ?? "");
    setPriority(item?.priority ?? "medium");
    setStatus(item?.status ?? "not_started");
    setDailyHours(`${item?.estimatedDailyHours ?? 1}`);
  }, [open, item, defaultGoalId, goals]);

  const parsedHours = Number(dailyHours);
  const valid =
    name.trim().length > 0 &&
    goalId.length > 0 &&
    Number.isFinite(parsedHours) &&
    parsedHours > 0;

  const submit = () => {
    if (!valid) return;
    onSave({
      id: item?.id ?? createId("item"),
      goalId,
      name: name.trim(),
      notes: notes.trim(),
      priority,
      status,
      estimatedDailyHours: parsedHours,
      createdAt: item?.createdAt ?? new Date().toISOString(),
      archivedAt: item?.archivedAt ?? null,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit focus item" : "New focus item"}</DialogTitle>
          <DialogDescription>
            Keep these concrete enough to sit down and start. &ldquo;Dependency
            injection module&rdquo; beats &ldquo;learn backend&rdquo;.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="item-name">Name</Label>
            <Input
              id="item-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Dependency injection module"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="item-notes">Notes</Label>
            <Textarea
              id="item-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Service lifetimes, scoped vs singleton, keyed services."
              className="min-h-20"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Goal</Label>
            <Select value={goalId} onValueChange={setGoalId}>
              <SelectTrigger>
                <SelectValue placeholder="Pick a goal" />
              </SelectTrigger>
              <SelectContent>
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="item-hours">Daily hours</Label>
              <Input
                id="item-hours"
                type="number"
                min={0.25}
                step={0.25}
                value={dailyHours}
                onChange={(event) => setDailyHours(event.target.value)}
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
                onValueChange={(value) => setStatus(value as FocusItemStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FOCUS_ITEM_STATUSES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {FOCUS_ITEM_STATUS_LABEL[option]}
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
            {item ? "Save changes" : "Create focus item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
