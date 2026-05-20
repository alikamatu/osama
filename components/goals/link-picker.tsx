"use client";

import { useMemo, useState } from "react";
import { Search, Check, Plus, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { fuzzyScore } from "@/lib/command/commands";
import { cn } from "@/lib/utils/cn";

export function LinkedPicker({
  selected, onChange, kind,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
  kind: "tasks" | "habits" | "goals";
}) {
  const rawList = useStore((s) =>
    kind === "tasks" ? s.tasks : kind === "habits" ? s.habits : s.goals,
  );
  const items = useMemo(
    () => (rawList as Array<{ id: string; title?: string; deletedAt?: string | null }>)
      .filter((x) => !x.deletedAt),
    [rawList],
  );
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const selectedItems = items.filter((i) => selected.includes(i.id));

  const filtered = useMemo(() => {
    if (!q.trim()) return items.slice(0, 20);
    return items
      .map((i) => ({ i, s: fuzzyScore(q, "title" in i ? (i.title ?? "") : "") }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => a.s - b.s)
      .slice(0, 20)
      .map((x) => x.i);
  }, [q, items]);

  function toggle(id: string) {
    if (selected.includes(id)) onChange(selected.filter((x) => x !== id));
    else onChange([...selected, id]);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        {selectedItems.map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => toggle(i.id)}
            className="inline-flex h-7 items-center gap-1 rounded-full bg-surface-2 px-2 text-[12px] text-fg hover:bg-surface-3"
          >
            <span className="max-w-[200px] truncate">{("title" in i) ? i.title : ""}</span>
            <X size={11} strokeWidth={2.5} className="text-fg-subtle" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-7 items-center gap-1 rounded-full bg-surface-2 px-2 text-[12px] font-medium text-fg-muted hover:bg-surface-3 hover:text-fg"
        >
          <Plus size={12} strokeWidth={2.5} /> Link {kind === "tasks" ? "task" : kind === "habits" ? "habit" : "goal"}
        </button>
      </div>

      <Modal open={open} onOpenChange={setOpen} title={`Link ${kind}`} size="md">
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-3">
            <Search size={14} strokeWidth={1.75} className="text-fg-subtle" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${kind}…`}
              className="h-10 w-full bg-transparent text-[13.5px] text-fg outline-none placeholder:text-fg-subtle"
            />
          </div>

          <ul className="max-h-[40vh] space-y-1 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="rounded-lg bg-surface-2 px-3 py-6 text-center text-[13px] text-fg-muted">No matches.</li>
            )}
            {filtered.map((i) => {
              const isSel = selected.includes(i.id);
              return (
                <li key={i.id}>
                  <button
                    type="button"
                    onClick={() => toggle(i.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left",
                      isSel ? "bg-accent/10" : "bg-surface-2 hover:bg-surface-3",
                    )}
                  >
                    <span className={cn(
                      "grid h-5 w-5 place-items-center rounded-md",
                      isSel ? "bg-accent text-accent-fg" : "bg-surface-3 text-fg-subtle",
                    )}>
                      {isSel && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span className="flex-1 truncate text-[13.5px] text-fg">{"title" in i ? i.title : ""}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex justify-end pt-2">
            <Button onClick={() => setOpen(false)}>Done · {selected.length} selected</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
