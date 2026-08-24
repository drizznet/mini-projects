"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { RatingStars } from "@/components/sessions/rating-stars";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDuration } from "@/lib/utils";

const RATING_LABELS: Record<number, string> = {
  1: "Lost the session",
  2: "Fragmented",
  3: "Adequate",
  4: "Strong focus",
  5: "Deep, uninterrupted flow",
};

/**
 * End-of-session reflection.
 *
 * Rating plus a free-text note feed the analytics (best category, best window)
 * and are the only qualitative signal in the system, so the dialog blocks the
 * "complete" path until a rating is chosen. Discard exists for accidental
 * starts and removes the session entirely.
 */
export function ReflectionDialog({
  open,
  onOpenChange,
  elapsedMs,
  interruptions,
  onComplete,
  onDiscard,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  elapsedMs: number;
  interruptions: number;
  onComplete: (rating: number, reflection: string) => void;
  onDiscard: () => void;
}) {
  const [rating, setRating] = useState<number | null>(null);
  const [reflection, setReflection] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>How did that session go?</DialogTitle>
          <DialogDescription>
            {formatDuration(elapsedMs)} of focused time
            {interruptions > 0
              ? ` · ${interruptions} interruption${interruptions === 1 ? "" : "s"}`
              : " · no interruptions"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Productivity rating</Label>
            <div className="flex items-center gap-3">
              <RatingStars
                value={rating}
                onChange={setRating}
                size="lg"
                className="-ml-1"
              />
              <span className="text-xs text-muted-foreground">
                {rating ? RATING_LABELS[rating] : "Pick a rating"}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reflection">
              What helped or blocked your focus?
            </Label>
            <Textarea
              id="reflection"
              value={reflection}
              onChange={(event) => setReflection(event.target.value)}
              placeholder="Phone in another room, clear outcome written down before starting…"
              className="min-h-28"
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="ghost"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => {
              onDiscard();
              onOpenChange(false);
            }}
          >
            <Trash2 className="size-3.5" />
            Discard session
          </Button>
          <Button
            disabled={rating === null}
            onClick={() => {
              if (rating === null) return;
              onComplete(rating, reflection.trim());
              onOpenChange(false);
            }}
          >
            Save and finish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
