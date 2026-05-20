"use client";

import type { Goal, Habit, Note, Project, Review, Task } from "@/types/entities";

export type ExportSnapshot = {
  version: 1;
  exportedAt: string;
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  projects: Project[];
  notes: Note[];
  reviews: Review[];
};

export function buildSnapshot(input: Omit<ExportSnapshot, "version" | "exportedAt">): ExportSnapshot {
  return { version: 1, exportedAt: new Date().toISOString(), ...input };
}

export function toJSON(snap: ExportSnapshot): string {
  return JSON.stringify(snap, null, 2);
}

export function toCSV(snap: ExportSnapshot): string {
  // Tasks CSV (most useful tabular cut). Headers + rows.
  const lines: string[] = [];
  const header = ["id","title","status","priority","project","due","dueTime","completedAt","labels","notes","createdAt","deletedAt"];
  lines.push(header.join(","));
  const projById = new Map(snap.projects.map((p) => [p.id, p.name]));
  for (const t of snap.tasks) {
    lines.push([
      t.id,
      csvCell(t.title),
      t.status,
      t.priority,
      csvCell(t.projectId ? projById.get(t.projectId) ?? "" : ""),
      t.due ?? "",
      t.dueTime ?? "",
      t.completedAt ?? "",
      csvCell(t.labels.join("|")),
      csvCell(t.notes ?? ""),
      t.createdAt,
      t.deletedAt ?? "",
    ].join(","));
  }
  return lines.join("\n");
}

function csvCell(s: string): string {
  if (s == null) return "";
  const needsQuote = /[",\n\r]/.test(s);
  const inner = s.replace(/"/g, '""');
  return needsQuote ? `"${inner}"` : inner;
}

export function toMarkdown(snap: ExportSnapshot): string {
  const projById = new Map(snap.projects.map((p) => [p.id, p]));
  const out: string[] = [];

  out.push(`# Osama export`);
  out.push(`_Exported ${new Date(snap.exportedAt).toLocaleString()}_`);
  out.push("");
  out.push(`- ${snap.tasks.length} tasks`);
  out.push(`- ${snap.habits.length} habits`);
  out.push(`- ${snap.goals.length} goals`);
  out.push(`- ${snap.projects.length} projects`);
  out.push(`- ${snap.notes.length} notes`);
  out.push(`- ${snap.reviews.length} reviews`);
  out.push("");

  if (snap.projects.length) {
    out.push(`## Projects`);
    for (const p of snap.projects) {
      out.push(`### ${p.name}${p.archived ? " _(archived)_" : ""}`);
      if (p.description) out.push(p.description);
      const tasks = snap.tasks.filter((t) => t.projectId === p.id);
      if (tasks.length) {
        out.push("");
        for (const t of tasks) out.push(`- ${t.status === "done" ? "[x]" : "[ ]"} ${t.title}`);
      }
      out.push("");
    }
  }

  const inboxTasks = snap.tasks.filter((t) => !t.projectId);
  if (inboxTasks.length) {
    out.push(`## Inbox tasks`);
    for (const t of inboxTasks) out.push(`- ${t.status === "done" ? "[x]" : "[ ]"} ${t.title}`);
    out.push("");
  }

  if (snap.goals.length) {
    out.push(`## Goals`);
    for (const g of snap.goals) {
      out.push(`### ${g.title} _(${g.horizon} · ${g.status})_`);
      if (g.why) out.push(`> ${g.why}`);
      if (g.milestones.length) {
        out.push("");
        out.push("**Milestones**");
        for (const m of g.milestones) out.push(`- ${m.done ? "[x]" : "[ ]"} ${m.title} — ${m.progress}%`);
      }
      out.push("");
    }
  }

  if (snap.habits.length) {
    out.push(`## Habits`);
    for (const h of snap.habits) {
      const done = Object.values(h.checkins).filter(Boolean).length;
      out.push(`- **${h.title}** — ${done} check-ins`);
    }
    out.push("");
  }

  if (snap.notes.length) {
    out.push(`## Notes`);
    for (const n of snap.notes) {
      out.push(`### ${n.title}`);
      if (n.tags.length) out.push(`_Tags: ${n.tags.map((t) => `#${t}`).join(", ")}_`);
      out.push("");
      out.push(n.body);
      out.push("");
    }
  }

  if (snap.reviews.length) {
    out.push(`## Reviews`);
    for (const r of snap.reviews) {
      out.push(`### ${r.kind} — ${r.periodStart.slice(0, 10)}`);
      for (const [k, v] of Object.entries(r.content)) {
        out.push(`**${k}**`);
        out.push(v || "—");
        out.push("");
      }
    }
  }

  return out.join("\n");
}

export function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function downloadJSON(snap: ExportSnapshot) {
  downloadBlob(`osama-${snap.exportedAt.slice(0, 10)}.json`, toJSON(snap), "application/json");
}
export function downloadMarkdown(snap: ExportSnapshot) {
  downloadBlob(`osama-${snap.exportedAt.slice(0, 10)}.md`, toMarkdown(snap), "text/markdown");
}
export function downloadCSV(snap: ExportSnapshot) {
  downloadBlob(`osama-tasks-${snap.exportedAt.slice(0, 10)}.csv`, toCSV(snap), "text/csv");
}
