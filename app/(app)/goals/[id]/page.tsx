"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Sparkles, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "@/lib/store";
import { useLiveTasks, useLiveHabits, useLiveProjects } from "@/lib/store/selectors";
import { useConfirm } from "@/components/ui/confirm";
import { PageBody } from "@/components/ui/page";
import { Markdown } from "@/components/ui/markdown";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { LinkedPicker } from "@/components/goals/link-picker";
import { buildGoalCtx, buildHabitCtx, buildTaskCtx, streamPost } from "@/lib/ai/client";
import { cn } from "@/lib/utils/cn";
import type { GoalHorizon, GoalStatus, Milestone } from "@/types/entities";

export default function GoalDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const confirm = useConfirm();
  const goal = useStore((s) => s.goals.find((g) => g.id === id));
  const tasks = useLiveTasks();
  const habits = useLiveHabits();
  const projects = useLiveProjects();
  const update = useStore((s) => s.updateGoal);
  const addMs = useStore((s) => s.addMilestone);
  const updMs = useStore((s) => s.updateMilestone);
  const delMs = useStore((s) => s.deleteMilestone);
  const remove = useStore((s) => s.deleteGoal);

  const [msInput, setMsInput] = useState("");
  const [diagnosis, setDiagnosis] = useState<string>("");
  const [diagnosing, setDiagnosing] = useState(false);
  const abortRef = useRef<(() => void) | null>(null);
  useEffect(() => () => { abortRef.current?.(); }, []);

  if (!goal) return (
    <PageBody className="pt-10">
      <p className="text-fg-muted">Goal not found.</p>
      <Link href="/goals" className="mt-3 inline-flex items-center gap-1 text-[13px] text-accent">
        <ArrowLeft size={14} /> All goals
      </Link>
    </PageBody>
  );

  const linkedTasks  = tasks.filter((t) => goal.taskIds.includes(t.id));
  const linkedHabits = habits.filter((h) => goal.habitIds.includes(h.id));
  const projById = new Map(projects.map((p) => [p.id, p]));

  const total = goal.milestones.length;
  const doneCount = goal.milestones.filter((m) => m.done).length;
  const overall = total > 0
    ? Math.round(goal.milestones.reduce((s, m) => s + (m.done ? 100 : m.progress), 0) / total)
    : 0;

  function addMilestone() {
    const t = msInput.trim();
    if (!t) return;
    addMs(goal!.id, t);
    setMsInput("");
  }

  function diagnose() {
    setDiagnosing(true);
    setDiagnosis("");
    abortRef.current = streamPost({
      url: "/api/ai/diagnose",
      body: {
        goal: buildGoalCtx(goal!),
        tasks: linkedTasks.map((t) => buildTaskCtx(t, t.projectId ? projById.get(t.projectId)?.name : null)),
        habits: linkedHabits.map(buildHabitCtx),
      },
      onChunk: (_d, full) => setDiagnosis(full),
      onDone: () => { setDiagnosing(false); abortRef.current = null; },
      onError: (msg) => { setDiagnosis((d) => d + `\n\n_Error: ${msg}_`); setDiagnosing(false); abortRef.current = null; },
    });
  }

  async function onDelete() {
    const ok = await confirm({
      title: "Delete goal?",
      description: "This removes the goal and its milestones. Linked tasks and habits stay.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (ok) { remove(goal!.id); router.push("/goals"); }
  }

  return (
    <>
      <div className="px-4 pt-6 sm:px-6 md:px-10 md:pt-10">
        <Link href="/goals" className="inline-flex items-center gap-1 text-[12.5px] text-fg-subtle hover:text-fg">
          <ArrowLeft size={13} strokeWidth={2} /> All goals
        </Link>
      </div>
      <PageBody className="px-4 sm:px-6 md:px-10">
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-5">
            <div>
              <input
                value={goal.title}
                onChange={(e) => update(goal.id, { title: e.target.value })}
                placeholder="What's the goal?"
                className="block w-full bg-transparent text-[24px] font-semibold tracking-tight text-fg outline-none placeholder:text-fg-subtle md:text-[28px]"
              />
              <textarea
                value={goal.why ?? ""}
                onChange={(e) => update(goal.id, { why: e.target.value })}
                placeholder="Why this goal matters — your north star."
                rows={2}
                className="mt-2 block w-full resize-none bg-transparent text-[14.5px] leading-relaxed text-fg-muted outline-none placeholder:text-fg-subtle"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <Stat label="Milestones" value={`${doneCount} / ${total}`} />
              <Stat label="Progress"  value={`${overall}%`} />
              <Stat label="Status"    value={goal.status.replace("-", " ")} small />
            </div>

            <div className="rounded-2xl bg-surface-1 p-4 sm:p-5">
              <header className="mb-4 flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-fg">Milestones</h3>
              </header>
              <form
                onSubmit={(e) => { e.preventDefault(); addMilestone(); }}
                className="mb-3 flex gap-2"
              >
                <input
                  value={msInput}
                  onChange={(e) => setMsInput(e.target.value)}
                  placeholder="Add a milestone…"
                  className="h-10 w-full rounded-lg bg-surface-2 px-3 text-[13.5px] text-fg outline-none placeholder:text-fg-subtle"
                />
                <button
                  type="submit"
                  disabled={!msInput.trim()}
                  className="inline-flex h-10 items-center gap-1 rounded-lg bg-accent px-3 text-[12.5px] font-semibold text-accent-fg disabled:opacity-50"
                >
                  <Plus size={13} strokeWidth={2.5} /> Add
                </button>
              </form>

              <ul className="space-y-2.5">
                {goal.milestones.length === 0 && (
                  <li className="rounded-lg bg-surface-2 px-3 py-4 text-center text-[13px] text-fg-muted">
                    Break the goal down. Each milestone gets its own progress bar.
                  </li>
                )}
                <AnimatePresence initial={false}>
                  {goal.milestones.map((m) => (
                    <motion.li
                      key={m.id}
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.18 }}
                    >
                      <MilestoneRow
                        m={m}
                        onUpdate={(next) => updMs(goal.id, next)}
                        onDelete={() => delMs(goal.id, m.id)}
                      />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>

            <div className="rounded-2xl bg-surface-1 p-4 sm:p-5">
              <header className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-[15px] font-semibold text-fg">Linked work</h3>
                <Button
                  size="sm"
                  variant="secondary"
                  leadingIcon={diagnosing ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} strokeWidth={1.75} />}
                  onClick={diagnose}
                  disabled={diagnosing}
                >
                  What&apos;s blocking this?
                </Button>
              </header>

              {(diagnosis || diagnosing) && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4 rounded-lg bg-surface-2 p-3"
                >
                  {diagnosis ? <Markdown source={diagnosis} /> : (
                    <div className="flex items-center gap-2 text-[12.5px] text-fg-muted">
                      <Loader2 size={13} className="animate-spin" /> Reading your goal & linked work…
                    </div>
                  )}
                </motion.div>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-fg-subtle">Tasks</h4>
                  <LinkedPicker
                    kind="tasks"
                    selected={goal.taskIds}
                    onChange={(next) => update(goal.id, { taskIds: next })}
                  />
                </div>
                <div>
                  <h4 className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-fg-subtle">Habits</h4>
                  <LinkedPicker
                    kind="habits"
                    selected={goal.habitIds}
                    onChange={(next) => update(goal.id, { habitIds: next })}
                  />
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <Side label="Horizon">
              <Select<GoalHorizon>
                value={goal.horizon}
                onChange={(v) => update(goal.id, { horizon: v })}
                options={[
                  { value: "quarter", label: "Quarter" },
                  { value: "year",    label: "Year" },
                  { value: "life",    label: "Life" },
                ]}
              />
            </Side>
            <Side label="Status">
              <Select<GoalStatus>
                value={goal.status}
                onChange={(v) => update(goal.id, { status: v })}
                options={[
                  { value: "on-track",  label: "On track" },
                  { value: "at-risk",   label: "At risk" },
                  { value: "off-track", label: "Off track" },
                  { value: "achieved",  label: "Achieved" },
                  { value: "archived",  label: "Archived" },
                ]}
              />
            </Side>
            <Side label="Target date">
              <DatePicker
                value={goal.targetDate ?? null}
                onChange={(v) => update(goal.id, { targetDate: v })}
                placeholder="No date"
              />
            </Side>

            <button
              type="button"
              onClick={onDelete}
              className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-surface-1 px-3 text-[13px] font-medium text-[color:var(--danger)] hover:bg-surface-2"
            >
              <Trash2 size={14} strokeWidth={2} /> Delete goal
            </button>
          </aside>
        </div>
      </PageBody>
    </>
  );
}

function MilestoneRow({
  m, onUpdate, onDelete,
}: { m: Milestone; onUpdate: (next: Milestone) => void; onDelete: () => void }) {
  return (
    <div className="rounded-lg bg-surface-2 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onUpdate({ ...m, done: !m.done, progress: !m.done ? 100 : m.progress })}
          aria-pressed={m.done}
          aria-label={m.done ? "Mark incomplete" : "Mark done"}
          className={cn(
            "grid h-5 w-5 place-items-center rounded-md",
            m.done ? "bg-accent text-accent-fg" : "bg-surface-3 text-fg-subtle hover:text-fg",
          )}
        >
          {m.done && (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 6.5 L4.7 8.7 L9.5 3.5" /></svg>
          )}
        </button>
        <input
          value={m.title}
          onChange={(e) => onUpdate({ ...m, title: e.target.value })}
          className={cn("flex-1 bg-transparent text-[13.5px] outline-none", m.done ? "text-fg-subtle line-through" : "text-fg")}
        />
        <span className="font-mono text-[11px] text-fg-subtle">{m.progress}%</span>
        <button type="button" onClick={onDelete} aria-label="Delete milestone" className="grid h-6 w-6 place-items-center rounded-md text-fg-subtle hover:text-[color:var(--danger)]">
          <Trash2 size={12} strokeWidth={2} />
        </button>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={m.progress}
        onChange={(e) => onUpdate({ ...m, progress: Number(e.target.value), done: Number(e.target.value) === 100 })}
        className="mt-2 block w-full accent-[color:var(--accent)]"
      />
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-3">
        <motion.div className="h-full rounded-full bg-accent" initial={false} animate={{ width: `${m.progress}%` }} transition={{ duration: 0.3 }} />
      </div>
    </div>
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

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="rounded-2xl bg-surface-1 p-3 sm:p-4">
      <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-fg-subtle">{label}</div>
      <div className={cn("mt-1 truncate font-semibold tracking-tight text-fg capitalize", small ? "text-[14px] sm:text-[16px]" : "text-[18px] sm:text-[22px]")}>{value}</div>
    </div>
  );
}
