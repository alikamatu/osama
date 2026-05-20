"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Pencil, Pin, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageBody } from "@/components/ui/page";
import { useConfirm } from "@/components/ui/confirm";
import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/utils/cn";

export default function NoteDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const confirm = useConfirm();
  const note   = useStore((s) => s.notes.find((n) => n.id === id));
  const update = useStore((s) => s.updateNote);
  const remove = useStore((s) => s.deleteNote);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [tagInput, setTagInput] = useState("");

  async function onDelete() {
    const ok = await confirm({
      title: "Delete note?",
      description: "This note will be removed. Linked tasks and goals stay.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (ok) { remove(note!.id); router.push("/notes"); }
  }

  const backlinks = useMemo(() => {
    if (!note) return { tasks: [], goals: [] };
    const t = useStore.getState().tasks.filter((x) => note.taskIds.includes(x.id));
    const g = useStore.getState().goals.filter((x) => note.goalIds.includes(x.id));
    return { tasks: t, goals: g };
  }, [note]);

  if (!note) return (
    <PageBody className="pt-10">
      <p className="text-fg-muted">Note not found.</p>
      <Link href="/notes" className="mt-3 inline-flex items-center gap-1 text-[13px] text-accent"><ArrowLeft size={14} /> All notes</Link>
    </PageBody>
  );

  function addTag(t: string) {
    const tag = t.trim().replace(/^#/, "").toLowerCase();
    if (!tag || note!.tags.includes(tag)) return;
    update(note!.id, { tags: [...note!.tags, tag] });
  }
  function removeTag(t: string) { update(note!.id, { tags: note!.tags.filter((x) => x !== t) }); }

  return (
    <>
      <div className="px-6 pt-6 md:px-10 md:pt-10">
        <Link href="/notes" className="inline-flex items-center gap-1 text-[12.5px] text-fg-subtle hover:text-fg">
          <ArrowLeft size={13} strokeWidth={2} /> All notes
        </Link>
      </div>
      <PageBody>
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => update(note.id, { pinned: !note.pinned })}
                aria-label={note.pinned ? "Unpin" : "Pin"}
                className={cn("mt-2 grid h-8 w-8 place-items-center rounded-md", note.pinned ? "text-accent" : "text-fg-subtle hover:text-fg")}
              >
                <Pin size={15} strokeWidth={2} />
              </button>
              <input
                value={note.title}
                onChange={(e) => update(note.id, { title: e.target.value })}
                placeholder="Title"
                className="w-full bg-transparent text-[26px] font-semibold tracking-tight text-fg outline-none placeholder:text-fg-subtle"
              />
              <div className="mt-2 inline-flex rounded-full bg-surface-1 p-1">
                <button type="button" onClick={() => setMode("write")}   aria-pressed={mode==="write"}   className={cn("inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[11.5px] font-medium", mode === "write" ? "bg-accent text-accent-fg" : "text-fg-muted hover:text-fg")}><Pencil size={12} strokeWidth={2} /> Write</button>
                <button type="button" onClick={() => setMode("preview")} aria-pressed={mode==="preview"} className={cn("inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[11.5px] font-medium", mode === "preview" ? "bg-accent text-accent-fg" : "text-fg-muted hover:text-fg")}><Eye size={12} strokeWidth={2} /> Preview</button>
              </div>
            </div>

            {mode === "write" ? (
              <textarea
                value={note.body}
                onChange={(e) => update(note.id, { body: e.target.value })}
                placeholder="Start writing — markdown supported (# headings, **bold**, *italic*, - lists, `code`, [link](url))."
                rows={24}
                className="block w-full resize-y rounded-2xl bg-surface-1 p-5 font-mono text-[13.5px] leading-relaxed text-fg outline-none placeholder:text-fg-subtle"
              />
            ) : (
              <div className="rounded-2xl bg-surface-1 p-5">
                {note.body ? <Markdown source={note.body} /> : <p className="text-fg-muted">Nothing to preview yet.</p>}
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl bg-surface-1 p-4">
              <h4 className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-fg-subtle">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {note.tags.map((t) => (
                  <button key={t} type="button" onClick={() => removeTag(t)} className="inline-flex h-6 items-center gap-1 rounded-full bg-surface-2 px-2 text-[11px] text-fg hover:bg-surface-3">
                    #{t} <span className="text-fg-subtle">×</span>
                  </button>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { addTag(tagInput); setTagInput(""); } }}
                  placeholder="add tag…"
                  className="h-6 bg-transparent text-[12px] text-fg outline-none placeholder:text-fg-subtle"
                />
              </div>
            </div>

            {(backlinks.tasks.length > 0 || backlinks.goals.length > 0) && (
              <div className="rounded-2xl bg-surface-1 p-4">
                <h4 className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-fg-subtle">Backlinks</h4>
                {backlinks.tasks.map((t) => <Link key={t.id} href={`/tasks/${t.id}`} className="block truncate rounded-md bg-surface-2 px-2 py-1.5 text-[12.5px] text-fg-muted hover:text-fg">→ {t.title}</Link>)}
                {backlinks.goals.map((g) => <Link key={g.id} href={`/goals/${g.id}`} className="block truncate rounded-md bg-surface-2 px-2 py-1.5 text-[12.5px] text-fg-muted hover:text-fg">⚐ {g.title}</Link>)}
              </div>
            )}

            <button
              type="button"
              onClick={onDelete}
              className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-surface-1 px-3 text-[13px] font-medium text-[color:var(--danger)] hover:bg-surface-2"
            >
              <Trash2 size={14} strokeWidth={2} /> Delete note
            </button>
          </aside>
        </div>
      </PageBody>
    </>
  );
}
