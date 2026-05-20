"use client";

import { useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { Popover } from "./popover";
import { cn } from "@/lib/utils/cn";

export type SelectOption<V extends string = string> = {
  value: V;
  label: string;
  hint?: string;
  /** Render-time accent strip (uses a token name like "warning", "danger"). */
  tone?: string;
};

export function Select<V extends string = string>({
  value, onChange, options, placeholder = "Select…", className,
}: {
  value: V | null | undefined;
  onChange: (next: V) => void;
  options: Array<SelectOption<V>>;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const current = options.find((o) => o.value === value) ?? null;

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-md bg-transparent px-2 text-left text-[13px] outline-none",
          "transition-colors hover:bg-surface-2",
          className,
        )}
      >
        <span className={cn("flex-1 truncate", current ? "text-fg" : "text-fg-subtle")}>
          {current?.label ?? placeholder}
        </span>
        <ChevronDown size={14} strokeWidth={2} className="text-fg-subtle" />
      </button>

      <Popover open={open} onOpenChange={setOpen} anchor={anchorRef.current} align="start" width="anchor">
        <ul role="listbox" className="max-h-[280px] overflow-y-auto p-1">
          {options.map((o) => {
            const active = o.value === value;
            return (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => { onChange(o.value); setOpen(false); }}
                  className={cn(
                    "relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px]",
                    active ? "text-fg" : "text-fg-muted hover:bg-surface-3 hover:text-fg",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="select-active"
                      className="absolute inset-0 -z-10 rounded-md bg-surface-3"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="flex-1 truncate">
                    {o.label}
                    {o.hint && <span className="ml-1.5 text-[11px] text-fg-subtle">{o.hint}</span>}
                  </span>
                  {active && <Check size={13} strokeWidth={2.5} className="text-accent" />}
                </button>
              </li>
            );
          })}
        </ul>
      </Popover>
    </>
  );
}
