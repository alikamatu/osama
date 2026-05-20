export type ID = string;
export type ISO = string;

export type Priority = "low" | "med" | "high";
export type TaskStatus = "open" | "in-progress" | "done";

/** Any soft-deletable entity has this field. Null/undefined = live. */
export type SoftDelete = {
  /** Soft-delete timestamp. Items hang around 30 days, then auto-purge. */
  deletedAt?: ISO | null;
};

export type Task = SoftDelete & {
  id: ID;
  title: string;
  notes?: string;
  status: TaskStatus;
  priority: Priority;
  projectId?: ID | null;
  labels: string[];
  due?: ISO | null;
  dueTime?: string | null;
  completedAt?: ISO | null;
  recurrence?: "none" | "daily" | "weekly" | "monthly";
  parentId?: ID | null;
  /** "today" — pinned to today board. */
  inbox?: boolean;
  order: number;
  createdAt: ISO;
};

export type HabitCadence =
  | { kind: "daily" }
  | { kind: "weekly-target"; perWeek: number }
  | { kind: "custom"; days: Array<0 | 1 | 2 | 3 | 4 | 5 | 6> };

export type Habit = SoftDelete & {
  id: ID;
  title: string;
  notes?: string;
  cadence: HabitCadence;
  reminderTime?: string | null;
  startDate?: ISO | null;
  /** ISO date string YYYY-MM-DD → done */
  checkins: Record<string, boolean>;
  createdAt: ISO;
};

export type GoalStatus = "on-track" | "at-risk" | "off-track" | "achieved" | "archived";
export type GoalHorizon = "quarter" | "year" | "life";

export type Milestone = {
  id: ID;
  title: string;
  progress: number; // 0..100
  done: boolean;
};

export type Goal = SoftDelete & {
  id: ID;
  title: string;
  why?: string;
  horizon: GoalHorizon;
  status: GoalStatus;
  milestones: Milestone[];
  taskIds: ID[];
  habitIds: ID[];
  targetDate?: ISO | null;
  createdAt: ISO;
};

export type Project = SoftDelete & {
  id: ID;
  name: string;
  description?: string;
  color: string; // token name
  archived: boolean;
  goalIds: ID[];
  createdAt: ISO;
};

export type Note = SoftDelete & {
  id: ID;
  title: string;
  body: string;            // markdown
  tags: string[];
  taskIds: ID[];
  goalIds: ID[];
  pinned: boolean;
  createdAt: ISO;
  updatedAt: ISO;
};

export type ReviewKind = "daily" | "weekly" | "monthly" | "yearly";
export type Review = {
  id: ID;
  kind: ReviewKind;
  /** Anchor date for the period (start of week/month/year for periodic, that day for daily). */
  periodStart: ISO;
  content: Record<string, string>; // question key -> answer
  createdAt: ISO;
};

export type ChatRole = "user" | "assistant" | "system";
export type ChatMessage = {
  id: ID;
  role: ChatRole;
  content: string;
  createdAt: ISO;
};

export type Conversation = {
  id: ID;
  title: string;
  messages: ChatMessage[];
  createdAt: ISO;
  updatedAt: ISO;
};

export type TrashableKind = "task" | "habit" | "goal" | "project" | "note";

export type TrashEntry =
  | { kind: "task";    entity: Task }
  | { kind: "habit";   entity: Habit }
  | { kind: "goal";    entity: Goal }
  | { kind: "project"; entity: Project }
  | { kind: "note";    entity: Note };

export const TRASH_RETENTION_DAYS = 30;
