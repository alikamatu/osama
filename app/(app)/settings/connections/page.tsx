import { SettingsSection } from "@/components/settings/section";

export default function ConnectionsSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Sign-in providers" description="Connect Google, GitHub, or Apple to skip the email step.">
        <p className="text-[13px] text-fg-muted">
          OAuth providers are wired in the UI; the server-side handshake lands with the persistent user table.
        </p>
      </SettingsSection>
      <SettingsSection title="Calendars" description="Mirror tasks and habits onto your external calendar.">
        <p className="text-[13px] text-fg-muted">Google Calendar and ICS feeds — coming with the calendar feature.</p>
      </SettingsSection>
    </div>
  );
}
