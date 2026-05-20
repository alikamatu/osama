"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Align = "start" | "end" | "center";

/**
 * A lightweight anchored popover. Renders inside the document, positioned by
 * the anchor element's bounding rect on open. Re-positions on scroll/resize.
 *
 * - Click outside or press Escape to close.
 * - Tab is allowed (we don't trap focus — popovers are short-lived).
 */
export function Popover({
  open, onOpenChange, anchor, align = "start", width, children, sideOffset = 6, className,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  anchor: HTMLElement | null;
  align?: Align;
  width?: number | "anchor";
  sideOffset?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    if (!open || !anchor) return;
    function reposition() {
      const a = anchor!.getBoundingClientRect();
      const popW = ref.current?.offsetWidth ?? 280;
      const popH = ref.current?.offsetHeight ?? 320;

      let top = a.bottom + sideOffset;
      let left = a.left;
      if (align === "end")    left = a.right - popW;
      if (align === "center") left = a.left + a.width / 2 - popW / 2;

      // Clamp into viewport.
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (left + popW > vw - 8) left = vw - popW - 8;
      if (left < 8) left = 8;
      if (top + popH > vh - 8) top = a.top - popH - sideOffset;
      if (top < 8) top = 8;

      const w = width === "anchor" ? a.width : width;
      setStyle({
        position: "fixed",
        top: Math.round(top),
        left: Math.round(left),
        width: w,
        zIndex: 60,
      });
    }
    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, anchor, align, width, sideOffset]);

  // Close on outside click / escape.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (ref.current?.contains(t)) return;
      if (anchor?.contains(t)) return;
      onOpenChange(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); onOpenChange(false); }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, anchor, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="dialog"
          style={style}
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className={
            "overflow-hidden rounded-xl bg-surface-2 shadow-[0_8px_24px_-12px_rgba(0,0,0,.45)] " +
            (className ?? "")
          }
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
