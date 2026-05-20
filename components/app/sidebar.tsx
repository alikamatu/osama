"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  CalendarDays, CheckSquare, Flag, Folder, Inbox, LayoutGrid, Menu, X,
  LineChart, NotebookPen, Search, Sparkles, Sun, Repeat, LogOut, Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/brand/logo";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { useKeyboard } from "@/components/keyboard/keyboard-provider";
import { cn } from "@/lib/utils/cn";

type Item = { href: string; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; key?: string };

const PRIMARY: Item[] = [
  { href: "/today",     label: "Today",     icon: Sun,         key: "g t" },
  { href: "/inbox",     label: "Inbox",     icon: Inbox,       key: "g i" },
  { href: "/tasks",     label: "Tasks",     icon: CheckSquare, key: "g k" },
  { href: "/projects",  label: "Projects",  icon: Folder,      key: "g p" },
  { href: "/habits",    label: "Habits",    icon: Repeat,      key: "g h" },
  { href: "/goals",     label: "Goals",     icon: Flag,        key: "g g" },
  { href: "/calendar",  label: "Calendar",  icon: CalendarDays },
  { href: "/reviews",   label: "Reviews",   icon: NotebookPen },
  { href: "/stats",     label: "Stats",     icon: LineChart },
];

const SECONDARY: Item[] = [
  { href: "/assistant", label: "Assistant", icon: Sparkles },
];

type User = { name?: string; email: string; avatarUrl?: string };

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close mobile drawer on route change.
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      {/* Mobile top bar — fixed, visible only < md */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-2 bg-bg/95 px-3 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="grid h-9 w-9 place-items-center rounded-md bg-surface-1 text-fg-muted hover:bg-surface-2 hover:text-fg"
        >
          <Menu size={16} strokeWidth={2} />
        </button>
        <Link href="/today" className="ml-1"><Logo size={22} withWordmark /></Link>
        <span className="ml-auto inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-surface-1">
          {user.avatarUrl && (
            <Image src={user.avatarUrl} alt="" width={32} height={32} unoptimized className="h-full w-full object-cover" />
          )}
        </span>
      </header>

      {/* Desktop sticky sidebar */}
      <aside className="hidden md:flex md:w-[248px] md:shrink-0 md:flex-col md:self-start md:sticky md:top-0 md:h-[100dvh] md:overflow-y-auto bg-bg md:border-r md:border-surface-1/60">
        <SidebarBody user={user} pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/45"
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 flex w-[78vw] max-w-[280px] flex-col bg-bg"
            >
              <div className="flex h-14 items-center justify-between px-4">
                <Logo size={22} withWordmark />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation"
                  className="grid h-9 w-9 place-items-center rounded-md text-fg-subtle hover:bg-surface-1 hover:text-fg"
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>
              <SidebarBody user={user} pathname={pathname} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarBody({ user, pathname }: { user: User; pathname: string }) {
  const { openPalette, openFocus } = useKeyboard();
  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="hidden h-14 items-center px-4 md:flex">
        <Logo size={24} withWordmark />
      </div>

      <button
        type="button"
        onClick={openPalette}
        aria-label="Open command palette"
        className={cn(
          "mx-3 mt-2 flex h-9 items-center gap-2 rounded-lg bg-surface-1 px-3",
          "text-[13px] text-fg-subtle hover:bg-surface-2 hover:text-fg-muted",
        )}
      >
        <Search size={14} strokeWidth={2} />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle">⌘K</kbd>
      </button>

      <nav className="mt-4 flex-1 overflow-y-auto px-3">
        <NavSection items={PRIMARY} pathname={pathname} />
        <div className="mt-6">
          <NavSection items={SECONDARY} pathname={pathname} />
        </div>
      </nav>

      {/* Focus Mode entry point */}
      <div className="px-3 pb-2">
        <button
          type="button"
          onClick={openFocus}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium",
            "bg-surface-1 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg",
          )}
        >
          <Zap size={14} strokeWidth={2} className="text-accent" />
          <span className="flex-1 text-left">Focus Mode</span>
          <kbd className="rounded bg-surface-2 px-1.5 font-mono text-[10px] text-fg-subtle">f</kbd>
        </button>
      </div>

      <div className="px-3 pb-4 pt-3">
        <div className="mb-3 flex items-center justify-between gap-2">
          <ThemeSwitcher />
          <KeyboardHint />
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-surface-1 p-2">
          <Link
            href="/settings/profile"
            className="-m-0.5 flex min-w-0 flex-1 items-center gap-3 rounded-md p-0.5 hover:bg-surface-2"
            aria-label="Open profile"
          >
            <span className="block h-8 w-8 shrink-0 overflow-hidden rounded-full bg-surface-2">
              {user.avatarUrl && (
                <Image src={user.avatarUrl} alt="" width={32} height={32} unoptimized className="h-full w-full object-cover" />
              )}
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-[13px] font-medium text-fg">
                {user.name || user.email.split("@")[0]}
              </span>
              <span className="block truncate text-[11px] text-fg-subtle">{user.email}</span>
            </span>
          </Link>
          <a
            href="/signout"
            title="Sign out"
            aria-label="Sign out"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-fg-subtle hover:bg-surface-3 hover:text-fg"
          >
            <LogOut size={14} strokeWidth={2} />
          </a>
        </div>
      </div>
    </div>
  );
}

function NavSection({ items, pathname }: { items: Item[]; pathname: string }) {
  return (
    <ul className="space-y-0.5">
      {items.map((it) => {
        const Icon = it.icon;
        const active = pathname === it.href || pathname.startsWith(it.href + "/");
        return (
          <li key={it.href}>
            <Link
              href={it.href}
              className={cn(
                "group relative flex h-10 items-center gap-2.5 rounded-lg px-3 text-[14px] md:h-9 md:text-[13.5px]",
                "transition-colors duration-150",
                active ? "text-fg" : "text-fg-muted hover:bg-surface-1 hover:text-fg",
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-lg bg-surface-1"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon size={16} strokeWidth={1.75} />
              <span className="flex-1">{it.label}</span>
              {it.key && (
                <kbd className="hidden rounded bg-transparent px-1 font-mono text-[10px] text-fg-subtle opacity-0 group-hover:opacity-100 md:block">
                  {it.key}
                </kbd>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function KeyboardHint() {
  const { openCheatsheet } = useKeyboard();
  return (
    <button
      type="button"
      onClick={openCheatsheet}
      aria-label="Show keyboard shortcuts"
      className="inline-flex h-7 items-center gap-1 rounded-full bg-surface-1 px-2 text-[11px] font-medium text-fg-subtle hover:bg-surface-2 hover:text-fg-muted"
    >
      <kbd className="font-mono">?</kbd>
      <span>shortcuts</span>
    </button>
  );
}

export { LayoutGrid };
