import Link from "next/link";
import { generateProject } from "./actions";

export default function AIProjectPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        {/* Back navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[var(--launchpad-teal)]"
        >
          <span>←</span>
          Back to dashboard
        </Link>

        {/* Hero */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/20 launchpad-gradient p-6 text-white shadow-lg sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                  ✦
                </span>
                LaunchPad AI
              </div>
              <h1 className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-[var(--launchpad-teal)]">
                Turn your idea into a project plan.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
                Describe what you want to build and LaunchPad will turn the
                idea into a structured project with milestones and actionable
                tasks.
              </p>
            </div>

            <div className="hidden shrink-0 lg:block">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                  AI workflow
                </p>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-[10px]">
                      1
                    </span>
                    Idea
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-[10px]">
                      2
                    </span>
                    Milestones
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-[10px]">
                      3
                    </span>
                    Tasks
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Planner form */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--launchpad-green)]/10 text-sm font-bold text-[var(--launchpad-teal-dark)]">
                ✦
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-950">
                  Describe your idea
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  The more useful context you provide, the better the generated
                  project plan will be.
                </p>
              </div>
            </div>
          </div>

          <form action={generateProject} className="p-5 sm:p-7">
            <label
              htmlFor="idea"
              className="block text-sm font-semibold text-slate-700"
            >
              What do you want to build?
            </label>

            <p className="mt-1 text-xs text-slate-400">
              Include the goal, important features, users, or constraints you
              already know.
            </p>

            <textarea
              id="idea"
              name="idea"
              required
              maxLength={2000}
              rows={9}
              placeholder="Example: Build a portfolio website for a software developer with a projects section, blog, contact form, dark mode, and responsive design."
              className="mt-4 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--launchpad-teal)] focus:bg-white focus:ring-4 focus:ring-[var(--launchpad-green)]/20"
            />

            <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-600">
                  ✓
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    What LaunchPad creates
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Project structure, milestones, and actionable tasks.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl launchpad-gradient px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 hover:shadow-md"
              >
                Generate project
                <span>→</span>
              </button>
            </div>
          </form>
        </div>

        {/* Example ideas */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Example
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-700">
              SaaS product
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Build a subscription-based productivity platform.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Example
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-700">
              Mobile app
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Create a fitness tracking app for beginners.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Example
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-700">
              Website
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Launch a responsive website for a local business.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}