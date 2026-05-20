import type { PlanInterval } from "@/lib/auth/session";

/**
 * Source of truth for plan pricing. Amounts are in *minor* units
 * (Paystack expects pesewas for GHS — multiply GHS by 100).
 */
export const CURRENCY = "GHS" as const;

export const PRO_PLAN = {
  id: "pro",
  name: "Pro",
  monthly: { interval: "monthly" as PlanInterval, amountMinor: 70_00,  amountMajor: 70  },
  yearly:  { interval: "yearly"  as PlanInterval, amountMinor: 640_00, amountMajor: 640 },
  yearlySavingsMajor: 200,
} as const;

export const FREE_PLAN = {
  id: "free",
  name: "Free",
  monthly: { interval: "monthly" as PlanInterval, amountMinor: 0, amountMajor: 0 },
};

export function formatGhs(amountMajor: number): string {
  return `GH₵${amountMajor.toLocaleString("en-GH")}`;
}

export function intervalAmountMinor(interval: PlanInterval): number {
  return interval === "yearly" ? PRO_PLAN.yearly.amountMinor : PRO_PLAN.monthly.amountMinor;
}

export function periodMs(interval: PlanInterval): number {
  return interval === "yearly" ? 365 * 24 * 3600 * 1000 : 30 * 24 * 3600 * 1000;
}
