"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const TIME_INTENT_OPTIONS = [
  { value: "", label: "No date" },
  { value: "today", label: "Today" },
  { value: "this_week", label: "This week" },
  { value: "later", label: "Later" },
];

/**
 * @param {Object} props
 * @param {(task: { title: string, notes?: string, project?: string, timeIntent?: string }) => void} [props.onSubmit]
 * @param {React.ReactNode} [props.trigger]
 */
export function TaskCreateModal({ onSubmit, trigger }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [project, setProject] = React.useState("");
  const [timeIntent, setTimeIntent] = React.useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onSubmit?.({
      title: trimmedTitle,
      notes: notes.trim() || undefined,
      project: project || undefined,
      timeIntent: timeIntent || undefined,
    });

    setTitle("");
    setNotes("");
    setProject("");
    setTimeIntent("");
    setOpen(false);
  }

  const selectClassName = cn(
    "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "disabled:pointer-events-none disabled:opacity-50"
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            Add task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogTitle>New task</DialogTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-2">
          <div className="space-y-2">
            <Label htmlFor="task-create-title">Title</Label>
            <Input
              id="task-create-title"
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-create-notes" className="text-muted-foreground font-normal text-xs">
              Notes
            </Label>
            <Textarea
              id="task-create-notes"
              placeholder="Optional details…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="resize-none text-sm text-muted-foreground placeholder:text-muted-foreground/70"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-create-project" className="text-muted-foreground font-normal text-xs">
                Project
              </Label>
              <select
                id="task-create-project"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className={selectClassName}
              >
                <option value="">None</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-create-time" className="text-muted-foreground font-normal text-xs">
                When
              </Label>
              <select
                id="task-create-time"
                value={timeIntent}
                onChange={(e) => setTimeIntent(e.target.value)}
                className={selectClassName}
              >
                {TIME_INTENT_OPTIONS.map((opt) => (
                  <option key={opt.value || "none"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Add task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
