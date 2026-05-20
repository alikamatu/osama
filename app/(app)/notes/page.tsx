"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NotebookPen, Plus, Pin, BookOpen, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { format } from "date-fns";
import { useStore } from "@/lib/store";
import { useLiveNotes } from "@/lib/store/selectors";
import { PageHeader, PageBody, Empty } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export default function NotesPage() {
  const router = useRouter();
  const notes = useLiveNotes();
  const add = useStore((s) => s.addNote);
  const openJournal = useStore((s) => s.getOrCreateTodaysJournal);

  function create() {
    const n = add();
    router.push(`/notes/${n.id}`);
  }

  function goToJournal() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const j = openJournal(tz);
    router.push(`/notes/${j.id}`);
  }

  const sorted = useMemo(() => [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  }), [notes]);

  const journalCount = useMemo(() => notes.filter((n) => n.tags.includes("journal")).length, [notes]);

  return (
    <>
      <PageHeader
        icon={NotebookPen}
        title="Notes"
        subtitle={`${notes.length} total${journalCount > 0 ? ` · ${journalCount} journal entr${journalCount === 1 ? "y" : "ies"}` : ""}`}
        actions={
          <>
            <Button variant="secondary" leadingIcon={<BookOpen size={16} strokeWidth={2} />} onClick={goToJournal}>
              Today&apos;s journal
            </Button>
            <Button leadingIcon={<Plus size={16} strokeWidth={2} />} onClick={create}>New note</Button>
          </>
        }
      />
      <PageBody>
        <TodaysJournalCard onOpen={goToJournal} />

        {notes.length === 0 ? (
          <Empty icon={NotebookPen} title="No notes yet" body="Draft thoughts, journals, anything." action={<Button onClick={create}>New note</Button>} />
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

/** A featured card promoting today's journal — opens or creates on click. */
function TodaysJournalCard({ onOpen }: { onOpen: () => void }) {
  const today = format(new Date(), "EEEE, MMMM d");
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="group relative w-full overflow-hidden rounded-2xl bg-surface-1 p-5 text-left hover:bg-surface-2"
    >
      <div className="flex items-start gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-fg">
          <BookOpen size={16} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-fg-subtle">Journal</span>
            <span className="text-[11px] text-fg-muted">{today}</span>
          </div>
          <h3 className="mt-1 text-[16px] font-semibold tracking-tight text-fg">
            Open today&apos;s journal entry
          </h3>
          <p className="mt-1 text-[12.5px] text-fg-muted">
            A short daily ritual — gratitude, what mattered, tomorrow&apos;s one thing. Ask AI for prompts inside.
          </p>
        </div>
        <span className="hidden shrink-0 items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-fg-muted sm:inline-flex">
          <Sparkles size={11} strokeWidth={2} /> AI ready
        </span>
      </div>
    </motion.button>
  );
}
