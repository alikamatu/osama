import { verifyUnsubToken, type UnsubScope } from "@/lib/auth/unsub-token";
import { AlertTriangle } from "lucide-react";
import { UnsubscribeForm } from "@/components/legal/unsubscribe-form";

const SCOPE_LABELS: Record<UnsubScope, string> = {
  "digest":           "the daily and weekly email digest",
  "habit-reminders":  "habit reminder emails",
  "goal-nudges":      "goal at-risk nudge emails",
  "all":              "all non-essential emails",
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const result = t ? verifyUnsubToken(t) : ({ ok: false, reason: "malformed" } as const);

  if (!result.ok) {
    return (
      <div className="mx-auto max-w-md px-6 py-16">
        <div className="rounded-2xl bg-surface-1 p-8 text-center">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-[color:var(--danger)]">
            <AlertTriangle size={20} strokeWidth={2} />
          </span>
          <h1 className="mt-4 text-[20px] font-semibold tracking-tight text-fg">
            Invalid unsubscribe link
          </h1>
          <p className="mt-2 text-[13.5px] text-fg-muted">
            This link couldn&apos;t be verified. It may have been altered. Sign in to manage your email preferences instead.
          </p>
          <a
            href="/settings/notifications"
            className="mt-6 inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg"
          >
            Open notification settings
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-2xl bg-surface-1 p-8 text-center">
        <h1 className="text-[22px] font-semibold tracking-tight text-fg">Unsubscribe</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-fg-muted">
          We&apos;ll stop sending you {SCOPE_LABELS[result.scope]}.
          Sign-in confirmation emails will always be delivered.
        </p>
        <p className="mt-4 text-[12px] text-fg-subtle">
          For <span className="text-fg-muted">{result.email}</span>
        </p>
        <div className="mt-6">
          <UnsubscribeForm email={result.email} scope={result.scope} />
        </div>
      </div>
    </div>
  );
}
