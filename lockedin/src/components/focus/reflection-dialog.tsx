"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDuration } from "@/lib/utils";

/**
 * End-of-session confirmation.
 *
 * Keep this moment lightweight: the session is logged with its derived focus
 * metrics as soon as the user confirms.
 */
export function ReflectionDialog({
  open,
  onOpenChange,
  elapsedMs,
  interruptions,
  onComplete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  elapsedMs: number;
  interruptions: number;
  onComplete: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>End this session?</DialogTitle>
          <DialogDescription>
            {formatDuration(elapsedMs)} of focused time
            {interruptions > 0
              ? ` · ${interruptions} interruption${interruptions === 1 ? "" : "s"}`
              : " · no interruptions"}
            {". Your focus time will be recorded."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="subtle" onClick={() => onOpenChange(false)}>
            Keep working
          </Button>
          <Button
            onClick={() => {
              onComplete();
              onOpenChange(false);
            }}
          >
            End session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
