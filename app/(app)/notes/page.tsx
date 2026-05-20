"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { NotebookPen, Plus, Pin } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "@/lib/store";
import { useLiveNotes } from "@/lib/store/selectors";
import { PageHeader, PageBody, Empty } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export default function NotesPage() {
  const router = useRouter();
  const notes = useLiveNotes();
  const add = useStore((s) => s.addNote);

  function create() {
    const n = add();
    router.push(`/notes/${n.id}`);
  }

  const sorted = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <>
      <PageHeader
        icon={NotebookPen}
        title="Notes"
        subtitle={`${notes.length} total`}
        actions={<Button leadingIcon={<Plus size={16} strokeWidth={2} />} onClick={create}>New note</Button>}
      />
      <PageBody>
        {notes.length === 0 ? (
          <Empty icon={NotebookPen} title="No notes yet" body="Draft thoughts, journals, anything." action={<Button onClick={create}>New note</Button>} />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: i * 0.03 }}
              >
                <Link href={`/notes/${n.id}`} className="block h-full rounded-2xl bg-surface-1 p-5 hover:bg-surface-2">
                  <header className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-[15.5px] font-semibold text-fg">{n.title}</h3>
                    {n.pinned && <Pin size={13} strokeWidth={2} className="shrink-0 text-accent" />}
                  </header>
                  <p className="line-clamp-4 whitespace-pre-line text-[13px] leading-relaxed text-fg-muted">
                    {n.body || "Empty note."}
                  </p>
                  <footer className="mt-4 flex items-center justify-between text-[11px] text-fg-subtle">
                    <span>{formatDistanceToNow(new Date(n.updatedAt), { addSuffix: true })}</span>
                    {n.tags.length > 0 && <span>{n.tags.map((t) => `#${t}`).join(" ")}</span>}
                  </footer>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
