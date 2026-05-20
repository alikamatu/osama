"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import type { Task } from "@/types/entities";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils/cn";

const PRIORITY_DOT = { low: "bg-fg-subtle", med: "bg-warning", high: "bg-danger" } as const;

export function TaskListView({ tasks }: { tasks: Task[] }) {
  const toggle   = useStore((s) => s.toggleTask);
  const projects = useStore((s) => s.projects);
  const projById = new Map(projects.map((p) => [p.id, p]));

  if (tasks.length === 0) return null;

  return (
    <ul className="space-y-1">
      {tasks.map((t) => {
        const done = t.status === "done";
        const project = t.projectId ? projById.get(t.projectId) : null;
        return (
          <motion.li
            key={t.id}
            layout
            className={cn(
              "group flex items-center gap-2 rounded-xl px-3 py-2",
              "bg-surface-1 hover:bg-surface-2",
            )}
          >
            <button
              type="button"
              onClick={() => toggle(t.id)}
              aria-label={done ? "Mark incomplete" : "Mark complete"}
              className="grid h-6 w-6 place-items-center rounded-md text-fg-subtle hover:text-fg"
            >
              {done
                ? <CheckCircle2 size={18} strokeWidth={2} className="text-accent" />
                : <Circle size={18} strokeWidth={1.75} />}
            </button>
            <span className={cn("h-1.5 w-1.5 rounded-full", PRIORITY_DOT[t.priority])} />
            <Link href={`/tasks/${t.id}`} className={cn(
              "flex-1 truncate text-[14px]",
              done ? "text-fg-subtle line-through" : "text-fg",
            )}>
              {t.title}
            </Link>
            {project && (
              <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] text-fg-muted">{project.name}</span>
            )}
            {t.due && (
              <span className="font-mono text-[11px] text-fg-subtle">
                {new Date(t.due).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
              </span>
            )}
            {t.dueTime && (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-fg-muted">
                <Clock3 size={11} strokeWidth={2} />{t.dueTime}
              </span>
            )}
          </motion.li>
        );
      })}
    </ul>
  );
}
