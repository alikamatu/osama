import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { signUpload } from "@/lib/cloudinary/sign";

const InputSchema = z.object({
  kind: z.enum(["avatar", "note", "task"]).default("note"),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => ({}));
  const parsed = InputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "invalid" }, { status: 400 });
  }

  const safeEmail = session.email.replace(/[^a-z0-9_]+/gi, "_").toLowerCase();
  const folder = `osama/${parsed.data.kind}s/${safeEmail}`;
  const signed = signUpload(folder);
  return NextResponse.json(signed);
}
