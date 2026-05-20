"use client";

import { motion } from "motion/react";

/**
 * Decorative animated SVG composition shown beside the auth form on desktop.
 * Uses themed CSS variables only — no fixed colors.
 */
export function AuthVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-surface-1">
      <svg
        viewBox="0 0 600 800"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="auth-band" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="var(--accent)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Concentric orbital rings — drawn-on stroke */}
        {[120, 200, 280, 360].map((r, i) => (
          <motion.circle
            key={r}
            cx="300" cy="380" r={r}
            fill="none"
            stroke="var(--surface-3)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.12 }}
          />
        ))}

        {/* Accent arc */}
        <motion.path
          d="M 80 380 A 220 220 0 0 1 520 380"
          fill="none"
          stroke="url(#auth-band)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
        />

        {/* Orbiting dot */}
        <motion.g
          style={{ originX: "300px", originY: "380px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="580" cy="380" r="6" fill="var(--accent)" />
        </motion.g>
        <motion.g
          style={{ originX: "300px", originY: "380px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="20" cy="380" r="4" fill="var(--fg-muted)" opacity="0.6" />
        </motion.g>

        {/* Streak bars at bottom — visual cue toward the product (habits) */}
        <g transform="translate(120, 600)">
          {Array.from({ length: 9 }).map((_, i) => {
            const heights = [42, 26, 60, 38, 70, 30, 54, 48, 36];
            return (
              <motion.rect
                key={i}
                x={i * 40}
                width={20}
                height={heights[i]}
                y={80 - heights[i]}
                rx={4}
                fill={i === 4 ? "var(--accent)" : "var(--surface-3)"}
                initial={{ height: 0, y: 80 }}
                animate={{ height: heights[i], y: 80 - heights[i] }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.7 + i * 0.05 }}
              />
            );
          })}
        </g>

        {/* Floating check pill */}
        <motion.g
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.0 }}
        >
          <rect x="360" y="180" width="170" height="44" rx="22" fill="var(--surface-2)" />
          <circle cx="386" cy="202" r="10" fill="var(--positive)" />
          <path d="M381 202 l4 4 l8 -8" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <text x="406" y="207" fontFamily="ui-sans-serif, system-ui" fontSize="14" fontWeight="500" fill="var(--fg)">
            Morning run · 12 day streak
          </text>
        </motion.g>

        <motion.g
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.15 }}
        >
          <rect x="70" y="260" width="200" height="44" rx="22" fill="var(--surface-2)" />
          <circle cx="96" cy="282" r="10" fill="var(--accent)" />
          <text x="116" y="287" fontFamily="ui-sans-serif, system-ui" fontSize="14" fontWeight="500" fill="var(--fg)">
            Review weekly goals
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
