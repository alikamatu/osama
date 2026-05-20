"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { buildSnapshot, downloadCSV, downloadJSON, downloadMarkdown } from "@/lib/exports";

type Format = "json" | "md" | "csv";

export function ExportButton({ format, label }: { format: Format; label: string }) {
  const [busy, setBusy] = useState(false);

  function snapshot() {
    const s = useStore.getState();
    return buildSnapshot({
      tasks: s.tasks, habits: s.habits, goals: s.goals,
      projects: s.projects, notes: s.notes, reviews: s.reviews,
    });
  }

  function run() {
    setBusy(true);
    try {
      const snap = snapshot();
      if (format === "json") downloadJSON(snap);
      else if (format === "md") downloadMarkdown(snap);
      else downloadCSV(snap);
    } finally {
      // download is synchronous from our POV; tiny delay so the spinner registers as feedback
      setTimeout(() => setBusy(false), 250);
    }
  }

  return (
    <button
      type="button"
      onClick={run}
      disabled={busy}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-surface-2 px-3 text-[13px] font-medium text-fg-muted hover:bg-surface-3 hover:text-fg disabled:opacity-60"
    >
      {busy ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} strokeWidth={2} />}
      {label}
    </button>
  );
}
