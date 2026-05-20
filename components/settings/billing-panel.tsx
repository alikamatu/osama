"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function CancelButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function cancel() {
    setError(null);
    startTransition(async () => {
      const r = await fetch("/api/billing/cancel", { method: "POST" });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        setError(body?.error ?? "Could not cancel.");
        return;
      }
      router.refresh();
    });
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex h-9 items-center rounded-lg bg-surface-2 px-3 text-[13px] font-medium text-fg-muted hover:bg-surface-3 hover:text-fg"
      >
        Cancel renewal
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={cancel}
        disabled={pending}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-surface-2 px-3 text-[13px] font-semibold text-[color:var(--danger)] hover:bg-surface-3"
      >
        {pending && <Loader2 size={14} className="animate-spin" />}
        Confirm cancel
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="inline-flex h-9 items-center rounded-lg px-3 text-[13px] font-medium text-fg-subtle hover:text-fg"
      >
        Nevermind
      </button>
      {error && <span className="text-[12px] text-[color:var(--danger)]">{error}</span>}
    </div>
  );
}
