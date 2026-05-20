import { SettingsSection } from "@/components/settings/section";
import { PushPanel } from "@/components/settings/push-panel";

export default function NotificationsSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Web push" description="Reminders for habits, delivered at the times you've set.">
        <PushPanel />
      </SettingsSection>
      <SettingsSection title="Email digest" description="A morning summary of yesterday and a plan for today.">
        <p className="text-[13px] text-fg-muted">
          The morning digest lands once we have your data layer wired. You&apos;ll pick the time and which sections to include.
        </p>
      </SettingsSection>
      <SettingsSection title="Goal nudges" description="A gentle ping when a goal looks at-risk.">
        <p className="text-[13px] text-fg-muted">
          Nudges run on the same scheduler as habit reminders — they need server-side goal state, arriving with the
          persistence layer. The reminders cron is already wired (<code className="font-mono text-[11.5px]">/api/cron/reminders</code>).
        </p>
      </SettingsSection>
      <SettingsSection title="Quiet hours" description="No notifications during sleep.">
        <p className="text-[13px] text-fg-muted">Per-day quiet windows arrive after notifications. Until then, set habit reminders outside your sleep window.</p>
      </SettingsSection>
    </div>
  );
}
