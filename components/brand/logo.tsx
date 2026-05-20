"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";

export function Logo({ size = 28, withWordmark = false, className }: {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        initial={{ rotate: -8, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="o-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%"  stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <motion.path
          d="M16 3.5 A12.5 12.5 0 1 1 16 28.5"
          stroke="url(#o-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        />
        <motion.circle
          cx="16" cy="16" r="3.25"
          fill="var(--accent)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.svg>
      {withWordmark && (
        <span className="select-none text-[15px] font-semibold tracking-tight text-fg">
          cairn
        </span>
      )}
    </div>
  );
}
