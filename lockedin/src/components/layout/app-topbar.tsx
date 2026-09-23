"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, PanelsTopLeft, Play } from "lucide-react";

import { SidebarContent } from "@/components/layout/sidebar-content";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { findNavItem } from "@/lib/navigation";
import { BRAND } from "@/lib/brand";
import { clearLocalAuthSession } from "@/lib/auth";

/** Top bar: mobile navigation, current section, start CTA. */
export function AppTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const current = findNavItem(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md lg:px-6">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="size-4" />
            <span className="sr-only">Open navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 items-center gap-2">
        <PanelsTopLeft className="hidden size-4 shrink-0 text-muted-foreground sm:block" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {current?.label ?? BRAND.name}
          </p>
          <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
            {current?.description}
          </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Button size="sm" asChild>
          <Link href="/focus">
            <Play className="size-3.5" />
            <span className="hidden sm:inline">Start focus</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Log out"
          title="Log out"
          onClick={() => {
            clearLocalAuthSession();
            router.replace("/login");
          }}
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  );
}
