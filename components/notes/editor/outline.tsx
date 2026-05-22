"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { Editor } from "@tiptap/react";
import { ListTree } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Heading = { level: number; text: string; pos: number; id: string };

export function Outline({ editor }: { editor: Editor | null }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activePos, setActivePos] = useState<number | null>(null);

  useEffect(() => {
    if (!editor) return;
    function rebuild() {
      if (!editor) return;
      const out: Heading[] = [];
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "heading") {
          const level = (node.attrs as { level?: number }).level ?? 1;
          out.push({
            level,
            text: node.textContent || "Untitled",
            pos,
            id: `${pos}-${level}`,
          });
        }
      });
      setHeadings(out);
    }
    function updateActive() {
      if (!editor) return;
      const cur = editor.state.selection.from;
      // The closest preceding heading is "active".
      let best: number | null = null;
      let bestPos = -1;
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "heading" && pos <= cur && pos > bestPos) {
          best = pos;
          bestPos = pos;
        }
      });
      setActivePos(best);
    }
    rebuild();
    updateActive();
    editor.on("update", rebuild);
    editor.on("selectionUpdate", updateActive);
    return () => {
      editor.off("update", rebuild);
      editor.off("selectionUpdate", updateActive);
    };
  }, [editor]);

  if (!editor) return null;

  function jump(pos: number) {
    if (!editor) return;
    editor.chain().focus().setTextSelection(pos + 1).run();
    const dom = editor.view.domAtPos(pos + 1).node as HTMLElement | null;
    (dom?.closest("h1, h2, h3") ?? dom)?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="rounded-2xl bg-surface-1 p-4">
      <h4 className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-fg-subtle">
        <ListTree size={12} strokeWidth={2} />
        Outline
      </h4>
      {headings.length === 0 ? (
        <p className="text-[12px] text-fg-subtle">
          Add a heading with <kbd className="rounded bg-surface-2 px-1 font-mono">/h1</kbd> or <kbd className="rounded bg-surface-2 px-1 font-mono">#</kbd> to see an outline.
        </p>
      ) : (
        <motion.ul layout className="space-y-0.5">
          {headings.map((h) => (
            <motion.li
              key={h.id}
              layout
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={() => jump(h.pos)}
                className={cn(
                  "relative block w-full truncate rounded-md px-2 py-1 text-left text-[12.5px]",
                  h.level === 1 ? "pl-2"  : h.level === 2 ? "pl-4" : "pl-6",
                  activePos === h.pos ? "text-fg" : "text-fg-muted hover:bg-surface-2 hover:text-fg",
                )}
              >
                {activePos === h.pos && (
                  <motion.span
                    layoutId="outline-active"
                    className="absolute inset-y-0 left-0 -z-10 w-full rounded-md bg-surface-2"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {h.text}
              </button>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
