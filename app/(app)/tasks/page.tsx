"use client";

import { useMemo, useState } from "react";
import { CheckSquare, LayoutGrid, List, Calendar as CalIcon, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "@/lib/store";
import { useLiveTasks } from "@/lib/store/selectors";
import { useKeyboard } from "@/components/keyboard/keyboard-provider";
import { PageHeader, PageBody, Empty } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { TaskFilters, type Filters } from "@/components/tasks/task-filters";
import { TaskListView } from "@/components/tasks/task-list-view";
import { TaskBoardView } from "@/components/tasks/task-board-view";
import { TaskCalendarView } from "@/components/tasks/task-calendar-view";
import { cn } from "@/lib/utils/cn";

type View = "list" | "board" | "calendar";
const VIEWS: Array<{ id: View; label: string; icon: typeof List }> = [
  { id: "list",     label: "List",     icon: List },
  { id: "board",    label: "Board",    icon: LayoutGrid },
  { id: "calendar", label: "Calendar", icon: CalIcon },
];

export default function TasksPage() {
  const tasks = useLiveTasks();
  const { openQuickAdd } = useKeyboard();
  const [view, setView] = useState<View>("list");
  const [filters, setFilters] = useState<Filters>({ q: "", status: "all", priority: "all", projectId: "all" });

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return tasks
      .filter((t) => {
        if (filters.status !== "all"   && t.status !== filters.status) return false;
        if (filters.priority !== "all" && t.priority !== filters.priority) return false;
        if (filters.projectId !== "all" && t.projectId !== filters.projectId) return false;
        if (q && !t.title.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.status === "done" && b.status !== "done") return 1;
        if (b.status === "done" && a.status !== "done") return -1;
        return a.order - b.order;
      });
  }, [tasks, filters]);

  return (
    <>
      <PageHeader
        icon={CheckSquare}
        title="Tasks"
        subtitle={`${tasks.length} total · ${tasks.filter((t) => t.status !== "done").length} open`}
        actions={
          <>
            <div className="hidden items-center gap-1 rounded-full bg-surface-1 p-1 md:flex">
              {VIEWS.map((v) => {
                const Icon = v.icon;
                const active = view === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setView(v.id)}
                    aria-pressed={active}
                    className={cn(
                      "relative inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium",
                      active ? "text-accent-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {active && (
                      <motion.span layoutId="tasks-view-active" className="absolute inset-0 -z-10 rounded-full bg-accent" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                    )}
                    <Icon size={13} strokeWidth={2} />
                    {v.label}
                  </button>
                );
              })}
            </div>
            <Button leadingIcon={<Plus size={16} strokeWidth={2} />} onClick={openQuickAdd}>New</Button>
          </>
        }
      />

      <PageBody>
        <TaskFilters filters={filters} onChange={setFilters} />

        {filtered.length === 0 ? (
          <Empty
            icon={CheckSquare}
            title="No tasks match"
            body="Adjust your filters or capture something new."
            action={<Button onClick={openQuickAdd}>Capture</Button>}
          />
        ) : (
          <>
            {view === "list"     && <TaskListView tasks={filtered} />}
            {view === "board"    && <TaskBoardView tasks={filtered} />}
            {view === "calendar" && <TaskCalendarView tasks={filtered} />}
          </>
        )}
      </PageBody>
    </>
  );
}
