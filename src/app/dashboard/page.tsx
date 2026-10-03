import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { signOut } from "@/auth";
import Link from "next/link";
import SearchBox from "./SearchBox";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

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
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Workspace</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Welcome{session.user.name ? `, 
              ${session.user.name}` : ""}
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <SearchBox />
            </div>

            <Link
              href="/dashboard/ai"
              className="rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              AI Project Planner
            </Link>
          </div>
          
          <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Sign out
            </button>
          </form>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-4">
          <Card label="Projects" value={projects.length} />
          <Card label="Active tasks" value={activeTaskCount} />
          <Card label="Completed tasks" value={completedCount} />
          <Card label="Progress" value={progress} suffix="%" />
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">Your projects</h2>
            <Link href="/dashboard/projects/new" className="text-sm text-blue-600 hover:underline">Create a project</Link>
            </div>
            
        {projects.length === 0 ? 
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-10 text-center">
          <p className="font-semibold text-slate-900">No projects yet</p>
          <p className="mt-1 text-sm text-slate-500">Your first project will appear here.</p>
        </div> : 
        <div className="mt-5 space-y-3">
          {projects.map((project) => <a
            key={project.id}
            href={`/dashboard/projects/${project.id}`}
            className="block rounded-xl border border-slate-200 p-4 transition hover:border-slate-400 hover:shadow-sm">
            <p className="font-semibold text-slate-900">{project.name}</p>
            <p className="mt-1 text-sm text-slate-500">{project.tasks.filter((task) => task.status === "DONE").length}/{project.tasks.length} tasks complete</p>
            </a>)}</div>}</section>
      </div>
    </main>
  );
}

function Card({
  label,
  value,
  suffix = "",
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">
        {value}
        {suffix}
      </p>
    </div>
  );
}
