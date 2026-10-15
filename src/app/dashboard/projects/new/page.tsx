import Link from "next/link";
import { createProject } from "@/app/dashboard/actions";

export default function NewProjectPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        {/* Back navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[var(--launchpad-teal)]"
        >
          <span>←</span>
          Back to dashboard
        </Link>

        {/* Header */}
        <div className="mt-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl launchpad-gradient text-lg font-bold text-white shadow-sm">
            +
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-[var(--launchpad-teal-dark)]">
            New project
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Create a project
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Turn an idea into an organized workspace. Add the basics now and
            build out tasks, milestones, and AI planning later.
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-7">
            <p className="text-sm font-semibold text-slate-800">
              Project details
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Give your project enough context to get started.
            </p>
          </div>

          <form action={createProject} className="p-5 sm:p-7">
            <div className="space-y-6">
              {/* Project name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Project name
                </label>

                <p className="mt-1 text-xs text-slate-400">
                  Choose a short, recognizable name.
                </p>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. LaunchPad"
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--launchpad-teal)] focus:ring-4 focus:ring-[var(--launchpad-green)]/20"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <p className="mt-1 text-xs text-slate-400">
                  Explain what you&apos;re building or organizing.
                </p>

                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="What is this project about?"
                  className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--launchpad-teal)] focus:ring-4 focus:ring-[var(--launchpad-green)]/20"
                />
              </div>

              {/* Goal */}
              <div>
                <label
                  htmlFor="goal"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Project goal
                </label>

                <p className="mt-1 text-xs text-slate-400">
                  What should this project accomplish?
                </p>

                <textarea
                  id="goal"
                  name="goal"
                  rows={3}
                  placeholder="e.g. Launch a working MVP for our first 100 users."
                  className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--launchpad-teal)] focus:ring-4 focus:ring-[var(--launchpad-green)]/20"
                />
              </div>

              {/* Deadline */}
              <div>
                <label
                  htmlFor="deadline"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Deadline
                </label>

                <p className="mt-1 text-xs text-slate-400">
                  Optional. You can add or change this later.
                </p>

                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--launchpad-teal)] focus:ring-4 focus:ring-[var(--launchpad-green)]/20 sm:max-w-xs"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-400">
                You can add tasks and milestones after creation.
              </p>

              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="rounded-xl launchpad-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 hover:shadow-md"
                >
                  Create project →
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Helpful note */}
        <div className="mt-5 rounded-2xl border border-[var(--launchpad-border)] bg-[var(--launchpad-green)]/10 p-4">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--launchpad-green)]/20 text-sm font-bold text-[var(--launchpad-teal-dark)]">
              ✦
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Want help planning it?
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                After creating your project, use LaunchPad AI Planner to turn
                your idea into milestones and tasks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}