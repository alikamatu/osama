"use client";

import { motion } from "motion/react";

/**
 * Decorative SVG background for the chat surface.
 * Topographic concentric rings + dot grid + subtle drifting orbs.
 * Themed via CSS variables (--surface-2 / --accent / --fg-subtle).
 * No blur, no glass — per the project's golden rules.
 */
export function ChatBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 800"
      >
        <defs>
          <pattern id="cairn-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="var(--fg-subtle)" opacity="0.18" />
          </pattern>

          <radialGradient id="cairn-vignette" cx="50%" cy="40%" r="80%">
            <stop offset="0%"   stopColor="var(--accent)" stopOpacity="0.06" />
            <stop offset="60%"  stopColor="var(--accent)" stopOpacity="0.0" />
            <stop offset="100%" stopColor="var(--bg)"     stopOpacity="0.0" />
          </radialGradient>

          <linearGradient id="cairn-fade-top" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="var(--bg)" stopOpacity="0.85" />
            <stop offset="20%"  stopColor="var(--bg)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cairn-fade-bottom" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%"   stopColor="var(--bg)" stopOpacity="0.9" />
            <stop offset="22%"  stopColor="var(--bg)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Dot grid base */}
        <rect width="100%" height="100%" fill="url(#cairn-dots)" />

        {/* Soft accent vignette */}
        <rect width="100%" height="100%" fill="url(#cairn-vignette)" />

        {/* Topographic rings — top-left, drifting */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: [0, -8, 0, 6, 0], y: [0, -6, 0, 4, 0] }}
          transition={{
            opacity: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            x: { duration: 28, ease: "easeInOut", repeat: Infinity },
            y: { duration: 32, ease: "easeInOut", repeat: Infinity },
          }}
          style={{ transformOrigin: "120px 120px" }}
        >
          {[60, 110, 160, 210, 260, 310].map((r, i) => (
            <circle
              key={r}
              cx="120" cy="120" r={r}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1"
              opacity={0.05 - i * 0.005}
            />
          ))}
        </motion.g>

        {/* Topographic rings — bottom-right, drifting in counter-phase */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: [0, 8, 0, -6, 0], y: [0, 6, 0, -4, 0] }}
          transition={{
            opacity: { duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
            x: { duration: 34, ease: "easeInOut", repeat: Infinity },
            y: { duration: 30, ease: "easeInOut", repeat: Infinity },
          }}
          style={{ transformOrigin: "1080px 680px" }}
        >
          {[50, 95, 140, 185, 230, 275].map((r, i) => (
            <circle
              key={r}
              cx="1080" cy="680" r={r}
              fill="none"
              stroke="var(--fg-subtle)"
              strokeWidth="1"
              opacity={0.06 - i * 0.006}
            />
          ))}
        </motion.g>

        {/* Tiny orbiting accent dot — bottom-right */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "1080px 680px" }}
        >
          <circle cx="1080" cy="500" r="2.5" fill="var(--accent)" opacity="0.4" />
        </motion.g>

        {/* Top + bottom fades so messages don't read over the texture */}
        <rect width="100%" height="100%" fill="url(#cairn-fade-top)" />
        <rect width="100%" height="100%" fill="url(#cairn-fade-bottom)" />
      </svg>
    </div>
  );
}
