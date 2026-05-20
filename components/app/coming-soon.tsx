import type { LucideIcon } from "lucide-react";

export function ComingSoon({
  icon: Icon, title, blurb, eta,
}: {
  icon: LucideIcon;
  title: string;
  blurb: string;
  eta?: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-[460px] rounded-2xl bg-surface-1 p-8 text-center">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-accent">
          <Icon size={22} strokeWidth={1.75} />
        </span>
        <h1 className="mt-5 text-[22px] font-semibold tracking-tight text-fg">{title}</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-fg-muted">{blurb}</p>
        {eta && (
          <p className="mt-4 inline-block rounded-full bg-surface-2 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
            {eta}
          </p>
        )}
      </div>
    </div>
  );
}
