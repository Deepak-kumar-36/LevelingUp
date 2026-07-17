/**
 * Zustand store for LevelingUp.
 *
 * All app state lives here and is persisted to IndexedDB via Dexie.
 * The store is the single source of truth — components read from it
 * and dispatch updates through `setData`.
 */

import { create } from 'zustand';
import { db } from '../database/db';
import { INITIAL_STATE } from '../lib/constants';
import { checkAchievements } from '../services/AchievementService';
import type { AppState } from '../types';

// ---------------------------------------------------------------------------
// Date & streak helpers
// ---------------------------------------------------------------------------

/** Format a Date as YYYY-MM-DD. */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Get ISO week key like "2026-W28". */
export function formatWeekKey(date: Date): string {
  const jan4 = new Date(date.getFullYear(), 0, 4);
  const daysSinceJan4 = (date.getTime() - jan4.getTime()) / 86_400_000;
  const weekNum = Math.ceil((daysSinceJan4 + jan4.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
}

/** Calculate the heatmap intensity level (0–3) for a day. */
export function getIntensity(completed: number, total: number): number {
  if (!completed || !total) return 0;
  const ratio = completed / total;
  if (ratio < 0.35) return 1;
  if (ratio < 0.70) return 2;
  return 3;
}

/**
 * Walk backwards from today counting consecutive days where the user
 * completed ≥ 70% of their quests. Returns the current streak length.
 */
export function calculateStreak(
  dayData: AppState['dayData'],
  totalQuests: number,
): number {
  let streak = 0;
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  for (let i = 0; i < 3650; i++) {
    const key = formatDateKey(date);
    const day = dayData[key];
    const completed = day?.quests?.length ?? 0;
    const ratio = completed / Math.max(1, totalQuests);

    if (ratio >= 0.7) {
      streak++;
      date.setDate(date.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/** Generate a simple numeric ID based on timestamp + random jitter. */
export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface Store {
  isReady: boolean;
  data: AppState;
  setData: (updater: (prev: AppState) => AppState) => void;
  loadFromDb: () => Promise<void>;
  saveToDb: (state: AppState) => Promise<void>;
}

export const useAppStore = create<Store>((set, get) => ({
  isReady: false,
  data: INITIAL_STATE,

  setData: (updater) => {
    const prev = get().data;
    let next = updater(prev);

    // Automatically check for newly-unlocked achievements
    if (next.setupDone) {
      const result = checkAchievements(next);
      next = result.newData;
    }

    set({ data: next });
    get().saveToDb(next);
  },

  loadFromDb: async () => {
    try {
      const saved = await db.settings.get(1);
      if (saved && (saved as unknown as { blob?: string }).blob) {
        const parsed = JSON.parse((saved as unknown as { blob: string }).blob) as Partial<AppState>;
        set({ data: { ...INITIAL_STATE, ...parsed }, isReady: true });
      } else {
        set({ isReady: true });
      }
    } catch (error) {
      console.error('Failed to load from DB:', error);
      set({ isReady: true });
    }
  },

  saveToDb: async (state) => {
    try {
      await db.settings.put({ id: 1, blob: JSON.stringify(state) } as any);
    } catch (error) {
      console.error('Failed to save to DB:', error);
    }
  },
}));
