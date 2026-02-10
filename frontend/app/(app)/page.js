"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { TaskCreateModal } from "@/components/task-create-modal";
import { TaskItem } from "@/components/task-item";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ── Placeholder data ──────────────────────────────────────────────

const INITIAL_FOCUS = [
  { id: "1", title: "Draft project proposal", notes: "Include timeline and deliverables." },
  { id: "2", title: "Review design mockups" },
];

const INITIAL_ACTIVE = [
  { id: "3", title: "Update client invoice" },
  { id: "4", title: "Research analytics tools", notes: "Compare 3–4 options for dashboards." },
  { id: "5", title: "Schedule team check-in" },
  { id: "6", title: "Write documentation" },
];

// ── Page ──────────────────────────────────────────────────────────

export default function FocusPage() {
  const [focusTasks, setFocusTasks] = useState(INITIAL_FOCUS);
  const [activeTasks, setActiveTasks] = useState(INITIAL_ACTIVE);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [showActive, setShowActive] = useState(true);

  function toggleComplete(id) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function moveToFocus(id) {
    const task = activeTasks.find((t) => t.id === id);
    if (!task) return;
    setActiveTasks((prev) => prev.filter((t) => t.id !== id));
    setFocusTasks((prev) => [...prev, task]);
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function moveToActive(id) {
    const task = focusTasks.find((t) => t.id === id);
    if (!task) return;
    setFocusTasks((prev) => prev.filter((t) => t.id !== id));
    setActiveTasks((prev) => [task, ...prev]);
  }

  function handleCreateTask({ title, notes }) {
    const id = `task-${Date.now()}`;
    setFocusTasks((prev) => [{ id, title, notes }, ...prev]);
  }

  const focusMoveOptions = [
    { label: "Move to Active", onSelect: (id) => moveToActive(id) },
    { label: "Move to Parked", onSelect: () => {} },
    { label: "Move to Completed", onSelect: () => {} },
  ];

  const activeMoveOptions = [
    { label: "Move to Focus", onSelect: (id) => moveToFocus(id) },
    { label: "Move to Parked", onSelect: () => {} },
    { label: "Move to Completed", onSelect: () => {} },
  ];

  return (
    <div className="max-w-2xl">
      {/* ── Daily Focus ── */}
      <section>
        <h1 className="text-2xl font-semibold tracking-tight leading-relaxed">
          Daily Focus
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          What needs your attention today.
        </p>

        <div className="mt-8 flex flex-col gap-6">
          <TaskCreateModal onSubmit={handleCreateTask} />

          {focusTasks.length === 0 ? (
            <Card className="border-dashed shadow-none p-6">
              <CardContent className="text-center p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your focus is clear.
                </p>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Move a task here from Active to commit to it today.
                </p>
              </CardContent>
            </Card>
          ) : (
            <ul className="space-y-3">
              {focusTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  state="focus"
                  completed={completedIds.has(task.id)}
                  onComplete={() => toggleComplete(task.id)}
                  moveOptions={focusMoveOptions.map((opt) => ({
                    label: opt.label,
                    onSelect: () => opt.onSelect(task.id),
                  }))}
                />
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── Active Tasks ── */}
      <section className="mt-12">
        <button
          type="button"
          onClick={() => setShowActive(!showActive)}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded leading-relaxed"
        >
          <ChevronRight
            className={cn(
              "size-3.5 transition-transform duration-200",
              showActive && "rotate-90"
            )}
          />
          Active Tasks
        </button>

        {showActive && (
          <div className="mt-6">
            {activeTasks.length === 0 ? (
              <p className="py-4 pl-2 text-sm text-muted-foreground leading-relaxed">
                No active tasks right now.
              </p>
            ) : (
              <ul className="space-y-3">
                {activeTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    state="active"
                    completed={completedIds.has(task.id)}
                    onComplete={() => toggleComplete(task.id)}
                    moveOptions={activeMoveOptions.map((opt) => ({
                      label: opt.label,
                      onSelect: () => opt.onSelect(task.id),
                    }))}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
