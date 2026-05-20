"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flag, Plus, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useLiveGoals } from "@/lib/store/selectors";
import { PageHeader, PageBody, Empty } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { GoalFormModal } from "@/components/goals/goal-form";
import { cn } from "@/lib/utils/cn";
import type { Goal, GoalHorizon, GoalStatus } from "@/types/entities";

const HORIZONS: Array<{ id: GoalHorizon; label: string; sub: string }> = [
  { id: "quarter", label: "Quarter", sub: "90-day outcomes" },
  { id: "year",    label: "Year",    sub: "Annual themes" },
  { id: "life",    label: "Life",    sub: "Long-horizon" },
];

const STATUS_TONE: Record<GoalStatus, string> = {
  "on-track":  "text-[color:var(--positive)]",
  "at-risk":   "text-[color:var(--warning)]",
  "off-track": "text-[color:var(--danger)]",
  "achieved":  "text-[color:var(--positive)]",
  "archived":  "text-fg-subtle",
};

export default function GoalsPage() {
  const router = useRouter();
  const goals = useLiveGoals();
  const [open, setOpen] = useState(false);
  const [horizon, setHorizon] = useState<GoalHorizon>("quarter");

  function openFor(h: GoalHorizon) { setHorizon(h); setOpen(true); }

  return (
    <>
      <PageHeader
        icon={Flag}
        title="Goals"
        subtitle={`${goals.filter((g) => g.status !== "archived").length} active`}
        actions={<Button leadingIcon={<Plus size={16} strokeWidth={2} />} onClick={() => openFor("quarter")}>New goal</Button>}
      />
      <PageBody>
        {goals.length === 0 ? (
          <Empty
            icon={Flag}
            title="No goals yet"
            body="Connect daily work to bigger outcomes."
            action={<Button onClick={() => openFor("quarter")}>New goal</Button>}
          />
        ) : (
          <div className="space-y-8">
            {HORIZONS.map((h) => {
              const list = goals.filter((g) => g.horizon === h.id && g.status !== "archived");
              return (
                <section key={h.id}>
                  <header className="mb-3 flex items-baseline justify-between">
                    <h2 className="text-[15px] font-semibold text-fg">{h.label}</h2>
                    <span className="text-[11px] text-fg-subtle">{h.sub} · {list.length}</span>
                  </header>
                  {list.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => openFor(h.id)}
                      className="block w-full rounded-2xl bg-surface-1 px-4 py-6 text-left text-[13px] text-fg-muted hover:bg-surface-2"
                    >
                      + Add a {h.label.toLowerCase()} goal
                    </button>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {list.map((g, i) => <GoalCard key={g.id} g={g} delay={i * 0.04} />)}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </PageBody>

      <GoalFormModal
        open={open}
        onOpenChange={setOpen}
        defaultHorizon={horizon}
        onCreated={(g) => router.push(`/goals/${g.id}`)}
      />
    </>
  );
}

function GoalCard({ g, delay }: { g: Goal; delay: number }) {
  const total = g.milestones.length;
  const doneCount = g.milestones.filter((m) => m.done).length;
  const pct = total > 0
    ? Math.round(g.milestones.reduce((s, m) => s + (m.done ? 100 : m.progress), 0) / total)
    : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay }}>
      <Link href={`/goals/${g.id}`} className="block rounded-2xl bg-surface-1 p-5 hover:bg-surface-2">
        <header className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-[16px] font-semibold leading-snug text-fg">{g.title}</h3>
          <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.14em]", STATUS_TONE[g.status])}>
            {g.status === "achieved" && <CheckCircle2 size={11} strokeWidth={2.25} />}
            {g.status === "at-risk" && <AlertTriangle size={11} strokeWidth={2.25} />}
            {g.status.replace("-", " ")}
          </span>
        </header>
        {g.why && <p className="line-clamp-2 text-[12.5px] text-fg-muted">{g.why}</p>}
        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-[11px] uppercase tracking-[0.14em] text-fg-subtle">{doneCount}/{total} milestones</span>
          <span className="font-mono text-[11px] text-fg-muted">{pct}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 + delay }} />
        </div>
      </Link>
    </motion.div>
  );
}
