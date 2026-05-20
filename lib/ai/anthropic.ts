import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5";

let _client: Anthropic | null = null;
let _cachedKey: string | undefined = undefined;

export function getAnthropic(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  if (!_client || _cachedKey !== key) {
    _client = new Anthropic({ apiKey: key });
    _cachedKey = key;
  }
  return _client;
}

export function isConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}
