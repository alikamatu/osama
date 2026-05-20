"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Plus } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useStore } from "@/lib/store";
import { PageHeader, PageBody, Empty } from "@/components/ui/page";
import { Button } from "@/components/ui/button";

export default function AssistantIndex() {
  const router = useRouter();
  const params = useSearchParams();
  const conversations = useStore((s) => s.conversations);
  const add = useStore((s) => s.addConversation);
  const appendMessage = useStore((s) => s.appendMessage);

  useEffect(() => {
    const q = params.get("q");
    if (q) {
      const c = add(q.length > 32 ? `${q.slice(0, 32)}…` : q);
      appendMessage(c.id, { role: "user", content: q });
      router.replace(`/assistant/${c.id}`);
    }
  }, [params, add, appendMessage, router]);

  function newThread() {
    const c = add();
    router.push(`/assistant/${c.id}`);
  }

  return (
    <>
      <PageHeader
        icon={Sparkles}
        title="Assistant"
        subtitle="Chat that knows your tasks, habits, and goals."
        actions={<Button leadingIcon={<Plus size={16} strokeWidth={2} />} onClick={newThread}>New chat</Button>}
      />
      <PageBody>
        {conversations.length === 0 ? (
          <Empty icon={Sparkles} title="No conversations yet" body="Ask for a daily plan, a weekly summary, or break a goal down." action={<Button onClick={newThread}>Start chat</Button>} />
        ) : (
          <ul className="space-y-2">
            {conversations.map((c) => (
              <li key={c.id}>
                <Link href={`/assistant/${c.id}`} className="block rounded-2xl bg-surface-1 p-4 hover:bg-surface-2">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="line-clamp-1 text-[15px] font-semibold text-fg">{c.title}</h3>
                    <span className="shrink-0 text-[11px] text-fg-subtle">{formatDistanceToNow(new Date(c.updatedAt), { addSuffix: true })}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-[12.5px] text-fg-muted">
                    {c.messages[c.messages.length - 1]?.content ?? "Empty thread"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PageBody>
    </>
  );
}
