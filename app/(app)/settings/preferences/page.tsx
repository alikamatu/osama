import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { SettingsSection, SettingsRow } from "@/components/settings/section";

export default async function PreferencesSettings() {
  const session = await getSession();
  if (!session) redirect("/signin");
  return (
    <div className="space-y-6">
      <SettingsSection title="Locale" description="Set during onboarding. Editing arrives with persistence.">
        <SettingsRow label="Timezone" hint="Used for greetings, due dates, and reminders.">
          <span className="text-[13px] text-fg-muted">{session.timezone ?? "UTC"}</span>
        </SettingsRow>
        <SettingsRow label="Start of week">
          <span className="text-[13px] text-fg-muted">
            {session.startOfWeek === "sun" ? "Sunday" : "Monday"}
          </span>
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
