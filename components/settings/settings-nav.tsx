"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";

const ITEMS = [
  { href: "/settings/profile",       label: "Profile" },
  { href: "/settings/appearance",    label: "Appearance" },
  { href: "/settings/preferences",   label: "Preferences" },
  { href: "/settings/notifications", label: "Notifications" },
  { href: "/settings/account",       label: "Account" },
  { href: "/settings/billing",       label: "Billing" },
  { href: "/settings/security",      label: "Security" },
  { href: "/settings/connections",   label: "Connections" },
  { href: "/settings/ai",            label: "AI" },
  { href: "/settings/integrations",  label: "Integrations" },
  { href: "/settings/data",          label: "Data" },
  { href: "/settings/danger",        label: "Danger zone" },
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-0.5">
      {ITEMS.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "relative flex h-9 items-center rounded-lg px-3 text-[13.5px]",
              active ? "text-fg" : "text-fg-muted hover:bg-surface-1 hover:text-fg",
            )}
          >
            {active && (
              <motion.span
                layoutId="settings-active"
                className="absolute inset-0 -z-10 rounded-lg bg-surface-1"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
