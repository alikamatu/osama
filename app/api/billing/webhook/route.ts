import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/billing/paystack";

/**
 * Paystack webhook receiver.
 *
 * Production note: webhooks fire OUT-OF-BAND of any user session — they can't
 * mutate cookies. To make subscription state durable across renewals, persist
 * `customer.email`, `customer_code`, `interval`, and `next_renewal_at` to your
 * users collection here. The session cookie picks it up on next request.
 *
 * Until the persistence layer lands this handler logs + acks; the post-payment
 * callback (api/billing/callback) is what actually flips the user to Pro
 * (because we control that request and own the session cookie).
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature");
  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  type Event = { event: string; data?: Record<string, unknown> };
  let evt: Event;
  try { evt = JSON.parse(raw) as Event; } catch {
    return NextResponse.json({ error: "bad_payload" }, { status: 400 });
  }

  switch (evt.event) {
    case "charge.success":
    case "subscription.create":
    case "subscription.disable":
    case "invoice.update":
    case "invoice.payment_failed":
      // TODO(persistence): update users collection with the new state.
      console.log("[paystack-webhook]", evt.event, (evt.data as { reference?: string } | undefined)?.reference);
      break;
    default:
      console.log("[paystack-webhook] unhandled", evt.event);
  }

  return NextResponse.json({ received: true });
}
