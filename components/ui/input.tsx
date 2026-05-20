"use client";

import { forwardRef, useId, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  leadingIcon?: React.ReactNode;
  trailingSlot?: React.ReactNode;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, leadingIcon, trailingSlot, error, hint, id, onFocus, onBlur, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [focused, setFocused] = useState(false);
  const showFloating = focused || Boolean(rest.value) || Boolean(rest.defaultValue);

  return (
    <div className="w-full">
      <div
        className={cn(
          "group relative flex items-center rounded-lg bg-surface-2",
          "transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          focused ? "bg-surface-3" : "hover:bg-surface-3",
          error && "ring-2 ring-[color:var(--danger)]/40",
          className,
        )}
      >
        {leadingIcon && (
          <span className="pl-3 text-fg-subtle group-focus-within:text-fg-muted">
            {leadingIcon}
          </span>
        )}
        <div className="relative flex-1">
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                "pointer-events-none absolute left-3 origin-left select-none text-fg-subtle",
                "transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                showFloating
                  ? "top-1.5 text-[11px] font-medium tracking-wide text-fg-muted"
                  : "top-1/2 -translate-y-1/2 text-sm",
              )}
            >
              {label}
            </label>
          )}
          <input
            ref={ref}
            id={inputId}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            className={cn(
              "block w-full bg-transparent text-fg outline-none",
              "placeholder:text-fg-subtle",
              label ? "h-12 pt-4 pb-1 px-3 text-sm" : "h-12 px-3 text-sm",
            )}
            {...rest}
          />
        </div>
        {trailingSlot && <div className="pr-2">{trailingSlot}</div>}
      </div>
      {(error || hint) && (
        <p className={cn("mt-1.5 text-[12px]", error ? "text-[color:var(--danger)]" : "text-fg-subtle")}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
});
