import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";

import { LoginForm } from "./login-form";
import { BrandLockup } from "@/components/brand/logo";
import focusBackground from "../../../public/assets/focus.jpg";

export const metadata: Metadata = { title: "Log in" };

function FocusIllustration() {
  return (
    <figure className="relative mx-auto mt-10 w-full max-w-sm pb-5">
      <div aria-hidden="true" className="absolute inset-x-3 top-4 bottom-1 rotate-3 rounded-3xl border border-white/20 bg-white/10" />
      <div className="relative rounded-3xl border border-white/70 bg-background p-6 text-foreground shadow-[0_24px_60px_-15px_#16051d80] xl:p-7">
        <div className="flex items-center justify-between gap-3"><span className="text-[10px] font-semibold uppercase tracking-[.16em] text-muted-foreground">One thing at a time</span><Sparkles className="size-4 text-chart-1" aria-hidden="true" /></div>
        <p className="mt-5 text-xl font-semibold tracking-tight">Make room for your best work.</p>
        <div className="mt-6 flex items-end justify-between gap-3 border-b border-border pb-5"><div><p className="text-[10px] text-muted-foreground">A little time, just for this.</p><p className="mt-2 font-mono text-5xl tracking-[-.06em]">25<span className="text-chart-1">:00</span></p></div><span className="mb-1 rounded-full border border-primary/10 bg-secondary px-3 py-1.5 text-[10px] font-medium">Focus block</span></div>
        <div className="mt-5 flex gap-1.5" aria-hidden="true">{Array.from({ length: 20 }, (_, index) => <span key={index} className={`h-5 flex-1 rounded-sm ${index < 12 ? "bg-primary" : "bg-accent"}`} />)}</div>
        <div className="mt-3 flex justify-between text-[10px] text-muted-foreground"><span>Settle in</span><span>Find your flow</span></div>
        <p className="mt-6 flex items-center gap-2 text-xs"><span className="grid size-5 place-items-center rounded-full bg-secondary"><Check className="size-3" aria-hidden="true" /></span>A clear intention. A fresh start.</p>
      </div>
      <figcaption className="relative mt-6 text-center text-[10px] tracking-wider text-primary-foreground/65">A glimpse of your focus space</figcaption>
    </figure>
  );
}

export default function LoginPage() {
  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:p-4 xl:p-6">
      <section aria-labelledby="login-focus-heading" className="relative hidden overflow-hidden rounded-[2rem] bg-primary p-8 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-12">
        <Image
          src={focusBackground}
          alt=""
          fill
          loading="lazy"
          placeholder="blur"
          sizes="(min-width: 1024px) 50vw, 1px"
          className="pointer-events-none object-cover object-center"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/55 via-black/40 to-black/60" />
        <Link href="/" className="relative flex w-fit items-center gap-2 rounded-md text-xs text-primary-foreground/80 transition-colors hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><ArrowLeft className="size-3.5" />Back to lockIn</Link>
        <div className="relative mx-auto w-full max-w-md py-10">
          <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-primary-foreground/65">A little less noise</p>
          <h2 id="login-focus-heading" className="mt-4 text-4xl leading-[1.08] font-semibold tracking-[-.04em] xl:text-5xl">Your time.<br /><span className="text-accent">Your kind of progress.</span></h2>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/75">A quieter place to gather your thoughts and give the work that matters your attention.</p>
          <FocusIllustration />
        </div>
        <p className="relative flex items-center gap-3 text-[10px] text-primary-foreground/65"><span className="h-px w-7 bg-white/30" />Less switching. More finishing.</p>
      </section>
      <section aria-label="Account access" className="flex min-h-svh flex-col px-6 py-12 sm:px-10 lg:min-h-0 lg:px-12 lg:py-8">
        <div className="hidden lg:block"><BrandLockup href="/" showSubtitle={false} /></div>
        <div className="flex w-full flex-1 items-center justify-center lg:py-12"><LoginForm /></div>
      </section>
    </main>
  );
}
