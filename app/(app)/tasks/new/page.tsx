"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKeyboard } from "@/components/keyboard/keyboard-provider";

export default function NewTaskPage() {
  const router = useRouter();
  const { openQuickAdd } = useKeyboard();
  useEffect(() => {
    openQuickAdd();
    router.replace("/tasks");
  }, [openQuickAdd, router]);
  return null;
}
