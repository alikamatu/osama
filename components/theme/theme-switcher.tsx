"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { THEMES, type ThemeId } from "@/lib/theme/themes";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils/cn";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  return (
    <div className={cn("flex items-center gap-1.5", className)} role="radiogroup" aria-label="Theme">
      {THEMES.map((t) => {
        const active = theme === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={t.label}
            title={t.label}
            onClick={() => setTheme(t.id as ThemeId)}
            className={cn(
              "group relative h-7 w-7 rounded-full p-[3px] outline-none",
              "transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "hover:scale-110 focus-visible:scale-110",
            )}
          >
            <span
              className="block h-full w-full rounded-full"
              style={{
                background: `conic-gradient(from 220deg, ${t.swatch[0]} 0 50%, ${t.swatch[1]} 50% 100%)`,
              }}
            />
            {active && (
              <motion.span
                layoutId="theme-active-ring"
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{ boxShadow: "inset 0 0 0 2px var(--accent)" }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {active && (
              <span className="pointer-events-none absolute inset-0 grid place-items-center text-fg">
                <Check size={12} strokeWidth={2.5} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
