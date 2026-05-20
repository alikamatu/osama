"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimatedDemo } from "./animated-demo";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface-1 px-3 py-1 text-[12px] font-medium text-fg-muted"
          >
            <Sparkles size={12} strokeWidth={2} />
            With an AI that knows your context
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="mt-5 text-[44px] font-semibold leading-[1.05] tracking-[-0.02em] text-fg md:text-[56px]"
          >
            A calm place for your daily plan.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-fg-muted"
          >
            Tasks, habits, goals, and reviews — together with an assistant that
            plans your day, breaks down work, and helps you reflect.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/signin"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-5 text-[15px] font-semibold text-accent-fg hover:brightness-110"
            >
              Get started — free
              <ArrowRight size={16} strokeWidth={2.25} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center rounded-xl bg-surface-1 px-5 text-[15px] font-medium text-fg-muted hover:bg-surface-2 hover:text-fg"
            >
              See pricing
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-10 flex items-center gap-3"
          >
            <span className="text-[11px] uppercase tracking-[0.16em] text-fg-subtle">Theme</span>
            <ThemeSwitcher />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.985, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative"
        >
          <AnimatedDemo />
        </motion.div>
      </div>
    </section>
  );
}
