"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Editor } from "@tiptap/react";
import {
  Bold, Italic, Strikethrough, Code, Link2, Link2Off,
  Heading1, Heading2, List, ListOrdered, Quote,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Floating formatting toolbar that appears above the current text selection.
 * We position it ourselves (instead of Tiptap's BubbleMenu plugin) so the
 * animation and DOM ownership stay in plain React/Motion-land.
 */
export function FloatingToolbar({ editor }: { editor: Editor | null }) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!editor) return;

    function update() {
      if (!editor) return;
      const { state, view } = editor;
      const { from, to, empty } = state.selection;
      if (empty || !view.hasFocus()) { setPos(null); return; }

      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);
      const container = (view.dom as HTMLElement).closest(".cairn-editor") as HTMLElement | null;
      if (!container) { setPos(null); return; }
      const box = container.getBoundingClientRect();

      const top = Math.min(start.top, end.top) - box.top - 44;
      const left = (Math.min(start.left, end.left) + Math.max(start.right, end.right)) / 2 - box.left;
      setPos({ top: Math.max(8, top), left });
    }

    editor.on("selectionUpdate", update);
    editor.on("focus", update);
    editor.on("blur", () => setPos(null));
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("focus", update);
    };
  }, [editor]);

  if (!editor) return null;

  const items = [
    { id: "h1", icon: Heading1,       active: editor.isActive("heading", { level: 1 }), run: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { id: "h2", icon: Heading2,       active: editor.isActive("heading", { level: 2 }), run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { id: "b",  icon: Bold,           active: editor.isActive("bold"),    run: () => editor.chain().focus().toggleBold().run() },
    { id: "i",  icon: Italic,         active: editor.isActive("italic"),  run: () => editor.chain().focus().toggleItalic().run() },
    { id: "s",  icon: Strikethrough,  active: editor.isActive("strike"),  run: () => editor.chain().focus().toggleStrike().run() },
    { id: "c",  icon: Code,           active: editor.isActive("code"),    run: () => editor.chain().focus().toggleCode().run() },
    { id: "q",  icon: Quote,          active: editor.isActive("blockquote"), run: () => editor.chain().focus().toggleBlockquote().run() },
    { id: "ul", icon: List,           active: editor.isActive("bulletList"), run: () => editor.chain().focus().toggleBulletList().run() },
    { id: "ol", icon: ListOrdered,    active: editor.isActive("orderedList"), run: () => editor.chain().focus().toggleOrderedList().run() },
    { id: "lk", icon: editor.isActive("link") ? Link2Off : Link2, active: editor.isActive("link"),
      run: () => {
        if (editor.isActive("link")) {
          editor.chain().focus().unsetLink().run();
          return;
        }
        const url = window.prompt("URL");
        if (!url) return;
        const safe = /^https?:\/\//i.test(url) ? url : `https://${url}`;
        editor.chain().focus().extendMarkRange("link").setLink({ href: safe }).run();
      },
    },
  ];

  return (
    <AnimatePresence>
      {pos && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.95 }}
          transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "absolute", top: pos.top, left: pos.left, transform: "translateX(-50%)", zIndex: 30 }}
          className="flex items-center gap-0.5 rounded-xl bg-surface-3 p-1 shadow-[0_8px_24px_-12px_rgba(0,0,0,.45)]"
        >
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <motion.button
                key={it.id}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); it.run(); }}
                whileTap={{ scale: 0.92 }}
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-md transition-colors",
                  it.active ? "bg-accent text-accent-fg" : "text-fg-muted hover:bg-surface-2 hover:text-fg",
                )}
                aria-pressed={it.active}
              >
                <Icon size={13} strokeWidth={2} />
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
