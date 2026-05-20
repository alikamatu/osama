"use client";

import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { useStore } from "@/lib/store";
import { Empty } from "@/components/ui/page";
import { NotebookPen } from "lucide-react";

export default function ReviewsIndex() {
  const reviews = useStore((s) => s.reviews);
  if (reviews.length === 0) {
    return <Empty icon={NotebookPen} title="No reviews yet" body="Start with today's evening shutdown — it takes 3 minutes." action={<Link href="/reviews/daily" className="inline-flex h-10 items-center rounded-lg bg-accent px-4 text-[13px] font-semibold text-accent-fg">Start daily</Link>} />;
  }
  const sorted = [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return (
    <ul className="space-y-2">
      {sorted.map((r) => (
        <li key={r.id}>
          <Link href={`/reviews/${r.id}`} className="block rounded-2xl bg-surface-1 p-4 hover:bg-surface-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold capitalize text-fg">{r.kind} review</h3>
              <span className="text-[11px] text-fg-subtle">{formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}</span>
            </div>
            <p className="mt-1 text-[12px] text-fg-muted">Period: {format(new Date(r.periodStart), "PPP")}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
