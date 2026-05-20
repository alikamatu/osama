import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const COLS: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: "Product",
    links: [
      { href: "/pricing",   label: "Pricing" },
      { href: "/docs",      label: "Docs" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms",   label: "Terms" },
    ],
  },
  {
    title: "Get the app",
    links: [
      { href: "/signin", label: "Sign in" },
      { href: "/signin", label: "Create account" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="mt-24 bg-surface-1">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Logo size={24} withWordmark />
            <p className="mt-3 max-w-[28ch] text-[13px] leading-relaxed text-fg-muted">
              A calm daily driver for tasks, habits, goals, and reviews — with an AI assistant that knows your context.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <h4 className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-fg-subtle">
                {c.title}
              </h4>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-[13.5px] text-fg-muted hover:text-fg">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 text-[12px] text-fg-subtle sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Osama. Made with care.</span>
          <span className="font-mono">v0.1</span>
        </div>
      </div>
    </footer>
  );
}
