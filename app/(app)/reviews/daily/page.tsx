"use client";

import { format } from "date-fns";
import { ReviewForm } from "@/components/reviews/review-form";
import { useStore } from "@/lib/store";
import { isDoneToday, ymd } from "@/lib/domain/habits";

export default function DailyReview() {
  const today = format(new Date(), "yyyy-MM-dd");
  return (
    <>
      <header className="mb-6">
        <h2 className="text-[20px] font-semibold tracking-tight text-fg">Evening shutdown</h2>
        <p className="mt-1 text-[13px] text-fg-muted">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
      </header>
      <ReviewForm
        kind="daily"
        periodStart={today}
        questions={[
          { key: "wins",      label: "Wins",       hint: "What landed today? Even small things." },
          { key: "stuck",     label: "Stuck",      hint: "What didn't move, and why?" },
          { key: "gratitude", label: "Gratitude",  hint: "One thing you appreciated today." },
          { key: "tomorrow",  label: "Tomorrow",   hint: "One important thing to do tomorrow." },
        ]}
        aiDraft={() => {
          const s = useStore.getState();
          const today = ymd(new Date());
          const completed = s.tasks.filter((t) => t.completedAt && ymd(t.completedAt) === today).map((t) => t.title);
          const habitsDone = s.habits.filter((h) => isDoneToday(h)).map((h) => h.title);
          return {
            wins:      [...completed, ...habitsDone].slice(0, 3).map((x) => `- ${x}`).join("\n") || "—",
            stuck:     "Look at any task you moved between lists today.",
            gratitude: "",
            tomorrow:  s.tasks.find((t) => t.priority === "high" && t.status !== "done")?.title ?? "",
          };
        }}
      />
    </>
  );
}
