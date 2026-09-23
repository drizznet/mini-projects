import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "./login-form";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Log in" };

function FocusIllustration() {
  return (
    <div className="relative h-[min(30rem,58vw)] w-[min(30rem,58vw)] max-w-full text-primary">
      <div className="absolute inset-[12%] rounded-full border border-primary/20" />
      <div className="absolute inset-[22%] rounded-full border border-primary/30" />
      <div className="absolute left-1/2 top-1/2 size-[34%] -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[38%] border-2 border-primary bg-primary/15 shadow-[0_0_80px_color-mix(in_oklab,var(--primary)_28%,transparent)]" />
      <div className="absolute left-[17%] top-[35%] h-px w-[66%] origin-center rotate-[24deg] bg-primary/70" />
      <div className="absolute left-[30%] top-[54%] h-px w-[55%] origin-center -rotate-[35deg] bg-primary/45" />
      <span className="absolute left-[16%] top-[33%] size-3 rounded-full bg-primary shadow-[0_0_18px_var(--primary)]" />
      <span className="absolute right-[17%] top-[25%] size-2 rounded-full bg-primary/80" />
      <span className="absolute bottom-[23%] right-[23%] size-4 rounded-full border border-primary bg-background" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-2">
      <section className="surface-ink relative hidden min-h-svh overflow-hidden p-10 text-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="aurora absolute inset-0" />
        <Link href="/" className="relative z-10 text-sm font-semibold tracking-[0.3em] uppercase">{BRAND.name}</Link>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <FocusIllustration />
          <p className="mt-3 text-center text-sm tracking-[0.22em] text-muted-foreground uppercase">{BRAND.tagline}</p>
        </div>
        <p className="relative z-10 max-w-xs text-sm leading-relaxed text-muted-foreground">A quieter place to plan your attention and protect the work that matters.</p>
      </section>
      <section className="flex min-h-svh items-center justify-center px-6 py-12 sm:px-10">
        <LoginForm />
      </section>
    </main>
  );
}
