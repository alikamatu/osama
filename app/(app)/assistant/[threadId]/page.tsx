"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Sparkles, Trash2, Square } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "@/lib/store";
import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/utils/cn";
import { buildGoalCtx, buildHabitCtx, buildTaskCtx, streamPost } from "@/lib/ai/client";
import { useConfirm } from "@/components/ui/confirm";

const SLASH_HINTS = ["/plan", "/review", "/clear-inbox"];

export default function ChatThread({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = use(params);
  const router = useRouter();
  const confirm = useConfirm();
  const convo = useStore((s) => s.conversations.find((c) => c.id === threadId));
  const conversations = useStore((s) => s.conversations);
  const append = useStore((s) => s.appendMessage);
  const rename = useStore((s) => s.renameConversation);
  const remove = useStore((s) => s.deleteConversation);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [pendingText, setPendingText] = useState("");
  const abortRef = useRef<(() => void) | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [convo?.messages.length, pendingText]);
  useEffect(() => () => { abortRef.current?.(); }, []);

  if (!convo) return (
    <div className="px-6 pt-10 md:px-10">
      <Link href="/assistant" className="inline-flex items-center gap-1 text-[13px] text-accent">
        <ArrowLeft size={14} /> Conversations
      </Link>
      <p className="mt-4 text-fg-muted">Conversation not found.</p>
    </div>
  );

  function buildContext() {
    const s = useStore.getState();
    const projById = new Map(s.projects.map((p) => [p.id, p]));
    return {
      tasks:  s.tasks.slice(0, 60).map((t) => buildTaskCtx(t, t.projectId ? projById.get(t.projectId)?.name : null)),
      habits: s.habits.map(buildHabitCtx),
      goals:  s.goals.slice(0, 20).map(buildGoalCtx),
    };
  }

  function send() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    append(convo!.id, { role: "user", content: text });
    if (convo!.messages.length === 0 && convo!.title === "New conversation") {
      rename(convo!.id, text.length > 36 ? `${text.slice(0, 36)}…` : text);
    }
    setPendingText("");
    setStreaming(true);

    const baseMessages = [
      ...convo!.messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content: text },
    ];

    abortRef.current = streamPost({
      url: "/api/ai/chat",
      body: { messages: baseMessages, context: buildContext() },
      onChunk: (_d, full) => setPendingText(full),
      onDone: (full) => {
        if (full.trim()) append(convo!.id, { role: "assistant", content: full });
        setPendingText("");
        setStreaming(false);
        abortRef.current = null;
      },
      onError: (msg) => {
        append(convo!.id, { role: "assistant", content: friendlyAiError(msg) });
        setPendingText("");
        setStreaming(false);
        abortRef.current = null;
      },
    });
  }

  function stop() {
    abortRef.current?.();
    if (pendingText.trim()) append(convo!.id, { role: "assistant", content: pendingText });
    setPendingText("");
    setStreaming(false);
    abortRef.current = null;
  }

  async function onDelete() {
    const ok = await confirm({
      title: "Delete this conversation?",
      description: "This can't be undone. The chat history will be removed.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (ok) { remove(convo!.id); router.push("/assistant"); }
  }

  return (
    <div className="flex h-[calc(100vh-0px)] flex-col">
      <header className="flex items-center justify-between px-4 pt-6 md:px-10 md:pt-10">
        <Link href="/assistant" className="inline-flex items-center gap-1 text-[12.5px] text-fg-subtle hover:text-fg">
          <ArrowLeft size={13} strokeWidth={2} /> Conversations
        </Link>
        <button type="button" onClick={onDelete} className="grid h-8 w-8 place-items-center rounded-md text-fg-subtle hover:bg-surface-1 hover:text-[color:var(--danger)]" aria-label="Delete conversation">
          <Trash2 size={14} strokeWidth={2} />
        </button>
      </header>

      <div className="flex flex-1 gap-6 px-4 pb-6 md:px-10">
        <aside className="hidden w-[220px] shrink-0 lg:block">
          <h4 className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-fg-subtle">Threads</h4>
          <ul className="space-y-0.5">
            {conversations.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/assistant/${c.id}`}
                  className={cn(
                    "block truncate rounded-md px-2 py-1.5 text-[12.5px]",
                    c.id === convo.id ? "bg-surface-1 text-fg" : "text-fg-muted hover:bg-surface-1 hover:text-fg",
                  )}
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <input
            value={convo.title}
            onChange={(e) => rename(convo.id, e.target.value)}
            className="mt-2 w-full bg-transparent text-[20px] font-semibold tracking-tight text-fg outline-none md:text-[22px]"
          />
          <div className="mt-4 flex-1 space-y-4 overflow-y-auto rounded-2xl bg-surface-1 p-4 sm:p-5">
            {convo.messages.length === 0 && !pendingText && (
              <div className="grid place-items-center py-12 text-center">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-2 text-accent">
                  <Sparkles size={18} strokeWidth={1.75} />
                </span>
                <p className="mt-3 text-[14px] font-medium text-fg">How can I help?</p>
                <p className="mt-1 max-w-[44ch] text-[12.5px] text-fg-muted">
                  Try a slash command — <kbd className="rounded bg-surface-2 px-1 font-mono">{SLASH_HINTS.join(", ")}</kbd>
                </p>
              </div>
            )}
            {convo.messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div className={cn(
                  "max-w-[88%] rounded-2xl px-4 py-2.5 md:max-w-[80%]",
                  m.role === "user" ? "bg-accent text-accent-fg" : "bg-surface-2 text-fg",
                )}>
                  {m.role === "assistant"
                    ? <Markdown source={m.content} />
                    : <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed">{m.content}</p>}
                </div>
              </motion.div>
            ))}
            {streaming && (
              <div className="flex justify-start">
                <div className="max-w-[88%] rounded-2xl bg-surface-2 px-4 py-2.5 md:max-w-[80%]">
                  {pendingText ? <Markdown source={pendingText} /> : <Typing />}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="mt-3 flex items-end gap-2 rounded-2xl bg-surface-1 p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask Cairn — Enter to send, Shift+Enter newline."
              rows={2}
              disabled={streaming}
              className="flex-1 resize-none bg-transparent px-3 py-2 text-[14px] text-fg outline-none placeholder:text-fg-subtle disabled:opacity-60"
            />
            {streaming ? (
              <button
                type="button"
                onClick={stop}
                className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-fg-muted hover:bg-surface-3 hover:text-fg"
                aria-label="Stop"
              >
                <Square size={14} strokeWidth={2.5} />
              </button>
            ) : (
              <button
                type="button"
                onClick={send}
                disabled={!input.trim()}
                className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-fg disabled:opacity-50"
                aria-label="Send"
              >
                <Send size={16} strokeWidth={2} />
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-fg-subtle"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.0, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function friendlyAiError(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes("credit balance") || lower.includes("credit_balance")) {
    return "**Anthropic account has no credits.** Add credits at [console.anthropic.com](https://console.anthropic.com) → Plans & Billing, then try again.";
  }
  if (lower.includes("rate limit") || lower.includes("429")) {
    return "**Hit a rate limit.** Try again in a minute.";
  }
  if (lower.includes("401") || lower.includes("invalid x-api-key")) {
    return "**AI key was rejected.** Check `ANTHROPIC_API_KEY` and try again.";
  }
  return `**Assistant error.** ${raw}`;
}
