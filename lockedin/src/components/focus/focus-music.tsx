"use client";

import { ExternalLink } from "lucide-react";

import type { MusicLink } from "@/lib/types";

/** Focus audio shortcuts. Links out so playback stays outside the session. */
export function FocusMusic({ links }: { links: MusicLink[] }) {
  if (links.length === 0) return null;

  return (
    <div className="border-t border-border/60 px-6 py-5 sm:px-8">
      <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
        While you lock in
      </p>
      <ul className="mt-3">
        {links.map((link) => (
          <li key={link.id} className="border-b border-border/60 last:border-b-0">
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-between gap-4 py-3 text-sm transition-colors hover:text-foreground"
            >
              <span className="min-w-0 truncate">{link.label}</span>
              <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
