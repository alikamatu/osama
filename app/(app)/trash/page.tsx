"use client";

import { useMemo } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Trash2, RotateCcw, CheckSquare, Flame, Flag, Folder, NotebookPen, Inbox as InboxIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "@/lib/store";
import { useConfirm } from "@/components/ui/confirm";
import { PageHeader, PageBody, Empty } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { TRASH_RETENTION_DAYS, type TrashableKind } from "@/types/entities";
import { cn } from "@/lib/utils/cn";

type Row = {
  kind: TrashableKind;
  id: string;
  title: string;
  deletedAt: string;
  meta?: string;
};

const KIND_ICON: Record<TrashableKind, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  task:    CheckSquare,
  habit:   Flame,
  goal:    Flag,
  project: Folder,
  note:    NotebookPen,
};

const KIND_LABEL: Record<TrashableKind, string> = {
  task: "Task", habit: "Habit", goal: "Goal", project: "Project", note: "Note",
};

export default function TrashPage() {
  const tasks    = useStore((s) => s.tasks);
  const habits   = useStore((s) => s.habits);
  const goals    = useStore((s) => s.goals);
  const projects = useStore((s) => s.projects);
  const notes    = useStore((s) => s.notes);
  const restore  = useStore((s) => s.restore);
  const purge    = useStore((s) => s.purge);
  const purgeAll = useStore((s) => s.purgeAllTrash);
  const confirm  = useConfirm();

  const rows: Row[] = useMemo(() => {
    const all: Row[] = [];
    for (const t of tasks)    if (t.deletedAt) all.push({ kind: "task",    id: t.id, title: t.title, deletedAt: t.deletedAt });
    for (const h of habits)   if (h.deletedAt) all.push({ kind: "habit",   id: h.id, title: h.title, deletedAt: h.deletedAt });
    for (const g of goals)    if (g.deletedAt) all.push({ kind: "goal",    id: g.id, title: g.title, deletedAt: g.deletedAt, meta: g.horizon });
    for (const p of projects) if (p.deletedAt) all.push({ kind: "project", id: p.id, title: p.name,  deletedAt: p.deletedAt });
    for (const n of notes)    if (n.deletedAt) all.push({ kind: "note",    id: n.id, title: n.title, deletedAt: n.deletedAt });
    return all.sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());
  }, [tasks, habits, goals, projects, notes]);

  async function onPurgeAll() {
    if (rows.length === 0) return;
    const ok = await confirm({
      title: `Permanently delete ${rows.length} item${rows.length === 1 ? "" : "s"}?`,
      description: "This empties the trash. The action can't be undone.",
      confirmLabel: "Empty trash",
      destructive: true,
    });
    if (ok) purgeAll();
  }

  async function onPurge(row: Row) {
    const ok = await confirm({
      title: `Permanently delete "${row.title}"?`,
      description: "This can't be undone.",
      confirmLabel: "Delete forever",
      destructive: true,
    });
    if (ok) purge(row.kind, row.id);
  }

  return (
    <>
      <PageHeader
        icon={Trash2}
        title="Trash"
        subtitle={`${rows.length} item${rows.length === 1 ? "" : "s"} · auto-purges after ${TRASH_RETENTION_DAYS} days`}
        actions={
          rows.length > 0 && (
            <Button variant="secondary" onClick={onPurgeAll} leadingIcon={<Trash2 size={14} strokeWidth={2} />}>
              Empty trash
            </Button>
          )
        }
      />
      <PageBody>
        {rows.length === 0 ? (
          <Empty icon={InboxIcon} title="Nothing in trash" body="Deleted items show up here for 30 days before permanent removal." />
        ) : (
          <ul className="space-y-1.5">
            <AnimatePresence initial={false}>
              {rows.map((row) => {
                const Icon = KIND_ICON[row.kind];
                const cutoff = new Date(row.deletedAt).getTime() + TRASH_RETENTION_DAYS * 24 * 3600 * 1000;
                const daysLeft = Math.max(0, Math.ceil((cutoff - Date.now()) / (24 * 3600 * 1000)));
                const detailHref = detailRoute(row);
                return (
                  <motion.li
                    key={`${row.kind}-${row.id}`}
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="group flex items-center gap-3 rounded-xl bg-surface-1 px-3 py-2.5 hover:bg-surface-2">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-surface-2 text-fg-muted">
                        <Icon size={14} strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0 flex-1">
                        {detailHref ? (
                          <Link href={detailHref} className="block truncate text-[14px] font-medium text-fg hover:underline">
                            {row.title || "Untitled"}
                          </Link>
                        ) : (
                          <span className="block truncate text-[14px] font-medium text-fg">{row.title || "Untitled"}</span>
                        )}
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-fg-subtle">
                          <span className="rounded bg-surface-2 px-1.5 py-0.5">{KIND_LABEL[row.kind]}</span>
                          {row.meta && <span className="capitalize">{row.meta}</span>}
                          <span>Deleted {formatDistanceToNow(new Date(row.deletedAt), { addSuffix: true })}</span>
                          <span className={cn("font-mono", daysLeft <= 3 && "text-[color:var(--warning)]")}>
                            · {daysLeft}d left
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => restore(row.kind, row.id)}
                        className="inline-flex h-8 items-center gap-1 rounded-md bg-surface-2 px-2.5 text-[12px] font-medium text-fg-muted hover:bg-surface-3 hover:text-fg"
                      >
                        <RotateCcw size={12} strokeWidth={2} /> Restore
                      </button>
                      <button
                        type="button"
                        onClick={() => onPurge(row)}
                        aria-label="Delete forever"
                        className="grid h-8 w-8 place-items-center rounded-md text-fg-subtle hover:bg-surface-3 hover:text-[color:var(--danger)]"
                      >
                        <Trash2 size={13} strokeWidth={2} />
                      </button>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </PageBody>
    </>
  );
}

function detailRoute(row: Row): string | null {
  switch (row.kind) {
    case "task":    return `/tasks/${row.id}`;
    case "habit":   return `/habits/${row.id}`;
    case "goal":    return `/goals/${row.id}`;
    case "project": return `/projects/${row.id}`;
    case "note":    return `/notes/${row.id}`;
  }
}
