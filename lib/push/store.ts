import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Push subscription storage — file-backed JSON (.data/push-subs.json).
 * Production swap: replace these with a `users.pushSubscriptions` collection
 * write in MongoDB. The function shapes are intentionally minimal.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "push-subs.json");

export type PushSubscriptionJSON = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  expirationTime?: number | null;
};

export type StoredSub = {
  email: string;
  /** Optional client-attached metadata (timezone, habit reminder times, etc.). */
  meta?: {
    timezone?: string;
    /** Map of "HH:MM" => habitIds[] — when to fire which reminders. */
    habitsByTime?: Record<string, string[]>;
  };
  subscription: PushSubscriptionJSON;
  createdAt: string;
  /** Stable hash of endpoint, used as the record key. */
  id: string;
};

type DB = { subs: StoredSub[] };

async function read(): Promise<DB> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as DB;
  } catch {
    return { subs: [] };
  }
}

async function write(db: DB) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 2), "utf-8");
}

function hash(endpoint: string): string {
  // djb2 — short, stable, no crypto dep needed for an id.
  let h = 5381;
  for (let i = 0; i < endpoint.length; i++) h = ((h << 5) + h + endpoint.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

export async function upsertSub(email: string, sub: PushSubscriptionJSON, meta?: StoredSub["meta"]): Promise<StoredSub> {
  const db = await read();
  const id = hash(sub.endpoint);
  const next: StoredSub = { id, email: email.toLowerCase(), subscription: sub, meta, createdAt: new Date().toISOString() };
  const idx = db.subs.findIndex((s) => s.id === id);
  if (idx >= 0) {
    db.subs[idx] = { ...db.subs[idx], ...next, createdAt: db.subs[idx].createdAt };
  } else {
    db.subs.push(next);
  }
  await write(db);
  return next;
}

export async function removeSubByEndpoint(endpoint: string): Promise<void> {
  const db = await read();
  const id = hash(endpoint);
  db.subs = db.subs.filter((s) => s.id !== id);
  await write(db);
}

export async function listSubsForEmail(email: string): Promise<StoredSub[]> {
  const db = await read();
  return db.subs.filter((s) => s.email === email.toLowerCase());
}

export async function listAllSubs(): Promise<StoredSub[]> {
  return (await read()).subs;
}
