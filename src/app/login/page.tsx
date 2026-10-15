import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
          {/* Brand panel */}
          <section className="relative overflow-hidden launchpad-gradient p-8 text-white sm:p-10 lg:p-12">
            <div className="relative z-10 flex h-full flex-col">
              <Link
                href="/"
                className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/90 transition hover:text-white"
              >
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white">
                  <img
                    src="/launchpad-logo.png"
                    alt="LaunchPad"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="launchpad-wordmark text-xl">
                  LaunchPad
                </span>
              </Link>

              <div className="mt-auto pt-16 lg:pt-32">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                  <span>✦</span>
                  Project workspace
                </div>

                <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                  Turn ideas into progress.
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
                  Plan projects, organize tasks, track milestones, and use AI
                  to keep your work moving forward.
                </p>

                <div className="mt-8 grid gap-3">
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm">
                      ✓
                    </span>
                    <span className="text-sm font-medium text-white/90">
                      Organized project workspace
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm">
                      ✦
                    </span>
                    <span className="text-sm font-medium text-white/90">
                      AI-powered project planning
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          </section>

          {/* Login panel */}
          <section className="p-6 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
                  <img
                    src="/launchpad-logo.png"
                    alt="LaunchPad"
                    className="h-full w-full object-contain"
                  />
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-[var(--launchpad-teal)]">
                  Welcome back
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  Sign in to LaunchPad
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Continue managing your projects, tasks, and milestones.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6">
                <Suspense
                  fallback={
                    <div className="space-y-4">
                      <div className="h-11 animate-pulse rounded-xl bg-slate-200" />
                      <div className="h-11 animate-pulse rounded-xl bg-slate-200" />
                      <div className="h-11 animate-pulse rounded-xl bg-slate-200" />
                    </div>
                  }
                >
                  <LoginForm />
                </Suspense>
              </div>

              <p className="mt-6 text-center text-sm text-slate-500">
                New to LaunchPad?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[var(--launchpad-teal)] transition hover:text-[var(--launchpad-teal-dark)]"
                >
                  Create an account
                </Link>
              </p>

              <Link
                href="/"
                className="mt-5 block text-center text-xs font-medium text-slate-400 transition hover:text-slate-600"
              >
                ← Back to home
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}