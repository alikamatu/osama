"use server";

import { z } from "zod";
import { verifyUnsubToken } from "@/lib/auth/unsub-token";
import { getSession, updateSession } from "@/lib/auth/session";
import { updateUserProfile } from "@/lib/db/users";

const InputSchema = z.object({ token: z.string().min(1) });

export type UnsubResult =
  | { ok: true }
  | { ok: false; error: string };

export async function confirmUnsubscribe(input: unknown): Promise<UnsubResult> {
  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid request." };
  const verified = verifyUnsubToken(parsed.data.token);
  if (!verified.ok) return { ok: false, error: "Invalid unsubscribe link." };

  // Persistence note:
  // Cookies can only be set when the user is signed in. If they are, mirror
  // the choice locally. Either way, the canonical record belongs in the users
  // collection when the data layer lands — keyed by `verified.email` + scope.
  const session = await getSession();
  if (session && session.email.toLowerCase() === verified.email) {
    if (verified.scope === "digest" || verified.scope === "all") {
      await updateSession({ emailDigest: "off" });
      await updateUserProfile(session.email, { emailDigest: "off" });
    }
  }
  return { ok: true };
}
