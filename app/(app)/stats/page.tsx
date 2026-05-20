"use client";

import { useMemo } from "react";
import { LineChart, Flame, Folder, Clock3 } from "lucide-react";
import { motion } from "motion/react";
import { addDays, format, subDays } from "date-fns";
import { useLiveTasks, useLiveHabits, useLiveProjects } from "@/lib/store/selectors";
import { PageHeader, PageBody } from "@/components/ui/page";
import { ymd } from "@/lib/domain/habits";
import { HabitHeatmap } from "@/components/habits/heatmap";

export default function StatsPage() {
  const tasks = useLiveTasks();
  const habits = useLiveHabits();
  const projects = useLiveProjects();

  const completionByDay = useMemo(() => {
    const days = 30;
    const out: Array<{ day: string; value: number }> = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const key = ymd(d);
      const count = tasks.filter((t) => t.completedAt && ymd(t.completedAt) === key).length;
      out.push({ day: format(d, "MMM d"), value: count });
    }
    return out;
  }, [tasks]);

  const byProject = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of tasks) {
      const k = t.projectId ?? "none";
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([id, n]) => {
      const proj = projects.find((p) => p.id === id);
      return { label: proj?.name ?? "Unassigned", value: n };
    });
  }, [tasks, projects]);

  const hourBuckets = useMemo(() => {
    const buckets = Array.from({ length: 24 }).map(() => 0);
    for (const t of tasks) {
      if (!t.completedAt) continue;
      const h = new Date(t.completedAt).getHours();
      buckets[h]++;
    }
    return buckets;
  }, [tasks]);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <>
      <PageHeader icon={LineChart} title="Stats" subtitle="Patterns over time. Without the doom-scroll." />
      <PageBody>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <KPI icon={Flame}  label="Completion rate" value={`${completionRate}%`} sub={`${completed}/${total} tasks`} />
          <KPI icon={Folder} label="Projects"        value={projects.filter((p) => !p.archived).length} sub={`${projects.length} total`} />
          <KPI icon={Clock3} label="Habits"          value={habits.length} sub="tracked" />
          <KPI icon={LineChart} label="Avg / day"    value={Math.round(completionByDay.reduce((s, d) => s + d.value, 0) / Math.max(1, completionByDay.length))} sub="last 30 days" />
        </div>

        <section className="mt-8 rounded-2xl bg-surface-1 p-5">
          <SectionHead title="Tasks completed · last 30 days" />
          <LineChartSVG data={completionByDay} />
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl bg-surface-1 p-5">
            <SectionHead title="By project" />
            <ul className="mt-4 space-y-2">
              {byProject.map((b) => {
                const max = Math.max(...byProject.map((x) => x.value), 1);
                const pct = Math.round((b.value / max) * 100);
                return (
                  <li key={b.label} className="flex items-center gap-3">
                    <span className="w-28 truncate text-[12.5px] text-fg">{b.label}</span>
                    <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <motion.span className="absolute inset-y-0 left-0 rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
                    </span>
                    <span className="w-8 text-right font-mono text-[11px] text-fg-muted">{b.value}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-2xl bg-surface-1 p-5">
            <SectionHead title="When you ship · time of day" />
            <div className="mt-4 flex h-[160px] items-end gap-[3px]">
              {hourBuckets.map((v, i) => {
                const max = Math.max(...hourBuckets, 1);
                const h = (v / max) * 100;
                return (
                  <motion.span
                    key={i}
                    className="flex-1 rounded-sm bg-accent"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.01 }}
                    style={{ minHeight: 2, opacity: v > 0 ? 1 : 0.3 }}
                    title={`${String(i).padStart(2, "0")}:00 — ${v} done`}
                  />
                );
              })}
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] text-fg-subtle">
              <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl bg-surface-1 p-5">
          <SectionHead title="Streak heatmap · all habits" />
          <div className="mt-4 space-y-4">
            {habits.map((h) => (
              <div key={h.id}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-fg">{h.title}</span>
                </div>
                <HabitHeatmap habit={h} />
              </div>
            ))}
          </div>
        </section>
      </PageBody>
    </>
  );
}

function SectionHead({ title }: { title: string }) {
  return <h3 className="text-[12px] font-medium uppercase tracking-[0.16em] text-fg-subtle">{title}</h3>;
}

function KPI({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-surface-1 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-fg-subtle">{label}</span>
        <span className="grid h-7 w-7 place-items-center rounded-md bg-surface-2 text-fg-muted">
          <Icon size={13} strokeWidth={1.75} />
        </span>
      </div>
      <div className="mt-2 text-[22px] font-semibold tracking-tight text-fg">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-fg-subtle">{sub}</div>}
    </div>
  );
}

function LineChartSVG({ data }: { data: Array<{ day: string; value: number }> }) {
  const w = 700, h = 180, padL = 8, padR = 8, padT = 12, padB = 24;
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const stepX = (w - padL - padR) / (data.length - 1 || 1);
  const points = data.map((d, i) => {
    const x = padL + i * stepX;
    const y = padT + (1 - d.value / max) * (h - padT - padB);
    return [x, y] as const;
  });
  const pathLine = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const pathArea = `${pathLine} L${points[points.length - 1][0].toFixed(1)},${h - padB} L${points[0][0].toFixed(1)},${h - padB} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full">
      <defs>
        <linearGradient id="stats-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={pathArea} fill="url(#stats-area)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
      <motion.path d={pathLine} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
      {points.map(([x, y], i) => i % 5 === 0 && (
        <text key={i} x={x} y={h - 6} textAnchor="middle" fontSize="9" fill="var(--fg-subtle)" fontFamily="ui-monospace, monospace">
          {data[i].day.slice(-2)}
        </text>
      ))}
    </svg>
  );
}
