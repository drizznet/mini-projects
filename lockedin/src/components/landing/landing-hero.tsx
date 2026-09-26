"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, Menu, Pause, Play, RotateCcw, X } from "lucide-react";
import { BrandLockup } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navFloating, setNavFloating] = useState(false);
  const navSlot = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(50);
  const [seconds, setSeconds] = useState(3000);
  const [running, setRunning] = useState(false);
  const remaining = useRef(seconds);
  remaining.current = seconds;
  const timerButton = useRef<HTMLButtonElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const slot = navSlot.current;
    if (!slot) return;
    const observer = new IntersectionObserver(([entry]) => {
      setNavFloating(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
    });
    observer.observe(slot);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const deadline = Date.now() + remaining.current * 1000;
    const interval = window.setInterval(() => setSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000))), 250);
    return () => window.clearInterval(interval);
  }, [running]);
  useEffect(() => { if (seconds === 0) setRunning(false); }, [seconds]);

  function showDemo() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timerButton.current?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "center" });
    timerButton.current?.focus({ preventScroll: true });
  }

  const progress = (1 - seconds / (duration * 60)) * 100;

  return (
    <>
      <div ref={navSlot} className="h-20 bg-background">
      <header className={`mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-5 sm:px-8 ${navFloating ? "landing-floating-nav fixed inset-x-3 top-3 z-50 rounded-2xl border border-primary/10 bg-background/95 shadow-[0_8px_32px_-12px_#410d4b40] backdrop-blur-xl sm:inset-x-5" : "relative z-30 border-b border-primary/10"}`}>
        <BrandLockup href="/" showSubtitle={false} />
        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
          <a href="#product" className="hover:text-primary">The workspace</a>
          <a href="#how" className="hover:text-primary">How it works</a>
          <a href="#calculator" className="hover:text-primary">Find your focus budget</a>
        </nav>
        <div className="flex items-center gap-3 sm:gap-5">
          <Link href="/login" className="hidden text-sm font-medium hover:opacity-70 sm:block">Log in</Link>
          <Button asChild className="h-10 rounded-xl px-4 text-xs"><Link href="/dashboard">Open lockIn<ArrowRight className="size-3.5" /></Link></Button>
          <button ref={menuButton} type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="hero-mobile-nav" onClick={() => setMenuOpen(!menuOpen)} className="grid size-10 place-items-center rounded-lg hover:bg-muted lg:hidden">{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
        </div>
        {menuOpen && <nav id="hero-mobile-nav" aria-label="Mobile navigation" onKeyDown={(event) => { if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); } }} className="absolute top-full right-4 left-4 mt-2 grid rounded-2xl border border-border bg-card p-3 shadow-lg lg:hidden">
          {[["The workspace", "#product"], ["How it works", "#how"], ["Focus calculator", "#calculator"], ["FAQ", "#faq"], ["Log in", "/login"]].map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm hover:bg-muted">{label}</Link>)}
        </nav>}
      </header>
      </div>

    <section className="attention-hero relative isolate overflow-hidden bg-background">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-14 pb-12 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-24">
        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.18em] sm:text-xs"><span className="size-1.5 rounded-full bg-chart-1" />A little intention goes a long way</p>
          <h1 className="mt-6 max-w-xl text-[clamp(2.8rem,5.4vw,5.3rem)] leading-[1.03] font-semibold tracking-[-.055em]">
            Your attention.<br /><span className="attention-headline">Back in your</span><br />hands.
          </h1>
          <p className="mt-7 max-w-[420px] text-base leading-relaxed text-muted-foreground sm:text-lg">The day will always ask for more. Decide what gets your time. Make a plan, settle into one thing, and see your progress with lockIn.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-xl px-6 text-sm"><Link href="/dashboard">Make room for focus<ArrowRight className="size-4" /></Link></Button>
            <button type="button" onClick={showDemo} className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 text-sm font-medium hover:bg-muted"><Play className="size-3.5" />Try it right here</button>
          </div>
          <div className="mt-9 flex items-center gap-4 text-xs text-muted-foreground"><span className="h-px w-10 bg-primary/25" /><span>Less switching. More finishing.</span></div>
        </div>

        <div className="attention-desk relative min-w-0 px-3 pt-4 pb-5 sm:px-7 sm:pb-8">
          <div className="relative isolate">
          <div className="attention-stack-card attention-stack-back pointer-events-none absolute inset-0 rounded-2xl border border-primary/20 bg-accent" aria-hidden="true" />
          <div className="attention-stack-card attention-stack-middle pointer-events-none absolute inset-0 rounded-2xl border border-primary/15 bg-secondary" aria-hidden="true" />
          <div className="attention-preview-card attention-stack-front relative overflow-hidden rounded-2xl border border-primary/15 bg-card">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-md bg-primary text-[10px] font-semibold text-primary-foreground">in</span><span className="text-xs font-semibold">A little space to focus</span></div>
              <span className="rounded-md bg-muted px-2 py-1 text-[9px] uppercase tracking-wider text-muted-foreground">Live demo</span>
            </div>

            <div className="p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3"><p className="text-[10px] font-semibold uppercase tracking-[.15em] text-muted-foreground">One clear intention</p><span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Check className="size-3" />You choose the pace</span></div>
              <h2 className="max-w-xs text-xl font-semibold leading-snug tracking-tight sm:text-2xl">Write the architecture note.</h2>
              <div className="mt-5 flex gap-2" role="group" aria-label="Demo duration">
                {[25, 50, 90].map((minutes) => <button key={minutes} type="button" aria-pressed={duration === minutes} onClick={() => { setDuration(minutes); setSeconds(minutes * 60); setRunning(false); }} className={`min-h-10 flex-1 rounded-lg border px-3 text-xs transition-colors ${duration === minutes ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-muted"}`}>{minutes} min</button>)}
              </div>
              <div className="relative mt-5 overflow-hidden rounded-xl border border-border bg-background px-5 py-6">
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 opacity-30" aria-hidden="true" style={{ backgroundImage: "repeating-linear-gradient(90deg, var(--primary) 0 1px, transparent 1px 12px)", maskImage: "linear-gradient(transparent, black)" }} />
                <div className="relative flex items-center justify-between gap-3">
                  <div><p className="text-[9px] uppercase tracking-widest text-muted-foreground">Attention, protected</p><p role="timer" aria-label="Demo time remaining" className="mt-3 font-mono text-5xl leading-none tracking-[-.06em] tabular-nums sm:text-6xl">{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</p></div>
                  <span className={`attention-signal flex h-10 items-center gap-1 ${running ? "is-running" : ""}`} aria-hidden="true">{[12, 24, 36, 20, 30].map((height, i) => <span key={i} className="w-1 rounded-full bg-chart-1" style={{ height, animationDelay: `${i * 130}ms` }} />)}</span>
                </div>
                <p aria-live="polite" className="relative mt-4 text-[10px] text-muted-foreground">{seconds === 0 ? "Session complete. Take a moment to reset." : running ? "Stay with this one thing." : "A fresh start is one click away."}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button ref={timerButton} type="button" onClick={() => { if (seconds === 0) setSeconds(duration * 60); setRunning(!running); }} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">{running ? <Pause className="size-4" /> : <Play className="size-4" />}{running ? "Pause focus" : seconds === 0 ? "Start again" : "Start focus"}</button>
                <button type="button" aria-label="Reset demo" onClick={() => { setSeconds(duration * 60); setRunning(false); }} className="grid size-11 place-items-center rounded-xl border border-border hover:bg-muted"><RotateCcw className="size-4" /></button>
              </div>
              <p className="mt-3 text-center text-[10px] text-muted-foreground">Try the timer. Your workspace stays untouched.</p>
            </div>

            <div className="border-t border-border bg-muted/50 px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between text-[10px]"><span className="font-semibold">Your next {duration} minutes</span><span className="text-muted-foreground">One thing at a time</span></div>
              <div className="mt-3 flex h-2 gap-1" aria-hidden="true">
                <span className="relative flex-[5] overflow-hidden rounded-full bg-primary/15"><span className="absolute inset-y-0 left-0 rounded-full bg-chart-1" style={{ width: `${progress}%` }} /></span>
                <span className="flex-1 rounded-full border border-dashed border-primary/25" />
              </div>
              <div className="mt-2 flex justify-between text-[9px] text-muted-foreground"><span>Focus block</span><span>Then, breathe</span></div>
            </div>
          </div>
          </div>
          <p className="relative mt-14 flex items-center justify-center gap-2 text-center font-mono text-[10px] text-muted-foreground"><span className="h-px w-5 shrink-0 bg-primary/20" />Built around your attention, not your backlog.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-primary/10 px-5 sm:px-8">
        <div className="grid gap-6 py-7 sm:grid-cols-3 sm:gap-8 sm:py-9">
          {[{ number: "01", title: "Give the day a direction.", detail: "A realistic budget for your attention." }, { number: "02", title: "Let one thing have the floor.", detail: "Protected sessions for meaningful work." }, { number: "03", title: "Find a rhythm that lasts.", detail: "Honest progress you can learn from." }].map((step) => <div key={step.number} className="flex items-start gap-3"><span className="mt-0.5 font-mono text-xs text-chart-1">{step.number}</span><div><h3 className="text-sm font-semibold">{step.title}</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.detail}</p></div></div>)}
        </div>
        <a href="#product" className="mx-auto mb-7 flex w-fit items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground hover:text-primary">Meet your workspace<ArrowDown className="size-3" /></a>
      </div>
    </section>
    </>
  );
}
