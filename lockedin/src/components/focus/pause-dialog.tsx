"use client";

import { useState } from "react";
import { Pause } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PauseReasonOption } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Pausing always costs a reason.
 *
 * Reasons are the raw material for the distraction analytics, so the dialog has
 * no "skip" path — the cheapest option is still an explicit "Planned break".
 * Planned reasons are excluded from the score penalty.
 */
export function PauseDialog({
  open,
  onOpenChange,
  reasons,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reasons: PauseReasonOption[];
  onConfirm: (reasonId: string, note: string) => void;
}) {
  const [reasonId, setReasonId] = useState<string>(reasons[0]?.id ?? "");
  const [note, setNote] = useState("");

  const planned = reasons.filter((reason) => reason.planned);
  const unplanned = reasons.filter((reason) => !reason.planned);

  const confirm = () => {
    if (!reasonId) return;
    onConfirm(reasonId, note.trim());
    setNote("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pause className="size-4 text-health-slipping" />
            Why are you taking a break?
          </DialogTitle>
          <DialogDescription>
            Your break duration is tracked separately from focus time. Planned
            breaks do not count against your focus score; other breaks are
            recorded as interruptions so you can see the pattern later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <ReasonGroup
            label="Planned"
            reasons={planned}
            selected={reasonId}
            onSelect={setReasonId}
            tone="planned"
          />
          <ReasonGroup
            label="Interruption"
            reasons={unplanned}
            selected={reasonId}
            onSelect={setReasonId}
            tone="unplanned"
          />

          <div className="space-y-1.5">
            <Label htmlFor="pause-note">Note (optional)</Label>
            <Input
              id="pause-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="What pulled you away?"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Keep going
          </Button>
          <Button onClick={confirm} disabled={!reasonId}>
            Start break
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReasonGroup({
  label,
  reasons,
  selected,
  onSelect,
  tone,
}: {
  label: string;
  reasons: PauseReasonOption[];
  selected: string;
  onSelect: (id: string) => void;
  tone: "planned" | "unplanned";
}) {
  if (reasons.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {reasons.map((reason) => {
          const active = selected === reason.id;
          return (
            <button
              key={reason.id}
              type="button"
              onClick={() => onSelect(reason.id)}
              aria-pressed={active}
              className={cn(
                "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
                active
                  ? tone === "planned"
                    ? "border-health-on-track/50 bg-health-on-track/12 text-health-on-track"
                    : "border-health-behind/50 bg-health-behind/12 text-health-behind"
                  : "border-border text-muted-foreground hover:border-border hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              {reason.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
