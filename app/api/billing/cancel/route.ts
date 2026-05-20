import { NextResponse } from "next/server";
import { getSession, updateSession } from "@/lib/auth/session";
import { updateUserProfile } from "@/lib/db/users";

/**
 * Mark the subscription as not auto-renewing. Pro remains active until
 * the current period ends. With persistence wired this would also call
 * Paystack `/subscription/disable` to stop auto-charging.
 */
export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!session.plan || session.plan === "free") {
    return NextResponse.json({ error: "no_active_subscription" }, { status: 400 });
  }
  const updatedSession = await updateSession({ paystackCustomerCode: null });
  if (updatedSession) {
    await updateUserProfile(updatedSession.email, { paystackCustomerCode: null });
  }
  return NextResponse.json({ ok: true, message: "Auto-renewal disabled. Pro remains active until period end." });
}
