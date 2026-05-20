"use client";

import Link from "next/link";
import { Repeat, Plus, Flame, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "@/lib/store";
import { useLiveHabits } from "@/lib/store/selectors";
import { useKeyboard } from "@/components/keyboard/keyboard-provider";
import { PageHeader, PageBody, Empty } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { HabitHeatmap } from "@/components/habits/heatmap";
import { bestStreak, completionRate, currentStreak, isDoneToday, ymd } from "@/lib/domain/habits";

export default function HabitsPage() {
  const habits = useLiveHabits();
  const toggle = useStore((s) => s.toggleHabitDay);
  const { openQuickAdd } = useKeyboard();

  const sorted = [...habits].sort((a, b) => currentStreak(b) - currentStreak(a));

  return (
    <>
      <PageHeader
        icon={Repeat}
        title="Habits"
        subtitle={`${habits.length} tracked`}
        actions={<Button leadingIcon={<Plus size={16} strokeWidth={2} />} onClick={openQuickAdd}>New habit</Button>}
      />
      <PageBody>
        {habits.length === 0 ? (
          <Empty icon={Repeat} title="No habits yet" body="Build the small things that compound." action={<Button onClick={openQuickAdd}>New habit</Button>} />
        ) : (
          <>
            <section className="rounded-2xl bg-surface-1 p-5">
              <header className="mb-4 flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-fg">Leaderboard</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-fg-muted">
                  <Trophy size={11} strokeWidth={2} />
                  By current streak
                </span>
              </header>
              <ul className="space-y-2">
                {sorted.map((h, i) => {
                  const streak = currentStreak(h);
                  const rate = completionRate(h);
                  const done = isDoneToday(h);
                  return (
                    <motion.li
                      key={h.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, delay: i * 0.03 }}
                      className="flex items-center gap-3 rounded-xl bg-surface-2 px-3 py-2.5"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-surface-3 font-mono text-[11px] text-fg-muted">
                        {i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggle(h.id, ymd(new Date()))}
                        className={`grid h-7 w-7 place-items-center rounded-full ${done ? "bg-accent text-accent-fg" : "bg-surface-3 text-fg-subtle"}`}
                        aria-label="Toggle today"
                      >
                        <Flame size={12} strokeWidth={2.25} />
                      </button>
                      <Link href={`/habits/${h.id}`} className="flex-1 truncate text-[14px] font-medium text-fg hover:underline">
                        {h.title}
                      </Link>
                      <span className="hidden font-mono text-[11px] text-fg-muted sm:block">{rate}% · 30d</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface-3 px-2 py-0.5 font-mono text-[11.5px] text-fg">
                        <Flame size={11} strokeWidth={2.5} className="text-accent" />
                        {streak}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </section>

            <section className="mt-6 space-y-4">
              <h2 className="text-[12px] font-medium uppercase tracking-[0.16em] text-fg-subtle">Year heatmaps</h2>
              {habits.map((h) => (
                <div key={h.id} className="rounded-2xl bg-surface-1 p-4">
                  <header className="mb-3 flex items-center justify-between">
                    <Link href={`/habits/${h.id}`} className="text-[14px] font-semibold text-fg hover:underline">
                      {h.title}
                    </Link>
                    <span className="text-[11px] text-fg-subtle">
                      Best: {bestStreak(h)} · Now: {currentStreak(h)}
                    </span>
                  </header>
                  <HabitHeatmap habit={h} />
                </div>
              ))}
            </section>
          </>
        )}
      </PageBody>
    </>
  );
}
