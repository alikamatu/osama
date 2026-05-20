import Link from "next/link";

const CARDS = [
  { href: "/docs/getting-started", title: "Getting started", body: "Sign in, onboard, and learn the daily rhythm." },
  { href: "/docs/habits",          title: "Habits",          body: "Streaks, cadence, and the weekly review loop." },
  { href: "/docs/goals",           title: "Goals",           body: "Long-horizon goals with milestones and at-risk nudges." },
  { href: "/docs/assistant",       title: "Assistant",       body: "What the AI can do — and what it won't." },
  { href: "/docs/api",             title: "API reference",   body: "Programmatic access, webhooks, and OAuth (coming)." },
];

export default function DocsIndex() {
  return (
    <>
      <h1>Documentation</h1>
      <p>
        A short, opinionated guide to using Osama well. Start with the daily rhythm, then layer in habits and goals.
      </p>

      <div className="not-prose mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="block rounded-2xl bg-surface-1 p-5 hover:bg-surface-2"
          >
            <h3 className="text-[15px] font-semibold text-fg">{c.title}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-fg-muted">{c.body}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
