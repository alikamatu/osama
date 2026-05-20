"use client";

import Link from "next/link";
import { Archive, ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, PageBody, Empty } from "@/components/ui/page";

export default function ArchivedProjectsPage() {
  const archived = useStore((s) => s.projects.filter((p) => p.archived));
  const update = useStore((s) => s.updateProject);

  return (
    <>
      <PageHeader
        icon={Archive}
        title="Archived projects"
        subtitle={`${archived.length} archived`}
        actions={
          <Link href="/projects" className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-surface-1 px-3 text-[13px] font-medium text-fg-muted hover:bg-surface-2 hover:text-fg">
            <ArrowLeft size={14} strokeWidth={2} /> Active projects
          </Link>
        }
      />
      <PageBody>
        {archived.length === 0 ? (
          <Empty icon={Archive} title="Nothing archived" body="Archived projects show up here for safekeeping." />
        ) : (
          <ul className="space-y-1.5">
            {archived.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl bg-surface-1 px-3 py-2.5">
                <Link href={`/projects/${p.id}`} className="flex-1 truncate text-[14px] text-fg hover:underline">{p.name}</Link>
                <button
                  type="button"
                  onClick={() => update(p.id, { archived: false })}
                  className="inline-flex h-8 items-center rounded-md bg-surface-2 px-3 text-[12px] font-medium text-fg-muted hover:bg-surface-3 hover:text-fg"
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        )}
      </PageBody>
    </>
  );
}
