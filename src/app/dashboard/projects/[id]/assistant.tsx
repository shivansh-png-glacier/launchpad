"use client";

import { useState } from "react";
import { askProjectAssistant } from "./actions";

type Props = {
  projectId: string;
};

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
    <section className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-blue-600">
          AI ASSISTANT
        </p>

        <h2 className="mt-1 text-xl font-bold text-slate-950">
          Ask about this project
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Get practical answers based on your actual tasks,
          milestones, and project data.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            handleAsk("What should I work on next?")
          }
          disabled={loading}
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          What should I work on next?
        </button>

        <button
          type="button"
          onClick={() =>
            handleAsk("Give me a summary of this project.")
          }
          disabled={loading}
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Summarize project
        </button>

        <button
          type="button"
          onClick={() =>
            handleAsk("What are the current blockers or risks?")
          }
          disabled={loading}
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Find blockers
        </button>
      </div>

      <div className="mt-5">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Ask something about this project..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            {question.length}/1000
          </p>

          <button
            type="button"
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {answer && (
        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            LaunchPad AI
          </p>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {answer}
          </p>
        </div>
      )}
    </section>
  );
}