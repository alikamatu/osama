import type { Goal, Habit, Note, Task, Project, Review } from "@/types/entities";
import { fuzzyScore } from "@/lib/command/commands";

export type SearchHit =
  | { kind: "task";    id: string; title: string; href: string; subtitle?: string; score: number }
  | { kind: "habit";   id: string; title: string; href: string; subtitle?: string; score: number }
  | { kind: "goal";    id: string; title: string; href: string; subtitle?: string; score: number }
  | { kind: "project"; id: string; title: string; href: string; subtitle?: string; score: number }
  | { kind: "note";    id: string; title: string; href: string; subtitle?: string; score: number }
  | { kind: "review";  id: string; title: string; href: string; subtitle?: string; score: number };

type Sources = {
  tasks: Task[]; habits: Habit[]; goals: Goal[];
  projects: Project[]; notes: Note[]; reviews: Review[];
};

export function searchAll(q: string, src: Sources, limit = 24): SearchHit[] {
  if (!q.trim()) return [];
  const hits: SearchHit[] = [];

  for (const t of src.tasks) {
    const s = Math.min(fuzzyScoreSafe(q, t.title), fuzzyScoreSafe(q, t.notes ?? ""));
    if (s >= 0) hits.push({ kind: "task", id: t.id, title: t.title, href: `/tasks/${t.id}`, subtitle: t.status === "done" ? "Done" : "Open", score: s });
  }
  for (const h of src.habits) {
    const s = fuzzyScoreSafe(q, h.title);
    if (s >= 0) hits.push({ kind: "habit", id: h.id, title: h.title, href: `/habits/${h.id}`, subtitle: cadenceLabel(h), score: s });
  }
  for (const g of src.goals) {
    const s = Math.min(fuzzyScoreSafe(q, g.title), fuzzyScoreSafe(q, g.why ?? ""));
    if (s >= 0) hits.push({ kind: "goal", id: g.id, title: g.title, href: `/goals/${g.id}`, subtitle: g.horizon, score: s });
  }
  for (const p of src.projects) {
    const s = fuzzyScoreSafe(q, p.name);
    if (s >= 0) hits.push({ kind: "project", id: p.id, title: p.name, href: `/projects/${p.id}`, subtitle: p.archived ? "archived" : undefined, score: s });
  }
  for (const n of src.notes) {
    const s = Math.min(fuzzyScoreSafe(q, n.title), fuzzyScoreSafe(q, n.body));
    if (s >= 0) hits.push({ kind: "note", id: n.id, title: n.title, href: `/notes/${n.id}`, subtitle: n.tags.join(", "), score: s });
  }
  for (const r of src.reviews) {
    const s = Math.min(fuzzyScoreSafe(q, r.kind), fuzzyScoreSafe(q, Object.values(r.content).join(" ")));
    if (s >= 0) hits.push({ kind: "review", id: r.id, title: `${cap(r.kind)} review`, href: `/reviews/${r.id}`, subtitle: new Date(r.periodStart).toLocaleDateString(), score: s });
  }

  return hits.sort((a, b) => a.score - b.score).slice(0, limit);
}

function fuzzyScoreSafe(q: string, target: string): number {
  return fuzzyScore(q, target);
}
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function cadenceLabel(h: Habit): string {
  switch (h.cadence.kind) {
    case "daily": return "Daily";
    case "weekly-target": return `${h.cadence.perWeek}× / week`;
    case "custom": return "Custom days";
  }
}
