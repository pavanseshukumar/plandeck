"use client";

import { useState, useEffect } from "react";
import { TaskItem } from "@/components/task-item";
import { Card, CardContent } from "@/components/ui/card";
import { loadTasksFromStorage, saveTasksToStorage } from "@/lib/task-storage";

const FOCUS_LIMIT = 3;

export default function CompletedPage() {
  const [focusTasks, setFocusTasks] = useState(() =>
    loadTasksFromStorage().focusTasks
  );
  const [activeTasks, setActiveTasks] = useState(() =>
    loadTasksFromStorage().activeTasks
  );
  const [parkedTasks, setParkedTasks] = useState(() =>
    loadTasksFromStorage().parkedTasks
  );
  const [completedTasks, setCompletedTasks] = useState(() =>
    loadTasksFromStorage().completedTasks
  );

  // ── Persistence effect ──────────────────────────────────────────

  useEffect(() => {
    saveTasksToStorage({
      focusTasks,
      activeTasks,
      parkedTasks,
      completedTasks,
    });
  }, [focusTasks, activeTasks, parkedTasks, completedTasks]);

  // ── State transition functions ──────────────────────────────────

  function findTask(id) {
    return (
      focusTasks.find((t) => t.id === id) ||
      activeTasks.find((t) => t.id === id) ||
      parkedTasks.find((t) => t.id === id) ||
      completedTasks.find((t) => t.id === id)
    );
  }

  function removeTask(id) {
    setFocusTasks((prev) => prev.filter((t) => t.id !== id));
    setActiveTasks((prev) => prev.filter((t) => t.id !== id));
    setParkedTasks((prev) => prev.filter((t) => t.id !== id));
    setCompletedTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function moveTask(id, targetState) {
    const task = findTask(id);
    if (!task) return;

    if (targetState === "focus" && focusTasks.length >= FOCUS_LIMIT) {
      return;
    }

    removeTask(id);

    switch (targetState) {
      case "focus":
        setFocusTasks((prev) => [task, ...prev]);
        break;
      case "active":
        setActiveTasks((prev) => [task, ...prev]);
        break;
      case "parked":
        setParkedTasks((prev) => [task, ...prev]);
        break;
      case "completed":
        setCompletedTasks((prev) => [task, ...prev]);
        break;
    }
  }

  function handleUncomplete(id) {
    moveTask(id, "active");
  }

  function buildMoveOptions(currentState) {
    const options = [];
    const isFocusLimitReached = focusTasks.length >= FOCUS_LIMIT;

    if (currentState !== "focus") {
      options.push({
        label: "Move to Focus",
        onSelect: (id) => moveTask(id, "focus"),
        disabled: isFocusLimitReached,
      });
    }

    if (currentState !== "active") {
      options.push({
        label: "Move to Active",
        onSelect: (id) => moveTask(id, "active"),
        disabled: false,
      });
    }

    if (currentState !== "parked") {
      options.push({
        label: "Move to Parked",
        onSelect: (id) => moveTask(id, "parked"),
        disabled: false,
      });
    }

    if (currentState !== "completed") {
      options.push({
        label: "Mark Complete",
        onSelect: (id) => moveTask(id, "completed"),
        disabled: false,
      });
    }

    return options;
  }

  return (
    <div className="max-w-2xl">
      <section>
        <h1 className="text-xl font-medium tracking-tight leading-relaxed text-muted-foreground">
          Completed Tasks
        </h1>
        <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed">
          Tasks you&apos;ve finished.
        </p>

        <div className="mt-8">
          {completedTasks.length === 0 ? (
            <Card className="border-dashed shadow-none p-6 border-transparent">
              <CardContent className="text-center p-4">
                <p className="text-sm text-muted-foreground/70 leading-relaxed">
                  No completed tasks yet.
                </p>
                <p className="mt-2 text-xs text-muted-foreground/60 leading-relaxed">
                  Completed tasks will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <ul className="space-y-3">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  state="completed"
                  completed={true}
                  onComplete={() => handleUncomplete(task.id)}
                  moveOptions={buildMoveOptions("completed").map((opt) => ({
                    label: opt.label,
                    onSelect: () => opt.onSelect(task.id),
                    disabled: opt.disabled,
                  }))}
                />
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
