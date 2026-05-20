import type { Session } from "@/lib/auth/session";
import type {
  Task, Habit, Goal, Project, Note, Review, Conversation,
} from "@/types/entities";
import { getDb } from "./mongo";

export type UserProfile = Omit<Session, "iat" | "exp">;

export type UserState = {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  projects: Project[];
  notes: Note[];
  reviews: Review[];
  conversations: Conversation[];
};

export type UserDoc = {
  _id: string;
  email: string;
  profile: UserProfile;
  state: UserState;
  createdAt: string;
  updatedAt: string;
};

export const emptyUserState: UserState = {
  tasks: [],
  habits: [],
  goals: [],
  projects: [],
  notes: [],
  reviews: [],
  conversations: [],
};

export async function findOrCreateUserByEmail(
  email: string,
  profile: Partial<UserProfile> = {},
): Promise<UserDoc> {
  const db = await getDb();
  const users = db.collection<UserDoc>("users");
  const normalized = email.toLowerCase();
  const now = new Date().toISOString();

  const defaults: UserProfile = {
    email: normalized,
    name: profile.name,
    avatarId: profile.avatarId,
    avatarUrl: profile.avatarUrl,
    timezone: profile.timezone,
    theme: profile.theme ?? "obsidian",
    startOfWeek: profile.startOfWeek ?? "mon",
    onboarded: profile.onboarded ?? false,
    plan: profile.plan ?? "free",
    planInterval: profile.planInterval ?? null,
    planRenewsAt: profile.planRenewsAt ?? null,
    paystackCustomerCode: profile.paystackCustomerCode ?? null,
    emailDigest: profile.emailDigest ?? "weekly",
  };

  const result = await users.findOneAndUpdate(
    { email: normalized },
    {
      $setOnInsert: {
        email: normalized,
        profile: defaults,
        state: emptyUserState,
        createdAt: now,
      },
      $set: {
        updatedAt: now,
      },
    },
    {
      returnDocument: "after",
      upsert: true,
    },
  );

  if (!result) {
    throw new Error("Failed to create or find user");
  }

  return result as UserDoc;
}

export async function getUserByEmail(email: string): Promise<UserDoc | null> {
  const db = await getDb();
  const users = db.collection<UserDoc>("users");
  return users.findOne({ email: email.toLowerCase() });
}

export async function updateUserProfile(email: string, patch: Partial<UserProfile>) {
  const db = await getDb();
  const users = db.collection<UserDoc>("users");
  const normalized = email.toLowerCase();
  const update: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    update[`profile.${key}`] = value;
  }
  await users.updateOne(
    { email: normalized },
    {
      $set: update,
      $setOnInsert: { email: normalized, profile: { email: normalized, theme: "obsidian", startOfWeek: "mon", onboarded: false }, state: emptyUserState, createdAt: new Date().toISOString() },
    },
    { upsert: true },
  );
}

export async function getUserState(email: string): Promise<UserState | null> {
  const user = await getUserByEmail(email);
  return user?.state ?? null;
}

export async function setUserState(email: string, state: UserState) {
  const db = await getDb();
  const users = db.collection<UserDoc>("users");
  await users.updateOne(
    { email: email.toLowerCase() },
    {
      $set: {
        state,
        updatedAt: new Date().toISOString(),
      },
      $setOnInsert: {
        email: email.toLowerCase(),
        profile: {
          email: email.toLowerCase(),
          theme: "obsidian",
          startOfWeek: "mon",
          onboarded: false,
        },
        createdAt: new Date().toISOString(),
      },
    },
    { upsert: true },
  );
}
