"use client";

import { use, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookText, Eye, Pencil, Pin, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { useLiveTasks, useLiveGoals } from "@/lib/store/selectors";
import { PageBody } from "@/components/ui/page";
import { useConfirm } from "@/components/ui/confirm";
import { Markdown } from "@/components/ui/markdown";
import { LinkedPicker } from "@/components/goals/link-picker";
import { NoteAIPanel } from "@/components/notes/ai-panel";
import { cn } from "@/lib/utils/cn";

export default function NoteDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const confirm = useConfirm();
  const note   = useStore((s) => s.notes.find((n) => n.id === id));
  const update = useStore((s) => s.updateNote);
  const remove = useStore((s) => s.deleteNote);
  const liveTasks = useLiveTasks();
  const liveGoals = useLiveGoals();
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [tagInput, setTagInput] = useState("");
  const [selection, setSelection] = useState<{ start: number; end: number; text: string }>({ start: 0, end: 0, text: "" });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    return {
      tasks: liveTasks.filter((t) => note.taskIds.includes(t.id)),
      goals: liveGoals.filter((g) => note.goalIds.includes(g.id)),
    };
  }, [note, liveTasks, liveGoals]);

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

  function captureSelection() {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end   = el.selectionEnd ?? 0;
    const text  = el.value.slice(start, end);
    setSelection({ start, end, text });
  }

  function applyAI(text: string, where: "insert" | "append" | "replace") {
    const current = note!.body;
    let next = current;
    let newCaret = current.length;

    if (where === "append") {
      const join = current.endsWith("\n") || current.length === 0 ? "" : "\n\n";
      next = current + join + text;
      newCaret = next.length;
    } else if (where === "replace" && selection.text) {
      next = current.slice(0, selection.start) + text + current.slice(selection.end);
      newCaret = selection.start + text.length;
    } else {
      const at = selection.start || current.length;
      const before = current.slice(0, at);
      const after  = current.slice(at);
      const needsBreakBefore = before.length > 0 && !before.endsWith("\n");
      const needsBreakAfter  = after.length  > 0 && !text.endsWith("\n") && !after.startsWith("\n");
      const insertion = (needsBreakBefore ? "\n" : "") + text + (needsBreakAfter ? "\n" : "");
      next = before + insertion + after;
      newCaret = at + insertion.length;
    }

    update(note!.id, { body: next });
    setMode("write");
    setTimeout(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(newCaret, newCaret);
    }, 30);
  }

  return (
    <>
      <div className="px-4 pt-6 sm:px-6 md:px-10 md:pt-10">
        <Link href="/notes" className="inline-flex items-center gap-1 text-[12.5px] text-fg-subtle hover:text-fg">
          <ArrowLeft size={13} strokeWidth={2} /> All notes
        </Link>
      </div>
      <PageBody className="px-4 sm:px-6 md:px-10">
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-start gap-2">
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
                className="min-w-0 flex-1 bg-transparent text-[24px] font-semibold tracking-tight text-fg outline-none placeholder:text-fg-subtle md:text-[26px]"
              />
              <div className="flex items-center gap-2">
                <NoteAIPanel
                  noteId={note.id}
                  title={note.title}
                  body={note.body}
                  selection={selection.text}
                  cursor={selection.start}
                  onApply={applyAI}
                />
                <div className="inline-flex rounded-full bg-surface-1 p-1">
                  <button type="button" onClick={() => setMode("write")}   aria-pressed={mode==="write"}   className={cn("inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[11.5px] font-medium", mode === "write" ? "bg-accent text-accent-fg" : "text-fg-muted hover:text-fg")}><Pencil size={12} strokeWidth={2} /> Write</button>
                  <button type="button" onClick={() => setMode("preview")} aria-pressed={mode==="preview"} className={cn("inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[11.5px] font-medium", mode === "preview" ? "bg-accent text-accent-fg" : "text-fg-muted hover:text-fg")}><Eye size={12} strokeWidth={2} /> Preview</button>
                </div>
              </div>
            </div>

            {selection.text && (
              <div className="rounded-lg bg-surface-1 px-3 py-2 text-[11.5px] text-fg-muted">
                <BookText size={11} strokeWidth={2} className="mr-1 inline" />
                {selection.text.length} character{selection.text.length === 1 ? "" : "s"} selected — AI actions will focus on this slice.
              </div>
            )}

            {mode === "write" ? (
              <textarea
                ref={textareaRef}
                value={note.body}
                onChange={(e) => update(note.id, { body: e.target.value })}
                onSelect={captureSelection}
                onKeyUp={captureSelection}
                onMouseUp={captureSelection}
                onFocus={captureSelection}
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

            <div className="space-y-4 rounded-2xl bg-surface-1 p-4">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.16em] text-fg-subtle">Backlinks</h4>
              <div>
                <span className="mb-1.5 block text-[11px] font-medium text-fg-muted">Tasks</span>
                <LinkedPicker
                  kind="tasks"
                  selected={note.taskIds}
                  onChange={(next) => update(note.id, { taskIds: next })}
                />
              </div>
              <div>
                <span className="mb-1.5 block text-[11px] font-medium text-fg-muted">Goals</span>
                <LinkedPicker
                  kind="goals"
                  selected={note.goalIds}
                  onChange={(next) => update(note.id, { goalIds: next })}
                />
              </div>

              {(backlinks.tasks.length > 0 || backlinks.goals.length > 0) && (
                <div className="space-y-1">
                  <span className="block text-[10.5px] font-medium uppercase tracking-[0.16em] text-fg-subtle">Open</span>
                  {backlinks.tasks.map((t) => <Link key={t.id} href={`/tasks/${t.id}`} className="block truncate rounded-md bg-surface-2 px-2 py-1.5 text-[12.5px] text-fg-muted hover:text-fg">→ {t.title}</Link>)}
                  {backlinks.goals.map((g) => <Link key={g.id} href={`/goals/${g.id}`} className="block truncate rounded-md bg-surface-2 px-2 py-1.5 text-[12.5px] text-fg-muted hover:text-fg">⚐ {g.title}</Link>)}
                </div>
              )}
            </div>

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
