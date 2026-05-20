import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/admin";

const NAV = [
  { href: "/admin",                label: "Overview" },
  { href: "/admin/users",          label: "Users" },
  { href: "/admin/flags",          label: "Feature flags" },
  { href: "/admin/deliverability", label: "Email" },
  { href: "/admin/errors",         label: "Errors" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/signin");
  if (!isAdmin(session.email)) notFound();

  return (
    <div className="min-h-screen bg-bg">
      <header className="flex items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-medium uppercase tracking-[0.18em] text-fg-subtle">Admin</span>
          <span className="text-[13px] text-fg-muted">{session.email}</span>
        </div>
        <a href="/today" className="text-[13px] text-fg-subtle hover:text-fg">Back to app</a>
      </header>

      <nav className="flex gap-1 px-6 md:px-10">
        {NAV.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-fg-muted hover:bg-surface-1 hover:text-fg"
          >
            {it.label}
          </Link>
        ))}
      </nav>

      <main className="px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}
