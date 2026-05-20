"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import type { Task, TaskStatus } from "@/types/entities";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils/cn";

const COLUMNS: Array<{ id: TaskStatus; label: string }> = [
  { id: "open",        label: "Open" },
  { id: "in-progress", label: "In progress" },
  { id: "done",        label: "Done" },
];

const PRIORITY_DOT = { low: "bg-fg-subtle", med: "bg-warning", high: "bg-danger" } as const;

export function TaskBoardView({ tasks }: { tasks: Task[] }) {
  const update = useStore((s) => s.updateTask);
  const toggle = useStore((s) => s.toggleTask);

  function moveTo(id: string, status: TaskStatus) {
    if (status === "done") {
      const t = tasks.find((x) => x.id === id);
      if (t && t.status !== "done") toggle(id);
      else update(id, { status });
    } else {
      update(id, { status, completedAt: null });
    }
  }

  function onDrop(e: React.DragEvent, col: TaskStatus) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) moveTo(id, col);
  }

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      {COLUMNS.map((col) => {
        const items = tasks.filter((t) => t.status === col.id);
        return (
          <div
            key={col.id}
            className="flex min-h-[200px] flex-col rounded-2xl bg-surface-1 p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, col.id)}
          >
            <header className="mb-2 flex items-center justify-between px-1">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-fg-subtle">{col.label}</span>
              <span className="font-mono text-[11px] text-fg-subtle">{items.length}</span>
            </header>
            <ul className="space-y-1.5">
              {items.map((t) => (
                <motion.li
                  layout
                  key={t.id}
                  draggable
                  onDragStart={(e) => { (e as unknown as React.DragEvent).dataTransfer.setData("text/plain", t.id); }}
                  className={cn(
                    "cursor-grab rounded-xl bg-surface-2 p-3 active:cursor-grabbing",
                    t.status === "done" && "opacity-70",
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", PRIORITY_DOT[t.priority])} />
                    <Link href={`/tasks/${t.id}`} className={cn(
                      "block flex-1 text-[13.5px] leading-snug",
                      t.status === "done" ? "text-fg-subtle line-through" : "text-fg",
                    )}>
                      {t.title}
                    </Link>
                    {t.status === "done" && <CheckCircle2 size={14} strokeWidth={2} className="text-accent" />}
                  </div>
                  {(t.due || t.dueTime) && (
                    <div className="mt-2 flex items-center gap-1.5 font-mono text-[10.5px] text-fg-subtle">
                      {t.due && new Date(t.due).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                      {t.dueTime && <span>· {t.dueTime}</span>}
                    </div>
                  )}
                </motion.li>
              ))}
              {items.length === 0 && (
                <li className="rounded-xl border border-dashed border-[color:var(--hairline)] px-3 py-6 text-center text-[12px] text-fg-subtle">
                  Drop here
                </li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
