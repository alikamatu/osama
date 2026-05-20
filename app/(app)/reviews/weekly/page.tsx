"use client";

import { format, startOfWeek, endOfWeek } from "date-fns";
import { ReviewForm } from "@/components/reviews/review-form";
import { useStore } from "@/lib/store";

export default function WeeklyReview() {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });
  const periodStart = format(start, "yyyy-MM-dd");
  return (
    <>
      <header className="mb-6">
        <h2 className="text-[20px] font-semibold tracking-tight text-fg">Weekly review</h2>
        <p className="mt-1 text-[13px] text-fg-muted">
          Week of {format(start, "MMM d")} – {format(end, "MMM d, yyyy")}
        </p>
      </header>
      <ReviewForm
        kind="weekly"
        periodStart={periodStart}
        questions={[
          { key: "moved",   label: "What moved?",         hint: "Tasks completed, milestones crossed, conversations advanced." },
          { key: "stalled", label: "What stalled?",        hint: "Where did energy or momentum drop?" },
          { key: "lessons", label: "Lessons",              hint: "What did you learn — about the work or yourself?" },
          { key: "next",    label: "Next week's one big thing", hint: "If one thing happens, it's a great week." },
        ]}
        aiDraft={() => {
          const s = useStore.getState();
          const inWeek = (iso?: string | null) => iso ? new Date(iso) >= start && new Date(iso) <= end : false;
          const done = s.tasks.filter((t) => inWeek(t.completedAt));
          const open = s.tasks.filter((t) => t.status !== "done" && t.priority === "high");
          return {
            moved:   done.slice(0, 5).map((t) => `- ${t.title}`).join("\n") || "—",
            stalled: open.slice(0, 5).map((t) => `- ${t.title} (still open)`).join("\n") || "—",
            lessons: "",
            next:    open[0]?.title ?? "",
          };
        }}
      />
    </>
  );
}
