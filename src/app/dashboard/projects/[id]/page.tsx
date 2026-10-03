import {
  createTask,
  createMilestone,
  updateTaskStatus,
  deleteTask,
} from "./actions";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProjectAssistant from "./assistant";

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
          createdAt: "desc" 
        },
      },
      milestones: {
        orderBy: { 
          createdAt: "desc" 
        },
      },
      activities: {
        orderBy: { 
          createdAt: "desc" 
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

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <a
          href="/dashboard"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to dashboard
        </a>

        <header className="mt-6">
          <p className="text-sm font-medium text-slate-500">Project</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            {project.name}
          </h1>

          {project.description && (
            <p className="mt-3 max-w-3xl text-slate-600">
              {project.description}
            </p>
          )}
        </header>

        <ProjectAssistant projectId={id} />

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-sm font-semibold text-blue-600">ACTIVITY</p>
            <h2 className="text-xl font-semibold text-slate-900">
              Recent activity
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              See what has happened in this project.
            </p>
          </div>

          {project.activities.length === 0 ? (
            <p className="text-sm text-slate-500">
              No activity yet.
            </p>
          ) : (
            <div className="space-y-4">
              {project.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700">
                      {activity.description}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {activity.createdAt.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card label="Tasks" value={project.tasks.length} />
          <Card label="Completed" value={completedTasks} />
          <Card label="Milestones" value={project.milestones.length} />
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900">Tasks</h2>

          <form
            action={async (formData) => {
              "use server";
              await createTask(id, formData);
            }}
            className="mt-4 rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Task title
                </label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Build homepage"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Priority
                </label>
                <select
                  name="priority"
                  defaultValue="MEDIUM"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="What needs to be done?"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
            
            <button
              type="submit"
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Add task
            </button>
          </form>

          <div className="mt-4 space-y-3">
            {project.tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {task.title}
                    </p>

                    {task.description && (
                      <p className="mt-1 text-sm text-slate-500">
                        {task.description}
                      </p>
                    )}
                  </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                      {task.priority}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        task.status === "DONE"
                          ? "bg-green-100 text-green-700"
                          : task.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-700"
                            : task.status === "REVIEW"
                              ? "bg-amber-100 text-amber-700"
                              : task.status === "TODO"
                                ? "bg-slate-100 text-slate-700"
                                : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <form
                    action={updateTaskStatus.bind(null, task.id, "BACKLOG")}
                  >
                    <button
                      type="submit"
                      className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                        task.status === "BACKLOG"
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      Backlog
                    </button>
                  </form>

                  <form
                    action={updateTaskStatus.bind(null, task.id, "TODO")}
                  >
                    <button
                      type="submit"
                      className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                        task.status === "TODO"
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      To Do
                    </button>
                  </form>

                  <form
                    action={updateTaskStatus.bind(null, task.id, "IN_PROGRESS")}
                  >
                    <button
                      type="submit"
                      className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                        task.status === "IN_PROGRESS"
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-blue-200 text-blue-600"
                      }`}
                    >
                      In Progress
                    </button>
                  </form>

                  <form
                    action={updateTaskStatus.bind(null, task.id, "REVIEW")}
                  >
                    <button
                      type="submit"
                      className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                        task.status === "REVIEW"
                          ? "border-amber-600 bg-amber-600 text-white"
                          : "border-amber-200 text-amber-600"
                      }`}
                    >
                      Review
                    </button>
                  </form>

                  <form
                    action={updateTaskStatus.bind(null, task.id, "DONE")}
                  >
                    <button
                      type="submit"
                      className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                        task.status === "DONE"
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-green-200 text-green-600"
                      }`}
                    >
                      Done
                    </button>
                  </form>

                  <form action={deleteTask.bind(null, task.id)}>
                    <button
                      type="submit"
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-950">Milestones</h2>
            <form
              action={async (formData) => {
                "use server";
                await createMilestone(id, formData);
              }}
              className="mt-4 rounded-xl border border-slate-200 p-5"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Milestone title
                  </label>
                  <input
                    name="title"
                    required
                    placeholder="e.g. Launch MVP"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <input
                    name="description"
                    placeholder="What should be completed?"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Add milestone
              </button>
            </form>

          {project.milestones.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No milestones yet.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {project.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <p className="font-semibold text-slate-900">
                    {milestone.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {milestone.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  );
}