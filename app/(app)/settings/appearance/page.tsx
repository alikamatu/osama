import { SettingsSection } from "@/components/settings/section";
import { AppearancePanel } from "@/components/settings/appearance-panel";

export default function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Theme" description="Five themes — all obey the same minimal rules: no glass, no colored borders, no blur.">
        <AppearancePanel />
      </SettingsSection>

      <SettingsSection title="Density & typography" description="Adjustable density and font scale are coming with the data layer.">
        <p className="text-[13px] text-fg-muted">
          Today the app ships at a single comfortable density. Compact mode and a small/large font scale arrive
          with personalized preferences.
        </p>
      </SettingsSection>
    </div>
  );
}
