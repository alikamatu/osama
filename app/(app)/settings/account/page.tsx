import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { SettingsSection, SettingsRow } from "@/components/settings/section";

export default async function AccountSettings() {
  const session = await getSession();
  if (!session) redirect("/signin");
  return (
    <div className="space-y-6">
      <SettingsSection title="Account" description="Your sign-in identity.">
        <SettingsRow label="Email" hint="Used for sign-in and notifications.">
          <span className="text-[13px] text-fg-muted">{session.email}</span>
        </SettingsRow>
        <SettingsRow label="Sign-in method" hint="Magic link.">
          <span className="text-[13px] text-fg-muted">Email link</span>
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Sessions" description="Active devices signed in to this account.">
        <p className="text-[13px] text-fg-muted">
          Device-level session listing arrives with persistence. For now, sign out from this device using the
          button in the sidebar.
        </p>
      </SettingsSection>
    </div>
  );
}
