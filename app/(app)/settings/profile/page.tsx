import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { SettingsSection, SettingsRow } from "@/components/settings/section";

export default async function ProfileSettings() {
  const session = await getSession();
  if (!session) redirect("/signin");

  return (
    <div className="space-y-6">
      <SettingsSection title="Profile" description="How you appear inside Osama.">
        <div className="flex items-center gap-4">
          <span className="block h-14 w-14 overflow-hidden rounded-2xl bg-surface-2">
            {session.avatarUrl && (
              <Image src={session.avatarUrl} alt="" width={56} height={56} unoptimized className="h-full w-full object-cover" />
            )}
          </span>
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-fg">{session.name || "—"}</div>
            <div className="truncate text-[13px] text-fg-muted">{session.email}</div>
          </div>
        </div>

        <div className="h-px w-full bg-[color:var(--hairline)]" />

        <SettingsRow label="Display name" hint="Used in greetings and reviews.">
          <span className="text-[13px] text-fg-muted">{session.name || "Not set"}</span>
        </SettingsRow>
        <SettingsRow label="Avatar" hint="Pick a different one anytime.">
          <span className="text-[13px] text-fg-muted">{session.avatarId ?? "Default"}</span>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Editing profile" description="Inline editing arrives with the data layer.">
        <p className="text-[13px] text-fg-muted">
          For now your profile is set during onboarding. Editing comes with the persistence layer — name,
          avatar, and timezone changes will sync to your devices.
        </p>
      </SettingsSection>
    </div>
  );
}
