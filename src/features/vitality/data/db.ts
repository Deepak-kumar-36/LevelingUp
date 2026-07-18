import Dexie, { type Table } from 'dexie';

export interface VitalsEntry {
  date: string; // YYYY-MM-DD (PK)
  sleepHours: number | null;
  sleepQuality: number | null; // 1-5
  waterIntakeMl: number;
  mood: number | null; // 1-5
  energy: number | null; // 1-5
  weightKg: number | null;
  notes: string;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  durationMin: number;
}

export interface Workout {
  id: string; // PK
  date: string; // YYYY-MM-DD
  type: string;
  exercises: WorkoutExercise[];
  totalDurationMin: number;
  notes: string;
}

export interface TrainingProtocol {
  id: string;
  name: string;
  exercises: { name: string; targetSets: number; targetReps: number }[];
}

export interface MobilitySession {
  id: string;
  date: string;
  type: string;
  durationMin: number;
  notes: string;
}

export interface MeditationSession {
  id: string;
  date: string;
  type: string;
  durationMin: number;
  notes: string;
}

export interface Meal {
  id: string;
  date: string;
  time: string;
  name: string;
  tags: string[];
}

export interface SupplementChecklist {
  date: string; // YYYY-MM-DD (PK)
  items: { name: string; completed: boolean }[];
}

export type InjuryStatus = 'active' | 'recovering' | 'resolved';
export interface Injury {
  id: string;
  bodyPart: string;
  status: InjuryStatus;
  startDate: string;
  resolvedDate: string | null;
  notes: string;
}

export interface BodyMetric {
  id: string;
  date: string;
  weightKg: number | null;
  waistCm: number | null;
  notes: string;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  imageBlob: Blob;
  notes: string;
}

export class VitalityDatabase extends Dexie {
  vitals!: Table<VitalsEntry, string>;
  workouts!: Table<Workout, string>;
  protocols!: Table<TrainingProtocol, string>;
  mobility!: Table<MobilitySession, string>;
  meditation!: Table<MeditationSession, string>;
  meals!: Table<Meal, string>;
  supplements!: Table<SupplementChecklist, string>;
  injuries!: Table<Injury, string>;
  metrics!: Table<BodyMetric, string>;
  photos!: Table<ProgressPhoto, string>;

  constructor() {
    super('VitalityDB');
    this.version(1).stores({
      vitals: 'date',
      workouts: 'id, date',
      protocols: 'id',
      mobility: 'id, date',
      meditation: 'id, date',
      meals: 'id, date',
      supplements: 'date',
      injuries: 'id, status',
      metrics: 'id, date',
      photos: 'id, date'
    });
  }
}

export const db = new VitalityDatabase();
