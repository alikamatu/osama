"use client";

import { motion } from "motion/react";
import { CheckCircle2, Circle, Flame } from "lucide-react";

/**
 * A self-contained, themed mock of the Today board for the hero.
 * Pure components, no data — just motion + tokens.
 */
export function AnimatedDemo() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-1 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-semibold text-fg">Good morning, Osama.</div>
          <div className="text-[11px] text-fg-subtle">Tuesday · May 19</div>
        </div>
        <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-fg-muted">8:42</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <ProgressCard label="Tasks"  value="3 / 5" pct={60} />
        <ProgressCard label="Habits" value="3 / 5" pct={60} />
      </div>

      <div className="mt-4 flex gap-2 overflow-hidden">
        {["Run", "Read", "Meditate"].map((h, i) => (
          <motion.div
            key={h}
            className={`flex h-16 w-24 shrink-0 flex-col justify-between rounded-xl p-2 ${i === 0 ? "bg-accent text-accent-fg" : "bg-surface-2"}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-1 rounded-full bg-black/15 px-1.5 py-0.5 text-[10px] font-medium">
              <Flame size={10} strokeWidth={2.5} />
              {[12, 27, 5][i]}
            </div>
            <div className={`text-[12px] font-semibold ${i === 0 ? "text-accent-fg" : "text-fg"}`}>{h}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 space-y-1.5">
        {[
          { t: "Plan Q3 roadmap",           done: false, dot: "bg-danger",   due: "10:00" },
          { t: "Review pull requests",       done: false, dot: "bg-warning", due: "13:00" },
          { t: "Write weekly status update", done: false, dot: "bg-warning" },
          { t: "Read 30 pages",              done: true,  dot: "bg-fg-subtle" },
        ].map((row, i) => (
          <motion.div
            key={row.t}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.32, delay: 0.18 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 rounded-lg bg-surface-2 px-2 py-1.5"
          >
            {row.done
              ? <CheckCircle2 size={14} strokeWidth={2} className="text-accent" />
              : <Circle size={14} strokeWidth={1.75} className="text-fg-subtle" />}
            <span className={`h-1.5 w-1.5 rounded-full ${row.dot}`} />
            <span className={`flex-1 truncate text-[12px] ${row.done ? "text-fg-subtle line-through" : "text-fg"}`}>{row.t}</span>
            {row.due && (
              <span className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">{row.due}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ProgressCard({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div className="rounded-xl bg-surface-2 p-2.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-fg-subtle">{label}</span>
        <span className="font-mono text-[10px] text-fg-muted">{pct}%</span>
      </div>
      <div className="mt-1 text-[15px] font-semibold text-fg">{value}</div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-3">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </div>
    </div>
  );
}
