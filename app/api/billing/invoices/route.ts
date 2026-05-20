import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { listCustomerByEmail, listTransactionsForCustomer } from "@/lib/billing/paystack";

/** GET /api/billing/invoices — returns the user's Paystack transactions, newest first. */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    let customerCode = session.paystackCustomerCode ?? null;
    if (!customerCode) {
      const customers = await listCustomerByEmail(session.email);
      customerCode = customers.data[0]?.customer_code ?? null;
    }
    if (!customerCode) {
      return NextResponse.json({ invoices: [], hasCustomer: false });
    }
    const tx = await listTransactionsForCustomer(customerCode, 30);
    const invoices = tx.data.map((t) => ({
      id: t.id,
      reference: t.reference,
      amountMinor: t.amount,
      currency: t.currency,
      status: t.status,
      paidAt: t.paid_at ?? null,
      createdAt: t.created_at,
      channel: t.channel ?? null,
      plan: (t.metadata && (t.metadata as { plan?: string }).plan) ?? null,
      interval: (t.metadata && (t.metadata as { interval?: string }).interval) ?? null,
    }));
    return NextResponse.json({ invoices, hasCustomer: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "fetch_failed";
    console.error("[billing/invoices]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
