import { create } from 'zustand';
import { db } from '../database/db';
import { INIT } from '../lib/html-constants';

export const dKey = (d: Date) => `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
export const getInten = (done: number, total: number) => { if (!done || !total) return 0; const p = done / total; return p < .35 ? 1 : p < .70 ? 2 : 3; };
export const wKey = (d: Date) => {
  const jan4 = new Date(d.getFullYear(), 0, 4);
  const w = Math.ceil((((d.getTime() - jan4.getTime()) / 86400000) + jan4.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${w.toString().padStart(2, '0')}`;
};

export const calcStreak = (dayData: any, totalQuests: number) => {
  let s = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < 3650; i++) {
    const k = dKey(d);
    const dd = dayData[k] ?? { quests: [] };
    if (dd.quests.length / Math.max(1, totalQuests) >= 0.7) {
      s++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return s;
};

export const numId = () => Date.now() + Math.floor(Math.random() * 1000);

interface AppState {
  isReady: boolean;
  data: typeof INIT;
  setData: (updater: (prev: typeof INIT) => typeof INIT | typeof INIT) => void;
  loadFromDb: () => Promise<void>;
  saveToDb: (data: typeof INIT) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  isReady: false,
  data: INIT,
  setData: (updater) => {
    const prev = get().data;
    const next = typeof updater === 'function' ? updater(prev) : updater;
    set({ data: next });
    get().saveToDb(next);
  },
  loadFromDb: async () => {
    try {
      const saved = await db.settings.get(1); // Use settings table with ID 1 to store the whole blob
      if (saved && (saved as any).blob) {
        set({ data: { ...INIT, ...JSON.parse((saved as any).blob) }, isReady: true });
      } else {
        set({ isReady: true });
      }
    } catch (e) {
      console.error(e);
      set({ isReady: true });
    }
  },
  saveToDb: async (dataToSave: typeof INIT) => {
    try {
      await db.settings.put({ id: 1, blob: JSON.stringify(dataToSave) } as any);
    } catch (e) {
      console.error(e);
    }
  }
}));
