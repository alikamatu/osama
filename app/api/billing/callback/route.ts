import { NextResponse, type NextRequest } from "next/server";
import { verifyTransaction } from "@/lib/billing/paystack";
import { getSession, updateSession } from "@/lib/auth/session";
import { updateUserProfile } from "@/lib/db/users";
import { buildActivatedPatch } from "@/lib/billing/subscription";
import type { PlanInterval } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  const base = process.env.APP_URL ?? req.nextUrl.origin;
  const reference = req.nextUrl.searchParams.get("reference") ?? req.nextUrl.searchParams.get("trxref");
  if (!reference) {
    return NextResponse.redirect(new URL("/settings/billing?status=missing-reference", base));
  }

  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/signin", base));

  try {
    const { data } = await verifyTransaction(reference);
    if (data.status !== "success") {
      return NextResponse.redirect(new URL(`/settings/billing?status=${encodeURIComponent(data.status)}`, base));
    }
    if (data.customer.email.toLowerCase() !== session.email.toLowerCase()) {
      console.warn("[billing/callback] email mismatch", data.customer.email, session.email);
      return NextResponse.redirect(new URL("/settings/billing?status=mismatch", base));
    }
    const interval = ((data.metadata?.interval as PlanInterval | undefined) ?? "monthly") as PlanInterval;
    const updatedSession = await updateSession(buildActivatedPatch(interval, data.customer.customer_code));
    if (updatedSession) {
      await updateUserProfile(updatedSession.email, {
        plan: updatedSession.plan,
        planInterval: updatedSession.planInterval ?? null,
        planRenewsAt: updatedSession.planRenewsAt ?? null,
        paystackCustomerCode: updatedSession.paystackCustomerCode ?? null,
      });
    }
    return NextResponse.redirect(new URL("/settings/billing?status=success", base));
  } catch (err) {
    const message = err instanceof Error ? err.message : "verify_failed";
    console.error("[billing/callback]", message);
    return NextResponse.redirect(new URL("/settings/billing?status=failed", base));
  }
}
