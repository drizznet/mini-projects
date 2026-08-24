"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ListChecks, Pencil, Play, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ItemDialog } from "@/components/items/item-dialog";
import {
  CategoryDot,
  ItemStatusBadge,
  PriorityBadge,
} from "@/components/shared/badges";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFocusData } from "@/hooks/use-focus-data";
import { sessionActiveHours } from "@/lib/analytics";
import { PRIORITY_META } from "@/lib/health";
import { lineageFor } from "@/lib/selectors";
import { useFocusStore } from "@/lib/store/focus-store";
import { formatHours, formatRelativeDay, toDateKey } from "@/lib/utils";

/** Focus item catalogue: the concrete work sessions attach to. */
export default function FocusItemsPage() {
  const { state, actions } = useFocusStore();
  const { index, now } = useFocusData({ tickMs: 60_000 });
  const [query, setQuery] = useState("");
  const [goalFilter, setGoalFilter] = useState<string>("all");

  // Lifetime hours and last-touched per item, computed in one pass.
  const stats = useMemo(() => {
    const map = new Map<string, { hours: number; last: number; count: number }>();
    for (const session of state.sessions) {
      const entry = map.get(session.focusItemId) ?? {
        hours: 0,
        last: 0,
        count: 0,
      };
      entry.hours += sessionActiveHours(session, now);
      entry.count += 1;
      entry.last = Math.max(entry.last, new Date(session.startedAt).getTime());
      map.set(session.focusItemId, entry);
    }
    return map;
  }, [state.sessions, now]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return state.focusItems
      .filter((item) => goalFilter === "all" || item.goalId === goalFilter)
      .filter((item) => {
        if (!term) return true;
        const lineage = lineageFor(index, item.id);
        return [item.name, item.notes, lineage?.goal?.title, lineage?.category?.name]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(term));
      })
      .sort(
        (a, b) =>
          PRIORITY_META[b.priority].weight - PRIORITY_META[a.priority].weight,
      );
  }, [state.focusItems, goalFilter, query, index]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Focus items"
        description="The units of work you actually sit down to do. Every session is logged against one of these."
        actions={
          <ItemDialog
            goals={state.goals}
            trigger={
              <Button size="sm" disabled={state.goals.length === 0}>
                <Plus className="size-3.5" />
                New focus item
              </Button>
            }
            onSave={(item) => {
              actions.saveItem(item);
              toast.success(`Created ${item.name}`);
            }}
          />
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search focus items, goals or notes"
            className="pl-9"
          />
        </div>
        <Select value={goalFilter} onValueChange={setGoalFilter}>
          <SelectTrigger className="sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All goals</SelectItem>
            {state.goals.map((goal) => (
              <SelectItem key={goal.id} value={goal.id}>
                {goal.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title={
            state.focusItems.length === 0
              ? "No focus items yet"
              : "Nothing matches those filters"
          }
          description={
            state.focusItems.length === 0
              ? "Create a goal first, then break it into items small enough to finish in one or two sessions."
              : "Clear the search or pick a different goal."
          }
          className="py-16"
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="hidden md:table-cell">Goal</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Daily est.</TableHead>
                  <TableHead className="text-right">Logged</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Last session
                  </TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((item) => {
                  const lineage = lineageFor(index, item.id);
                  const stat = stats.get(item.id);

                  return (
                    <TableRow key={item.id} className="group">
                      <TableCell className="max-w-64">
                        <div className="flex items-center gap-2">
                          <CategoryDot
                            color={
                              lineage?.category
                                ? `var(--${lineage.category.color})`
                                : "var(--chart-1)"
                            }
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {item.name}
                            </p>
                            {item.notes ? (
                              <p className="truncate text-[11px] text-muted-foreground">
                                {item.notes}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden max-w-48 md:table-cell">
                        <p className="truncate text-xs text-muted-foreground">
                          {lineage?.goal?.title ?? "—"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={item.priority} />
                      </TableCell>
                      <TableCell>
                        <ItemStatusBadge status={item.status} />
                      </TableCell>
                      <TableCell className="tabular text-right text-xs">
                        {formatHours(item.estimatedDailyHours)}
                      </TableCell>
                      <TableCell className="tabular text-right text-xs font-medium">
                        {formatHours(stat?.hours ?? 0)}
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">
                        {stat?.last
                          ? formatRelativeDay(toDateKey(new Date(stat.last)))
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            asChild
                            aria-label={`Start a session for ${item.name}`}
                          >
                            <Link href={`/focus?item=${item.id}`}>
                              <Play className="size-3.5" />
                            </Link>
                          </Button>
                          <ItemDialog
                            item={item}
                            goals={state.goals}
                            trigger={
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                aria-label={`Edit ${item.name}`}
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                            }
                            onSave={(updated) => {
                              actions.saveItem(updated);
                              toast.success("Focus item updated");
                            }}
                          />
                          <ConfirmDialog
                            title={`Delete ${item.name}?`}
                            description={`${stat?.count ?? 0} logged session${(stat?.count ?? 0) === 1 ? "" : "s"} will stay in your history but lose their link.`}
                            onConfirm={() => {
                              actions.removeItem(item.id);
                              toast.success("Focus item deleted");
                            }}
                          >
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              className="text-destructive hover:bg-destructive/10"
                              aria-label={`Delete ${item.name}`}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </ConfirmDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
