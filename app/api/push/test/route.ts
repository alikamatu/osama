import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { listSubsForEmail } from "@/lib/push/store";
import { sendPush } from "@/lib/push/client";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const subs = await listSubsForEmail(session.email);
  if (subs.length === 0) {
    return NextResponse.json({ error: "no_subscription", detail: "Subscribe this device first." }, { status: 400 });
  }
  const results = await Promise.all(subs.map((s) => sendPush(s.subscription, {
    title: "Cairn",
    body: "Push notifications are working. You'll get reminders here.",
    kind: "test",
    url: "/today",
    tag: "cairn-test",
  })));
  const ok = results.filter((r) => r.ok).length;
  return NextResponse.json({ sent: ok, total: subs.length });
}
