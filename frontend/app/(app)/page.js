"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { TaskCreateModal } from "@/components/task-create-modal";
import { TaskItem } from "@/components/task-item";
import { StartYourDay } from "@/components/start-your-day";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  isDayStarted,
  markDayStarted,
} from "@/lib/task-storage";

// ── Constants ─────────────────────────────────────────────────────

const FOCUS_LIMIT = 3;

// ── Page ──────────────────────────────────────────────────────────

export default function FocusPage() {
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
  const [dayStarted, setDayStarted] = useState(() => isDayStarted());
  const [showActive, setShowActive] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

  // ── Show StartYourDay if day hasn't started and no focus tasks ──
  const shouldShowStartDay = !dayStarted && focusTasks.length === 0;

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

    // Enforce focus limit
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

  function handleComplete(id) {
    moveTask(id, "completed");
  }

  function handleCreateTask({ title, notes }) {
    const id = `task-${Date.now()}`;
    // Only add to Focus if under limit, otherwise add to Active
    if (focusTasks.length < FOCUS_LIMIT) {
      setFocusTasks((prev) => [{ id, title, notes }, ...prev]);
    } else {
      setActiveTasks((prev) => [{ id, title, notes }, ...prev]);
    }
  }

  function handleStartDay(selectedIds) {
    // Move selected tasks from Active to Focus
    const selectedTasks = activeTasks.filter((task) =>
      selectedIds.includes(task.id)
    );
    const remainingActiveTasks = activeTasks.filter(
      (task) => !selectedIds.includes(task.id)
    );

    setActiveTasks(remainingActiveTasks);
    setFocusTasks(selectedTasks);
    setDayStarted(true);
    markDayStarted();
  }

  // ── Move options builders ────────────────────────────────────────

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

  // ── Show Start Your Day screen ──────────────────────────────────

  if (shouldShowStartDay) {
    return <StartYourDay activeTasks={activeTasks} onConfirm={handleStartDay} />;
  }

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
        <p className="mt-1 text-xs text-muted-foreground/70 leading-relaxed">
          Choose up to 3 tasks to focus on today.
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
                  completed={false}
                  onComplete={() => handleComplete(task.id)}
                  moveOptions={buildMoveOptions("focus").map((opt) => ({
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
                    completed={false}
                    onComplete={() => handleComplete(task.id)}
                    moveOptions={buildMoveOptions("active").map((opt) => ({
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

      {/* ── Completed Tasks ── */}
      {completedTasks.length > 0 && (
        <section className="mt-12">
          <button
            type="button"
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded leading-relaxed"
          >
            <ChevronRight
              className={cn(
                "size-3.5 transition-transform duration-200",
                showCompleted && "rotate-90"
              )}
            />
            Completed ({completedTasks.length})
          </button>

          {showCompleted && (
            <div className="mt-6">
              <ul className="space-y-3">
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    state="completed"
                    completed={true}
                    onComplete={() => moveTask(task.id, "active")}
                    moveOptions={buildMoveOptions("completed").map((opt) => ({
                      label: opt.label,
                      onSelect: () => opt.onSelect(task.id),
                    }))}
                  />
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
