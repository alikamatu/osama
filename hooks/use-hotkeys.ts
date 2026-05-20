"use client";

import { useEffect, useRef } from "react";

type Handler = (e: KeyboardEvent) => void;

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if (el.isContentEditable) return true;
  return false;
}

/**
 * Register a single-key hotkey (e.g. "?" or "Escape") with mod/typing guards.
 */
export function useHotkey(
  key: string,
  handler: Handler,
  opts?: { allowInInputs?: boolean; mods?: { meta?: boolean; ctrl?: boolean; shift?: boolean; alt?: boolean } },
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== key) return;
      if (!opts?.allowInInputs && isTyping(e.target)) return;
      if (opts?.mods?.meta && !e.metaKey) return;
      if (opts?.mods?.ctrl && !e.ctrlKey) return;
      if (opts?.mods?.shift && !e.shiftKey) return;
      if (opts?.mods?.alt && !e.altKey) return;
      handlerRef.current(e);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, opts?.allowInInputs, opts?.mods?.meta, opts?.mods?.ctrl, opts?.mods?.shift, opts?.mods?.alt]);
}

/**
 * ⌘K / Ctrl+K — works on both mac and windows/linux.
 */
export function useCmdK(handler: Handler) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        ref.current(e);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

/**
 * Chord like "g t" — press leader then follower within window.
 * Map keys: { t: () => router.push("/today"), ... }
 */
export function useChord(leader: string, map: Record<string, Handler>, windowMs = 1200) {
  const armed = useRef<number | null>(null);
  const mapRef = useRef(map);
  mapRef.current = map;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isTyping(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const now = Date.now();
      if (armed.current && now - armed.current < windowMs) {
        const fn = mapRef.current[e.key.toLowerCase()];
        armed.current = null;
        if (fn) {
          e.preventDefault();
          fn(e);
        }
        return;
      }
      if (e.key.toLowerCase() === leader) {
        armed.current = now;
      } else {
        armed.current = null;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leader, windowMs]);
}
