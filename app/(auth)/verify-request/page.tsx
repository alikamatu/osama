import { Mail, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

export default async function VerifyRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-16">
      <header className="flex items-center justify-between">
        <Logo size={28} withWordmark />
        <ThemeSwitcher />
      </header>

      <main className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-[440px] rounded-2xl bg-surface-1 p-8 text-center">
          <Envelope />
          <h1 className="mt-6 text-[22px] font-semibold tracking-tight text-fg">
            Check your inbox
          </h1>
          <p className="mt-2 text-sm text-fg-muted">
            We sent a sign-in link
            {email ? <> to <span className="text-fg">{email}</span></> : null}.
            The link expires in 15 minutes and can only be used once.
          </p>

          <div className="mt-6 rounded-lg bg-surface-2 p-3 text-left">
            <p className="text-[12px] leading-relaxed text-fg-subtle">
              Can&apos;t find it? Check spam, or wait a minute — emails can take a moment to arrive.
            </p>
          </div>

          <a
            href="/signin"
            className="mt-6 inline-flex h-10 items-center gap-1.5 rounded-lg bg-surface-2 px-4 text-sm font-medium text-fg-muted hover:bg-surface-3 hover:text-fg"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Use a different email
          </a>
        </div>
      </main>
    </div>
  );
}

function Envelope() {
  return (
    <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-accent">
      <Mail size={26} strokeWidth={1.75} />
    </div>
  );
}
