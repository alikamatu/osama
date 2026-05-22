"use client";

import { motion } from "motion/react";

/**
 * Three layered SVG wave bands at the bottom of the focus surface.
 * Each band has its own path, opacity, vertical offset, and translation
 * speed so they drift past each other for an organic feel.
 *
 * The width is 2× the viewBox so we can translate it -50% before looping
 * without a seam.
 */
const WAVE_A = "M0,140 C160,80 320,200 480,140 C640,80 800,200 960,140 C1120,80 1280,200 1440,140 L1440,260 L0,260 Z";
const WAVE_B = "M0,160 C200,110 400,210 600,160 C800,110 1000,210 1200,160 C1400,110 1600,210 1800,160 L1800,260 L0,260 Z";
const WAVE_C = "M0,180 C220,140 440,220 660,180 C880,140 1100,220 1320,180 C1540,140 1760,220 1980,180 L1980,260 L0,260 Z";

export function FocusWaves() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[44vh] overflow-hidden"
    >
      <motion.svg
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-full w-[200%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <defs>
          <linearGradient id="fw-fade-a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="var(--accent)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.16" />
          </linearGradient>
          <linearGradient id="fw-fade-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="var(--accent)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.10" />
          </linearGradient>
          <linearGradient id="fw-fade-c" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="var(--fg)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--fg)" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {/* Back wave — slowest, lowest opacity */}
        <motion.path
          d={WAVE_C}
          fill="url(#fw-fade-c)"
          animate={{ x: [0, -1440] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        />

        {/* Mid wave */}
        <motion.path
          d={WAVE_B}
          fill="url(#fw-fade-b)"
          animate={{ x: [0, -1440] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        {/* Front wave — fastest, most prominent */}
        <motion.path
          d={WAVE_A}
          fill="url(#fw-fade-a)"
          animate={{ x: [0, -1440] }}
          transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
        />
      </motion.svg>
    </div>
  );
}
