"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, BellOff, CheckCircle2, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";

type Permission = "default" | "granted" | "denied" | "unsupported";

const VAPID = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export function PushPanel() {
  const habits = useStore((s) => s.habits);
  const [perm, setPerm] = useState<Permission>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setPerm("unsupported");
      return;
    }
    setPerm(Notification.permission as Permission);
    navigator.serviceWorker.getRegistration().then(async (reg) => {
      if (!reg) return;
      const sub = await reg.pushManager.getSubscription();
      setSubscribed(Boolean(sub));
    });
  }, []);

  const syncMeta = useCallback(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription: sub.toJSON(),
        meta: { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, habitsByTime: buildHabitMap(habits) },
      }),
    });
  }, [habits]);

  // Keep server-side meta in sync whenever the user changes habit reminder times.
  useEffect(() => {
    if (!subscribed) return;
    const t = setTimeout(() => { void syncMeta(); }, 400);
    return () => clearTimeout(t);
  }, [habits, subscribed, syncMeta]);

  async function enable() {
    setError(null);
    setBusy(true);
    try {
      if (!VAPID) throw new Error("VAPID public key not configured.");
      let reg = await navigator.serviceWorker.getRegistration();
      if (!reg) reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      const permission = await Notification.requestPermission();
      setPerm(permission as Permission);
      if (permission !== "granted") return;
      const existing = await reg.pushManager.getSubscription();
      const sub = existing ?? await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID) as unknown as BufferSource,
      });
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: sub.toJSON(),
          meta: { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, habitsByTime: buildHabitMap(habits) },
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Subscribe failed.");
      setSubscribed(true);
      setFlash("Subscribed. You'll get reminders on this device.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not enable notifications.");
    } finally {
      setBusy(false);
      setTimeout(() => setFlash(null), 4000);
    }
  }

  async function disable() {
    setBusy(true);
    setError(null);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = reg ? await reg.pushManager.getSubscription() : null;
      if (sub) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setSubscribed(false);
      setFlash("Notifications disabled for this device.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not disable notifications.");
    } finally {
      setBusy(false);
      setTimeout(() => setFlash(null), 4000);
    }
  }

  async function sendTest() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/push/test", { method: "POST" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.detail ?? body.error ?? "Test failed.");
      setFlash(`Test sent to ${body.sent} of ${body.total} device${body.total === 1 ? "" : "s"}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Test failed.");
    } finally {
      setBusy(false);
      setTimeout(() => setFlash(null), 4000);
    }
  }

  if (perm === "unsupported") {
    return (
      <p className="text-[13px] text-fg-muted">
        Your browser doesn&apos;t support web push notifications. Try Chrome, Edge, Firefox, or Safari 16+.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13.5px] font-medium text-fg">
            {subscribed ? "Notifications enabled on this device" : "Get reminders on this device"}
          </p>
          <p className="mt-0.5 text-[12px] text-fg-muted">
            {subscribed
              ? "We'll send a notification at each habit's reminder time."
              : "Allow notifications to receive habit reminders at the times you set."}
          </p>
        </div>
        <div className="shrink-0">
          {subscribed ? (
            <button
              type="button"
              onClick={disable}
              disabled={busy}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-surface-2 px-3 text-[13px] font-medium text-fg-muted hover:bg-surface-3 hover:text-fg disabled:opacity-60"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <BellOff size={14} strokeWidth={2} />}
              Disable
            </button>
          ) : (
            <button
              type="button"
              onClick={enable}
              disabled={busy || perm === "denied"}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-accent px-3 text-[13px] font-semibold text-accent-fg disabled:opacity-60"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Bell size={14} strokeWidth={2} />}
              {perm === "denied" ? "Blocked in browser" : "Enable"}
            </button>
          )}
        </div>
      </div>

      {subscribed && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface-2 px-3 py-2">
          <span className="text-[12px] text-fg-muted">
            {Object.keys(buildHabitMap(habits)).length} habit reminder{Object.keys(buildHabitMap(habits)).length === 1 ? "" : "s"} scheduled
          </span>
          <button
            type="button"
            onClick={sendTest}
            disabled={busy}
            className="inline-flex h-8 items-center gap-1 rounded-md bg-surface-3 px-2.5 text-[12px] font-medium text-fg-muted hover:text-fg disabled:opacity-60"
          >
            {busy ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} strokeWidth={2} />}
            Send test
          </button>
        </div>
      )}

      {flash && <p className="text-[12px] text-[color:var(--positive)]">{flash}</p>}
      {error && <p className="text-[12px] text-[color:var(--danger)]">{error}</p>}
      {perm === "denied" && (
        <p className="text-[11.5px] text-fg-subtle">
          Notifications are blocked in your browser settings. Re-allow them for this site, then click Enable.
        </p>
      )}
    </div>
  );
}

function buildHabitMap(habits: ReturnType<typeof useStore.getState>["habits"]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const h of habits) {
    if (h.deletedAt) continue;
    if (!h.reminderTime) continue;
    const time = h.reminderTime;
    (out[time] ??= []).push(h.title);
  }
  return out;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) arr[i] = raw.charCodeAt(i);
  return arr;
}
