import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SearchBox from "./SearchBox";
import { Card } from "@/components/ui/Card";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const [projects, activeTaskCount, completedCount] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: {
        tasks: {
          select: { status: true },
        },
      },
    }),
    prisma.task.count({
      where: {
        project: { ownerId: session.user.id },
        status: { not: "DONE" },
      },
    }),
    prisma.task.count({
      where: {
        project: { ownerId: session.user.id },
        status: "DONE",
      },
    }),
  ]);

  const totalTasks = activeTaskCount + completedCount;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedCount / totalTasks) * 100);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="flex h-20 items-center border-b border-slate-100 px-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white">
                <img
                  src="/launchpad-logo.png"
                  alt="LaunchPad"
                  className="h-full w-full object-contain"
                />
              </div>

              <span className="launchpad-wordmark text-2xl">
                LaunchPad
              </span>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6">
            <div className="flex items-center justify-between px-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Workspace
              </p>

              <span className="text-[10px] font-medium text-slate-300">
                MAIN
              </span>
            </div>

            <div className="mt-3 space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-xl bg-[var(--launchpad-green)]/10 px-3 py-2.5 text-sm font-semibold text-[var(--launchpad-teal-dark)]"
              >
                <span>⌂</span>
                Dashboard
              </Link>

              <Link
                href="/dashboard/projects/new"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <span>＋</span>
                New project
              </Link>

              <Link
                href="/dashboard/ai"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <span>✦</span>
                AI Planner
              </Link>
            </div>
          </nav>

          <div className="border-t border-slate-100 p-4">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
                <span>↪</span>
                Sign out
              </button>
            </form>
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Mobile header */}
          <header className="border-b border-slate-200 bg-white lg:hidden">
            <div className="flex h-16 items-center justify-between px-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-white">
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

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button className="text-sm font-medium text-slate-500">
                  Sign out
                </button>
              </form>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Top bar */}
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--launchpad-teal)]">
                  Workspace
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Welcome
                  {session.user.name ? `, ${session.user.name}` : ""}
                  <span className="ml-2">👋</span>
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Here&apos;s what&apos;s happening with your projects.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <SearchBox />

                <Link
                  href="/dashboard/ai"
                  className="launchpad-gradient inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                  <span>✦</span>
                  AI Project Planner
                </Link>
              </div>
            </div>

            {/* Stats */}
            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card className="p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                <Stat
                  label="Projects"
                  value={projects.length}
                  icon="◈"
                  description="Your active workspace"
                />
              </Card>

              <Card className="p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                <Stat
                  label="Active tasks"
                  value={activeTaskCount}
                  icon="◷"
                  description="Tasks still in progress"
                />
              </Card>

              <Card className="p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                <Stat
                  label="Completed"
                  value={completedCount}
                  icon="✓"
                  description="Tasks finished"
                />
              </Card>

              <Card className="p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Overall progress
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight">
                      {progress}%
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600">
                    ↗
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="launchpad-gradient h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  {completedCount} of {totalTasks} tasks completed
                </p>
              </Card>
            </section>

            {/* Projects */}
            <section className="mt-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    Your projects
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Keep your work organized and moving forward.
                  </p>
                </div>

                <Link
                  href="/dashboard/projects/new"
                  className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-[var(--launchpad-teal-dark)] transition hover:bg-[var(--launchpad-teal)] sm:block"
                >
                  + New project
                </Link>
              </div>

              {projects.length === 0 ? (
                <Card className="mt-5 border-dashed p-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--launchpad-teal)] text-xl text-white">
                    +
                  </div>

                  <p className="mt-4 font-semibold text-slate-900">
                    No projects yet
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Create your first project to get started.
                  </p>

                  <Link
                    href="/dashboard/projects/new"
                    className="mt-5 inline-flex rounded-xl bg-[var(--launchpad-teal)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--launchpad-teal-dark)]"
                  >
                    Create project
                  </Link>
                </Card>
              ) : (
                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  {projects.map((project) => {
                    const completed = project.tasks.filter(
                      (task) => task.status === "DONE"
                    ).length;

                    const total = project.tasks.length;

                    const projectProgress =
                      total === 0
                        ? 0
                        : Math.round((completed / total) * 100);

                    return (
                      <Link
                        key={project.id}
                        href={`/dashboard/projects/${project.id}`}
                        className="group"
                      >
                        <Card className="p-5 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-[var(--launchpad-teal-dark)] group-hover:shadow-md">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl launchpad-gradient text-sm font-bold text-white shadow-sm">
                                {project.name.charAt(0).toUpperCase()}
                              </div>

                              <div className="min-w-0">
                                <h3 className="truncate font-semibold text-slate-950">
                                  {project.name}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                  {completed}/{total} tasks complete
                                </p>
                              </div>
                            </div>

                            <span className="shrink-0 text-sm font-semibold text-slate-500">
                              {projectProgress}%
                            </span>
                          </div>

                          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="launchpad-gradient h-full rounded-full transition-all duration-500"
                              style={{ width: `${projectProgress}%` }}
                            />
                          </div>

                          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                            <span>Project workspace</span>

                            <span className="font-medium text-[var(--launchpad-teal-dark)] opacity-0 transition group-hover:opacity-100">
                              Open project →
                            </span>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            {/* AI Planner */}
            <section className="mt-8">
              <Link href="/dashboard/ai" className="group block">
                <Card className="overflow-hidden border-[var(--launchpad-border)] bg-gradient-to-br from-white via-[var(--launchpad-green)]/5 to-[var(--launchpad-teal)]/5 p-6 shadow-sm transition duration-200 group-hover:-translate-y-0.5 group-hover:border-[var(--launchpad-teal-dark)] group-hover:shadow-md sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl launchpad-gradient text-xl text-white shadow-sm">
                        ✦
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[var(--launchpad-teal-dark)]">
                          AI-powered planning
                        </p>

                        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
                          Turn an idea into a project
                          </h2>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                          Describe what you want to build and let LaunchPad
                          create a structured project with milestones and
                          tasks.
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-[var(--launchpad-teal-dark)] transition group-hover:translate-x-1">
                      Open AI Planner →
                    </span>
                  </div>
                </Card>
              </Link>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  icon,
  description,
}: {
  label: string;
  value: number;
  icon: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">{description}</p>
    </div>
  );
}