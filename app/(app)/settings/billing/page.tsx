import { redirect } from "next/navigation";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { readSubscription } from "@/lib/billing/subscription";
import { formatGhs, PRO_PLAN } from "@/lib/billing/plans";
import { SettingsSection, SettingsRow } from "@/components/settings/section";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { CancelButton } from "@/components/settings/billing-panel";
import { InvoiceList } from "@/components/settings/invoices";

const STATUS_COPY: Record<string, { tone: "ok" | "warn" | "err"; text: string }> = {
  success:             { tone: "ok",   text: "Payment received. Welcome to Pro." },
  cancelled:           { tone: "warn", text: "Checkout cancelled. No charge made." },
  failed:              { tone: "err",  text: "We couldn't verify your payment. Try again or contact support." },
  abandoned:           { tone: "warn", text: "Checkout was abandoned before completing." },
  mismatch:            { tone: "err",  text: "Payment email didn't match your account. No changes made." },
  "missing-reference": { tone: "err",  text: "Missing payment reference. Please retry." },
  pending:             { tone: "warn", text: "Payment is still processing." },
};

export default async function BillingSettings({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/signin");
  const sub = readSubscription(session);
  const { status } = await searchParams;
  const flash = status ? STATUS_COPY[status] : null;

  const renewLabel = sub.renewsAt
    ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(sub.renewsAt))
    : null;

  return (
    <div className="space-y-6">
      {flash && (
        <div
          role="alert"
          className={`rounded-xl px-4 py-3 text-[13.5px] ${
            flash.tone === "ok"   ? "bg-surface-1 text-fg" :
            flash.tone === "warn" ? "bg-surface-1 text-fg-muted" :
                                    "bg-surface-1 text-[color:var(--danger)]"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            {flash.tone === "ok" ? (
              <CheckCircle2 size={16} strokeWidth={2} className="text-[color:var(--positive)]" />
            ) : (
              <AlertTriangle size={16} strokeWidth={2} />
            )}
            {flash.text}
          </span>
        </div>
      )}

      <SettingsSection title="Current plan" description="What you're on, and when it renews.">
        <SettingsRow label="Plan" hint={sub.tier === "pro" ? "All features unlocked." : "Upgrade for the assistant, sync, and more."}>
          <span className="inline-flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] ${
              sub.tier === "pro" ? "bg-accent text-accent-fg" : "bg-surface-2 text-fg-muted"
            }`}>
              {sub.tier === "pro" ? "Pro" : "Free"}
            </span>
          </span>
        </SettingsRow>
        {sub.tier === "pro" && (
          <>
            <SettingsRow label="Billing period">
              <span className="text-[13px] text-fg-muted">
                {sub.interval === "yearly" ? `Yearly · ${formatGhs(PRO_PLAN.yearly.amountMajor)}` : `Monthly · ${formatGhs(PRO_PLAN.monthly.amountMajor)}`}
              </span>
            </SettingsRow>
            <SettingsRow label="Next renewal" hint={sub.daysUntilRenewal !== null ? `${sub.daysUntilRenewal} days from now` : undefined}>
              <span className="text-[13px] text-fg-muted">{renewLabel ?? "—"}</span>
            </SettingsRow>
            <SettingsRow label="Auto-renew">
              {session.paystackCustomerCode ? (
                <CancelButton />
              ) : (
                <span className="text-[12px] text-fg-subtle">Renewal disabled. Pro stays active until {renewLabel}.</span>
              )}
            </SettingsRow>
          </>
        )}
      </SettingsSection>

      {sub.tier !== "pro" && (
        <SettingsSection title="Upgrade" description="Pro unlocks the assistant, calendar sync, reviews, and more.">
          <PricingCards currentTier="free" />
        </SettingsSection>
      )}

      <SettingsSection title="Invoices" description="Every payment to Osama. Click out for the full Paystack receipt.">
        <InvoiceList />
      </SettingsSection>

      <SettingsSection title="Payment" description="Powered by Paystack.">
        <p className="text-[13px] text-fg-muted">
          Card, mobile money (MTN, Vodafone, AirtelTigo), and bank transfer are all accepted. Receipts are
          emailed automatically after each payment.
        </p>
      </SettingsSection>
    </div>
  );
}
