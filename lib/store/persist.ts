import type { Task, Habit, Goal, Project, Note, Review, Conversation } from "@/types/entities";

export type PersistedState = {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  projects: Project[];
  notes: Note[];
  reviews: Review[];
  conversations: Conversation[];
};

export const emptyPersistedState: PersistedState = {
  tasks: [],
  habits: [],
  goals: [],
  projects: [],
  notes: [],
  reviews: [],
  conversations: [],
};

export function pickPersistedState(state: PersistedState): PersistedState {
  return {
    tasks: state.tasks,
    habits: state.habits,
    goals: state.goals,
    projects: state.projects,
    notes: state.notes,
    reviews: state.reviews,
    conversations: state.conversations,
  };
}

export function isEmptyPersistedState(state: PersistedState): boolean {
  return (
    state.tasks.length === 0 &&
    state.habits.length === 0 &&
    state.goals.length === 0 &&
    state.projects.length === 0 &&
    state.notes.length === 0 &&
    state.reviews.length === 0 &&
    state.conversations.length === 0
  );
}
