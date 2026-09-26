"use client";

import Link from "next/link";
import { Timer } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { SessionList } from "@/components/sessions/session-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EntityIndex } from "@/lib/selectors";
import type { FocusSession } from "@/lib/types";

export function RecentSessionsCard({
  sessions,
  index,
  now,
  interruptionsFor,
}: {
  sessions: FocusSession[];
  index: EntityIndex;
  now: number;
  interruptionsFor: (session: FocusSession) => number;
}) {
  const recent = [...sessions]
    .sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    )
    .slice(0, 6);

  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Recent sessions</CardTitle>
          <CardDescription>Latest focus blocks and their ratings</CardDescription>
        </div>
        <Button size="sm" variant="ghost" asChild>
          <Link href="/sessions">View all</Link>
        </Button>
      </CardHeader>

      <CardContent>
        {recent.length === 0 ? (
          <EmptyState
            icon={Timer}
            title="No sessions yet"
            description="Start your first focus session and it will show up here with its rating and interruptions."
            action={
              <Button size="sm" asChild>
                <Link href="/focus">Start a session</Link>
              </Button>
            }
          />
        ) : (
          <SessionList
            sessions={recent}
            index={index}
            now={now}
            interruptionsFor={interruptionsFor}
            className="-my-3"
          />
        )}
      </CardContent>
    </Card>
  );
}
