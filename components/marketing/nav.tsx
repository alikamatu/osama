"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { cn } from "@/lib/utils/cn";

const ITEMS = [
  { href: "/pricing",   label: "Pricing" },
  { href: "/docs",      label: "Docs" },
  { href: "/changelog", label: "Changelog" },
];

export function MarketingNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 bg-bg/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="inline-flex" aria-label="Osama home">
          <Logo size={26} withWordmark />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {ITEMS.map((it) => {
            const active = pathname === it.href || pathname.startsWith(it.href + "/");
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[13.5px] font-medium",
                  active ? "text-fg" : "text-fg-muted hover:bg-surface-1 hover:text-fg",
                )}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block"><ThemeSwitcher /></div>
          <Link
            href="/signin"
            className="inline-flex h-9 items-center rounded-lg bg-surface-2 px-3 text-[13px] font-medium text-fg-muted hover:bg-surface-3 hover:text-fg"
          >
            Sign in
          </Link>
          <Link
            href="/signin"
            className="inline-flex h-9 items-center rounded-lg bg-accent px-3.5 text-[13px] font-semibold text-accent-fg hover:brightness-110"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
