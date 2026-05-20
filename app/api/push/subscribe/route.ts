import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { upsertSub } from "@/lib/push/store";

const Input = z.object({
  subscription: z.object({
    endpoint: z.string().url(),
    expirationTime: z.number().nullable().optional(),
    keys: z.object({ p256dh: z.string(), auth: z.string() }),
  }),
  meta: z.object({
    timezone: z.string().optional(),
    habitsByTime: z.record(z.string(), z.array(z.string())).optional(),
  }).optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = Input.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "invalid" }, { status: 400 });
  }

  const stored = await upsertSub(session.email, parsed.data.subscription, parsed.data.meta);
  return NextResponse.json({ ok: true, id: stored.id });
}
