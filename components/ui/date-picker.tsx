"use client";

import { useMemo, useRef, useState } from "react";
import { addDays, addMonths, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import { Calendar as CalIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion } from "motion/react";
import { Popover } from "./popover";
import { cn } from "@/lib/utils/cn";

export function DatePicker({
  value, onChange, placeholder = "Pick a date", weekStartsOn = 1, allowClear = true, className,
}: {
  value: string | null;
  onChange: (next: string | null) => void;
  placeholder?: string;
  weekStartsOn?: 0 | 1;
  allowClear?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const selected = value ? new Date(value) : null;
  const [view, setView] = useState<Date>(() => selected ?? new Date());

  const display = selected ? format(selected, "EEE, MMM d, yyyy") : "";

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(view), { weekStartsOn });
    const end = endOfWeek(endOfMonth(view), { weekStartsOn });
    const out: Date[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) out.push(d);
    return out;
  }, [view, weekStartsOn]);

  const weekdayLabels = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn });
    return Array.from({ length: 7 }).map((_, i) => format(addDays(start, i), "EEEEEE"));
  }, [weekStartsOn]);

  function pick(d: Date) {
    onChange(d.toISOString());
    setOpen(false);
  }

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => { setView(selected ?? new Date()); setOpen((v) => !v); }}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-md bg-transparent px-2 text-left text-[13px] outline-none",
          "transition-colors hover:bg-surface-2",
          className,
        )}
      >
        <CalIcon size={13} strokeWidth={1.75} className="text-fg-subtle" />
        <span className={cn("flex-1 truncate", selected ? "text-fg" : "text-fg-subtle")}>
          {display || placeholder}
        </span>
        {allowClear && selected && (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear date"
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onChange(null); } }}
            className="grid h-5 w-5 place-items-center rounded-md text-fg-subtle hover:bg-surface-3 hover:text-fg"
          >
            <X size={11} strokeWidth={2.25} />
          </span>
        )}
      </button>

      <Popover open={open} onOpenChange={setOpen} anchor={anchorRef.current} align="start">
        <div className="w-[296px] p-3">
          <header className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setView((v) => addMonths(v, -1))}
                aria-label="Previous month"
                className="grid h-7 w-7 place-items-center rounded-md text-fg-muted hover:bg-surface-3 hover:text-fg"
              ><ChevronLeft size={14} strokeWidth={2} /></button>
              <button
                type="button"
                onClick={() => setView((v) => addMonths(v, 1))}
                aria-label="Next month"
                className="grid h-7 w-7 place-items-center rounded-md text-fg-muted hover:bg-surface-3 hover:text-fg"
              ><ChevronRight size={14} strokeWidth={2} /></button>
            </div>
            <div className="text-[13px] font-semibold tracking-tight text-fg">{format(view, "MMMM yyyy")}</div>
            <button
              type="button"
              onClick={() => { setView(new Date()); }}
              className="rounded-md bg-surface-3 px-2 py-1 text-[11px] font-medium text-fg-muted hover:text-fg"
            >
              Today
            </button>
          </header>

          <div className="grid grid-cols-7 gap-y-0.5">
            {weekdayLabels.map((d) => (
              <div key={d} className="text-center text-[10px] font-medium uppercase tracking-[0.14em] text-fg-subtle">{d}</div>
            ))}
            {days.map((d) => {
              const inMonth = isSameMonth(d, view);
              const isSel = selected && isSameDay(d, selected);
              const isToday = isSameDay(d, new Date());
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  onClick={() => pick(d)}
                  aria-pressed={Boolean(isSel)}
                  className={cn(
                    "relative grid h-9 place-items-center rounded-md text-[12.5px] font-medium",
                    "transition-colors",
                    !inMonth && "text-fg-subtle",
                    inMonth && !isSel && "text-fg hover:bg-surface-3",
                    isSel && "text-accent-fg",
                  )}
                >
                  {isSel && (
                    <motion.span
                      layoutId="dp-selected"
                      className="absolute inset-0.5 -z-10 rounded-md bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className={cn(isToday && !isSel && "underline underline-offset-[5px] decoration-accent decoration-2")}>
                    {d.getDate()}
                  </span>
                </button>
              );
            })}
          </div>

          <footer className="mt-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => { onChange(null); setOpen(false); }}
              className="rounded-md px-2 py-1 text-[11.5px] font-medium text-fg-subtle hover:bg-surface-3 hover:text-fg"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => pick(new Date())}
              className="rounded-md bg-accent px-2.5 py-1 text-[11.5px] font-semibold text-accent-fg"
            >
              Today
            </button>
          </footer>
        </div>
      </Popover>
    </>
  );
}
