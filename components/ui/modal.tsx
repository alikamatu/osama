"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Modal({
  open, onOpenChange, title, description, children, size = "md", className,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); onOpenChange(false); return; }
      if (e.key === "Tab") {
        const root = ref.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);

    // Focus the first focusable element.
    const t = setTimeout(() => {
      const root = ref.current;
      const focusable = root?.querySelector<HTMLElement>(
        'input:not([disabled]), textarea:not([disabled]), button:not([disabled])',
      );
      focusable?.focus();
    }, 30);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open, onOpenChange]);

  const widths = {
    sm: "w-[min(420px,92vw)]",
    md: "w-[min(540px,92vw)]",
    lg: "w-[min(720px,92vw)]",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-end sm:place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-black/45"
          />
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.985 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative z-10 w-full overflow-hidden rounded-t-2xl bg-surface-1 sm:rounded-2xl",
              widths[size],
              "max-h-[92vh] flex flex-col",
              className,
            )}
          >
            {(title || description) && (
              <header className="flex items-start gap-3 px-5 pt-5">
                <div className="min-w-0 flex-1">
                  {title && <h2 className="text-[17px] font-semibold tracking-tight text-fg">{title}</h2>}
                  {description && <p className="mt-1 text-[13px] text-fg-muted">{description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-fg-subtle hover:bg-surface-2 hover:text-fg"
                >
                  <X size={15} strokeWidth={2} />
                </button>
              </header>
            )}
            <div className="flex-1 overflow-y-auto px-5 pb-5 pt-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
