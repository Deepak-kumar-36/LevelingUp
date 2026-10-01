import Dexie, { type Table } from 'dexie';

export interface WAProgram {
  id: string; // Slug, e.g. "winter-arc-2026"
  name: string;
  description: string;
  startDate: string;
  durationWeeks: number;
  endDate: string;
  status: 'active' | 'completed' | 'archived';
  sourceFile: string;
  createdAt: number;
  updatedAt: number;
}

export interface WACategory {
  id: string; // e.g. "winter-arc-2026-health"
  programId: string;
  name: string;
  description: string;
  priority: number;
  order: number;
}

export interface WAGoal {
  id: string;
  programId: string;
  categoryId: string;
  title: string;
  description: string;
  target: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed';
  progress: number; // User progress (must be protected during import)
}

export interface WAHabit {
  id: string;
  programId: string;
  categoryId: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'custom';
  target: number;
  unit: string;
  active: boolean;
  trackingType: 'boolean' | 'numeric';
}

export interface WATask {
  id: string;
  programId: string;
  categoryId: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  completedAt: number | null;
}

export interface WAWorkout {
  id: string;
  programId: string;
  name: string; // e.g. "Upper Body"
  dayOfWeek: string; // e.g. "MONDAY"
}

export interface WAExercise {
  id: string;
  workoutId: string;
  name: string;
  sets: number;
  reps: string; // Could be "8" or "8-10" or "Failure"
  duration: number; // minutes
  notes: string;
  progressionPlan: Array<{ week: number, sets: number, reps: string }>;
}

export interface WAStudyTrack {
  id: string;
  programId: string;
  categoryId: string;
  name: string;
  description: string;
  priority: number;
  weeklyTargetMinutes: number;
}

export interface WATrackStage {
  id: string;
  trackId: string;
  name: string;
  order: number;
  status: 'locked' | 'active' | 'completed';
  completedAt: number | null;
}

export interface WASchedule {
  id: string;
  programId: string;
  dayOfWeek: string;
  title: string;
  categoryId: string;
  durationMinutes: number;
  type: string;
}

export interface WAScorecardItem {
  id: string;
  programId: string;
  title: string;
  points: number;
  trackingType: string;
  active: boolean;
}

export interface WAWeeklyReview {
  id: string;
  programId: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'completed';
  notes: string;
}

export interface WAMilestone {
  id: string;
  programId: string;
  weekNumber: number;
  title: string;
  status: 'pending' | 'completed';
}

export interface WAIdea {
  id: string;
  programId: string;
  title: string;
  description: string;
  source: string;
  status: 'idea' | 'active' | 'existing';
}

export interface WAImportMeta {
  sourceFileName: string;
  sourceHash: string;
  importedAt: number;
  schemaVersion: string;
}

export class WinterArcDatabase extends Dexie {
  programs!: Table<WAProgram, string>;
  categories!: Table<WACategory, string>;
  goals!: Table<WAGoal, string>;
  habits!: Table<WAHabit, string>;
  tasks!: Table<WATask, string>;
  workouts!: Table<WAWorkout, string>;
  exercises!: Table<WAExercise, string>;
  tracks!: Table<WAStudyTrack, string>;
  trackStages!: Table<WATrackStage, string>;
  schedules!: Table<WASchedule, string>;
  scorecards!: Table<WAScorecardItem, string>;
  reviews!: Table<WAWeeklyReview, string>;
  milestones!: Table<WAMilestone, string>;
  ideas!: Table<WAIdea, string>;
  meta!: Table<WAImportMeta, string>; // Only ever holds 1 row basically, or keyed by programId

  constructor() {
    super('WinterArcDB');
    this.version(1).stores({
      programs: 'id',
      categories: 'id, programId',
      goals: 'id, programId, categoryId',
      habits: 'id, programId, categoryId',
      tasks: 'id, programId, categoryId',
      workouts: 'id, programId',
      exercises: 'id, workoutId',
      tracks: 'id, programId, categoryId',
      trackStages: 'id, trackId',
      schedules: 'id, programId, dayOfWeek',
      scorecards: 'id, programId',
      reviews: 'id, programId, weekNumber',
      milestones: 'id, programId, weekNumber',
      ideas: 'id, programId, status',
      meta: 'sourceFileName, sourceHash'
    });
  }
}

export const wadb = new WinterArcDatabase();
