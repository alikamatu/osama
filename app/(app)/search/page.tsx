"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, CheckSquare, Flame, Flag, Folder, NotebookPen, FileText } from "lucide-react";
import { useStore } from "@/lib/store";
import { useLiveTasks, useLiveHabits, useLiveGoals, useLiveProjects, useLiveNotes } from "@/lib/store/selectors";
import { PageHeader, PageBody, Empty } from "@/components/ui/page";
import { searchAll, type SearchHit } from "@/lib/domain/search";

const KIND_ICON = {
  task: CheckSquare, habit: Flame, goal: Flag, project: Folder, note: NotebookPen, review: FileText,
} as const;

export default function SearchPage() {
  const [q, setQ] = useState("");
  const tasks    = useLiveTasks();
  const habits   = useLiveHabits();
  const goals    = useLiveGoals();
  const projects = useLiveProjects();
  const notes    = useLiveNotes();
  const reviews  = useStore((s) => s.reviews);

  const hits: SearchHit[] = useMemo(
    () => searchAll(q, { tasks, habits, goals, projects, notes, reviews }),
    [q, tasks, habits, goals, projects, notes, reviews],
  );

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const initial = sp.get("q") ?? "";
    if (initial) setQ(initial);
  }, []);

  return (
    <>
      <PageHeader icon={Search} title="Search" subtitle="Across tasks, habits, goals, projects, notes, and reviews." />
      <PageBody>
        <input
          type="search"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type to find anything…"
          className="h-12 w-full rounded-xl bg-surface-1 px-4 text-[15px] text-fg outline-none placeholder:text-fg-subtle"
        />

        <div className="mt-4">
          {!q.trim() ? (
            <p className="text-[13px] text-fg-subtle">Start typing — fuzzy matching across every entity.</p>
          ) : hits.length === 0 ? (
            <Empty icon={Search} title="Nothing found" body="Try fewer keywords or check different fields." />
          ) : (
            <ul className="space-y-1.5">
              {hits.map((h) => {
                const Icon = KIND_ICON[h.kind];
                return (
                  <li key={`${h.kind}-${h.id}`}>
                    <Link href={h.href} className="flex items-center gap-3 rounded-xl bg-surface-1 px-3 py-2.5 hover:bg-surface-2">
                      <span className="grid h-7 w-7 place-items-center rounded-md bg-surface-2 text-fg-muted">
                        <Icon size={13} strokeWidth={1.75} />
                      </span>
                      <span className="flex-1 truncate text-[14px] text-fg">{h.title}</span>
                      <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] capitalize text-fg-subtle">{h.kind}</span>
                      {h.subtitle && <span className="truncate text-[11.5px] text-fg-subtle">{h.subtitle}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PageBody>
    </>
  );
}
