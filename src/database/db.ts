import Dexie, { type Table } from 'dexie';

export interface User {
  id: number;
  name: string;
  totalXp: number;
  coins: number;
  longestStreak: number;
  stats: {
    intelligence: number;
    builder: number;
    discipline: number;
    vitality: number;
    wealth: number;
  };
}

export interface Quest {
  id: string;
  name: string;
  type: 'binary' | 'count' | 'time' | 'progress';
  target: number;
  unit?: string;
  xpReward: number;
  coinReward: number;
  statGains: Record<string, number>;
  isActive: boolean;
  frequency: 'daily' | 'weekly' | 'once';
}

export interface QuestLog {
  id: string; // e.g. `${questId}_${date}`
  questId: string;
  date: string; // YYYY-MM-DD
  progress: number;
  completed: boolean;
}

export interface Backlog {
  id: string;
  questId: string;
  questName: string;
  dateAssigned: string; // YYYY-MM-DD
  amount: number;
  status: 'pending' | 'completed';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

export interface WeightLog {
  id: string;
  date: string;
  weight: number;
}

export interface FoodLog {
  id: string;
  date: string;
  foodName: string;
  calories: number;
  protein: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string;
}

export interface ProgressNode {
  id: string;
  treeId: string; // e.g. 'dsa', 'webdev'
  name: string;
  status: 'locked' | 'active' | 'completed';
  xpReward: number;
  dependencies: string[];
}

export interface DailyStat {
  date: string;
  xpEarned: number;
  coinsEarned: number;
  tasksCompleted: number;
}

export interface Boss {
  id: string;
  treeId: string;
  name: string;
  status: 'locked' | 'active' | 'completed';
  requiredNodeId: string;
  xpReward: number;
  coinReward: number;
}

export interface Settings {
  id: number;
  theme: 'dark';
  setupDone: boolean;
  monthlyBudget: number;
  targets: {
    calories: number;
    protein: number;
    startWeight: number;
    targetWeight: number;
    startCgpa: number;
    targetCgpa: number;
  };
}

export class LevelingUpDB extends Dexie {
  users!: Table<User, number>;
  quests!: Table<Quest, string>;
  questLogs!: Table<QuestLog, string>;
  backlogs!: Table<Backlog, string>;
  notes!: Table<Note, string>;
  expenses!: Table<Expense, string>;
  weightLogs!: Table<WeightLog, string>;
  foodLogs!: Table<FoodLog, string>;
  achievements!: Table<Achievement, string>;
  progressNodes!: Table<ProgressNode, string>;
  dailyStats!: Table<DailyStat, string>;
  bosses!: Table<Boss, string>;
  settings!: Table<Settings, number>;

  constructor() {
    super('LevelingUpDB');
    this.version(2).stores({
      users: 'id',
      quests: 'id, type, frequency, isActive',
      questLogs: 'id, questId, date, completed',
      backlogs: 'id, questId, dateAssigned, status',
      notes: 'id, *tags',
      expenses: 'id, date, category',
      weightLogs: 'id, date',
      foodLogs: 'id, date',
      achievements: 'id',
      progressNodes: 'id, treeId, status',
      dailyStats: 'date',
      bosses: 'id, treeId, status',
      settings: 'id'
    });
  }
}

export const db = new LevelingUpDB();
