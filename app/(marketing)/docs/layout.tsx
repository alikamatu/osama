import { DocsNav } from "@/components/marketing/docs-nav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <DocsNav />
        </aside>
        <article className="prose-cairn max-w-[68ch] min-w-0">
          {children}
        </article>
      </div>
    </div>
  );
}
