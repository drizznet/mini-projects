"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Mail, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

import { createLocalAuthSession } from "@/lib/auth";
import { BRAND } from "@/lib/brand";
import { getApiErrorMessage } from "@/lib/utils";
import { getAuthAccessToken, login, register } from "@/services/auth";

type AuthMode = "login" | "signup" | "reset";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  const heading = mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    if (!email || (mode !== "reset" && !password)) {
      setMessage({ kind: "error", text: mode === "reset" ? "Enter your email address to continue." : "Enter your email and password to continue." });
      return;
    }
    setBusy(true);
    try {
      if (mode === "login") {
        const response = await login({ email, password });
        createLocalAuthSession(email, getAuthAccessToken(response));
        const next = new URLSearchParams(window.location.search).get("next");
        const destination = next?.startsWith("/") && !next.startsWith("//")
          ? next
          : "/dashboard";
        router.replace(destination);
      } else if (mode === "signup") {
        const response = await register({ email, password });
        const accessToken = getAuthAccessToken(response);
        if (accessToken) {
          createLocalAuthSession(email, accessToken);
          router.replace("/dashboard");
        } else {
          setMessage({ kind: "success", text: "Account created. Log in to continue." });
          setMode("login");
          setPassword("");
        }
      } else {
        setMessage({ kind: "success", text: "Password reset will be available when accounts are added." });
      }
    } catch (error) {
      setMessage({
        kind: "error",
        text: getApiErrorMessage(error),
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-[25rem]">
      <div className="mb-10 lg:hidden"><Link href="/" className="text-sm font-semibold tracking-[0.28em] text-foreground uppercase">{BRAND.name}</Link></div>
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-primary uppercase">{BRAND.byline}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{heading}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{mode === "login" ? "Pick up where you left off." : mode === "signup" ? "Build a calmer way to work." : "We’ll help you get back in."}</p>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <label className="block"><span className="mb-2 block text-xs font-medium text-muted-foreground">Email address</span><span className="relative block"><Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="h-12 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></span></label>
        {mode !== "reset" && <label className="block"><span className="mb-2 block text-xs font-medium text-muted-foreground">Password</span><span className="relative block"><LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type={showPassword ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" className="h-12 w-full rounded-xl border border-input bg-card px-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></span></label>}
        {message && <p role="alert" className={`rounded-xl border px-3.5 py-3 text-sm ${message.kind === "error" ? "border-destructive/25 bg-destructive/10 text-destructive" : "border-health-excellent/25 bg-health-excellent/10 text-health-excellent"}`}>{message.text}</p>}
        <button type="submit" disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70">{busy ? <Loader2 className="size-4 animate-spin" /> : mode === "reset" ? <RotateCcw className="size-4" /> : <ArrowRight className="size-4" />}{busy ? "Working…" : mode === "login" ? "Log in" : mode === "signup" ? "Create account" : "Send reset link"}</button>
      </form>
      <div className="mt-6 flex items-center justify-between text-sm">{mode === "login" ? <><button type="button" onClick={() => { setMode("reset"); setMessage(null); }} className="text-muted-foreground transition-colors hover:text-foreground">Forgot password?</button><button type="button" onClick={() => { setMode("signup"); setMessage(null); }} className="font-medium text-primary hover:underline">Create account</button></> : <button type="button" onClick={() => { setMode("login"); setMessage(null); }} className="font-medium text-primary hover:underline">Back to log in</button>}</div>
    </div>
  );
}
