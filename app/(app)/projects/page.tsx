"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Folder, Plus, Archive } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "@/lib/store";
import { useLiveProjects, useLiveTasks } from "@/lib/store/selectors";
import { PageHeader, PageBody, Empty } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { ProjectFormModal } from "@/components/projects/project-form";

export default function ProjectsPage() {
  const router = useRouter();
  const projects = useLiveProjects();
  const tasks = useLiveTasks();
  const [open, setOpen] = useState(false);

  const active = projects.filter((p) => !p.archived);
  function create() { setOpen(true); }

  return (
    <>
      <PageHeader
        icon={Folder}
        title="Projects"
        subtitle={`${active.length} active`}
        actions={
          <>
            <Link href="/projects/archived" className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-surface-1 px-3 text-[13px] font-medium text-fg-muted hover:bg-surface-2 hover:text-fg">
              <Archive size={14} strokeWidth={2} /> Archived
            </Link>
            <Button leadingIcon={<Plus size={16} strokeWidth={2} />} onClick={create}>New project</Button>
          </>
        }
      />
      <PageBody>
        {active.length === 0 ? (
          <Empty icon={Folder} title="No projects yet" body="Create one to group related tasks." action={<Button onClick={create}>New project</Button>} />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((p, i) => {
              const open = tasks.filter((t) => t.projectId === p.id && t.status !== "done").length;
              const done = tasks.filter((t) => t.projectId === p.id && t.status === "done").length;
              const total = open + done;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  <Link href={`/projects/${p.id}`} className="block rounded-2xl bg-surface-1 p-5 hover:bg-surface-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-[16px] font-semibold text-fg">{p.name}</h3>
                      <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-fg-muted">{open} open</span>
                    </div>
                    {p.description && <p className="mt-1 line-clamp-2 text-[12.5px] text-fg-muted">{p.description}</p>}
                    <div className="mt-4">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-fg-subtle">Completion</span>
                        <span className="font-mono text-[11px] text-fg-muted">{pct}%</span>
                      </div>
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-2">
                        <motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5, delay: 0.15 + i * 0.04 }} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </PageBody>

      <ProjectFormModal
        open={open}
        onOpenChange={setOpen}
        onCreated={(p) => router.push(`/projects/${p.id}`)}
      />
    </>
  );
}
