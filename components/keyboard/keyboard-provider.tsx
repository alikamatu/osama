"use client";

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChord, useCmdK, useHotkey } from "@/hooks/use-hotkeys";
import { CommandPalette } from "@/components/command/palette";
import { Cheatsheet } from "@/components/keyboard/cheatsheet";
import { QuickAdd } from "@/components/today/quick-add";
import { FocusMode } from "@/components/focus/focus-mode";
import { useStore } from "@/lib/store";

type Ctx = {
  openPalette: () => void;
  openCheatsheet: () => void;
  openQuickAdd: () => void;
  openFocus: () => void;
};
const KeyboardContext = createContext<Ctx | null>(null);

const RECENT_KEY = "osama:recent-routes";
const RECENT_MAX = 6;

export function KeyboardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [cheatsheetOpen, setCheatsheetOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [focusOpen, setFocusOpen] = useState(false);
  const addTask = useStore((s) => s.addTask);
  const addHabit = useStore((s) => s.addHabit);
  const addNote = useStore((s) => s.addNote);
  const addGoal = useStore((s) => s.addGoal);

  useEffect(() => {
    function onQuickAddEvent(e: Event) {
      const detail = (e as CustomEvent<{ kind: string; title: string }>).detail;
      if (!detail?.title?.trim()) return;
      if (detail.kind === "task" || detail.kind === "inbox") {
        addTask({ title: detail.title, inbox: detail.kind === "task" });
      } else if (detail.kind === "habit") {
        addHabit({ title: detail.title });
      } else if (detail.kind === "goal") {
        addGoal({ title: detail.title, horizon: "quarter" });
      } else {
        addNote({ title: detail.title });
      }
    }

    window.addEventListener("osama:quickadd", onQuickAddEvent);
    return () => window.removeEventListener("osama:quickadd", onQuickAddEvent);
  }, [addTask, addHabit, addNote, addGoal]);

  // Track recent routes for the palette.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname;
    try {
      const raw = window.localStorage.getItem(RECENT_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      const next = [path, ...list.filter((p) => p !== path)].slice(0, RECENT_MAX);
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  useCmdK(() => setPaletteOpen((v) => !v));
  useHotkey("?", () => setCheatsheetOpen((v) => !v), { mods: { shift: true } });
  useHotkey("n", () => setQuickOpen(true));
  useHotkey("f", () => setFocusOpen(true));
  useHotkey("Escape", () => {
    setPaletteOpen(false);
    setCheatsheetOpen(false);
    setFocusOpen(false);
  });

  // g-chord navigation
  useChord("g", {
    t: () => router.push("/today"),
    i: () => router.push("/inbox"),
    k: () => router.push("/tasks"),
    p: () => router.push("/projects"),
    h: () => router.push("/habits"),
    g: () => router.push("/goals"),
    c: () => router.push("/calendar"),
    r: () => router.push("/reviews"),
    n: () => router.push("/notes"),
    j: () => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const j = useStore.getState().getOrCreateTodaysJournal(tz);
      router.push(`/notes/${j.id}`);
    },
    s: () => router.push("/stats"),
    a: () => router.push("/assistant"),
    ",": () => router.push("/settings/profile"),
  });

  const value = useMemo<Ctx>(
    () => ({
      openPalette: () => setPaletteOpen(true),
      openCheatsheet: () => setCheatsheetOpen(true),
      openQuickAdd: () => setQuickOpen(true),
      openFocus: () => setFocusOpen(true),
    }),
    [],
  );

  const handleQuickAdd = useCallback((kind: string, title: string) => {
    window.dispatchEvent(
      new CustomEvent("osama:quickadd", { detail: { kind, title } }),
    );
  }, []);

  return (
    <KeyboardContext.Provider value={value}>
      {children}
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <Cheatsheet open={cheatsheetOpen} onOpenChange={setCheatsheetOpen} />
      <QuickAdd open={quickOpen} onOpenChange={setQuickOpen} onCreate={handleQuickAdd} />
      <FocusMode open={focusOpen} onClose={() => setFocusOpen(false)} />
    </KeyboardContext.Provider>
  );
}

export function useKeyboard() {
  const ctx = useContext(KeyboardContext);
  if (!ctx) throw new Error("useKeyboard must be used inside <KeyboardProvider>");
  return ctx;
}

export function getRecentRoutes(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
