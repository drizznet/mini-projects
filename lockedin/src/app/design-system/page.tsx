import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Design system</h1>
      <p className="text-muted-foreground">
        lockIn uses a black-and-white workspace: a black navigation rail, a
        light canvas, and white cards. Color is reserved for status, charts,
        and health.
      </p>
      <Button asChild><Link href="/">Back to lockIn</Link></Button>
    </main>
  );
}
