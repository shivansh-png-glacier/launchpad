"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { askProjectAssistant } from "./actions";

type Props = {
  projectId: string;
};

const suggestions = [
  {
    label: "Next best task",
    question: "What should I work on next?",
    icon: "→",
  },
  {
    label: "Project summary",
    question: "Give me a summary of this project.",
    icon: "✦",
  },
  {
    label: "Find blockers",
    question: "What are the current blockers or risks?",
    icon: "!",
  },
];

export default function ProjectAssistant({ projectId }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk(customQuestion?: string) {
    const currentQuestion = (customQuestion ?? question).trim();

    if (!currentQuestion) {
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const result = await askProjectAssistant(
        projectId,
        currentQuestion
      );

      setAnswer(result);
      setQuestion(currentQuestion);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--launchpad-border)] bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-[var(--launchpad-border)] bg-gradient-to-br from-[var(--launchpad-green)]/10 via-white to-[var(--launchpad-teal)]/10 p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--launchpad-teal)] text-lg font-semibold text-white shadow-sm">
            ✦
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--launchpad-teal-dark)]">
                LaunchPad AI
              </p>

              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                Project aware
              </span>
            </div>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              Ask anything about this project
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Get practical answers using your current tasks,
              milestones, and project activity.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        {/* Suggested questions */}
        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Suggested questions
            </p>

            <span className="text-xs text-slate-400">
              Start with one
            </span>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.question}
                type="button"
                onClick={() => handleAsk(suggestion.question)}
                disabled={loading}
                className="group rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-[var(--launchpad-teal)] hover:bg-[var(--launchpad-green)]/10 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 transition group-hover:bg-[var(--launchpad-green)]/20 group-hover:text-[var(--launchpad-teal-dark)]">
                    {suggestion.icon}
                  </span>

                  <span className="text-xs text-slate-300 transition group-hover:text-[var(--launchpad-teal)]">
                    →
                  </span>
                </div>

                <p className="mt-3 text-xs font-semibold text-slate-700">
                  {suggestion.label}
                </p>

                <p className="mt-1 text-[11px] leading-4 text-slate-400">
                  {suggestion.question}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="mt-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-[var(--launchpad-teal)] focus-within:bg-white focus-within:ring-4 focus-within:ring-[var(--launchpad-green)]/20">
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Ask LaunchPad AI about your tasks, priorities, blockers, milestones..."
              className="w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400"
            />

            <div className="flex flex-col gap-3 border-t border-slate-200 px-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--launchpad-green)]/10 text-[10px] font-bold text-[var(--launchpad-teal-dark)]">
                  AI
                </span>

                <p className="text-xs text-slate-400">
                  Answers are based on this project&apos;s data.
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <p className="text-[11px] text-slate-400">
                  {question.length}/1000
                </p>

                <button
                  type="button"
                  onClick={() => handleAsk()}
                  disabled={loading || !question.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl launchpad-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      Ask AI
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100 text-xs font-bold text-red-600">
                !
              </div>

              <div>
                <p className="text-sm font-semibold text-red-800">
                  AI request failed
                </p>

                <p className="mt-1 text-sm leading-5 text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Answer */}
        {answer && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--launchpad-border)] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[var(--launchpad-border)] bg-[var(--launchpad-green)]/50 px-5 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--launchpad-green)]/10 text-xs font-bold text-white">
                ✦
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  LaunchPad AI
                </p>

                <p className="text-[11px] text-slate-400">
                  Project assistant
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="prose prose-slate max-w-none text-sm leading-7">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="mb-4 mt-6 text-xl font-bold text-slate-950 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mb-3 mt-6 text-lg font-bold text-slate-950 first:mt-0">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mb-2 mt-5 text-base font-bold text-slate-950">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-4 leading-7 text-slate-700 last:mb-0">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-4 list-disc space-y-2 pl-5 text-slate-700">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-4 list-decimal space-y-2 pl-5 text-slate-700">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-6">
                        {children}
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-slate-950">
                        {children}
                      </strong>
                    ),
                    code: ({ children }) => (
                      <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-[var(--launchpad-teal-dark)]">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {answer}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}