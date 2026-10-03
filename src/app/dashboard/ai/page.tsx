import Link from "next/link";
import { generateProject } from "./actions";

export default function AIProjectPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-blue-600">
              AI PROJECT PLANNER
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Turn an idea into a project plan
            </h1>

            <p className="mt-3 text-slate-600">
              Describe what you want to build. LaunchPad will create the
              project, milestones, and actionable tasks for you.
            </p>
          </div>

          <form action={generateProject} className="mt-8">
            <label
              htmlFor="idea"
              className="block text-sm font-semibold text-slate-800"
            >
              What do you want to build?
            </label>

            <textarea
              id="idea"
              name="idea"
              required
              maxLength={2000}
              rows={8}
              placeholder="Example: Build a portfolio website for a software developer with a projects section, blog, contact form, dark mode, and responsive design."
              className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                AI will create the project structure automatically.
              </p>

              <button
                type="submit"
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Generate project
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}