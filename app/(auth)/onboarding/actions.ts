"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { updateSession } from "@/lib/auth/session";
import { findAvatarById } from "@/lib/avatars/store";
import { updateUserProfile } from "@/lib/db/users";

const InputSchema = z.object({
  name: z.string().trim().min(1, "Tell us your name.").max(120),
  avatarId: z.string().min(1, "Pick an avatar."),
  theme: z.enum(["obsidian", "paper", "oceanic", "sunset", "forest"]),
  timezone: z.string().min(1).max(60),
  startOfWeek: z.enum(["sun", "mon"]),
});

export type OnboardingResult =
  | { ok: true }
  | { ok: false; error: string };

export async function completeOnboarding(input: unknown): Promise<OnboardingResult> {
  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { name, avatarId, theme, timezone, startOfWeek } = parsed.data;
  const avatar = await findAvatarById(avatarId);
  if (!avatar) return { ok: false, error: "Avatar not found." };

  const session = await updateSession({
    name,
    avatarId: avatar.id,
    avatarUrl: avatar.url,
    theme,
    timezone,
    startOfWeek,
    onboarded: true,
  });

  if (!session) return { ok: false, error: "Your session expired. Sign in again." };

  await updateUserProfile(session.email, {
    name,
    avatarId: avatar.id,
    avatarUrl: avatar.url,
    theme,
    timezone,
    startOfWeek,
    onboarded: true,
  });

  redirect("/today");
}
