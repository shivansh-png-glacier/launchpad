import {
  createTask,
  createMilestone,
  updateTaskStatus,
  deleteTask,
} from "./actions";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProjectAssistant from "./assistant";
import TaskBoard from "./TaskBoard";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id,
      ownerId: session.user.id,
    },
    include: {
      tasks: {
        orderBy: {
          createdAt: "desc",
        },
      },
      milestones: {
        orderBy: {
          createdAt: "desc",
        },
      },
      activities: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });

  if (!project) {
    notFound();
  }

  const completedTasks = project.tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  const totalTasks = project.tasks.length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const taskColumns = [
    {
      key: "BACKLOG",
      label: "Backlog",
    },
    {
      key: "TODO",
      label: "To Do",
    },
    {
      key: "IN_PROGRESS",
      label: "In Progress",
    },
    {
      key: "REVIEW",
      label: "Review",
    },
    {
      key: "DONE",
      label: "Done",
    },
  ] as const;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* Top navigation */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
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

          <Link
            href="/dashboard"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Project header */}
        <section>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Link
                  href="/dashboard"
                  className="transition hover:text-[var(--launchpad-teal)]"
                >
                  Workspace
                </Link>

                <span>/</span>

                <span>Project</span>
              </div>

              <div className="mt-4 flex items-start gap-4">
                <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--launchpad-green)]/10 text-xl font-bold text-[var(--launchpad-teal-dark)] sm:flex">
                  {project.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {project.name}
                  </h1>

                  {project.description && (
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm">
                <p className="text-xs font-medium text-slate-400">
                  Progress
                </p>

                <p className="mt-1 text-xl font-bold text-slate-950">
                  {progress}%
                </p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">
                Project progress
              </span>

              <span className="text-slate-500">
                {completedTasks}/{totalTasks} tasks complete
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="launchpad-gradient h-full rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        {/* Section navigation */}
        <nav className="mt-6 flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <a
            href="#tasks"
            className="shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-[var(--launchpad-green)]/10 hover:text-[var(--launchpad-teal-dark)]"
          >
            Tasks
          </a>

          <a
            href="#milestones"
            className="shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-[var(--launchpad-green)]/10 hover:text-[var(--launchpad-teal-dark)]"
          >
            Milestones
          </a>

          <a
            href="#activity"
            className="shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-[var(--launchpad-green)]/10 hover:text-[var(--launchpad-teal-dark)]"
          >
            Activity
          </a>
        </nav>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <Card
            label="Tasks"
            value={project.tasks.length}
            icon="✓"
          />

          <Card
            label="Completed"
            value={completedTasks}
            icon="↗"
          />

          <Card
            label="Milestones"
            value={project.milestones.length}
            icon="◆"
          />
        </section>

        {/* AI Assistant */}
        <section className="mt-6">
          <ProjectAssistant projectId={id} />
        </section>

        {/* Activity */}
        <section id="activity" className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--launchpad-green)]/10 text-sm text-[var(--launchpad-teal-dark)]">
                    •
                  </span>

                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--launchpad-teal-dark)]">
                    Activity
                  </p>
                </div>

                <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-950">
                  Recent activity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  A timeline of what&apos;s happening in this project.
                </p>
              </div>

              <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 sm:inline-flex">
                {project.activities.length} recent
              </span>
            </div>
          </div>

          {project.activities.length === 0 ? (
            <div className="p-6">
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                  •
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  No activity yet
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Project actions will appear here as you work.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="relative">
                <div className="absolute bottom-3 left-[15px] top-3 w-px bg-slate-200" />

                <div className="space-y-6">
                  {project.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="relative flex gap-4"
                    >
                      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[var(--launchpad-green)]/15 text-xs font-bold text-[var(--launchpad-teal-dark)]">
                        {activity.type === "TASK_CREATED"
                          ? "+"
                          : activity.type === "TASK_DELETED"
                            ? "×"
                            : activity.type === "TASK_STATUS_UPDATED"
                              ? "→"
                              : activity.type === "MILESTONE_CREATED"
                                ? "◆"
                                : "•"}
                      </div>

                      <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                          <p className="text-sm leading-6 text-slate-700">
                            {activity.description}
                          </p>

                          <time className="shrink-0 text-[11px] font-medium text-slate-400">
                            {activity.createdAt.toLocaleString()}
                          </time>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Tasks */}
        <section id="tasks" className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--launchpad-teal-dark)]">
                Execution
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                Tasks
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create tasks and move them through your workflow.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {project.tasks.length} total
              </span>

              <span className="hidden rounded-full bg-[var(--launchpad-green)]/10 px-3 py-1 text-xs font-semibold text-[var(--launchpad-teal-dark)] sm:block">
                {completedTasks} completed
              </span>
            </div>
          </div>

          {/* Add task */}
          <form
            action={async (formData) => {
              "use server";
              await createTask(id, formData);
            }}
            className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--launchpad-teal-light)] text-sm font-bold text-[var(--launchpad-teal-dark)]">
                  +
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Add a task
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Capture the next piece of work for this project.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 pt-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Task title
                  </label>

                  <input
                    name="title"
                    required
                    placeholder="e.g. Build homepage"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[var(--launchpad-teal)] focus:bg-white focus:ring-2 focus:ring-[var(--launchpad-green)]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Priority
                  </label>

                  <select
                    name="priority"
                    defaultValue="MEDIUM"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[var(--launchpad-teal)] focus:bg-white focus:ring-2 focus:ring-[var(--launchpad-green)]/20"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4 px-5">
              <label className="block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                rows={3}
                placeholder="What needs to be done?"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[var(--launchpad-teal)] focus:bg-white focus:ring-2 focus:ring-[var(--launchpad-green)]/20"
              />
            </div>

            <button
              type="submit"
              className="mx-5 mb-5 mt-5 rounded-xl launchpad-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 hover:shadow-md"
            >
              + Add task
            </button>
          </form>

          <TaskBoard
            tasks={project.tasks.map((task) => ({
              id: task.id,
              title: task.title,
              description: task.description,
              priority: task.priority,
              status: task.status,
            }))}
          />
        </section>

        {/* Milestones */}
        <section id="milestones" className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--launchpad-green)]/10 text-sm text-[var(--launchpad-teal-dark)]">
                    ◆
                  </span>

                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--launchpad-teal-dark)]">
                    Roadmap
                  </p>
                </div>

                <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-950">
                  Milestones
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Break the project into meaningful checkpoints.
                </p>
              </div>

              <span className="self-start rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                {project.milestones.length}{" "}
                {project.milestones.length === 1
                  ? "milestone"
                  : "milestones"}
              </span>
            </div>
          </div>

          {/* Add milestone */}
          <div className="border-b border-slate-100 p-6">
            <form
              action={async (formData) => {
                "use server";
                await createMilestone(id, formData);
              }}
              className="rounded-2xl bg-slate-50 p-4 sm:p-5"
            >
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-800">
                  Add a milestone
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Define an important checkpoint for the project.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600">
                    Milestone title
                  </label>

                  <input
                    name="title"
                    required
                    placeholder="e.g. Launch MVP"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[var(--launchpad-teal)] focus:ring-2 focus:ring-[var(--launchpad-green)]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600">
                    Description
                  </label>

                  <input
                    name="description"
                    placeholder="What should be completed?"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[var(--launchpad-teal)] focus:ring-2 focus:ring-[var(--launchpad-green)]/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 rounded-xl launchpad-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 hover:shadow-md"
              >
                + Add milestone
              </button>
            </form>
          </div>

          {/* Milestone list */}
          <div className="p-6">
            {project.milestones.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--launchpad-green)]/10 text-[var(--launchpad-teal-dark)] shadow-sm">
                  ◆
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  No milestones yet
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Add your first checkpoint above.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {project.milestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[var(--launchpad-teal)] hover:shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--launchpad-green)]/10 text-sm font-bold text-[var(--launchpad-teal-dark)]">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-bold leading-5 text-slate-950">
                            {milestone.title}
                          </h3>

                          <span className="shrink-0 text-xs text-slate-300 transition group-hover:text-[var(--launchpad-teal)]">
                            →
                          </span>
                        </div>

                        {milestone.description ? (
                          <p className="mt-2 text-xs leading-5 text-slate-500">
                            {milestone.description}
                          </p>
                        ) : (
                          <p className="mt-2 text-xs italic text-slate-400">
                            No description provided.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

function StatusButton({
  action,
  active,
  children,
}: {
  action: (formData: FormData) => void;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
          active
            ? "border-[var(--launchpad-teal)] launchpad-gradient text-white shadow-sm"
            : "border-slate-200 bg-white text-slate-600 hover:border-[var(--launchpad-teal)] hover:bg-[var(--launchpad-green)]/10 hover:text-[var(--launchpad-teal-dark)]"
        }`}
      >
        {children}
      </button>
    </form>
  );
}

function priorityStyle(priority: string) {
  switch (priority) {
    case "URGENT":
      return "bg-red-50 text-red-700";
    case "HIGH":
      return "bg-orange-50 text-orange-700";
    case "MEDIUM":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function statusStyle(status: string) {
  switch (status) {
    case "DONE":
      return "bg-emerald-50 text-emerald-700";
    case "IN_PROGRESS":
      return "bg-indigo-50 text-indigo-700";
    case "REVIEW":
      return "bg-amber-50 text-amber-700";
    case "TODO":
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}