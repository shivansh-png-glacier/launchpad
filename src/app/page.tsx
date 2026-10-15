export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--launchpad-bg)] text-[var(--launchpad-text)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
              <img
                src="/launchpad-logo.png"
                alt="LaunchPad"
                className="h-full w-full object-contain"
              />
            </div>

            <span className="launchpad-wordmark text-2xl">
              LaunchPad
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-[var(--launchpad-text)] transition hover:bg-white"
            >
              Sign in
            </a>

            <a
              href="/register"
              className="launchpad-gradient rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Get started
            </a>
          </div>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-[var(--launchpad-border)] bg-white px-4 py-2 text-sm font-medium shadow-sm">
              <span className="mr-2 h-2 w-2 rounded-full bg-[var(--launchpad-green)]" />
              Your AI-powered project workspace
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
              Turn ideas into
              <span className="launchpad-text-gradient block">
                shipped work.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--launchpad-muted)] sm:text-xl">
              LaunchPad helps you plan projects, organize tasks, track
              milestones, and use AI to turn rough ideas into actionable work.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/register"
                className="launchpad-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
              >
                Start building for free
              </a>

              <a
                href="/login"
                className="rounded-xl border border-[var(--launchpad-border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--launchpad-text)] shadow-sm transition hover:bg-slate-50"
              >
                Sign in
              </a>
            </div>
          </div>

          {/* Product preview */}
          <div className="mx-auto mt-16 max-w-5xl rounded-3xl border border-[var(--launchpad-border)] bg-white p-3 shadow-2xl">
            <div className="rounded-2xl border border-[var(--launchpad-border)] bg-[var(--launchpad-bg)] p-5 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--launchpad-muted)]">
                    Project workspace
                  </p>
                  <h2 className="mt-1 text-xl font-bold">
                    LaunchPad MVP
                  </h2>
                </div>

                <span className="rounded-full bg-[var(--launchpad-green)]/15 px-3 py-1 text-xs font-semibold text-[var(--launchpad-teal-dark)]">
                  In progress
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-sm text-[var(--launchpad-muted)]">
                    Tasks
                  </p>
                  <p className="mt-2 text-3xl font-bold">24</p>
                  <p className="mt-1 text-xs text-[var(--launchpad-muted)]">
                    16 completed
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-sm text-[var(--launchpad-muted)]">
                    Milestones
                  </p>
                  <p className="mt-2 text-3xl font-bold">5</p>
                  <p className="mt-1 text-xs text-[var(--launchpad-muted)]">
                    3 completed
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-sm text-[var(--launchpad-muted)]">
                    Progress
                  </p>
                  <p className="mt-2 text-3xl font-bold">68%</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="launchpad-gradient h-full rounded-full"
                      style={{ width: "68%" }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {["Backlog", "In progress", "Done"].map((column) => (
                  <div
                    key={column}
                    className="rounded-2xl border border-[var(--launchpad-border)] bg-white p-4"
                  >
                    <p className="text-sm font-semibold">{column}</p>

                    <div className="mt-3 space-y-2">
                      <div className="rounded-xl bg-[var(--launchpad-bg)] p-3 text-sm">
                        Build authentication flow
                      </div>
                      <div className="rounded-xl bg-[var(--launchpad-bg)] p-3 text-sm">
                        Design project dashboard
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-[var(--launchpad-teal)]">
              Everything in one workspace
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From first idea to final task.
            </h2>

            <p className="mt-4 text-[var(--launchpad-muted)]">
              Keep planning, execution, and AI assistance together instead of
              spreading your project across multiple tools.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <Feature
              title="AI project planning"
              description="Describe what you want to build and turn the idea into milestones and actionable tasks."
            />

            <Feature
              title="Task management"
              description="Organize work with priorities, statuses, milestones, and a focused project workflow."
            />

            <Feature
              title="AI project assistant"
              description="Ask questions about your project and get useful guidance without leaving your workspace."
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="mb-12 overflow-hidden rounded-3xl launchpad-gradient px-6 py-14 text-center text-white shadow-xl sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to launch your next project?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
            Create your workspace, bring your idea to LaunchPad, and start
            turning it into shipped work.
          </p>

          <a
            href="/register"
            className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[var(--launchpad-text)] shadow-sm transition hover:bg-slate-100"
          >
            Create your LaunchPad
          </a>
        </section>

        {/* Footer */}
        <footer className="border-t border-[var(--launchpad-border)] py-6 text-center text-sm text-[var(--launchpad-muted)]">
          © 2026 LaunchPad. Build better. Ship faster.
        </footer>
      </div>
    </main>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--launchpad-border)] bg-white p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl launchpad-gradient text-sm font-bold text-white">
        ✓
      </div>

      <h3 className="mt-5 text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-[var(--launchpad-muted)]">
        {description}
      </p>
    </div>
  );
}