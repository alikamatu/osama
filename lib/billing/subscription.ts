import "server-only";
import type { PlanInterval, PlanTier, Session } from "@/lib/auth/session";
import { periodMs } from "./plans";

export type SubscriptionView = {
  tier: PlanTier;
  interval: PlanInterval | null;
  renewsAt: number | null;
  active: boolean;
  daysUntilRenewal: number | null;
};

export function readSubscription(session: Session | null): SubscriptionView {
  if (!session || !session.plan || session.plan === "free") {
    return { tier: "free", interval: null, renewsAt: null, active: false, daysUntilRenewal: null };
  }
  const expired = session.planRenewsAt ? session.planRenewsAt < Date.now() : false;
  return {
    tier: expired ? "free" : "pro",
    interval: session.planInterval ?? null,
    renewsAt: session.planRenewsAt ?? null,
    active: !expired,
    daysUntilRenewal: session.planRenewsAt
      ? Math.max(0, Math.ceil((session.planRenewsAt - Date.now()) / (24 * 3600 * 1000)))
      : null,
  };
}

export function buildActivatedPatch(interval: PlanInterval, customerCode?: string | null) {
  return {
    plan: "pro" as PlanTier,
    planInterval: interval,
    planRenewsAt: Date.now() + periodMs(interval),
    paystackCustomerCode: customerCode ?? null,
  };
}
