"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotebookPen } from "lucide-react";
import { PageHeader, PageBody } from "@/components/ui/page";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { href: "/reviews",         label: "Index" },
  { href: "/reviews/daily",   label: "Daily" },
  { href: "/reviews/weekly",  label: "Weekly" },
  { href: "/reviews/monthly", label: "Monthly" },
  { href: "/reviews/yearly",  label: "Yearly" },
];

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <PageHeader icon={NotebookPen} title="Reviews" subtitle="Reflect on the rhythm. Small loops, big change." />
      <PageBody>
        <nav className="mb-6 inline-flex gap-1 rounded-full bg-surface-1 p-1">
          {TABS.map((t) => {
            const active = pathname === t.href || (t.href !== "/reviews" && pathname.startsWith(t.href));
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[12.5px] font-medium",
                  active ? "bg-accent text-accent-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
        {children}
      </PageBody>
    </>
  );
}
