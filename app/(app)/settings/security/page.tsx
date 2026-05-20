import { SettingsSection, SettingsRow } from "@/components/settings/section";

export default function SecuritySettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Two-factor authentication" description="Add a second factor when you sign in.">
        <p className="text-[13px] text-fg-muted">
          2FA via authenticator app and recovery codes ships after the persistence layer lands.
        </p>
      </SettingsSection>
      <SettingsSection title="Active sessions" description="Devices currently signed in.">
        <SettingsRow label="This device" hint="Now">
          <span className="text-[12px] text-fg-muted">Active</span>
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Recent activity" description="Sign-ins from the last 30 days.">
        <p className="text-[13px] text-fg-muted">Activity log appears here once we persist sign-in events.</p>
      </SettingsSection>
    </div>
  );
}
