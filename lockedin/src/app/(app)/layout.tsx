import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppShell } from "@/components/layout/app-shell";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: BRAND.name,
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
