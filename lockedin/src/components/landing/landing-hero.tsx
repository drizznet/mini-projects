"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, AudioLines, Check, Pause, Play, RotateCcw } from "lucide-react";

export function LandingHero() {
  const [duration, setDuration] = useState(50);
  const [seconds, setSeconds] = useState(50 * 60);
  const [running, setRunning] = useState(false);
  const remaining = useRef(seconds);
  remaining.current = seconds;

  useEffect(() => {
    if (!running) return;
    const deadline = Date.now() + remaining.current * 1000;
    const interval = window.setInterval(() => setSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000))), 250);
    return () => window.clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (seconds === 0) setRunning(false);
  }, [seconds]);

  return (
    <div className="surface-ink focus-stage relative mx-auto mt-12 w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-ink text-foreground shadow-2xl shadow-primary/15">
      <Image src="/assets/product/focus-orbit.svg" alt="" fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="pointer-events-none object-cover opacity-10 grayscale" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 font-mono text-[10px] tracking-widest text-muted-foreground sm:p-7">
        <span className="flex items-center gap-2"><span className={`size-1.5 rounded-full bg-emerald-300 ${running ? "focus-beacon" : ""}`} />FOCUS ENVIRONMENT</span>
        <span>INTERACTIVE DEMO</span>
      </div>
      <div className="focus-float absolute left-[5%] top-[30%] hidden w-44 rounded-2xl border border-border bg-ink-panel/95 p-4 text-left shadow-xl lg:block">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">One clear intention</span>
        <p className="mt-3 text-sm font-medium">Make room for your best work.</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-health-excellent"><Check className="size-3.5" /> Distractions set aside</div>
      </div>
      <div className="relative mx-auto my-20 w-[calc(100%_-_2rem)] max-w-[290px] rounded-3xl border border-border bg-ink-panel/95 p-5 shadow-2xl sm:my-24 sm:p-6">
        <div className="flex items-center justify-center gap-2 text-xs text-primary"><AudioLines className="size-4" /> Your next clear hour</div>
        <div className="mt-5 flex justify-center gap-1 rounded-full bg-white/5 p-1" aria-label="Demo session duration">
          {[25, 50, 90].map((minutes) => <button key={minutes} type="button" aria-pressed={duration === minutes} onClick={() => { setDuration(minutes); setSeconds(minutes * 60); setRunning(false); }} className={`flex-1 rounded-full py-2 text-xs transition-colors ${duration === minutes ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{minutes} min</button>)}
        </div>
        <div className={`focus-dial mx-auto my-6 grid size-44 place-items-center rounded-full border border-primary/20 ${running ? "is-running" : ""}`}>
          <div>
            <p className="font-mono text-4xl tracking-tight tabular-nums" role="timer" aria-label="Demo time remaining">{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground" aria-live="polite">{seconds === 0 ? "Session complete" : running ? "Stay with it" : "A little space to focus"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => { if (seconds === 0) setSeconds(duration * 60); setRunning(!running); }} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">{running ? <Pause className="size-4" /> : <Play className="size-4" />}{running ? "Pause demo" : seconds === 0 ? "Try again" : "Try a focus session"}</button>
          <button type="button" aria-label="Reset demo timer" onClick={() => { setSeconds(duration * 60); setRunning(false); }} className="rounded-xl border border-border px-3 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"><RotateCcw className="size-4" /></button>
        </div>
        <p className="mt-3 text-[10px] text-muted-foreground">Just a preview. Nothing is saved.</p>
      </div>
      <div className="focus-float absolute right-[5%] bottom-[28%] hidden w-40 rounded-2xl border border-border bg-ink-panel/95 p-4 text-left shadow-xl lg:block" style={{ animationDelay: "-2s" }}>
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">Find your rhythm<ArrowUpRight className="size-4 text-primary" /></div>
        <div className="mt-4 flex h-14 items-end gap-1.5" aria-hidden="true">{[30, 50, 40, 70, 55, 85, 100].map((height, index) => <span key={index} className="focus-bar flex-1 rounded-t bg-primary/70" style={{ height: `${height}%`, animationDelay: `${index * 100}ms` }} />)}</div>
        <p className="mt-3 text-[10px] text-muted-foreground">One session at a time.</p>
      </div>
      <p className="absolute inset-x-0 bottom-5 text-center font-mono text-[9px] uppercase tracking-[.2em] text-muted-foreground">Less noise. More signal.</p>
    </div>
  );
}
