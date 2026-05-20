"use client";

import { useMemo } from "react";
import { useStore } from "./index";

/** Live = not soft-deleted. Use these instead of raw store arrays in feature pages. */

export function useLiveTasks() {
  const tasks = useStore((s) => s.tasks);
  return useMemo(() => tasks.filter((t) => !t.deletedAt), [tasks]);
}
export function useLiveHabits() {
  const habits = useStore((s) => s.habits);
  return useMemo(() => habits.filter((h) => !h.deletedAt), [habits]);
}
export function useLiveGoals() {
  const goals = useStore((s) => s.goals);
  return useMemo(() => goals.filter((g) => !g.deletedAt), [goals]);
}
export function useLiveProjects() {
  const projects = useStore((s) => s.projects);
  return useMemo(() => projects.filter((p) => !p.deletedAt), [projects]);
}
export function useLiveNotes() {
  const notes = useStore((s) => s.notes);
  return useMemo(() => notes.filter((n) => !n.deletedAt), [notes]);
}
