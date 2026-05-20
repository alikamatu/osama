import "server-only";
import webpush from "web-push";
import type { PushSubscriptionJSON } from "./store";
import { removeSubByEndpoint } from "./store";

const PUBLIC  = process.env.VAPID_PUBLIC_KEY;
const PRIVATE = process.env.VAPID_PRIVATE_KEY;
const SUBJECT = process.env.VAPID_SUBJECT ?? "mailto:noreply@assistant.alikamatu.com";

let configured = false;
function ensureConfigured() {
  if (configured) return true;
  if (!PUBLIC || !PRIVATE) return false;
  webpush.setVapidDetails(SUBJECT, PUBLIC, PRIVATE);
  configured = true;
  return true;
}

export type PushPayload = {
  title: string;
  body?: string;
  url?: string;
  kind?: "habit-reminder" | "goal-nudge" | "test" | "generic";
  tag?: string;
  renotify?: boolean;
};

export async function sendPush(sub: PushSubscriptionJSON, payload: PushPayload): Promise<{ ok: true } | { ok: false; gone: boolean; error: string }> {
  if (!ensureConfigured()) return { ok: false, gone: false, error: "VAPID keys not configured." };
  try {
    await webpush.sendNotification(sub as unknown as webpush.PushSubscription, JSON.stringify(payload));
    return { ok: true };
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode;
    const gone = status === 404 || status === 410;
    if (gone) {
      try { await removeSubByEndpoint(sub.endpoint); } catch { /* ignore */ }
    }
    return { ok: false, gone, error: err instanceof Error ? err.message : "send failed" };
  }
}
