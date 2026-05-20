"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Flag, Sparkles, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { useLiveProjects, useLiveGoals } from "@/lib/store/selectors";
import { Button } from "@/components/ui/button";
import { PageBody } from "@/components/ui/page";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { cn } from "@/lib/utils/cn";
import type { Priority, TaskStatus } from "@/types/entities";

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const task    = useStore((s) => s.tasks.find((t) => t.id === id));
  const projects= useLiveProjects();
  const goals   = useLiveGoals();
  const update  = useStore((s) => s.updateTask);
  const toggle  = useStore((s) => s.toggleTask);
  const remove  = useStore((s) => s.deleteTask);

  const linkedGoals = goals.filter((g) => g.taskIds.includes(id));
  const project = task?.projectId ? projects.find((p) => p.id === task.projectId) : null;

  const [breakingDown, setBreakingDown] = useState(false);
  const [breakError, setBreakError] = useState<string | null>(null);

  if (!task) {
    return (
      <PageBody className="pt-10">
        <p className="text-fg-muted">Task not found.</p>
        <Link href="/tasks" className="mt-3 inline-flex items-center gap-1 text-[13px] text-accent">
          <ArrowLeft size={14} /> All tasks
        </Link>
      </PageBody>
    );
  }

  const done = task.status === "done";

  async function suggestBreakdown() {
    setBreakingDown(true);
    setBreakError(null);
    try {
      const res = await fetch("/api/ai/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: task!.title, notes: task!.notes }),
      });
      const body = await res.json();
      if (!res.ok) {
        setBreakError(body?.detail || body?.error || "Couldn't reach the assistant.");
        return;
      }
      const subs: string[] = Array.isArray(body.subtasks) ? body.subtasks : [];
      subs.forEach((s: string, i: number) => {
        useStore.getState().addTask({
          title: s,
          parentId: task!.id,
          priority: task!.priority,
          projectId: task!.projectId,
          order: -Date.now() - i,
        });
      });
    } catch (err) {
      setBreakError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setBreakingDown(false);
    }
  }

  const subtasks = useStore.getState().tasks.filter((t) => t.parentId === id);

  return (
    <>
      <div className="px-6 pt-6 md:px-10 md:pt-10">
        <Link href="/tasks" className="inline-flex items-center gap-1 text-[12.5px] text-fg-subtle hover:text-fg">
          <ArrowLeft size={13} strokeWidth={2} /> All tasks
        </Link>
      </div>

      <PageBody>
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => toggle(task.id)}
                aria-label={done ? "Mark incomplete" : "Mark complete"}
                className="mt-1 grid h-7 w-7 place-items-center rounded-md text-fg-subtle hover:text-fg"
              >
                {done
                  ? <CheckCircle2 size={22} strokeWidth={2} className="text-accent" />
                  : <Circle size={22} strokeWidth={1.75} />}
              </button>
              <input
                value={task.title}
                onChange={(e) => update(task.id, { title: e.target.value })}
                className={cn(
                  "w-full bg-transparent text-[24px] font-semibold tracking-tight outline-none",
                  done ? "text-fg-subtle line-through" : "text-fg",
                )}
              />
            </div>

            <div className="rounded-2xl bg-surface-1 p-5">
              <h3 className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-fg-subtle">Notes</h3>
              <textarea
                value={task.notes ?? ""}
                onChange={(e) => update(task.id, { notes: e.target.value })}
                placeholder="Markdown supported — context, links, anything you'd want later."
                rows={8}
                className="block w-full resize-y bg-transparent font-mono text-[13.5px] leading-relaxed text-fg outline-none placeholder:text-fg-subtle"
              />
            </div>

            <div className="rounded-2xl bg-surface-1 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-fg-subtle">Subtasks</h3>
                <Button
                  size="sm"
                  variant="secondary"
                  leadingIcon={<Sparkles size={13} strokeWidth={1.75} />}
                  onClick={suggestBreakdown}
                  loading={breakingDown}
                >
                  Break this down
                </Button>
              </div>
              {breakError && (
                <p className="mb-3 rounded-lg bg-surface-2 px-3 py-2 text-[12.5px] text-[color:var(--danger)]">
                  {breakError}
                </p>
              )}
              {subtasks.length === 0 ? (
                <p className="text-[13px] text-fg-muted">No subtasks yet. Use the AI breakdown to seed some.</p>
              ) : (
                <ul className="space-y-1.5">
                  {subtasks.map((st) => (
                    <li key={st.id} className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2">
                      <button
                        type="button"
                        onClick={() => toggle(st.id)}
                        className="grid h-5 w-5 place-items-center rounded-md text-fg-subtle hover:text-fg"
                      >
                        {st.status === "done"
                          ? <CheckCircle2 size={15} strokeWidth={2} className="text-accent" />
                          : <Circle size={15} strokeWidth={1.75} />}
                      </button>
                      <span className={cn("flex-1 text-[13px]", st.status === "done" ? "text-fg-subtle line-through" : "text-fg")}>
                        {st.title}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <Side label="Status">
              <Select<TaskStatus>
                value={task.status}
                onChange={(v) => update(task.id, { status: v, completedAt: v === "done" ? new Date().toISOString() : null })}
                options={[
                  { value: "open",        label: "Open" },
                  { value: "in-progress", label: "In progress" },
                  { value: "done",        label: "Done" },
                ]}
              />
            </Side>
            <Side label="Priority">
              <Select<Priority>
                value={task.priority}
                onChange={(v) => update(task.id, { priority: v })}
                options={[
                  { value: "low",  label: "Low" },
                  { value: "med",  label: "Medium" },
                  { value: "high", label: "High" },
                ]}
              />
            </Side>
            <Side label="Project">
              <Select<string>
                value={task.projectId ?? "__none__"}
                onChange={(v) => update(task.id, { projectId: v === "__none__" ? null : v })}
                options={[
                  { value: "__none__", label: "None" },
                  ...projects.map((p) => ({ value: p.id, label: p.name })),
                ]}
              />
            </Side>
            <Side label="Due date">
              <DatePicker
                value={task.due ?? null}
                onChange={(v) => update(task.id, { due: v })}
                placeholder="No date"
              />
            </Side>
            <Side label="Due time">
              <TimePicker
                value={task.dueTime ?? null}
                onChange={(v) => update(task.id, { dueTime: v })}
                placeholder="No time"
                step={5}
              />
            </Side>
            <Side label="Recurrence">
              <Select<"none" | "daily" | "weekly" | "monthly">
                value={(task.recurrence ?? "none")}
                onChange={(v) => update(task.id, { recurrence: v })}
                options={[
                  { value: "none",    label: "None" },
                  { value: "daily",   label: "Daily" },
                  { value: "weekly",  label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                ]}
              />
            </Side>

            {(project || linkedGoals.length > 0) && (
              <div className="space-y-2 rounded-2xl bg-surface-1 p-4">
                <h4 className="text-[10px] font-medium uppercase tracking-[0.16em] text-fg-subtle">Links</h4>
                {project && (
                  <Link href={`/projects/${project.id}`} className="block rounded-md bg-surface-2 px-2 py-1.5 text-[12.5px] text-fg-muted hover:text-fg">
                    📁 {project.name}
                  </Link>
                )}
                {linkedGoals.map((g) => (
                  <Link key={g.id} href={`/goals/${g.id}`} className="block rounded-md bg-surface-2 px-2 py-1.5 text-[12.5px] text-fg-muted hover:text-fg">
                    <Flag size={11} strokeWidth={2} className="mr-1 inline" />
                    {g.title}
                  </Link>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => { remove(task.id); router.push("/tasks"); }}
              className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-surface-1 px-3 text-[13px] font-medium text-[color:var(--danger)] hover:bg-surface-2"
            >
              <Trash2 size={14} strokeWidth={2} />
              Delete task
            </button>
          </aside>
        </div>
      </PageBody>
    </>
  );
}

function Side({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-surface-1 px-3 py-2">
      <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-fg-subtle">{label}</div>
      {children}
    </div>
  );
}
