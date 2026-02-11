"use client";

import { useState } from "react";
import { Circle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FOCUS_LIMIT = 3;

/**
 * @param {Object} props
 * @param {{ id: string, title: string, notes?: string }[]} props.activeTasks
 * @param {(selectedIds: string[]) => void} props.onConfirm
 */
export function StartYourDay({ activeTasks, onConfirm }) {
  const [selectedIds, setSelectedIds] = useState(new Set());

  function toggleSelection(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size < FOCUS_LIMIT) {
          next.add(id);
        }
      }
      return next;
    });
  }

  function handleConfirm() {
    if (selectedIds.size > 0) {
      onConfirm(Array.from(selectedIds));
    }
  }

  const canConfirm = selectedIds.size > 0;
  const remaining = FOCUS_LIMIT - selectedIds.size;

  return (
    <div className="max-w-2xl">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight leading-relaxed">
          Start Your Day
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Choose up to 3 tasks to focus on today.
        </p>

        <div className="mt-8">
          {activeTasks.length === 0 ? (
            <Card className="border-dashed shadow-none p-6">
              <CardContent className="text-center p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No active tasks available.
                </p>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Create tasks first, then select your focus for the day.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <ul className="space-y-3">
                {activeTasks.map((task) => {
                  const isSelected = selectedIds.has(task.id);
                  return (
                    <li
                      key={task.id}
                      className={cn(
                        "group -mx-1 flex items-center gap-4 rounded-lg border px-4 py-3 transition-colors cursor-pointer",
                        isSelected
                          ? "border-border bg-accent/30"
                          : "border-border/80 hover:bg-accent/50"
                      )}
                      onClick={() => toggleSelection(task.id)}
                    >
                      <div
                        className="flex shrink-0 text-muted-foreground transition-colors"
                        aria-label={
                          isSelected ? "Deselect task" : "Select task"
                        }
                      >
                        {isSelected ? (
                          <Check className="size-4" />
                        ) : (
                          <Circle className="size-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block text-sm leading-relaxed",
                            isSelected && "font-medium"
                          )}
                        >
                          {task.title}
                        </span>
                        {task.notes && (
                          <span className="mt-1 block truncate text-xs text-muted-foreground leading-relaxed">
                            {task.notes.slice(0, 60).trim() +
                              (task.notes.length > 60 ? "…" : "")}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 flex items-center justify-between">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedIds.size === 0
                    ? `Select up to ${FOCUS_LIMIT} tasks`
                    : selectedIds.size === FOCUS_LIMIT
                    ? "Maximum selected"
                    : `${remaining} more can be selected`}
                </p>
                <Button
                  onClick={handleConfirm}
                  disabled={!canConfirm}
                  className="min-w-24"
                >
                  Start Day
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
