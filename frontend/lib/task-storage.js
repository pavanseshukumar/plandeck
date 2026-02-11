// ── Constants ─────────────────────────────────────────────────────

const STORAGE_KEY = "plandeck-tasks";

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

// ── Persistence helpers ───────────────────────────────────────────

export function loadTasksFromStorage() {
  if (typeof window === "undefined") {
    return {
      focusTasks: INITIAL_FOCUS,
      activeTasks: INITIAL_ACTIVE,
      parkedTasks: [],
      completedTasks: [],
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        focusTasks: parsed.focusTasks || INITIAL_FOCUS,
        activeTasks: parsed.activeTasks || INITIAL_ACTIVE,
        parkedTasks: parsed.parkedTasks || [],
        completedTasks: parsed.completedTasks || [],
      };
    }
  } catch (error) {
    console.error("Failed to load tasks from localStorage:", error);
  }

  return {
    focusTasks: INITIAL_FOCUS,
    activeTasks: INITIAL_ACTIVE,
    parkedTasks: [],
    completedTasks: [],
  };
}

export function saveTasksToStorage(tasks) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        focusTasks: tasks.focusTasks,
        activeTasks: tasks.activeTasks,
        parkedTasks: tasks.parkedTasks,
        completedTasks: tasks.completedTasks,
      })
    );
  } catch (error) {
    console.error("Failed to save tasks to localStorage:", error);
  }
}

// ── Day tracking helpers ──────────────────────────────────────────

const DAY_STARTED_KEY = "plandeck-day-started";

export function isDayStarted() {
  if (typeof window === "undefined") return false;

  try {
    const stored = localStorage.getItem(DAY_STARTED_KEY);
    return stored === "true";
  } catch (error) {
    console.error("Failed to check day started status:", error);
    return false;
  }
}

export function markDayStarted() {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(DAY_STARTED_KEY, "true");
  } catch (error) {
    console.error("Failed to mark day as started:", error);
  }
}

export function resetDayStarted() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(DAY_STARTED_KEY);
  } catch (error) {
    console.error("Failed to reset day started status:", error);
  }
}
