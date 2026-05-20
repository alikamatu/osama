import { SettingsNav } from "@/components/settings/settings-nav";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 pb-10 pt-6 md:px-10 md:pt-10">
      <header className="mb-8">
        <h1 className="text-[28px] font-semibold tracking-tight text-fg">Settings</h1>
        <p className="mt-1 text-[13px] text-fg-muted">Tune Cairn to your workflow.</p>
      </header>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <SettingsNav />
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
