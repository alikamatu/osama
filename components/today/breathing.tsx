"use client";

import { useState, useEffect } from "react";
import { Wind, Play, Square } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils/cn";

type Phase = "idle" | "inhale" | "hold1" | "exhale" | "hold2";

export function BreathingWidget() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (phase === "idle") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          if (phase === "inhale") {
            setPhase("hold1");
            return 7; // Hold for 7s
          } else if (phase === "hold1") {
            setPhase("exhale");
            return 8; // Exhale for 8s
          } else if (phase === "exhale") {
            setPhase("inhale");
            return 4; // Inhale for 4s (skipping hold2 for simplicity in 4-7-8)
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  function start() {
    setPhase("inhale");
    setTimeLeft(4);
  }

  function stop() {
    setPhase("idle");
    setTimeLeft(0);
  }

  const getPhaseText = () => {
    switch (phase) {
      case "idle": return "Ready to relax?";
      case "inhale": return "Breathe in...";
      case "hold1": return "Hold...";
      case "exhale": return "Breathe out...";
      default: return "";
    }
  };

  const getScale = () => {
    if (phase === "idle") return 1;
    if (phase === "inhale" || phase === "hold1") return 1.5;
    return 1; // exhale goes back to 1
  };

  const getDuration = () => {
    if (phase === "inhale") return 4;
    if (phase === "exhale") return 8;
    return 1; // For holds
  };

  return (
    <div className="rounded-2xl bg-surface-1 p-5 relative overflow-hidden">
      <div className="flex items-baseline justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <Wind size={16} strokeWidth={2} className="text-accent" />
          <h2 className="text-[15px] font-semibold text-fg">Mindfulness</h2>
        </div>
        <span className="text-[11px] uppercase tracking-[0.14em] text-fg-subtle">4-7-8 Breathing</span>
      </div>

      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative grid h-24 w-24 place-items-center mb-6">
          <motion.div
            className="absolute inset-0 rounded-full bg-accent/20"
            animate={{ scale: getScale() }}
            transition={{ 
              duration: getDuration(), 
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute inset-2 rounded-full bg-accent/40"
            animate={{ scale: getScale() }}
            transition={{ 
              duration: getDuration(), 
              ease: "easeInOut",
              delay: 0.1
            }}
          />
          <div className="absolute inset-4 rounded-full bg-accent flex items-center justify-center text-accent-fg font-mono font-semibold text-lg shadow-lg">
            <AnimatePresence mode="wait">
              <motion.span
                key={timeLeft}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.2 }}
              >
                {phase === "idle" ? <Wind size={20} strokeWidth={2} /> : timeLeft}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        
        <div className="text-[14px] font-medium text-fg mb-6 min-h-[20px]">
          {getPhaseText()}
        </div>

        <button
          onClick={phase === "idle" ? start : stop}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-colors",
            phase === "idle" 
              ? "bg-surface-2 text-fg hover:bg-surface-3"
              : "bg-surface-2 text-fg-muted hover:text-fg hover:bg-surface-3"
          )}
        >
          {phase === "idle" ? (
            <><Play size={14} strokeWidth={2.5} /> Start Exercise</>
          ) : (
            <><Square size={14} strokeWidth={2.5} /> Stop</>
          )}
        </button>
      </div>
    </div>
  );
}
