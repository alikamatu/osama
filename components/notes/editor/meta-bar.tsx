"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, Cloud } from "lucide-react";

export type SaveState = "idle" | "saving" | "saved";

export function MetaBar({
  words, characters, readingMinutes, saveState,
}: {
  words: number;
  characters: number;
  readingMinutes: number;
  saveState: SaveState;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11.5px] text-fg-subtle">
      <span><span className="font-mono tabular-nums text-fg-muted">{words}</span> word{words === 1 ? "" : "s"}</span>
      <span className="opacity-50">·</span>
      <span><span className="font-mono tabular-nums text-fg-muted">{characters}</span> char{characters === 1 ? "" : "s"}</span>
      <span className="opacity-50">·</span>
      <span><span className="font-mono tabular-nums text-fg-muted">{readingMinutes}</span> min read</span>
      <span className="opacity-50 ml-auto">·</span>
      <SaveIndicator state={saveState} />
    </div>
  );
}

function SaveIndicator({ state }: { state: SaveState }) {
  return (
    <span className="inline-flex h-5 items-center gap-1">
      <AnimatePresence mode="wait" initial={false}>
        {state === "saving" && (
          <motion.span
            key="saving"
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-1 text-fg-muted"
          >
            <Loader2 size={11} strokeWidth={2} className="animate-spin" />
            Saving
          </motion.span>
        )}
        {state === "saved" && (
          <motion.span
            key="saved"
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-1 text-[color:var(--positive)]"
          >
            <CheckCircle2 size={11} strokeWidth={2} />
            Saved
          </motion.span>
        )}
        {state === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-1 text-fg-subtle"
          >
            <Cloud size={11} strokeWidth={2} />
            Synced
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
