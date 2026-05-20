"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useStore } from "@/lib/store";

export default function SavedReview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const review = useStore((s) => s.reviews.find((r) => r.id === id));
  if (!review) return (
    <div>
      <Link href="/reviews" className="inline-flex items-center gap-1 text-[13px] text-accent">
        <ArrowLeft size={14} /> All reviews
      </Link>
      <p className="mt-4 text-fg-muted">Review not found.</p>
    </div>
  );

  return (
    <>
      <Link href="/reviews" className="inline-flex items-center gap-1 text-[12.5px] text-fg-subtle hover:text-fg">
        <ArrowLeft size={13} strokeWidth={2} /> All reviews
      </Link>
      <header className="mt-4 mb-6">
        <h2 className="text-[20px] font-semibold capitalize tracking-tight text-fg">{review.kind} review</h2>
        <p className="mt-1 text-[13px] text-fg-muted">Period: {format(new Date(review.periodStart), "PPP")} · Saved {format(new Date(review.createdAt), "PPP p")}</p>
      </header>
      <div className="space-y-4">
        {Object.entries(review.content).map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-surface-1 p-5">
            <h3 className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-fg-subtle">{k.replace(/-/g, " ")}</h3>
            <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-fg">{v || "—"}</p>
          </div>
        ))}
      </div>
    </>
  );
}
