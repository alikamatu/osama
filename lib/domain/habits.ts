import { differenceInCalendarDays, format } from "date-fns";
import type { Habit } from "@/types/entities";

export function ymd(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return format(date, "yyyy-MM-dd");
}

/** Calendar-day streak length ending today (or yesterday if today isn't done). */
export function currentStreak(h: Habit, ref = new Date()): number {
  const today = ymd(ref);
  // Daily cadence supported here; weekly-target streak is "weeks hit target".
  if (h.cadence.kind === "daily" || h.cadence.kind === "custom") {
    let streak = 0;
    const cursor = new Date(ref);
    if (!h.checkins[today]) {
      cursor.setDate(cursor.getDate() - 1);
    }
    for (;;) {
      const key = ymd(cursor);
      if (!h.checkins[key]) break;
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }
  // weekly-target — return number of consecutive weeks where target met.
  return weeklyStreak(h, ref);
}

function weeklyStreak(h: Habit, ref: Date): number {
  if (h.cadence.kind !== "weekly-target") return 0;
  const target = h.cadence.perWeek;
  let streak = 0;
  const cursor = new Date(ref);
  for (;;) {
    let countInWeek = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(cursor);
      d.setDate(d.getDate() - i);
      if (h.checkins[ymd(d)]) countInWeek++;
    }
    if (countInWeek < target) break;
    streak++;
    cursor.setDate(cursor.getDate() - 7);
  }
  return streak;
}

export function bestStreak(h: Habit): number {
  const days = Object.keys(h.checkins).filter((k) => h.checkins[k]).sort();
  if (days.length === 0) return 0;
  let best = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const cur = new Date(days[i]);
    if (differenceInCalendarDays(cur, prev) === 1) {
      run++;
      best = Math.max(best, run);
    } else {
      run = 1;
    }
  }
  return best;
}

export function completionRate(h: Habit, windowDays = 30): number {
  const today = new Date();
  let hits = 0;
  let total = 0;
  for (let i = 0; i < windowDays; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = ymd(d);
    if (!isDueOn(h, d)) continue;
    total++;
    if (h.checkins[key]) hits++;
  }
  if (total === 0) return 0;
  return Math.round((hits / total) * 100);
}

export function isDueOn(h: Habit, d: Date): boolean {
  if (h.cadence.kind === "daily") return true;
  if (h.cadence.kind === "custom") return h.cadence.days.includes(d.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6);
  return true; // weekly-target: every day is a possible check-in
}

export function isDoneToday(h: Habit, ref = new Date()): boolean {
  return Boolean(h.checkins[ymd(ref)]);
}

/** Builds a year-long heatmap grid: 53 weeks × 7 days, anchored on today. */
export function buildYearGrid(h: Habit, ref = new Date()): Array<{ ymd: string; done: boolean; date: Date } | null> {
  const cells: Array<{ ymd: string; done: boolean; date: Date } | null> = [];
  const end = new Date(ref);
  end.setHours(0, 0, 0, 0);
  // Walk back 53 weeks aligned to weekday
  const start = new Date(end);
  start.setDate(start.getDate() - 52 * 7 - end.getDay());
  const cursor = new Date(start);
  while (cursor <= end) {
    const key = ymd(cursor);
    cells.push({ ymd: key, done: Boolean(h.checkins[key]), date: new Date(cursor) });
    cursor.setDate(cursor.getDate() + 1);
  }
  // Pad trailing slots to complete the last week column
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
