"use client";

import type { Habit, Task, Goal } from "@/types/entities";
import type { GoalCtxT, HabitCtxT, TaskCtxT, UserCtxT } from "./context";
import { currentStreak, isDoneToday } from "@/lib/domain/habits";

export function buildTaskCtx(task: Task, projectName?: string | null): TaskCtxT {
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    projectName: projectName ?? null,
    due: task.due ?? null,
    dueTime: task.dueTime ?? null,
  };
}

export function buildHabitCtx(h: Habit): HabitCtxT {
  return { id: h.id, title: h.title, streak: currentStreak(h), doneToday: isDoneToday(h) };
}

export function buildGoalCtx(g: Goal): GoalCtxT {
  return {
    id: g.id,
    title: g.title,
    why: g.why ?? "",
    horizon: g.horizon,
    status: g.status,
    milestones: g.milestones.map((m) => ({ title: m.title, progress: m.progress, done: m.done })),
  };
}

export function buildUserCtx(s: {
  name?: string; timezone?: string; startOfWeek?: "sun" | "mon";
}): UserCtxT {
  return { name: s.name, timezone: s.timezone, startOfWeek: s.startOfWeek };
}

/**
 * Calls a streaming AI endpoint, invoking onChunk for each text delta and
 * onDone with the full assembled text. Returns an abort function.
 */
export function streamPost(opts: {
  url: string;
  body: unknown;
  onChunk: (delta: string, full: string) => void;
  onDone?: (full: string) => void;
  onError?: (msg: string) => void;
}): () => void {
  const controller = new AbortController();
  (async () => {
    let assembled = "";
    try {
      const res = await fetch(opts.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(opts.body),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const t = await res.text().catch(() => "");
        opts.onError?.(t || `HTTP ${res.status}`);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assembled += chunk;
        opts.onChunk(chunk, assembled);
      }
      opts.onDone?.(assembled);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      opts.onError?.((err as Error).message);
    }
  })();
  return () => controller.abort();
}
