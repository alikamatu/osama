import {
  CheckSquare, Repeat, Flag, NotebookPen, Sparkles, Command,
  LineChart, CalendarDays, Sun, Inbox, Search, Keyboard,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const PILLARS: Array<{ icon: LucideIcon; title: string; body: string }> = [
  { icon: Sun,          title: "Daily command center",     body: "One screen for what matters today: tasks, habits, and a focus timer." },
  { icon: Repeat,       title: "Streak-aware habits",       body: "Build the small things that compound. See your run length at a glance." },
  { icon: Flag,         title: "Long-horizon goals",        body: "Connect daily work to quarterly and yearly outcomes. Catch drift early." },
  { icon: NotebookPen,  title: "Reflective reviews",        body: "Daily shutdown, weekly review, monthly retro — drafted from your data." },
  { icon: Sparkles,     title: "An assistant with context", body: "Plan a day, break down a goal, summarize a week. Your data stays yours." },
  { icon: LineChart,    title: "Stats that motivate",       body: "Trends, heatmaps, time-of-day insights — without doom-scrolling charts." },
];

const KEYBOARD: Array<{ icon: LucideIcon; title: string; body: string }> = [
  { icon: Command,      title: "Command palette", body: "⌘K to jump anywhere, run an action, or ask Osama." },
  { icon: Keyboard,     title: "Chord shortcuts", body: "g t for Today, g h for Habits, g g for Goals." },
  { icon: Search,       title: "Quick capture",   body: "Press N from anywhere to add a task, habit, or thought." },
  { icon: CalendarDays, title: "Time-zone aware", body: "Greetings, due dates, and reminders match your day." },
  { icon: CheckSquare,  title: "Drag-reorder",    body: "Reshape today by dragging. Swipe to complete on touch." },
  { icon: Inbox,        title: "Quick triage",    body: "Email-in, AI inbox sorting, and one-tap routing to projects." },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <header className="mb-12 max-w-[52ch]">
        <h2 className="text-[32px] font-semibold tracking-[-0.01em] text-fg md:text-[40px]">
          Six pillars. One calm app.
        </h2>
        <p className="mt-3 text-[16px] leading-relaxed text-fg-muted">
          Osama replaces three apps you toggle between with one that knows them all — and gets out of the way.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map(({ icon: Icon, title, body }) => (
          <article key={title} className="rounded-2xl bg-surface-1 p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-accent">
              <Icon size={18} strokeWidth={1.75} />
            </span>
            <h3 className="mt-4 text-[16px] font-semibold tracking-tight text-fg">{title}</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-fg-muted">{body}</p>
          </article>
        ))}
      </div>

      <header className="mt-24 mb-10 max-w-[52ch]">
        <h2 className="text-[28px] font-semibold tracking-[-0.01em] text-fg">Designed for the keyboard.</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">
          Most of Osama is reachable in two keystrokes.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {KEYBOARD.map(({ icon: Icon, title, body }) => (
          <article key={title} className="rounded-2xl bg-surface-1 p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-fg">
                <Icon size={16} strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="text-[14.5px] font-semibold text-fg">{title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-fg-muted">{body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
