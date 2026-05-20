"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { PRO_PLAN, formatGhs } from "@/lib/billing/plans";
import { cn } from "@/lib/utils/cn";

type Interval = "monthly" | "yearly";

const FREE_FEATURES = [
  "Daily tasks, habits, goals",
  "Drag-reorder, streak counters",
  "5 themes + keyboard shortcuts",
  "Command palette + quick capture",
  "Up to 3 projects",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited projects",
  "AI assistant with your context",
  "Weekly + monthly reviews with AI drafts",
  "Insights & stats dashboards",
  "Calendar sync (Google, ICS)",
  "Web push + email digests",
  "JSON / Markdown / CSV exports",
  "Priority support",
];

export function PricingCards({
  currentTier = "free",
  showToggle = true,
  className,
}: {
  currentTier?: "free" | "pro";
  showToggle?: boolean;
  className?: string;
}) {
  const [interval, setInterval] = useState<Interval>("yearly");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function startCheckout(i: Interval) {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interval: i }),
        });
        if (res.status === 401) {
          router.push("/signin");
          return;
        }
        const body = await res.json();
        if (!res.ok) {
          setError(body?.error ?? "Could not start checkout.");
          return;
        }
        window.location.href = body.authorizationUrl;
      } catch {
        setError("Network error. Try again.");
      }
    });
  }

  const proAmount =
    interval === "yearly" ? PRO_PLAN.yearly.amountMajor : PRO_PLAN.monthly.amountMajor;
  const proSuffix = interval === "yearly" ? "/yr" : "/mo";

  return (
    <div className={cn("w-full", className)}>
      {showToggle && (
        <div className="mx-auto mb-8 inline-flex w-full justify-center">
          <div className="relative inline-flex rounded-full bg-surface-1 p-1" role="radiogroup" aria-label="Billing period">
            {(["monthly", "yearly"] as Interval[]).map((i) => {
              const active = interval === i;
              return (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setInterval(i)}
                  className={cn(
                    "relative z-10 h-9 px-4 rounded-full text-[13px] font-medium",
                    "transition-colors duration-200",
                    active ? "text-accent-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="pricing-interval-active"
                      className="absolute inset-0 -z-10 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {i === "monthly" ? "Monthly" : "Yearly"}
                  {i === "yearly" && (
                    <span className={cn(
                      "ml-1.5 rounded-full px-1.5 py-0.5 font-mono text-[10px]",
                      active ? "bg-black/15 text-accent-fg" : "bg-surface-2 text-fg-muted",
                    )}>
                      −{formatGhs(PRO_PLAN.yearlySavingsMajor)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Free */}
        <article className="rounded-2xl bg-surface-1 p-6">
          <header>
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-fg-subtle">Free</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-[36px] font-semibold tracking-tight text-fg">{formatGhs(0)}</span>
              <span className="text-[14px] text-fg-muted">forever</span>
            </div>
            <p className="mt-2 text-[13.5px] text-fg-muted">
              Everything you need to plan a calm day.
            </p>
          </header>
          <FeatureList items={FREE_FEATURES} />
          <button
            type="button"
            disabled={currentTier === "free"}
            onClick={() => router.push("/signin")}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-surface-2 px-4 text-[14px] font-semibold text-fg-muted hover:bg-surface-3 hover:text-fg disabled:opacity-60"
          >
            {currentTier === "free" ? "Your current plan" : "Get started"}
          </button>
        </article>

        {/* Pro */}
        <article className="relative overflow-hidden rounded-2xl bg-surface-1 p-6">
          <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
            <Sparkles size={11} strokeWidth={2.25} /> Most popular
          </span>
          <header>
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-fg-subtle">Pro</span>
            <div className="mt-2 flex items-baseline gap-1">
              <motion.span
                key={`${interval}-${proAmount}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[36px] font-semibold tracking-tight text-fg"
              >
                {formatGhs(proAmount)}
              </motion.span>
              <span className="text-[14px] text-fg-muted">{proSuffix}</span>
            </div>
            <p className="mt-2 text-[13.5px] text-fg-muted">
              {interval === "yearly"
                ? `Save ${formatGhs(PRO_PLAN.yearlySavingsMajor)} vs paying monthly.`
                : "Cancel any time. Pro stays active until period ends."}
            </p>
          </header>
          <FeatureList items={PRO_FEATURES} accent />
          <button
            type="button"
            disabled={pending || currentTier === "pro"}
            onClick={() => startCheckout(interval)}
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-[14px] font-semibold text-accent-fg hover:brightness-110 disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Redirecting…
              </>
            ) : currentTier === "pro" ? (
              "Your current plan"
            ) : (
              `Upgrade to Pro — ${formatGhs(proAmount)}${proSuffix}`
            )}
          </button>
          {error && <p className="mt-3 text-[12px] text-[color:var(--danger)]">{error}</p>}
          <p className="mt-3 text-center text-[11px] text-fg-subtle">
            Secured by Paystack · Pay with card, mobile money, or bank.
          </p>
        </article>
      </div>
    </div>
  );
}

function FeatureList({ items, accent }: { items: string[]; accent?: boolean }) {
  return (
    <ul className="mt-6 space-y-2.5">
      {items.map((f) => (
        <li key={f} className="flex items-start gap-2.5">
          <span className={cn(
            "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full",
            accent ? "bg-accent text-accent-fg" : "bg-surface-2 text-fg-muted",
          )}>
            <Check size={11} strokeWidth={3} />
          </span>
          <span className="text-[13.5px] leading-relaxed text-fg">{f}</span>
        </li>
      ))}
    </ul>
  );
}
