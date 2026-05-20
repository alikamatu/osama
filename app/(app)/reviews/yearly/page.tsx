"use client";

import { format, startOfYear } from "date-fns";
import { ReviewForm } from "@/components/reviews/review-form";

export default function YearlyReview() {
  const start = startOfYear(new Date());
  const periodStart = format(start, "yyyy-MM-dd");
  return (
    <>
      <header className="mb-6">
        <h2 className="text-[20px] font-semibold tracking-tight text-fg">Annual review</h2>
        <p className="mt-1 text-[13px] text-fg-muted">{format(start, "yyyy")} so far</p>
      </header>
      <ReviewForm
        kind="yearly"
        periodStart={periodStart}
        questions={[
          { key: "highlights",  label: "Highlights",            hint: "Three or four moments worth remembering." },
          { key: "shipped",     label: "What you shipped",      hint: "Goals achieved, projects delivered, milestones." },
          { key: "growth",      label: "Growth",                hint: "Where did you grow — skill, taste, character?" },
          { key: "regrets",     label: "Regrets / unfinished",  hint: "What didn't happen that should have?" },
          { key: "next-year",   label: "Next year's themes",    hint: "Two or three words for the year ahead." },
        ]}
      />
    </>
  );
}
