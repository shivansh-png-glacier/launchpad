import { StatCard } from "@/components/stat-card";

const projects = [
  { name: "Personal Finance App", progress: 68, status: "In progress", tasks: "17 / 25" },
  { name: "Portfolio Website", progress: 42, status: "In progress", tasks: "8 / 19" },
  { name: "LaunchPad MVP", progress: 12, status: "Planning", tasks: "3 / 24" },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between border-b border-neutral-200 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-neutral-900 text-sm font-bold text-white">L</div>
              <span className="font-semibold tracking-tight">LaunchPad</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/login" className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">Sign in</a>
            <a href="/register" className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700">Create account</a>
          </div>
        </header>

        <section className="py-10">
          <p className="text-sm font-medium text-neutral-500">Workspace overview</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Turn ideas into shipped work.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600">
            Plan projects with AI, break them into actionable tasks, and keep execution moving from one workspace.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total projects" value="3" detail="1 currently planning" />
          <StatCard label="Active tasks" value="28" detail="6 due this week" />
          <StatCard label="Completed" value="25" detail="Across all projects" />
          <StatCard label="Overall progress" value="41%" detail="Across active projects" />
        </section>

        <section className="mt-10 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
            <div>
              <h2 className="font-semibold">Your projects</h2>
              <p className="mt-1 text-sm text-neutral-500">A snapshot of current work.</p>
            </div>
            <button className="text-sm font-medium text-neutral-700 hover:text-neutral-950">View all →</button>
          </div>
          <div className="divide-y divide-neutral-200">
            {projects.map((project) => (
              <article key={project.name} className="p-5 transition hover:bg-neutral-50">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{project.name}</h3>
                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600">{project.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">{project.tasks} tasks completed</p>
                  </div>
                  <div className="w-full sm:w-56">
                    <div className="mb-2 flex justify-between text-xs text-neutral-500">
                      <span>Progress</span><span>{project.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                      <div className="h-full rounded-full bg-neutral-900" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-900 p-6 text-white">
            <p className="text-sm text-neutral-400">AI project planner</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Have an idea? Start with the messy version.</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-300">
              Describe what you want to build. LaunchPad will turn it into goals, milestones, and actionable tasks for you to review.
            </p>
            <button className="mt-6 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-200">
              Generate a project plan
            </button>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">Next up</p>
            <h2 className="mt-2 text-lg font-semibold">Design the authentication flow</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Keep the first release focused: authentication, projects, tasks, and AI planning.</p>
            <div className="mt-5 flex items-center justify-between text-xs text-neutral-500">
              <span>LaunchPad MVP</span><span>High priority</span>
            </div>
          </div>
        </section>
      </div>
</main>
  );
}
