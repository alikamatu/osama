"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoalFormModal } from "@/components/goals/goal-form";

export default function NewGoal() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  useEffect(() => { if (!open) router.replace("/goals"); }, [open, router]);
  return <GoalFormModal open={open} onOpenChange={setOpen} onCreated={(g) => router.replace(`/goals/${g.id}`)} />;
}
