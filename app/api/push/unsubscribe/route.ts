import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { removeSubByEndpoint } from "@/lib/push/store";

const Input = z.object({ endpoint: z.string().url() });

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = Input.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  await removeSubByEndpoint(parsed.data.endpoint);
  return NextResponse.json({ ok: true });
}
