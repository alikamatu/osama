import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const SECRET = process.env.PAYSTACK_SECRET_KEY;
if (!SECRET) throw new Error("PAYSTACK_SECRET_KEY is not set");

const BASE = "https://api.paystack.co";

type PaystackEnvelope<T> = { status: boolean; message: string; data: T };

async function call<T>(path: string, init: RequestInit = {}): Promise<PaystackEnvelope<T>> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${SECRET}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    // Paystack returns fresh data per call — no caching.
    cache: "no-store",
  });
  const body = (await res.json()) as PaystackEnvelope<T>;
  if (!res.ok || body.status === false) {
    throw new Error(`Paystack ${path} failed: ${body.message ?? res.statusText}`);
  }
  return body;
}

export type InitTransactionInput = {
  email: string;
  amountMinor: number;
  currency: "GHS";
  reference?: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

export type InitTransactionData = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export function initTransaction(input: InitTransactionInput) {
  return call<InitTransactionData>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: input.amountMinor,
      currency: input.currency,
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });
}

export type VerifyTransactionData = {
  status: "success" | "failed" | "abandoned" | "pending" | string;
  reference: string;
  amount: number;
  currency: string;
  customer: { customer_code: string; email: string };
  paid_at?: string;
  metadata?: Record<string, unknown> | null;
};

export function verifyTransaction(reference: string) {
  return call<VerifyTransactionData>(`/transaction/verify/${encodeURIComponent(reference)}`);
}

/**
 * Verify a Paystack webhook payload. Paystack signs each delivery with
 * HMAC SHA-512 of the raw body using your secret key, in the `x-paystack-signature` header.
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = createHmac("sha512", SECRET!).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  if (a.length !== b.length) return false;
  try { return timingSafeEqual(a, b); } catch { return false; }
}

export type CustomerSummary = {
  customer_code: string;
  email: string;
  first_name?: string;
  last_name?: string;
};

export function listCustomerByEmail(email: string) {
  return call<CustomerSummary[]>(`/customer?email=${encodeURIComponent(email)}&perPage=1`);
}

export type TransactionListItem = {
  id: number;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  paid_at?: string | null;
  created_at: string;
  channel?: string;
  customer: { customer_code: string; email: string };
  metadata?: Record<string, unknown> | null;
};

export function listTransactionsForCustomer(customerCode: string, limit = 20) {
  return call<TransactionListItem[]>(
    `/transaction?customer=${encodeURIComponent(customerCode)}&perPage=${limit}`,
  );
}

export function buildReference(email: string): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  const safe = email.replace(/[^a-z0-9]/gi, "").slice(0, 12).toLowerCase();
  return `osama_${safe}_${ts}_${rand}`;
}
