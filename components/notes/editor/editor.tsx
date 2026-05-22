"use client";

import "./styles.css";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Markdown } from "tiptap-markdown";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";
import { FloatingToolbar } from "./floating-toolbar";
import { SlashMenu } from "./slash-menu";

type EditorProps = {
  initialMarkdown: string;
  placeholder?: string;
  onChange: (markdown: string, plain: string) => void;
  /** Distraction-free toggle dims unfocused blocks. */
  focusMode?: boolean;
  /** Receive the editor instance for outline / shortcuts. */
  onEditor?: (e: Editor | null) => void;
};

const HOUSE_EASE = [0.22, 1, 0.36, 1] as const;

export function NoteEditor({
  initialMarkdown, placeholder, onChange, focusMode = false, onEditor,
}: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // disable defaults we override or don't want.
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Type / for blocks, or just start writing…",
        showOnlyCurrent: false,
        emptyEditorClass: "is-editor-empty",
      }),
      Typography, // smart quotes, ellipsis, em-dash etc.
      TaskList,
      TaskItem.configure({ nested: true }),
      Markdown.configure({
        html: false,
        tightLists: true,
        bulletListMarker: "-",
        linkify: true,
        breaks: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: initialMarkdown,
    onCreate: ({ editor }) => {
      onEditor?.(editor);
      setMounted(true);
      // Emit initial counts so the meta bar isn't blank.
      const md = (editor.storage as unknown as { markdown: { getMarkdown: () => string } }).markdown.getMarkdown();
      onChange(md, editor.getText());
    },
    onUpdate: ({ editor }) => {
      const md = (editor.storage as unknown as { markdown: { getMarkdown: () => string } }).markdown.getMarkdown();
      onChange(md, editor.getText());
    },
    onDestroy: () => onEditor?.(null),
  });

  // Track the currently-focused block so focus mode can dim everything else.
  useEffect(() => {
    if (!editor) return;
    function paint() {
      if (!editor) return;
      const root = containerRef.current?.querySelector(".ProseMirror");
      if (!root) return;
      root.querySelectorAll(".has-focus").forEach((n) => n.classList.remove("has-focus"));
      const { $from } = editor.state.selection;
      const depth = $from.depth;
      let pos = $from.before(depth >= 1 ? 1 : depth);
      pos = Math.max(0, pos);
      const dom = editor.view.nodeDOM(pos);
      const el = (dom instanceof HTMLElement ? dom : (dom?.parentElement ?? null));
      el?.classList.add("has-focus");
    }
    editor.on("selectionUpdate", paint);
    editor.on("update", paint);
    paint();
    return () => {
      editor.off("selectionUpdate", paint);
      editor.off("update", paint);
    };
  }, [editor]);

  // Setter from outside (e.g., AI panel insertion) — exposed via ref pattern is overkill;
  // callers should drive content updates through the markdown prop change.
  const lastMd = useRef(initialMarkdown);
  useEffect(() => {
    if (!editor) return;
    if (initialMarkdown === lastMd.current) return;
    lastMd.current = initialMarkdown;
    // Replace content without losing focus state.
    editor.commands.setContent(initialMarkdown, { emitUpdate: false });
  }, [editor, initialMarkdown]);

  // Cmd/Ctrl+S — soft save signal (the store autosaves on every change; this just blurs).
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      (document.activeElement as HTMLElement | null)?.blur();
    }
  }, []);

  return (
    <motion.div
      ref={containerRef}
      onKeyDown={onKeyDown}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: HOUSE_EASE }}
      className={cn("cairn-editor relative", focusMode && "focus-on")}
    >
      <FloatingToolbar editor={editor} />
      <SlashMenu editor={editor} />
      <EditorContent editor={editor} className={cn(!mounted && "opacity-0")} />
    </motion.div>
  );
}
