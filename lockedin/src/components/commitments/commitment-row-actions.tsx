"use client";

import Link from "next/link";
import {
  CalendarDays,
  Eye,
  ListChecks,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { CommitmentDialog } from "@/components/commitments/commitment-dialog";
import { ItemDialog } from "@/components/items/item-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FocusStoreValue } from "@/lib/store/focus-store";
import type { FocusState, Goal } from "@/lib/types";

export function CommitmentRowActions({
  goal,
  state,
  actions,
  itemCount,
  hasTodayWorkItem,
  todayFocusItemId,
  failed = false,
}: {
  goal: Goal;
  state: FocusState;
  actions: FocusStoreValue["actions"];
  itemCount: number;
  hasTodayWorkItem: boolean;
  todayFocusItemId: string | null;
  failed?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={`More actions for ${goal.title}`}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href={`/plans/${goal.id}`}>
            <Eye /> View plan
          </Link>
        </DropdownMenuItem>
        {hasTodayWorkItem && !failed ? (
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard?goal=${encodeURIComponent(goal.id)}&focus=${encodeURIComponent(todayFocusItemId ?? "")}`}
            >
              <CalendarDays /> Open in Today
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        {!failed ? (
        <ItemDialog
          goals={state.goals}
          defaultGoalId={goal.id}
          trigger={
            <DropdownMenuItem>
              <ListChecks /> Add work item
            </DropdownMenuItem>
          }
          onSave={(item) => {
            actions.saveItem(item);
            toast.success(`Added ${item.name}`);
          }}
        />
        ) : null}
        <CommitmentDialog
          goal={goal}
          categories={state.categories}
          trigger={
            <DropdownMenuItem>
              <Pencil /> Edit plan
            </DropdownMenuItem>
          }
          onSave={(updated) => {
            actions.saveGoal(updated);
          toast.success("Plan updated");
          }}
        />
        <DropdownMenuSeparator />
        <ConfirmDialog
          title={`Delete ${goal.title}?`}
          description={`Its ${itemCount} work item${itemCount === 1 ? "" : "s"} will be deleted too.`}
          onConfirm={() => {
            actions.removeGoal(goal.id);
          toast.success("Plan deleted");
          }}
        >
          <DropdownMenuItem variant="destructive">
          <Trash2 /> Delete plan
          </DropdownMenuItem>
        </ConfirmDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
