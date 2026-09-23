"use client";

import { ExternalLink, Headphones } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MusicLink } from "@/lib/types";

/**
 * Focus audio shortcuts.
 *
 * Deliberately links out instead of embedding a player: an iframe would keep
 * playing after the session ends and the app has no business owning playback
 * state. Manage the list in Settings.
 */
export function FocusMusic({ links }: { links: MusicLink[] }) {
  if (links.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-1.5">
            <Headphones className="size-3.5" />
            Focus audio
          </CardTitle>
          <CardDescription>Open a playlist in a new tab</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2.5 text-xs transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <span className="min-w-0 flex-1 truncate font-medium">
              {link.label}
            </span>
            <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
