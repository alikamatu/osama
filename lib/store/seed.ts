import { nanoid } from "nanoid";
import type {
  Conversation, Goal, Habit, Note, Project, Review, Task,
} from "@/types/entities";

const today = new Date();
const iso = (d: Date) => d.toISOString();
const ymd = (d: Date) => d.toISOString().slice(0, 10);
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d;
};
const inDays = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d;
};

export type SeedState = {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  projects: Project[];
  notes: Note[];
  reviews: Review[];
  conversations: Conversation[];
};

export function buildSeed(): SeedState {
  const pWork    = { id: nanoid(8), name: "Work",           color: "accent",  archived: false, goalIds: [], createdAt: iso(daysAgo(30)), description: "Anything client- or company-facing." };
  const pPersonal= { id: nanoid(8), name: "Personal",       color: "positive", archived: false, goalIds: [], createdAt: iso(daysAgo(30)), description: "Health, family, household." };
  const pLearning= { id: nanoid(8), name: "Learning",       color: "warning", archived: false, goalIds: [], createdAt: iso(daysAgo(30)), description: "Reading, courses, exploration." };

  const projects: Project[] = [pWork, pPersonal, pLearning];

  const habitRun: Habit = {
    id: nanoid(8), title: "Morning run", cadence: { kind: "daily" },
    reminderTime: "06:30", checkins: buildCheckins(48, 0.78), createdAt: iso(daysAgo(120)),
  };
  const habitRead: Habit = {
    id: nanoid(8), title: "Read", cadence: { kind: "daily" },
    reminderTime: "21:00", checkins: buildCheckins(60, 0.85), createdAt: iso(daysAgo(120)),
  };
  const habitMeditate: Habit = {
    id: nanoid(8), title: "Meditate", cadence: { kind: "daily" },
    reminderTime: "07:30", checkins: buildCheckins(40, 0.55), createdAt: iso(daysAgo(120)),
  };
  const habitHydrate: Habit = {
    id: nanoid(8), title: "Hydrate · 2L", cadence: { kind: "daily" },
    reminderTime: null, checkins: buildCheckins(70, 0.9), createdAt: iso(daysAgo(120)),
  };
  const habitJournal: Habit = {
    id: nanoid(8), title: "Journal", cadence: { kind: "weekly-target", perWeek: 4 },
    reminderTime: "22:00", checkins: buildCheckins(30, 0.5), createdAt: iso(daysAgo(120)),
  };
  const habits: Habit[] = [habitRun, habitRead, habitMeditate, habitHydrate, habitJournal];

  const tasks: Task[] = [
    seedTask({ title: "Plan Q3 product roadmap",      priority: "high", projectId: pWork.id,     dueTime: "10:00", labels: ["planning"], inbox: true }),
    seedTask({ title: "Review pull requests",         priority: "med",  projectId: pWork.id,     dueTime: "13:00", labels: ["code"],     inbox: true }),
    seedTask({ title: "Write weekly status update",   priority: "med",  projectId: pWork.id,     dueTime: "16:00", labels: ["writing"],  inbox: true }),
    seedTask({ title: "Reply to investor email",      priority: "high", projectId: pWork.id,     labels: ["comms"],   inbox: true }),
    seedTask({ title: "Read 30 pages",                priority: "low",  projectId: pLearning.id, status: "done",     inbox: true }),
    seedTask({ title: "Schedule dental cleaning",     priority: "low",  projectId: pPersonal.id, labels: ["chore"] }),
    seedTask({ title: "Renew passport",               priority: "med",  projectId: pPersonal.id, due: iso(inDays(20)) }),
    seedTask({ title: "Finish chapter 4 of book",     priority: "med",  projectId: pLearning.id }),
    seedTask({ title: "Plan team offsite",             priority: "high", projectId: pWork.id,     due: iso(inDays(7)) }),
    seedTask({ title: "Set up gym membership",         priority: "low",  projectId: pPersonal.id }),
    seedTask({ title: "Take dog to vet",               priority: "med",  projectId: pPersonal.id, due: iso(inDays(3)) }),
    seedTask({ title: "Quick — file expense report",   priority: "med" }), // inbox unsorted
  ];

  const goals: Goal[] = [
    {
      id: nanoid(8),
      title: "Ship Cairn v1",
      why: "A calm daily driver that I'd actually use myself.",
      horizon: "quarter",
      status: "on-track",
      milestones: [
        { id: nanoid(6), title: "Auth + onboarding",   progress: 100, done: true  },
        { id: nanoid(6), title: "Today + tasks",       progress: 80,  done: false },
        { id: nanoid(6), title: "Habits + goals",      progress: 35,  done: false },
        { id: nanoid(6), title: "Beta release",         progress: 0,   done: false },
      ],
      taskIds: [], habitIds: [],
      targetDate: iso(inDays(60)), createdAt: iso(daysAgo(40)),
    },
    {
      id: nanoid(8),
      title: "Run a half marathon",
      why: "Year of small, hard things.",
      horizon: "year",
      status: "on-track",
      milestones: [
        { id: nanoid(6), title: "5km comfortable",  progress: 100, done: true  },
        { id: nanoid(6), title: "10km under 60min", progress: 60,  done: false },
        { id: nanoid(6), title: "15km long run",    progress: 20,  done: false },
        { id: nanoid(6), title: "Race day",          progress: 0,   done: false },
      ],
      taskIds: [], habitIds: [habitRun.id],
      targetDate: iso(inDays(180)), createdAt: iso(daysAgo(80)),
    },
    {
      id: nanoid(8),
      title: "Read 24 books this year",
      why: "Build a long-form reading muscle.",
      horizon: "year",
      status: "at-risk",
      milestones: [
        { id: nanoid(6), title: "Book 6",  progress: 100, done: true  },
        { id: nanoid(6), title: "Book 12", progress: 50,  done: false },
        { id: nanoid(6), title: "Book 18", progress: 0,   done: false },
        { id: nanoid(6), title: "Book 24", progress: 0,   done: false },
      ],
      taskIds: [], habitIds: [habitRead.id],
      targetDate: iso(inDays(240)), createdAt: iso(daysAgo(100)),
    },
    {
      id: nanoid(8),
      title: "Be the calmest version of myself",
      why: "Long-haul.",
      horizon: "life",
      status: "on-track",
      milestones: [],
      taskIds: [], habitIds: [habitMeditate.id, habitJournal.id],
      targetDate: null, createdAt: iso(daysAgo(120)),
    },
  ];

  const notes: Note[] = [
    {
      id: nanoid(8),
      title: "Weekly review template",
      body: `# Weekly review\n\n## What moved?\n- \n\n## What stalled?\n- \n\n## Next week's one big thing\n- \n`,
      tags: ["template", "review"],
      taskIds: [], goalIds: [], pinned: true,
      createdAt: iso(daysAgo(7)), updatedAt: iso(daysAgo(1)),
    },
    {
      id: nanoid(8),
      title: "Ideas for Cairn assistant",
      body: `## Tools the assistant should call\n- create / complete tasks\n- check off habits\n- summarize the week\n\n## Prompt patterns\n- Plan a day from open tasks + available hours\n- Break a goal into milestones and tasks\n`,
      tags: ["product"],
      taskIds: [], goalIds: [], pinned: false,
      createdAt: iso(daysAgo(3)), updatedAt: iso(daysAgo(3)),
    },
    {
      id: nanoid(8),
      title: "Race training notes",
      body: `## Plan\n- 3 easy runs / week\n- 1 long run on weekends\n- Strength 2x / week\n\n## Cross-train\n- Cycling on Tuesdays\n`,
      tags: ["running", "health"],
      taskIds: [], goalIds: [], pinned: false,
      createdAt: iso(daysAgo(10)), updatedAt: iso(daysAgo(2)),
    },
  ];

  const reviews: Review[] = [
    {
      id: nanoid(8), kind: "weekly", periodStart: iso(daysAgo(7)),
      content: {
        moved: "Shipped onboarding, habits row, command palette.",
        stalled: "Assistant chat — blocked on model choice.",
        next: "Get tasks page to feature parity with today board.",
      },
      createdAt: iso(daysAgo(1)),
    },
  ];

  const conversations: Conversation[] = [
    {
      id: nanoid(8),
      title: "Plan tomorrow",
      messages: [
        { id: nanoid(6), role: "user",      content: "Plan my day. I have a 30-min standup at 10 and a meeting at 2.", createdAt: iso(daysAgo(0)) },
        { id: nanoid(6), role: "assistant", content: "Here's a draft. 9:00 deep work (PRs). 10:00 standup. 10:30 inbox triage. 11:00 deep work (planning). 13:00 lunch. 14:00 meeting. 15:00 review weekly status. 16:30 walk + stretch.", createdAt: iso(daysAgo(0)) },
      ],
      createdAt: iso(daysAgo(0)), updatedAt: iso(daysAgo(0)),
    },
  ];

  return { tasks, habits, goals, projects, notes, reviews, conversations };
}

function seedTask(p: Partial<Task> & { title: string }): Task {
  return {
    id: nanoid(8),
    title: p.title,
    status: p.status ?? "open",
    priority: p.priority ?? "med",
    projectId: p.projectId ?? null,
    labels: p.labels ?? [],
    due: p.due ?? null,
    dueTime: p.dueTime ?? null,
    completedAt: p.status === "done" ? iso(daysAgo(0)) : null,
    recurrence: "none",
    parentId: null,
    inbox: p.inbox ?? false,
    order: Math.floor(Math.random() * 1_000_000),
    createdAt: iso(daysAgo(Math.floor(Math.random() * 10))),
    notes: p.notes,
  };
}

function buildCheckins(daysBack: number, density: number): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  const start = new Date(today);
  for (let i = 0; i < daysBack; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() - i);
    if (Math.random() < density) out[ymd(d)] = true;
  }
  return out;
}
