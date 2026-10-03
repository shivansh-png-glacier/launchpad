import Link from "next/link";
import { createProject } from "@/app/dashboard/actions";

export default function NewProjectPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-slate-600 hover:text-slate-950"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-medium text-slate-500">New project</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Create a project
            </h1>
            <p className="mt-2 text-slate-600">
              Start with the basics. You can add tasks and milestones later.
            </p>
          </div>

          <form action={createProject} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Project name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. LaunchPad"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="What is this project about?"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="goal"
                className="block text-sm font-medium text-slate-700"
              >
                Goal
              </label>
              <textarea
                id="goal"
                name="goal"
                rows={3}
                placeholder="What should this project accomplish?"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="deadline"
                className="block text-sm font-medium text-slate-700"
              >
                Deadline
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
              <Link
                href="/dashboard"
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Create project
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}