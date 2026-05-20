"use client";

import { motion } from "motion/react";
import { useTheme } from "@/components/theme/theme-provider";
import { THEMES } from "@/lib/theme/themes";
import { cn } from "@/lib/utils/cn";

export function AppearancePanel() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {THEMES.map((t) => {
        const active = theme === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id)}
            className={cn(
              "relative overflow-hidden rounded-xl bg-surface-2 p-4 text-left",
              "transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.01]",
            )}
            aria-pressed={active}
          >
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-fg">{t.label}</span>
              <span
                className="h-6 w-12 rounded-full"
                style={{ background: `linear-gradient(90deg, ${t.swatch[0]} 0 50%, ${t.swatch[1]} 50% 100%)` }}
              />
            </div>
            <div className="mt-4 flex gap-1.5">
              <span className="h-2 flex-1 rounded-full" style={{ background: t.swatch[0] }} />
              <span className="h-2 w-12 rounded-full" style={{ background: t.swatch[1] }} />
              <span className="h-2 flex-[2] rounded-full" style={{ background: t.swatch[0], opacity: 0.6 }} />
            </div>
            {active && (
              <motion.span
                layoutId="settings-theme-active"
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{ boxShadow: "inset 0 0 0 2px var(--accent)" }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
