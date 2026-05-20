"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import type { ReviewKind } from "@/types/entities";
import { Button } from "@/components/ui/button";

type Question = { key: string; label: string; hint?: string };

export function ReviewForm({
  kind, periodStart, questions, aiDraft,
}: {
  kind: ReviewKind;
  periodStart: string;
  questions: Question[];
  aiDraft?: () => Record<string, string>;
}) {
  const existing = useStore((s) => s.reviews.find((r) => r.kind === kind && r.periodStart === periodStart));
  const save = useStore((s) => s.saveReview);
  const [content, setContent] = useState<Record<string, string>>(existing?.content ?? {});
  const [savedAt, setSavedAt] = useState<number | null>(existing ? Date.now() : null);

  useEffect(() => {
    setContent(existing?.content ?? {});
  }, [existing?.id]);  // eslint-disable-line react-hooks/exhaustive-deps

  function set(key: string, val: string) {
    setContent((c) => ({ ...c, [key]: val }));
  }

  function commit() {
    save(kind, periodStart, content);
    setSavedAt(Date.now());
  }

  function runDraft() {
    if (!aiDraft) return;
    const next = aiDraft();
    setContent((c) => ({ ...c, ...next }));
  }

  return (
    <div className="space-y-5">
      {aiDraft && (
        <div className="flex items-center justify-between rounded-2xl bg-surface-1 p-4">
          <p className="max-w-[40ch] text-[13px] text-fg-muted">
            Let the assistant draft this from your week. You can edit anything before saving.
          </p>
          <Button size="sm" variant="secondary" leadingIcon={<Sparkles size={13} strokeWidth={1.75} />} onClick={runDraft}>
            Draft with AI
          </Button>
        </div>
      )}

      {questions.map((q) => (
        <label key={q.key} className="block rounded-2xl bg-surface-1 p-5">
          <span className="block text-[14px] font-semibold text-fg">{q.label}</span>
          {q.hint && <span className="mt-0.5 block text-[12px] text-fg-subtle">{q.hint}</span>}
          <textarea
            value={content[q.key] ?? ""}
            onChange={(e) => set(q.key, e.target.value)}
            rows={4}
            placeholder="Your reflection…"
            className="mt-3 block w-full resize-y bg-surface-2 rounded-lg p-3 text-[13.5px] leading-relaxed text-fg outline-none placeholder:text-fg-subtle"
          />
        </label>
      ))}

      <div className="flex items-center justify-between gap-3">
        {savedAt && (
          <motion.span
            key={savedAt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-1 text-[12px] text-fg-muted"
          >
            <CheckCircle2 size={13} strokeWidth={2} className="text-[color:var(--positive)]" />
            Saved
          </motion.span>
        )}
        <div className="ml-auto">
          <Button onClick={commit}>Save review</Button>
        </div>
      </div>
    </div>
  );
}
