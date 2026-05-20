"use client";

import { format, startOfMonth, endOfMonth } from "date-fns";
import { ReviewForm } from "@/components/reviews/review-form";

export default function MonthlyReview() {
  const start = startOfMonth(new Date());
  const periodStart = format(start, "yyyy-MM-dd");
  return (
    <>
      <header className="mb-6">
        <h2 className="text-[20px] font-semibold tracking-tight text-fg">Monthly review</h2>
        <p className="mt-1 text-[13px] text-fg-muted">
          {format(start, "MMMM yyyy")} · ends {format(endOfMonth(new Date()), "MMM d")}
        </p>
      </header>
      <ReviewForm
        kind="monthly"
        periodStart={periodStart}
        questions={[
          { key: "theme",     label: "Theme of the month",        hint: "If you had to name it, what was it?" },
          { key: "goals",     label: "Goal progress",              hint: "Which goals advanced? Which need rethinking?" },
          { key: "habits",    label: "Habits",                     hint: "Which streaks held? Which need a new approach?" },
          { key: "energy",    label: "Energy & focus",             hint: "What gave energy, what drained it?" },
          { key: "next",      label: "Next month's focus",         hint: "One outcome, one habit, one experiment." },
        ]}
      />
    </>
  );
}
