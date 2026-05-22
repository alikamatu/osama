"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft, Pin, Trash2, Maximize2, Minimize2, ClipboardCopy, Download, Sparkles,
} from "lucide-react";
import type { Editor } from "@tiptap/react";
import { useStore } from "@/lib/store";
import { useLiveTasks, useLiveGoals } from "@/lib/store/selectors";
import { PageBody } from "@/components/ui/page";
import { useConfirm } from "@/components/ui/confirm";
import { LinkedPicker } from "@/components/goals/link-picker";
import { NoteAIPanel } from "@/components/notes/ai-panel";
import { NoteEditor } from "@/components/notes/editor/editor";
import { Outline } from "@/components/notes/editor/outline";
import { MetaBar, type SaveState } from "@/components/notes/editor/meta-bar";
import { cn } from "@/lib/utils/cn";

const HOUSE_EASE = [0.22, 1, 0.36, 1] as const;
const SAVE_FLASH_MS = 1100;

export default function NoteDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const confirm = useConfirm();
  const note   = useStore((s) => s.notes.find((n) => n.id === id));
  const update = useStore((s) => s.updateNote);
  const remove = useStore((s) => s.deleteNote);
  const liveTasks = useLiveTasks();
  const liveGoals = useLiveGoals();

  // The Tiptap editor instance lives in state so child panels (Outline, AIPanel) can read it.
  const [editor, setEditor] = useState<Editor | null>(null);

  const [tagInput, setTagInput] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [plain, setPlain] = useState("");
  const [flash, setFlash] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const backlinks = useMemo(() => {
    if (!note) return { tasks: [], goals: [] };
    return {
      tasks: liveTasks.filter((t) => note.taskIds.includes(t.id)),
      goals: liveGoals.filter((g) => note.goalIds.includes(g.id)),
    };
  }, [note, liveTasks, liveGoals]);

  const wordCount = useMemo(() => {
    const t = plain.trim();
    return t.length === 0 ? 0 : t.split(/\s+/).filter(Boolean).length;
  }, [plain]);
  const charCount = useMemo(() => plain.replace(/\s+/g, " ").trim().length, [plain]);
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));

  // ESC exits focus mode.
  useEffect(() => {
    if (!focusMode) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setFocusMode(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusMode]);

  // Subtle "Saved" flash after a debounce.
  function bumpSavedFlash() {
    setSaveState("saving");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setSaveState("saved");
      saveTimerRef.current = setTimeout(() => setSaveState("idle"), SAVE_FLASH_MS);
    }, 320);
  }

  function showFlash(msg: string) {
    setFlash(msg);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => setFlash(null), 1600);
  }

  function applyAI(text: string, where: "insert" | "append" | "replace") {
    if (!editor) return;
    if (where === "append") {
      editor.commands.focus("end");
      editor.commands.insertContent("\n\n" + text);
    } else if (where === "replace" && !editor.state.selection.empty) {
      editor.chain().focus().deleteSelection().insertContent(text).run();
    } else {
      editor.chain().focus().insertContent(text).run();
    }
  }

  async function onDelete() {
    const ok = await confirm({
      title: "Delete note?",
      description: "This note will be removed. Linked tasks and goals stay.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (ok) { remove(note!.id); router.push("/notes"); }
  }

  function addTag(t: string) {
    const tag = t.trim().replace(/^#/, "").toLowerCase();
    if (!tag || note!.tags.includes(tag)) return;
    update(note!.id, { tags: [...note!.tags, tag] });
  }
  function removeTag(t: string) { update(note!.id, { tags: note!.tags.filter((x) => x !== t) }); }

  if (!note) return (
    <PageBody className="pt-10">
      <p className="text-fg-muted">Note not found.</p>
      <Link href="/notes" className="mt-3 inline-flex items-center gap-1 text-[13px] text-accent"><ArrowLeft size={14} /> All notes</Link>
    </PageBody>
  );

  async function copyAsMarkdown() {
    try {
      await navigator.clipboard.writeText(note!.body ?? "");
      showFlash("Copied as Markdown");
    } catch {
      showFlash("Copy failed");
    }
  }

  function downloadMarkdown() {
    const safeTitle = (note!.title || "untitled").replace(/[^a-z0-9-_]+/gi, "-").toLowerCase().slice(0, 80);
    const blob = new Blob([`# ${note!.title}\n\n${note!.body ?? ""}\n`], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeTitle}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    showFlash("Downloaded .md");
  }

  return (
    <>
      {/* Top breadcrumb — hidden in focus mode */}
      {!focusMode && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: HOUSE_EASE }}
          className="px-4 pt-6 sm:px-6 md:px-10 md:pt-10"
        >
          <Link href="/notes" className="inline-flex items-center gap-1 text-[12.5px] text-fg-subtle hover:text-fg">
            <ArrowLeft size={13} strokeWidth={2} /> All notes
          </Link>
        </motion.div>
      )}

      <PageBody className={cn(focusMode ? "px-4 pt-6 sm:px-6" : "px-4 sm:px-6 md:px-10")}>
        <div className={cn(
          "mt-4 grid grid-cols-1 gap-6",
          focusMode ? "mx-auto max-w-[820px]" : "lg:grid-cols-[1fr_280px]",
        )}>
          {/* Editor column */}
          <div className="min-w-0 space-y-3">
            {/* Title row */}
            <div className="flex flex-wrap items-start gap-2">
              <button
                type="button"
                onClick={() => update(note.id, { pinned: !note.pinned })}
                aria-label={note.pinned ? "Unpin" : "Pin"}
                className={cn(
                  "mt-2 grid h-8 w-8 place-items-center rounded-md transition-colors",
                  note.pinned ? "text-accent" : "text-fg-subtle hover:text-fg",
                )}
              >
                <Pin size={15} strokeWidth={2} />
              </button>
              <input
                value={note.title}
                onChange={(e) => { update(note.id, { title: e.target.value }); bumpSavedFlash(); }}
                placeholder="Untitled"
                className="min-w-0 flex-1 bg-transparent text-[24px] font-semibold tracking-tight text-fg outline-none placeholder:text-fg-subtle md:text-[28px]"
              />
              <div className="flex flex-wrap items-center gap-2">
                <NoteAIPanel
                  noteId={note.id}
                  title={note.title}
                  body={note.body}
                  selection=""
                  cursor={0}
                  onApply={applyAI}
                />
                <button
                  type="button"
                  onClick={() => setFocusMode((v) => !v)}
                  aria-label={focusMode ? "Exit focus mode" : "Enter focus mode"}
                  className="grid h-8 w-8 place-items-center rounded-md text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg"
                >
                  {focusMode ? <Minimize2 size={14} strokeWidth={2} /> : <Maximize2 size={14} strokeWidth={2} />}
                </button>
                <button
                  type="button"
                  onClick={copyAsMarkdown}
                  aria-label="Copy as Markdown"
                  className="grid h-8 w-8 place-items-center rounded-md text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg"
                >
                  <ClipboardCopy size={14} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={downloadMarkdown}
                  aria-label="Download as Markdown"
                  className="grid h-8 w-8 place-items-center rounded-md text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg"
                >
                  <Download size={14} strokeWidth={2} />
                </button>
              </div>
            </div>

            <MetaBar
              words={wordCount}
              characters={charCount}
              readingMinutes={readingMinutes}
              saveState={saveState}
            />

            {/* Inline flash toast */}
            {flash && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 px-2.5 py-1 text-[12px] text-fg-muted"
              >
                <Sparkles size={11} strokeWidth={2} className="text-accent" />
                {flash}
              </motion.div>
            )}

            {/* The editor itself */}
            <NoteEditor
              initialMarkdown={note.body ?? ""}
              placeholder="Start writing — type / for blocks, ** for bold, # for heading."
              focusMode={focusMode}
              onChange={(md, txt) => {
                update(note.id, { body: md });
                setPlain(txt);
                bumpSavedFlash();
              }}
              onEditor={setEditor}
            />
          </div>

          {/* Sidebar — hidden in focus mode */}
          {!focusMode && (
            <motion.aside
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.32, ease: HOUSE_EASE, delay: 0.06 }}
              className="space-y-4"
            >
              <Outline editor={editor} />

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
            </motion.aside>
          )}
        </div>
      </PageBody>
    </>
  );
}
