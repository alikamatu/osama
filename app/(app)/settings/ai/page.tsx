import { SettingsSection } from "@/components/settings/section";

export default function AiSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Assistant" description="How Osama&apos;s assistant behaves.">
        <p className="text-[13px] text-fg-muted">
          Choose your model, write a custom system prompt, and pin facts to long-term memory — once the
          assistant chat ships.
        </p>
      </SettingsSection>
      <SettingsSection title="Privacy" description="Your data, your call.">
        <p className="text-[13px] text-fg-muted">
          You&apos;ll be able to disable model training on your content and clear assistant memory at any time.
        </p>
      </SettingsSection>
    </div>
  );
}
