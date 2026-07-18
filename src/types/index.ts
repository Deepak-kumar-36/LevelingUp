/**
 * Core type definitions for LevelingUp.
 *
 * Every piece of app state is described here so the rest of the codebase
 * can stay free of `any`.
 */

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

export interface UserStats {
  intelligence: number;
  builder: number;
  discipline: number;
  vitality: number;
  wealth: number;
}

export type StatName = keyof UserStats;

export type CharacterClass = 'NONE' | 'SHADOW' | 'BERSERKER' | 'SAGE';

export interface UserProfile {
  name: string;
  totalXp: number;
  coins: number;
  longestStreak: number;
  stats: UserStats;
  userClass: CharacterClass;
  unlockedPerks: string[];
}

// ---------------------------------------------------------------------------
// Quests
// ---------------------------------------------------------------------------

export interface Quest {
  id: string;
  name: string;
  xp: number;
  coins: number;
  gains: Partial<Record<StatName, number>>;
}

export interface WeeklyGoal {
  id: string;
  name: string;
  target: number;
  unit: string;
}

// ---------------------------------------------------------------------------
// Day / Week tracking
// ---------------------------------------------------------------------------

export interface DayData {
  quests: string[];
  xp: number;
  coins: number;
}

export type DayDataMap = Record<string, DayData>;
export type WeeklyProgressMap = Record<string, Record<string, number>>;

// ---------------------------------------------------------------------------
// Backlog
// ---------------------------------------------------------------------------

export interface BacklogItem {
  id: string;
  name: string;
  xp: number;
  coins: number;
}

// ---------------------------------------------------------------------------
// Bosses
// ---------------------------------------------------------------------------

export interface Boss {
  id: string;
  name: string;
  title: string;
  maxHp: number;
  hp: number;
  xpReward: number;
  coinReward: number;
  actionDesc: string;
  damage: number;
}

// ---------------------------------------------------------------------------
// Shop & Equipment
// ---------------------------------------------------------------------------

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  desc: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  slot: EquipmentSlot;
  cost: number;
  stats: Partial<Record<StatName, number>>;
  desc: string;
}

export type EquipmentSlot = 'head' | 'body' | 'weapon' | 'accessory';

export interface EquippedGear {
  head: string | null;
  body: string | null;
  weapon: string | null;
  accessory: string | null;
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

export interface AchievementDef {
  id: string;
  name: string;
  desc: string;
  xpReward: number;
}

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface FoodEntry {
  date: string;
  name: string;
  calories: number;
  protein: number;
}

export interface HealthTargets {
  calories: number;
  protein: number;
  targetWeight: number;
  startWeight: number;
}

export interface HealthData {
  weights: WeightEntry[];
  foodLogs: FoodEntry[];
  targets: HealthTargets;
}

// ---------------------------------------------------------------------------
// Finance
// ---------------------------------------------------------------------------

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  category: string;
  desc: string;
  isRecurring?: boolean;
}

export interface TreasuryBudget {
  categoryId: string;
  limitAmount: number;
}

export interface TreasuryMeta {
  logStreak: number;
  lastLogDate: string | null;
}

export interface FinanceData {
  transactions: Transaction[];
  budgets?: TreasuryBudget[];
  meta?: TreasuryMeta;
  monthlyBudget: number; // legacy
}

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------

export interface Note {
  id: string;
  title: string;
  body: string;
  date: string; // legacy fallback
  tags?: string[];
  createdAt?: number;
  updatedAt?: number;
}

export interface NoteLink {
  id: string;
  sourceNoteId: string;
  targetNoteId: string;
  createdAt: number;
}

// ---------------------------------------------------------------------------
// Themes
// ---------------------------------------------------------------------------

export interface ThemeDef {
  id: string;
  name: string;
  cost: number;
}

// ---------------------------------------------------------------------------
// Ranks
// ---------------------------------------------------------------------------

export interface Rank {
  label: string;
  min: number;
  max: number;
}

// ---------------------------------------------------------------------------
// Root app state (the shape stored in IndexedDB)
// ---------------------------------------------------------------------------

export interface AppState {
  setupDone: boolean;
  user: UserProfile;
  quests: Quest[];
  weekly: WeeklyGoal[];
  dayData: DayDataMap;
  weeklyProgress: WeeklyProgressMap;
  backlogs: BacklogItem[];
  redeemed: string[];
  notes: Note[];
  links?: NoteLink[];
  health: HealthData;
  finance: FinanceData;
  bosses: Boss[];
  lastBacklogCheck: string | null;
  achievements: string[];
  achievementQueue: string[];
  inventory: string[];
  theme: string;
  unlockedThemes: string[];
  equipped: EquippedGear;
  bounties: Quest[];
  completedBounties: string[];
  lastBountyRefresh: string | null;
  materials: Record<string, number>;
}
