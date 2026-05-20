"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const SECTIONS = [
  {
    title: "Start here",
    items: [
      { href: "/docs",                  label: "Overview" },
      { href: "/docs/getting-started",  label: "Getting started" },
    ],
  },
  {
    title: "Core features",
    items: [
      { href: "/docs/habits",    label: "Habits" },
      { href: "/docs/goals",     label: "Goals" },
      { href: "/docs/assistant", label: "Assistant" },
    ],
  },
  {
    title: "Developers",
    items: [
      { href: "/docs/api", label: "API reference" },
    ],
  },
];

export function DocsNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-6">
      {SECTIONS.map((s) => (
        <div key={s.title}>
          <h4 className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-fg-subtle">{s.title}</h4>
          <ul className="space-y-0.5">
            {s.items.map((it) => {
              const active = pathname === it.href;
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className={cn(
                      "block rounded-lg px-3 py-1.5 text-[13.5px]",
                      active ? "bg-surface-1 text-fg" : "text-fg-muted hover:bg-surface-1 hover:text-fg",
                    )}
                  >
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
