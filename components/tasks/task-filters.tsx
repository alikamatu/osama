"use client";

import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils/cn";
import type { Priority, TaskStatus } from "@/types/entities";

export type Filters = {
  q: string;
  status: TaskStatus | "all";
  priority: Priority | "all";
  projectId: string | "all";
};

export function TaskFilters({
  filters, onChange,
}: { filters: Filters; onChange: (f: Filters) => void }) {
  const projects = useStore((s) => s.projects);

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl bg-surface-1 px-3 py-2">
      <input
        type="search"
        placeholder="Search tasks…"
        value={filters.q}
        onChange={(e) => onChange({ ...filters, q: e.target.value })}
        className="h-9 min-w-[200px] flex-1 bg-transparent text-[13.5px] text-fg outline-none placeholder:text-fg-subtle"
      />
      <Pill label="Status">
        {(["all","open","in-progress","done"] as const).map((s) => (
          <Chip key={s} active={filters.status === s} onClick={() => onChange({ ...filters, status: s })}>{s === "all" ? "Any" : labelStatus(s)}</Chip>
        ))}
      </Pill>
      <Pill label="Priority">
        {(["all","high","med","low"] as const).map((p) => (
          <Chip key={p} active={filters.priority === p} onClick={() => onChange({ ...filters, priority: p })}>{p === "all" ? "Any" : labelPriority(p)}</Chip>
        ))}
      </Pill>
      <Pill label="Project">
        <Chip active={filters.projectId === "all"} onClick={() => onChange({ ...filters, projectId: "all" })}>Any</Chip>
        {projects.filter((p) => !p.archived).map((p) => (
          <Chip key={p.id} active={filters.projectId === p.id} onClick={() => onChange({ ...filters, projectId: p.id })}>{p.name}</Chip>
        ))}
      </Pill>
    </div>
  );
}

function Pill({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-fg-subtle">{label}</span>
      <div className="flex gap-1">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-7 rounded-full px-2.5 text-[11.5px] font-medium",
        active ? "bg-accent text-accent-fg" : "bg-surface-2 text-fg-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

function labelStatus(s: TaskStatus) {
  return s === "open" ? "Open" : s === "in-progress" ? "In progress" : "Done";
}
function labelPriority(p: Priority) {
  return p === "high" ? "High" : p === "med" ? "Medium" : "Low";
}
