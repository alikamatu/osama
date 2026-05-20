import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { findOrCreateUserByEmail, getUserState, setUserState, type UserState } from "@/lib/db/users";

const UserStateSchema = z.object({
  tasks: z.array(z.any()),
  habits: z.array(z.any()),
  goals: z.array(z.any()),
  projects: z.array(z.any()),
  notes: z.array(z.any()),
  reviews: z.array(z.any()),
  conversations: z.array(z.any()),
});

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await findOrCreateUserByEmail(session.email, session);
  const state = await getUserState(session.email);
  return NextResponse.json(state ?? null, { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const json = await req.json();
  const parsed = UserStateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const state = parsed.data as UserState;
  await findOrCreateUserByEmail(session.email, session);
  await setUserState(session.email, state);
  return NextResponse.json({ ok: true });
}
