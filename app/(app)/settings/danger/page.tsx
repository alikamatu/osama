import { SettingsSection, SettingsRow } from "@/components/settings/section";

export default function DangerSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Danger zone" description="Irreversible actions.">
        <SettingsRow label="Sign out everywhere" hint="Ends every active session for this account.">
          <a href="/signout" className="inline-flex h-9 items-center rounded-lg bg-surface-2 px-3 text-[13px] font-medium text-fg-muted hover:bg-surface-3 hover:text-fg">
            Sign out
          </a>
        </SettingsRow>
        <SettingsRow label="Delete account" hint="Removes your data permanently. Cannot be undone.">
          <button
            type="button"
            disabled
            className="inline-flex h-9 items-center rounded-lg bg-surface-2 px-3 text-[13px] font-medium text-[color:var(--danger)] opacity-60"
          >
            Delete account
          </button>
        </SettingsRow>
        <p className="text-[12px] text-fg-subtle">
          Account deletion is enabled once the persistence layer is live.
        </p>
      </SettingsSection>
    </div>
  );
}
