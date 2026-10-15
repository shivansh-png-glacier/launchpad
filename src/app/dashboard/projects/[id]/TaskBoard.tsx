"use client";

import { useState } from "react";
import { updateTaskStatus } from "./actions";

type TaskStatus =
  | "BACKLOG"
  | "TODO"
  | "IN_PROGRESS"
  | "REVIEW"
  | "DONE";

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: TaskStatus;
};

const columns: {
  key: TaskStatus;
  label: string;
}[] = [
  { key: "BACKLOG", label: "Backlog" },
  { key: "TODO", label: "To Do" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "REVIEW", label: "Review" },
  { key: "DONE", label: "Done" },
];

export default function TaskBoard({ tasks }: { tasks: Task[] }) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] =
    useState<TaskStatus | null>(null);
  const [movingTaskId, setMovingTaskId] = useState<string | null>(null);
  const [mobileColumn, setMobileColumn] =
    useState<TaskStatus>("TODO");

  async function handleDrop(status: TaskStatus) {
    if (!draggedTaskId || movingTaskId) return;

    const task = tasks.find((item) => item.id === draggedTaskId);

    if (!task || task.status === status) {
      setDraggedTaskId(null);
      setDragOverColumn(null);
      return;
    }

    try {
      setMovingTaskId(draggedTaskId);

      await updateTaskStatus(draggedTaskId, status);
    } finally {
      setMovingTaskId(null);
      setDraggedTaskId(null);
      setDragOverColumn(null);
    }
  }

  async function handleMobileStatusChange(
    taskId: string,
    status: TaskStatus
  ) {
    const task = tasks.find((item) => item.id === taskId);

    if (!task || task.status === status) return;

    try {
      setMovingTaskId(taskId);
      await updateTaskStatus(taskId, status);
    } finally {
      setMovingTaskId(null);
    }
  }

  return (
    <>
      {/* ====================================================== */}
      {/* DESKTOP KANBAN                                         */}
      {/* ====================================================== */}

      <div className="mt-5 hidden overflow-x-auto pb-4 lg:block">
        <div className="grid min-w-[1100px] grid-cols-5 gap-4">
          {columns.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column.key
            );

            const isDropTarget = dragOverColumn === column.key;

            return (
              <div
                key={column.key}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOverColumn(column.key);
                }}
                onDragLeave={() => {
                  setDragOverColumn(null);
                }}
                onDrop={() => {
                  void handleDrop(column.key);
                }}
                className={`flex min-h-[360px] flex-col rounded-2xl border p-3 shadow-sm transition ${
                  isDropTarget
                    ? "border-[var(--launchpad-teal)] bg-[var(--launchpad-green)]/10 ring-2 ring-[var(--launchpad-green)]/20"
                    : "border-slate-200 bg-slate-100/70"
                }`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between px-2 py-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-800">
                      {column.label}
                    </h3>

                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-semibold text-slate-500 shadow-sm">
                      {columnTasks.length}
                    </span>
                  </div>

                  {isDropTarget && (
                    <span className="text-[11px] font-semibold text-[var(--launchpad-teal-dark)]">
                      Drop here
                    </span>
                  )}
                </div>

                {/* Tasks */}
                <div className="mt-2 flex flex-1 flex-col gap-3">
                  {columnTasks.length === 0 ? (
                    <div
                      className={`flex min-h-24 flex-1 items-center justify-center rounded-xl border border-dashed px-3 text-center transition ${
                        isDropTarget
                          ? "border-[var(--launchpad-teal)] bg-white text-[var(--launchpad-teal)]"
                          : "border-slate-200 bg-white/50 text-slate-400"
                      }`}
                    >
                      <p className="text-xs">
                        {isDropTarget
                          ? "Release to move task"
                          : "No tasks here"}
                      </p>
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        draggedTaskId={draggedTaskId}
                        movingTaskId={movingTaskId}
                        onDragStart={(event) => {
                          setDraggedTaskId(task.id);
                          event.dataTransfer.effectAllowed = "move";
                          event.dataTransfer.setData(
                            "text/plain",
                            task.id
                          );
                        }}
                        onDragEnd={() => {
                          setDraggedTaskId(null);
                          setDragOverColumn(null);
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ====================================================== */}
      {/* MOBILE KANBAN                                          */}
      {/* ====================================================== */}

      <div className="mt-5 lg:hidden">
        {/* Status selector */}
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max gap-2">
            {columns.map((column) => {
              const count = tasks.filter(
                (task) => task.status === column.key
              ).length;

              const active = mobileColumn === column.key;

              return (
                <button
                  key={column.key}
                  type="button"
                  onClick={() => setMobileColumn(column.key)}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                    active
                      ? "launchpad-gradient text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {column.label}

                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current status */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-100/70 p-3">
          <div className="flex items-center justify-between px-2 py-2">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-slate-800">
                {
                  columns.find(
                    (column) => column.key === mobileColumn
                  )?.label
                }
              </h3>

              <p className="mt-0.5 text-xs text-slate-400">
                {
                  tasks.filter(
                    (task) => task.status === mobileColumn
                  ).length
                }{" "}
                tasks
              </p>
            </div>
          </div>

          <div className="mt-2 space-y-3">
            {tasks.filter(
              (task) => task.status === mobileColumn
            ).length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
                <p className="text-sm font-medium text-slate-500">
                  No tasks here
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Tasks moved into this status will appear here.
                </p>
              </div>
            ) : (
              tasks
                .filter(
                  (task) => task.status === mobileColumn
                )
                .map((task) => (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[var(--launchpad-teal)] hover:shadow-md"
                  >
                    {/* Priority */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityStyle(
                          task.priority
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${priorityDotStyle(
                            task.priority
                          )}`}
                        />

                        {task.priority}
                      </span>

                      <span className="text-[11px] font-medium text-slate-400">
                        Task
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="mt-3 text-sm font-semibold leading-5 text-slate-950">
                      {task.title}
                    </h4>

                    {/* Description */}
                    {task.description && (
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {task.description}
                      </p>
                    )}

                    {/* Mobile status control */}
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <label className="block text-[11px] font-medium text-slate-400">
                        Move task
                      </label>

                      <div className="mt-2 flex gap-2">
                        <select
                          value={task.status}
                          disabled={movingTaskId === task.id}
                          onChange={(event) => {
                            void handleMobileStatusChange(
                              task.id,
                              event.target.value as TaskStatus
                            );
                          }}
                          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 outline-none focus:border-[var(--launchpad-teal)] focus:bg-white focus:ring-2 focus:ring-[var(--launchpad-green)]/20"
                        >
                          {columns.map((column) => (
                            <option
                              key={column.key}
                              value={column.key}
                            >
                              {column.label}
                            </option>
                          ))}
                        </select>

                        {movingTaskId === task.id && (
                          <span className="flex items-center px-2 text-[11px] font-semibold text-[var(--launchpad-teal-dark)]">
                            Moving...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function TaskCard({
  task,
  draggedTaskId,
  movingTaskId,
  onDragStart,
  onDragEnd,
}: {
  task: Task;
  draggedTaskId: string | null;
  movingTaskId: string | null;
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>
  ) => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      draggable={movingTaskId !== task.id}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group cursor-grab rounded-2xl border bg-white p-4 shadow-sm transition duration-200 active:cursor-grabbing ${
        draggedTaskId === task.id
          ? "scale-[0.98] border-[var(--launchpad-teal)] bg-[var(--launchpad-green)]/10 opacity-60 shadow-none"
          : "border-slate-200 hover:-translate-y-0.5 hover:border-[var(--launchpad-teal)] hover:shadow-md"
      }`}
    >
      {/* Priority + drag handle */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityStyle(
            task.priority
          )}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${priorityDotStyle(
              task.priority
            )}`}
          />

          {task.priority}
        </span>

        <span
          aria-label="Drag task"
          className="select-none text-sm tracking-[3px] text-slate-300 transition group-hover:text-[var(--launchpad-teal)]"
        >
          ⠿
        </span>
      </div>

      {/* Title */}
      <h4 className="mt-3 text-sm font-bold leading-5 tracking-tight text-slate-950">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">
          {task.description}
        </p>
      )}

      {/* Card footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-[11px] text-slate-400">
          Drag to move
        </span>

        {movingTaskId === task.id && (
          <span className="text-[11px] font-semibold text-[var(--launchpad-teal-dark)]">
            Moving...
          </span>
        )}
      </div>
    </div>
  );
}

function priorityDotStyle(priority: string) {
  switch (priority) {
    case "URGENT":
      return "bg-red-500";
    case "HIGH":
      return "bg-orange-500";
    case "MEDIUM":
      return "bg-amber-500";
    default:
      return "bg-slate-400";
  }
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