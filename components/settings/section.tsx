export function SettingsSection({
  title, description, children,
}: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-surface-1 p-6">
      <div className="mb-5">
        <h2 className="text-[16px] font-semibold text-fg">{title}</h2>
        {description && (
          <p className="mt-1 text-[13px] text-fg-muted">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function SettingsRow({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="min-w-0">
        <div className="text-[13.5px] font-medium text-fg">{label}</div>
        {hint && <div className="mt-0.5 text-[12px] text-fg-subtle">{hint}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
