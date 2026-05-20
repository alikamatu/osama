import { NextResponse } from "next/server";
import { listAllSubs } from "@/lib/push/store";
import { sendPush } from "@/lib/push/client";

/**
 * Habit-reminder fanout. Designed to be invoked every 5 minutes by a scheduler
 * (Vercel Cron, GitHub Action, etc.). Auth via either `?token=` or Vercel's
 * `Authorization: Bearer <CRON_SECRET>` header convention.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const expected = process.env.CRON_SECRET;
  const provided = url.searchParams.get("token") ?? req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const subs = await listAllSubs();
  let attempted = 0;
  let succeeded = 0;

  for (const sub of subs) {
    const tz = sub.meta?.timezone ?? "UTC";
    const localHHMM = hhmmIn(now, tz);
    const bucket = sub.meta?.habitsByTime?.[localHHMM];
    if (!bucket || bucket.length === 0) continue;

    attempted++;
    const r = await sendPush(sub.subscription, {
      title: bucket.length === 1 ? "Habit reminder" : `${bucket.length} habits due`,
      body: bucket.length === 1
        ? `It's time for: ${bucket[0]}.`
        : `Time for: ${bucket.slice(0, 3).join(", ")}${bucket.length > 3 ? "…" : ""}.`,
      url: "/today",
      kind: "habit-reminder",
      tag: `habit-${localHHMM}`,
    });
    if (r.ok) succeeded++;
  }

  return NextResponse.json({ ok: true, at: now.toISOString(), attempted, succeeded, total: subs.length });
}

function hhmmIn(d: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone, hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(d);
  const h = parts.find((p) => p.type === "hour")?.value ?? "00";
  const m = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
}
