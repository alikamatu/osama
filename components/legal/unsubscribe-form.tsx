"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { confirmUnsubscribe } from "@/app/(legal)/unsubscribe/actions";
import type { UnsubScope } from "@/lib/auth/unsub-token";

export function UnsubscribeForm({ email, scope }: { email: string; scope: UnsubScope }) {
  void email; // surfaced in the page heading
  void scope;
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submit() {
    setError(null);
    const token = params.get("t");
    if (!token) { setError("Missing token."); return; }
    startTransition(async () => {
      const r = await confirmUnsubscribe({ token });
      if (r.ok) setDone(true);
      else setError(r.error);
    });
  }

  if (done) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg bg-surface-2 px-4 py-3 text-[13.5px] text-fg">
        <CheckCircle2 size={16} strokeWidth={2} className="text-[color:var(--positive)]" />
        You&apos;ve been unsubscribed.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={pending}
        onClick={submit}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-[14px] font-semibold text-accent-fg hover:brightness-110 disabled:opacity-60"
      >
        {pending ? <><Loader2 size={16} className="animate-spin" /> Updating…</> : "Confirm unsubscribe"}
      </button>
      {error && <p className="text-[12px] text-[color:var(--danger)]">{error}</p>}
      <a
        href="/settings/notifications"
        className="block text-[12px] text-fg-subtle hover:text-fg-muted"
      >
        Manage all preferences instead
      </a>
    </div>
  );
}
