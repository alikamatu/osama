import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { Sidebar } from "@/components/app/sidebar";
import { KeyboardProvider } from "@/components/keyboard/keyboard-provider";
import { Hydrated } from "@/components/store/hydrated";
import { StoreSync } from "@/components/store/sync";
import { ConfirmProvider } from "@/components/ui/confirm";
import { ServiceWorkerRegister } from "@/components/pwa/sw-register";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/signin");
  if (!session.onboarded) redirect("/onboarding");

  return (
    <ConfirmProvider><KeyboardProvider>
      <ServiceWorkerRegister />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-fg"
      >
        Skip to content
      </a>
      <div className="flex bg-bg">
        <Sidebar
          user={{
            name: session.name,
            email: session.email,
            avatarUrl: session.avatarUrl,
          }}
        />
        <main id="main" className="flex min-h-screen flex-1 flex-col pt-14 md:pt-0">
          <Hydrated fallback={<AppSkeleton />}>
            <StoreSync />
            {children}
          </Hydrated>
        </main>
      </div>
    </KeyboardProvider></ConfirmProvider>
  );
}

function AppSkeleton() {
  return (
    <div className="px-6 pt-10 md:px-10" aria-hidden="true">
      <div className="h-7 w-48 animate-pulse rounded-md bg-surface-1" />
      <div className="mt-2 h-3 w-32 animate-pulse rounded bg-surface-1" />
      <div className="mt-8 grid grid-cols-2 gap-3">
        <div className="h-24 animate-pulse rounded-2xl bg-surface-1" />
        <div className="h-24 animate-pulse rounded-2xl bg-surface-1" />
      </div>
      <div className="mt-6 space-y-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-xl bg-surface-1" />
        ))}
      </div>
    </div>
  );
}
