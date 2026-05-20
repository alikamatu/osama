import { Upload, RotateCcw } from "lucide-react";
import { SettingsSection, SettingsRow } from "@/components/settings/section";
import { ExportButton } from "@/components/settings/export-buttons";

export default function DataSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Export" description="Take your data with you any time. Downloads run on your device — nothing leaves the app.">
        <SettingsRow label="Export as JSON" hint="A full snapshot of every entity. Best for backups.">
          <ExportButton format="json" label="Download JSON" />
        </SettingsRow>
        <SettingsRow label="Export as Markdown" hint="Projects, goals, notes, reviews — readable anywhere.">
          <ExportButton format="md" label="Download Markdown" />
        </SettingsRow>
        <SettingsRow label="Export as CSV" hint="Your tasks as a spreadsheet.">
          <ExportButton format="csv" label="Download CSV" />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Import" description="Bring your history from another tool.">
        <SettingsRow label="Todoist · Things · Notion CSV" hint="Map projects, tasks, and labels.">
          <button type="button" disabled className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-surface-2 px-3 text-[13px] font-medium text-fg-muted opacity-60">
            <Upload size={14} strokeWidth={2} />
            Import (coming soon)
          </button>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Trash" description="Soft-deleted items, kept for 30 days.">
        <SettingsRow label="Restore items" hint="Anything you deleted within the window can come back.">
          <a href="/trash" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-surface-2 px-3 text-[13px] font-medium text-fg-muted hover:bg-surface-3 hover:text-fg">
            <RotateCcw size={14} strokeWidth={2} />
            Open trash
          </a>
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
