"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Editor } from "@tiptap/react";
import {
  Heading1, Heading2, Heading3, List, ListOrdered, ListChecks,
  Quote, Code2, Minus, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Item = {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  keywords: string;
  run: (editor: Editor, range: { from: number; to: number }) => void;
};

const ITEMS: Item[] = [
  { id: "h1", label: "Heading 1",   hint: "Big section title",     icon: Heading1,    keywords: "h1 heading title",
    run: (e, r) => e.chain().focus().deleteRange(r).setHeading({ level: 1 }).run() },
  { id: "h2", label: "Heading 2",   hint: "Section heading",        icon: Heading2,    keywords: "h2 heading sub",
    run: (e, r) => e.chain().focus().deleteRange(r).setHeading({ level: 2 }).run() },
  { id: "h3", label: "Heading 3",   hint: "Subsection heading",     icon: Heading3,    keywords: "h3 heading",
    run: (e, r) => e.chain().focus().deleteRange(r).setHeading({ level: 3 }).run() },
  { id: "ul", label: "Bullet list", hint: "Simple bulleted list",   icon: List,        keywords: "ul bullet list unordered",
    run: (e, r) => e.chain().focus().deleteRange(r).toggleBulletList().run() },
  { id: "ol", label: "Numbered list", hint: "Ordered list",         icon: ListOrdered, keywords: "ol ordered numbered list",
    run: (e, r) => e.chain().focus().deleteRange(r).toggleOrderedList().run() },
  { id: "todo", label: "To-do list", hint: "Checkboxes",            icon: ListChecks,  keywords: "todo task check list",
    run: (e, r) => e.chain().focus().deleteRange(r).toggleTaskList().run() },
  { id: "quote", label: "Quote",    hint: "Indented quotation",     icon: Quote,       keywords: "quote blockquote",
    run: (e, r) => e.chain().focus().deleteRange(r).toggleBlockquote().run() },
  { id: "code", label: "Code block", hint: "Monospace, multi-line", icon: Code2,       keywords: "code pre block",
    run: (e, r) => e.chain().focus().deleteRange(r).toggleCodeBlock().run() },
  { id: "hr",  label: "Divider",    hint: "Horizontal rule",        icon: Minus,       keywords: "hr divider rule line",
    run: (e, r) => e.chain().focus().deleteRange(r).setHorizontalRule().run() },
];

export function SlashMenu({ editor }: { editor: Editor | null }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [active, setActive] = useState(0);
  const triggerRangeRef = useRef<{ from: number; to: number } | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter((i) =>
      i.label.toLowerCase().includes(q) || i.keywords.includes(q),
    );
  }, [query]);

  // Re-clamp active when filtered length changes.
  useEffect(() => { if (active >= filtered.length) setActive(0); }, [filtered.length, active]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-i="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const runItem = useCallback((item: Item) => {
    if (!editor || !triggerRangeRef.current) return;
    item.run(editor, triggerRangeRef.current);
    triggerRangeRef.current = null;
    setOpen(false);
    setQuery("");
  }, [editor]);

  // Detect "/" trigger and update query while open.
  useEffect(() => {
    if (!editor) return;

    function update() {
      if (!editor) return;
      const { state, view } = editor;
      const { $from } = state.selection;
      const text = $from.parent.textBetween(0, $from.parentOffset, "\n", "\0");
      const m = /(^|\s)(\/([\w]*))$/.exec(text);
      if (m) {
        const trigger = m[2];
        const startInBlock = $from.parentOffset - trigger.length;
        const from = $from.start() + startInBlock;
        const to = from + trigger.length;
        triggerRangeRef.current = { from, to };
        setQuery(m[3] ?? "");

        // Position popover beneath the slash.
        const coords = view.coordsAtPos(from);
        const container = (view.dom as HTMLElement).closest(".cairn-editor") as HTMLElement | null;
        if (container) {
          const box = container.getBoundingClientRect();
          setPos({ top: coords.bottom - box.top + 6, left: coords.left - box.left });
        }
        setOpen(true);
        return;
      }
      // Close if the slash trigger disappeared.
      triggerRangeRef.current = null;
      setOpen(false);
    }

    editor.on("selectionUpdate", update);
    editor.on("update", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("update", update);
    };
  }, [editor]);

  // Keyboard nav while open.
  useEffect(() => {
    if (!open || !editor) return;
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(filtered.length - 1, i + 1)); }
      else if (e.key === "ArrowUp")   { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
      else if (e.key === "Enter")     {
        const it = filtered[active];
        if (it) { e.preventDefault(); runItem(it); }
      }
      else if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, filtered, active, editor, runItem]);

  if (!editor) return null;

  return (
    <AnimatePresence>
      {open && pos && filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.97 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "absolute", top: pos.top, left: pos.left, zIndex: 25 }}
          className="w-[260px] overflow-hidden rounded-xl bg-surface-3 shadow-[0_12px_32px_-12px_rgba(0,0,0,.45)]"
        >
          <div className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
            Insert block
          </div>
          <ul ref={listRef} role="listbox" className="max-h-[280px] overflow-y-auto p-1">
            {filtered.map((it, i) => {
              const Icon = it.icon;
              const isActive = i === active;
              return (
                <li key={it.id}>
                  <button
                    data-i={i}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onMouseMove={() => setActive(i)}
                    onMouseDown={(e) => { e.preventDefault(); runItem(it); }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left",
                      isActive ? "bg-surface-2" : "hover:bg-surface-2/70",
                    )}
                  >
                    <span className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-md",
                      isActive ? "bg-accent text-accent-fg" : "bg-surface-2 text-fg-muted",
                    )}>
                      <Icon size={13} strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium text-fg">{it.label}</span>
                      <span className="block truncate text-[11px] text-fg-subtle">{it.hint}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
