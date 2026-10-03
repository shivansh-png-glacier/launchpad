"use client";

import { useState } from "react";
import Link from "next/link";
import { searchWorkspace } from "./search-actions";

type SearchResults = {
  projects: {
    id: string;
    name: string;
  }[];
  tasks: {
    id: string;
    title: string;
    projectId: string;
  }[];
  milestones: {
    id: string;
    title: string;
    projectId: string;
  }[];
};

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    projects: [],
    tasks: [],
    milestones: [],
  });
  const [loading, setLoading] = useState(false);

  async function handleSearch(value: string) {
    setQuery(value);

    if (!value.trim()) {
      setResults({
        projects: [],
        tasks: [],
        milestones: [],
      });
      return;
    }

    setLoading(true);

    try {
      const data = await searchWorkspace(value);
      setResults(data);
    } finally {
      setLoading(false);
    }
  }

  const hasResults =
    results.projects.length > 0 ||
    results.tasks.length > 0 ||
    results.milestones.length > 0;

  return (
    <div className="relative w-full max-w-md">
      <input
        value={query}
        onChange={(event) => handleSearch(event.target.value)}
        placeholder="Search projects, tasks, milestones..."
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />

      {query.trim() && (
        <div className="absolute left-0 right-0 top-12 z-50 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
          {loading ? (
            <p className="p-2 text-sm text-slate-500">
              Searching...
            </p>
          ) : !hasResults ? (
            <p className="p-2 text-sm text-slate-500">
              No results found.
            </p>
          ) : (
            <div className="space-y-4">
              {results.projects.length > 0 && (
                <div>
                  <p className="px-2 text-xs font-semibold uppercase text-slate-400">
                    Projects
                  </p>

                  <div className="mt-1">
                    {results.projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/dashboard/projects/${project.id}`}
                        className="block rounded-lg px-2 py-2 text-sm hover:bg-slate-50"
                      >
                        {project.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.tasks.length > 0 && (
                <div>
                  <p className="px-2 text-xs font-semibold uppercase text-slate-400">
                    Tasks
                  </p>

                  <div className="mt-1">
                    {results.tasks.map((task) => (
                      <Link
                        key={task.id}
                        href={`/dashboard/projects/${task.projectId}`}
                        className="block rounded-lg px-2 py-2 text-sm hover:bg-slate-50"
                      >
                        {task.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.milestones.length > 0 && (
                <div>
                  <p className="px-2 text-xs font-semibold uppercase text-slate-400">
                    Milestones
                  </p>

                  <div className="mt-1">
                    {results.milestones.map((milestone) => (
                      <Link
                        key={milestone.id}
                        href={`/dashboard/projects/${milestone.projectId}`}
                        className="block rounded-lg px-2 py-2 text-sm hover:bg-slate-50"
                      >
                        {milestone.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}