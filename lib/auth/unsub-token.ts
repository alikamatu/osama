import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const SECRET = process.env.AUTH_SECRET;
if (!SECRET) throw new Error("AUTH_SECRET is not set");

export type UnsubScope = "digest" | "habit-reminders" | "goal-nudges" | "all";

function b64url(buf: Buffer | string) {
  return Buffer.from(buf).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function fromB64url(s: string) {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

export function signUnsubToken(email: string, scope: UnsubScope = "digest"): string {
  const payload = { e: email.toLowerCase(), s: scope, i: Date.now() };
  const body = b64url(JSON.stringify(payload));
  const sig = b64url(createHmac("sha256", SECRET!).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyUnsubToken(token: string):
  | { ok: true; email: string; scope: UnsubScope }
  | { ok: false; reason: "malformed" | "bad-signature" } {
  const [body, sig] = token.split(".");
  if (!body || !sig) return { ok: false, reason: "malformed" };
  const expected = createHmac("sha256", SECRET!).update(body).digest();
  const actual = fromB64url(sig);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return { ok: false, reason: "bad-signature" };
  }
  try {
    const payload = JSON.parse(fromB64url(body).toString("utf8")) as {
      e: string; s: UnsubScope;
    };
    return { ok: true, email: payload.e, scope: payload.s };
  } catch {
    return { ok: false, reason: "malformed" };
  }
}
