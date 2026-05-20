"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import type { Project } from "@/types/entities";

export function ProjectFormModal({
  open, onOpenChange, onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated?: (p: Project) => void;
}) {
  const addProject = useStore((s) => s.addProject);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const n = name.trim();
    if (!n) { setError("Give the project a name."); return; }
    const p = addProject({ name: n, description: description.trim() || undefined });
    onCreated?.(p);
    setName(""); setDescription(""); setError(null);
    onOpenChange(false);
  }

  return (
    <Modal
      open={open}
      onOpenChange={(v) => { if (!v) { setName(""); setDescription(""); setError(null); } onOpenChange(v); }}
      title="New project"
      description="Group related tasks under one workspace."
      size="md"
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Project name"
          autoFocus
          value={name}
          onChange={(e) => { setName(e.target.value); setError(null); }}
          error={error ?? undefined}
        />
        <div>
          <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-fg-subtle">Description (optional)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="One sentence on what this project is about."
            className="block w-full resize-y rounded-lg bg-surface-2 p-3 text-[13.5px] leading-relaxed text-fg outline-none placeholder:text-fg-subtle"
          />
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit">Create project</Button>
        </div>
      </form>
    </Modal>
  );
}
