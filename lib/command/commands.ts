import {
  Sun, Inbox, CheckSquare, Folder, Repeat, Flag, CalendarDays, NotebookPen,
  LineChart, Sparkles, Settings, LogOut, Plus, Palette, Search, type LucideIcon,
} from "lucide-react";
import { THEMES, type ThemeId } from "@/lib/theme/themes";

export type CommandGroup = "Navigation" | "Actions" | "Theme" | "Recent" | "Ask";

export type Command = {
  id: string;
  group: CommandGroup;
  label: string;
  hint?: string;
  shortcut?: string[];
  icon: LucideIcon;
  /** Either a path (string) or an action key the host runs. */
  href?: string;
  action?: "new-task" | "new-habit" | "new-goal" | "open-cheatsheet" | "sign-out" | "set-theme";
  payload?: string;
  keywords?: string[];
};

export const NAV_COMMANDS: Command[] = [
  { id: "nav-today",    group: "Navigation", label: "Go to Today",     icon: Sun,         href: "/today",     shortcut: ["g","t"] },
  { id: "nav-inbox",    group: "Navigation", label: "Go to Inbox",     icon: Inbox,       href: "/inbox",     shortcut: ["g","i"] },
  { id: "nav-tasks",    group: "Navigation", label: "Go to Tasks",     icon: CheckSquare, href: "/tasks",     shortcut: ["g","k"] },
  { id: "nav-projects", group: "Navigation", label: "Go to Projects",  icon: Folder,      href: "/projects",  shortcut: ["g","p"] },
  { id: "nav-habits",   group: "Navigation", label: "Go to Habits",    icon: Repeat,      href: "/habits",    shortcut: ["g","h"] },
  { id: "nav-goals",    group: "Navigation", label: "Go to Goals",     icon: Flag,        href: "/goals",     shortcut: ["g","g"] },
  { id: "nav-calendar", group: "Navigation", label: "Go to Calendar",  icon: CalendarDays,href: "/calendar",  shortcut: ["g","c"] },
  { id: "nav-reviews",  group: "Navigation", label: "Go to Reviews",   icon: NotebookPen, href: "/reviews",   shortcut: ["g","r"] },
  { id: "nav-stats",    group: "Navigation", label: "Go to Stats",     icon: LineChart,   href: "/stats",     shortcut: ["g","s"] },
  { id: "nav-asst",     group: "Navigation", label: "Go to Assistant", icon: Sparkles,    href: "/assistant", shortcut: ["g","a"] },
  { id: "nav-settings", group: "Navigation", label: "Open Settings",   icon: Settings,    href: "/settings/profile", shortcut: ["g",","] },
];

export const ACTION_COMMANDS: Command[] = [
  { id: "act-new-task",   group: "Actions", label: "New task",            icon: Plus,    action: "new-task",   keywords: ["create","add"], shortcut: ["N"] },
  { id: "act-new-habit",  group: "Actions", label: "New habit",           icon: Repeat,  action: "new-habit",  keywords: ["create"] },
  { id: "act-new-goal",   group: "Actions", label: "New goal",            icon: Flag,    action: "new-goal",   keywords: ["create"] },
  { id: "act-cheatsheet", group: "Actions", label: "Show shortcuts",      icon: Search,  action: "open-cheatsheet", keywords: ["help","keys"], shortcut: ["?"] },
  { id: "act-signout",    group: "Actions", label: "Sign out",            icon: LogOut,  action: "sign-out",   keywords: ["logout"] },
];

export function themeCommands(): Command[] {
  return THEMES.map((t) => ({
    id: `theme-${t.id}`,
    group: "Theme" as CommandGroup,
    label: `Switch theme · ${t.label}`,
    icon: Palette,
    action: "set-theme",
    payload: t.id,
    keywords: ["theme","color","appearance", t.id as ThemeId],
  }));
}

export function allCommands(): Command[] {
  return [...NAV_COMMANDS, ...ACTION_COMMANDS, ...themeCommands()];
}

/** Cheap subsequence fuzzy match. Returns a score (lower = better) or -1 if no match. */
export function fuzzyScore(query: string, target: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return t.indexOf(q);
  let qi = 0;
  let last = -1;
  let spread = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      if (last >= 0) spread += i - last - 1;
      last = i;
      qi++;
    }
  }
  if (qi !== q.length) return -1;
  return 1000 + spread;
}
