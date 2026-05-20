"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckSquare, Flag, Repeat, Inbox, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Kind = "task" | "habit" | "goal" | "inbox";

export function QuickAdd({
  open, onOpenChange, onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (kind: Kind, title: string) => void;
}) {
  const [kind, setKind] = useState<Kind>("task");
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle("");
      setKind("task");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  function submit() {
    const t = title.trim();
    if (!t) return;
    onCreate(kind, t);
    onOpenChange(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-start justify-center pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-black/40"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-[min(560px,92vw)] overflow-hidden rounded-2xl bg-surface-1"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 px-4 pt-3">
              <KindChip active={kind === "task"}   onClick={() => setKind("task")}   icon={<CheckSquare size={13} strokeWidth={2} />}>Task</KindChip>
              <KindChip active={kind === "habit"}  onClick={() => setKind("habit")}  icon={<Repeat size={13} strokeWidth={2} />}>Habit</KindChip>
              <KindChip active={kind === "goal"}   onClick={() => setKind("goal")}   icon={<Flag size={13} strokeWidth={2} />}>Goal</KindChip>
              <KindChip active={kind === "inbox"}  onClick={() => setKind("inbox")}  icon={<Inbox size={13} strokeWidth={2} />}>Inbox</KindChip>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="ml-auto grid h-7 w-7 place-items-center rounded-md text-fg-subtle hover:bg-surface-2 hover:text-fg"
                aria-label="Close"
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>

            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
              placeholder={
                kind === "task"  ? "What needs doing?" :
                kind === "habit" ? "A habit to build…" :
                kind === "goal"  ? "A goal to chase…" :
                                   "Quick thought…"
              }
              className="block w-full bg-transparent px-4 py-4 text-[17px] text-fg outline-none placeholder:text-fg-subtle"
            />

            <div className="flex items-center justify-between bg-surface-2 px-4 py-2.5">
              <span className="text-[11px] text-fg-subtle">
                Press <kbd className="rounded bg-surface-3 px-1 py-0.5 font-mono">↵</kbd> to save · <kbd className="rounded bg-surface-3 px-1 py-0.5 font-mono">Esc</kbd> to close
              </span>
              <button
                type="button"
                onClick={submit}
                disabled={!title.trim()}
                className="rounded-md bg-accent px-3 py-1.5 text-[12px] font-semibold text-accent-fg disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function KindChip({
  active, onClick, children, icon,
}: { active: boolean; onClick: () => void; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium",
        active ? "bg-accent text-accent-fg" : "bg-surface-2 text-fg-muted hover:text-fg",
      )}
    >
      {icon}
      {children}
    </button>
  );
}
