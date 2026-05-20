import { z } from "zod";

/**
 * Context the client sends to the server. We don't trust the client store —
 * it's local — but we also can't read it from the server. So the client
 * sends a compact, validated snapshot of just what each AI call needs.
 */
export const TaskCtx = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(["open", "in-progress", "done"]),
  priority: z.enum(["low", "med", "high"]),
  projectName: z.string().nullable().optional(),
  due: z.string().nullable().optional(),
  dueTime: z.string().nullable().optional(),
});

export const HabitCtx = z.object({
  id: z.string(),
  title: z.string(),
  streak: z.number().int().nonnegative(),
  doneToday: z.boolean(),
});

export const GoalCtx = z.object({
  id: z.string(),
  title: z.string(),
  why: z.string().optional(),
  horizon: z.enum(["quarter", "year", "life"]),
  status: z.enum(["on-track", "at-risk", "off-track", "achieved", "archived"]),
  milestones: z.array(z.object({
    title: z.string(),
    progress: z.number().min(0).max(100),
    done: z.boolean(),
  })),
});

export const UserCtx = z.object({
  name: z.string().optional(),
  timezone: z.string().optional(),
  startOfWeek: z.enum(["sun", "mon"]).optional(),
});

export type TaskCtxT = z.infer<typeof TaskCtx>;
export type HabitCtxT = z.infer<typeof HabitCtx>;
export type GoalCtxT  = z.infer<typeof GoalCtx>;
export type UserCtxT  = z.infer<typeof UserCtx>;

export function describeUser(u?: UserCtxT): string {
  if (!u) return "";
  const parts: string[] = [];
  if (u.name) parts.push(`Name: ${u.name}.`);
  if (u.timezone) parts.push(`Timezone: ${u.timezone}.`);
  if (u.startOfWeek) parts.push(`Week starts: ${u.startOfWeek === "mon" ? "Monday" : "Sunday"}.`);
  return parts.join(" ");
}

export function describeTasks(tasks: TaskCtxT[]): string {
  if (tasks.length === 0) return "No tasks.";
  const open = tasks.filter((t) => t.status !== "done");
  const done = tasks.filter((t) => t.status === "done");
  const lines: string[] = [];
  lines.push(`Open tasks (${open.length}):`);
  open.slice(0, 25).forEach((t) => {
    const bits = [t.title, `[${t.priority}]`];
    if (t.projectName) bits.push(`(${t.projectName})`);
    if (t.due) bits.push(`due ${t.due.slice(0, 10)}`);
    if (t.dueTime) bits.push(`@ ${t.dueTime}`);
    lines.push(`  - ${bits.join(" ")}`);
  });
  if (done.length) lines.push(`Recently completed (${done.length}):`);
  done.slice(0, 8).forEach((t) => lines.push(`  - ${t.title}`));
  return lines.join("\n");
}

export function describeHabits(habits: HabitCtxT[]): string {
  if (habits.length === 0) return "No habits.";
  return [
    `Habits (${habits.length}):`,
    ...habits.map((h) => `  - ${h.title} · streak ${h.streak} · ${h.doneToday ? "done today" : "not yet today"}`),
  ].join("\n");
}

export function describeGoals(goals: GoalCtxT[]): string {
  if (goals.length === 0) return "No goals.";
  return [
    `Goals (${goals.length}):`,
    ...goals.map((g) => {
      const total = g.milestones.length;
      const doneCount = g.milestones.filter((m) => m.done).length;
      const avg = total > 0 ? Math.round(g.milestones.reduce((s, m) => s + (m.done ? 100 : m.progress), 0) / total) : 0;
      return `  - ${g.title} [${g.horizon}, ${g.status}] · ${doneCount}/${total} milestones · ${avg}%`;
    }),
  ].join("\n");
}
