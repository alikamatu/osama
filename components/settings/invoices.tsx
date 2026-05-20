"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Invoice = {
  id: number;
  reference: string;
  amountMinor: number;
  currency: string;
  status: string;
  paidAt: string | null;
  createdAt: string;
  channel: string | null;
  plan: string | null;
  interval: string | null;
};

const STATUS_TONE: Record<string, string> = {
  success: "text-[color:var(--positive)]",
  failed:  "text-[color:var(--danger)]",
  abandoned: "text-fg-subtle",
  pending: "text-[color:var(--warning)]",
};

export function InvoiceList() {
  const [state, setState] = useState<{ loading: boolean; error: string | null; invoices: Invoice[]; hasCustomer: boolean }>({
    loading: true, error: null, invoices: [], hasCustomer: true,
  });

  useEffect(() => {
    let alive = true;
    fetch("/api/billing/invoices")
      .then(async (r) => {
        const body = await r.json();
        if (!alive) return;
        if (!r.ok) {
          setState({ loading: false, error: body?.error ?? "Could not load invoices.", invoices: [], hasCustomer: false });
          return;
        }
        setState({ loading: false, error: null, invoices: body.invoices ?? [], hasCustomer: Boolean(body.hasCustomer) });
      })
      .catch((e) => alive && setState({ loading: false, error: e.message, invoices: [], hasCustomer: false }));
    return () => { alive = false; };
  }, []);

  if (state.loading) {
    return (
      <div className="flex items-center gap-2 text-[13px] text-fg-muted">
        <Loader2 size={14} className="animate-spin" /> Loading invoices…
      </div>
    );
  }
  if (state.error) {
    return <p className="text-[13px] text-[color:var(--danger)]">{state.error}</p>;
  }
  if (!state.hasCustomer || state.invoices.length === 0) {
    return (
      <p className="text-[13px] text-fg-muted">
        No invoices yet. Once you complete a Paystack payment, every charge will appear here.
      </p>
    );
  }

  return (
    <ul className="space-y-1.5">
      {state.invoices.map((inv) => {
        const Icon = inv.status === "success" ? CheckCircle2
                  : inv.status === "pending"   ? Clock
                  : AlertCircle;
        const amount = formatAmount(inv.amountMinor, inv.currency);
        const date = new Date(inv.paidAt ?? inv.createdAt);
        return (
          <li key={inv.id} className="flex items-center gap-3 rounded-xl bg-surface-2 px-3 py-2.5">
            <Icon size={15} strokeWidth={2} className={cn(STATUS_TONE[inv.status] ?? "text-fg-subtle")} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[13.5px] font-semibold text-fg">{amount}</span>
                {inv.interval && (
                  <span className="rounded bg-surface-3 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-fg-muted">
                    {inv.interval}
                  </span>
                )}
                <span className={cn("text-[11px] capitalize", STATUS_TONE[inv.status] ?? "text-fg-subtle")}>
                  {inv.status}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-fg-subtle">
                <span>{date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                <span>·</span>
                <span className="font-mono">{inv.reference}</span>
                {inv.channel && <><span>·</span><span className="capitalize">{inv.channel}</span></>}
              </div>
            </div>
            <a
              href={`https://dashboard.paystack.com/#/transactions/${inv.id}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open on Paystack"
              className="grid h-7 w-7 place-items-center rounded-md text-fg-subtle hover:bg-surface-3 hover:text-fg"
            >
              <ExternalLink size={12} strokeWidth={2} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function formatAmount(minor: number, currency: string): string {
  const amount = minor / 100;
  if (currency === "GHS") return `GH₵${amount.toLocaleString("en-GH", { minimumFractionDigits: 2 })}`;
  return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}
