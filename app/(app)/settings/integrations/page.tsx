import { SettingsSection, SettingsRow } from "@/components/settings/section";
import { Webhook, Mail, Key } from "lucide-react";

export default function IntegrationsSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="API keys" description="Personal access tokens for the REST API.">
        <SettingsRow label="Tokens" hint="Create scoped keys for scripts and automations.">
          <button type="button" disabled className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-surface-2 px-3 text-[13px] font-medium text-fg-muted opacity-60">
            <Key size={14} strokeWidth={2} /> Create token
          </button>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Webhooks" description="Send events to your own services.">
        <SettingsRow label="Endpoints" hint="task.completed, habit.streak.broken, goal.at-risk.">
          <button type="button" disabled className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-surface-2 px-3 text-[13px] font-medium text-fg-muted opacity-60">
            <Webhook size={14} strokeWidth={2} /> Add endpoint
          </button>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Email-in" description="A unique address that captures into your Inbox.">
        <SettingsRow label="Your address" hint="Forward emails here and they'll appear in your inbox.">
          <span className="rounded-md bg-surface-2 px-2 py-1 font-mono text-[12px] text-fg-muted">in-<span className="text-fg">you</span>@osama.app</span>
        </SettingsRow>
        <p className="text-[12px] text-fg-subtle">
          <Mail size={11} strokeWidth={2} className="mr-1 inline" />
          Activates with Resend inbound parsing — endpoint is scaffolded.
        </p>
      </SettingsSection>
    </div>
  );
}
