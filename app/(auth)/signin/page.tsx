import { Logo } from "@/components/brand/logo";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthVisual } from "@/components/auth/auth-visual";

const ERROR_COPY: Record<string, string> = {
  expired: "That sign-in link has expired. Request a new one below.",
  invalid: "We couldn't verify that sign-in link. Try again.",
  oauth_denied: "Sign-in was cancelled. Try again.",
  oauth_failed: "Something went wrong with that sign-in. Try again or use email instead.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? ERROR_COPY[error] ?? null : null;
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_1.05fr]">
      {/* Left — form column */}
      <div className="relative flex flex-col px-6 py-8 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between">
          <Logo size={28} withWordmark />
          <ThemeSwitcher />
        </header>

        <main className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-fg">
                Welcome back.
              </h1>
              <p className="mt-2 text-[15px] text-fg-muted">
                Pick up where you left off — tasks, streaks, goals, and your assistant.
              </p>
            </div>
            {errorMessage && (
              <div
                role="alert"
                className="mb-5 rounded-lg bg-surface-2 px-4 py-3 text-[13px] text-[color:var(--danger)]"
              >
                {errorMessage}
              </div>
            )}
            <AuthForm />
          </div>
        </main>

        <footer className="flex items-center justify-between text-[12px] text-fg-subtle">
          <span>© {new Date().getFullYear()} Osama</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-fg-muted">Help</a>
            <a href="#" className="hover:text-fg-muted">Status</a>
          </div>
        </footer>
      </div>

      {/* Right — illustration (hidden on small screens) */}
      <div className="relative hidden lg:block">
        <AuthVisual />
      </div>
    </div>
  );
}
