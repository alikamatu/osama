import "server-only";
import { getAnthropic, MODEL } from "./anthropic";
import type Anthropic from "@anthropic-ai/sdk";

/**
 * Translate raw Anthropic SDK errors into clean, user-facing messages.
 * Returns either markdown (for streaming consumers) or a short string.
 */
export type AiFailure = {
  kind: "no_credit" | "no_key" | "rate_limit" | "auth" | "overloaded" | "unknown";
  title: string;
  body: string;
};

export function classifyAiError(err: unknown): AiFailure {
  const raw = err instanceof Error ? err.message : String(err ?? "");
  const lower = raw.toLowerCase();

  if (lower.includes("credit balance") || lower.includes("credit_balance")) {
    return {
      kind: "no_credit",
      title: "Anthropic account has no credits",
      body: "Add credits at console.anthropic.com → Plans & Billing, then try again. Your existing tasks and data aren't affected.",
    };
  }
  if (lower.includes("api key") && lower.includes("not")) {
    return { kind: "no_key", title: "AI not configured", body: "Set ANTHROPIC_API_KEY in your environment to enable assistant features." };
  }
  if (lower.includes("rate limit") || lower.includes("rate_limit") || lower.includes("429")) {
    return { kind: "rate_limit", title: "Hit a rate limit", body: "Anthropic is asking us to slow down. Try again in a minute." };
  }
  if (lower.includes("authentication") || lower.includes("401") || lower.includes("invalid x-api-key")) {
    return { kind: "auth", title: "AI key rejected", body: "Anthropic didn't accept your API key. Check it and try again." };
  }
  if (lower.includes("overloaded") || lower.includes("529")) {
    return { kind: "overloaded", title: "Anthropic is overloaded", body: "Try again in a moment." };
  }
  return { kind: "unknown", title: "Assistant error", body: raw || "Something went wrong calling the model." };
}

function failureMarkdown(f: AiFailure): string {
  return `**${f.title}.** ${f.body}`;
}

/**
 * Calls Anthropic and returns a ReadableStream of UTF-8 text deltas.
 * The client just reads `response.body` chunk-by-chunk and appends.
 */
export function streamCompletion(args: {
  system: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  maxTokens?: number;
}): ReadableStream<Uint8Array> {
  const client = getAnthropic();
  const encoder = new TextEncoder();

  if (!client) {
    return new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(failureMarkdown(classifyAiError("AI not configured"))));
        controller.close();
      },
    });
  }

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: MODEL,
          max_tokens: args.maxTokens ?? 1024,
          system: args.system,
          messages: args.messages,
        });

        for await (const event of stream) {
          if (event.type === "content_block_delta") {
            const delta = (event as Anthropic.RawContentBlockDeltaEvent).delta;
            if (delta.type === "text_delta") {
              controller.enqueue(encoder.encode(delta.text));
            }
          }
        }
        controller.close();
      } catch (err) {
        controller.enqueue(encoder.encode(failureMarkdown(classifyAiError(err))));
        controller.close();
      }
    },
  });
}

/** One-shot non-streaming call. Returns the assembled text. */
export async function complete(args: {
  system: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  maxTokens?: number;
}): Promise<string> {
  const client = getAnthropic();
  if (!client) throw new Error("Anthropic API key not configured.");
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: args.maxTokens ?? 1024,
    system: args.system,
    messages: args.messages,
  });
  return res.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
}
