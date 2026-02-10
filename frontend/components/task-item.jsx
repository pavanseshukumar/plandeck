"use client";

import * as React from "react";
import { Circle, Check, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NOTES_PREVIEW_LENGTH = 60;

/**
 * @param {Object} props
 * @param {{ id: string, title: string, notes?: string }} props.task
 * @param {'focus' | 'active' | 'parked' | 'completed'} props.state
 * @param {boolean} props.completed
 * @param {() => void} props.onComplete
 * @param {{ label: string, onSelect: () => void }[]} props.moveOptions - options to move task to another state (exclude current)
 */
export function TaskItem({
  task,
  state,
  completed,
  onComplete,
  moveOptions = [],
}) {
  const notesPreview = task.notes
    ? task.notes.slice(0, NOTES_PREVIEW_LENGTH).trim() +
      (task.notes.length > NOTES_PREVIEW_LENGTH ? "…" : "")
    : null;

  return (
    <li
      className={cn(
        "group -mx-1 flex items-center gap-4 rounded-lg border px-4 py-3 transition-colors hover:bg-accent/50",
        state === "focus" && "border-border bg-accent/30",
        state === "active" && "border-border/80",
        state === "parked" && "border-border/60 bg-muted/20",
        state === "completed" && "border-transparent"
      )}
    >
      <button
        type="button"
        onClick={onComplete}
        className="flex shrink-0 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
        aria-label={completed ? "Mark incomplete" : "Mark complete"}
      >
        {completed ? (
          <Check className="size-4" />
        ) : (
          <Circle className="size-4" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-sm leading-relaxed",
            completed && "text-muted-foreground line-through",
            state === "focus" && !completed && "font-medium",
            state === "parked" && !completed && "text-muted-foreground"
          )}
        >
          {task.title}
        </span>
        {notesPreview && (
          <span className="mt-1 block truncate text-xs text-muted-foreground leading-relaxed">
            {notesPreview}
          </span>
        )}
      </div>

      {moveOptions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus:outline-none"
              aria-label="Move to another list"
            >
              <MoreHorizontal className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {moveOptions.map((option) => (
              <DropdownMenuItem
                key={option.label}
                onSelect={(e) => {
                  e.preventDefault();
                  option.onSelect();
                }}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </li>
  );
}
