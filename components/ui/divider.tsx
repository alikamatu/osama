export function Divider({ label }: { label?: string }) {
  if (!label) {
    return <div className="h-px w-full bg-[color:var(--hairline)]" />;
  }
  return (
    <div className="flex w-full items-center gap-3" role="separator" aria-label={label}>
      <span className="h-px flex-1 bg-[color:var(--hairline)]" />
      <span className="select-none text-[11px] font-medium uppercase tracking-[0.14em] text-fg-subtle">
        {label}
      </span>
      <span className="h-px flex-1 bg-[color:var(--hairline)]" />
    </div>
  );
}
