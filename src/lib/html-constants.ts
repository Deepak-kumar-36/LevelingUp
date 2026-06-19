export const QUESTS = [
  { id: 'striver', name: 'STRIVER PROGRESS', xp: 50, coins: 10, gains: { intelligence: 2, discipline: 1 } },
  { id: 'webdev', name: 'WEB DEVELOPMENT', xp: 50, coins: 10, gains: { builder: 2, discipline: 1 } },
  { id: 'cf', name: 'CODEFORCES PROBLEM', xp: 30, coins: 5, gains: { intelligence: 1, discipline: 1 } },
  { id: 'calories', name: 'CALORIES GOAL', xp: 20, coins: 5, gains: { vitality: 2 } },
  { id: 'protein', name: 'PROTEIN GOAL', xp: 20, coins: 5, gains: { vitality: 2 } },
  { id: 'expense', name: 'EXPENSE ENTRY', xp: 10, coins: 2, gains: { wealth: 1 } },
  { id: 'note', name: 'DAILY NOTE', xp: 10, coins: 2, gains: { discipline: 1 } },
];

export const WEEKLY = [
  { id: 'lc', name: 'LEETCODE', target: 7, unit: 'PROBLEMS' },
  { id: 'lc_c', name: 'LEETCODE CONTEST', target: 1, unit: 'CONTEST' },
  { id: 'cfw', name: 'CODEFORCES', target: 5, unit: 'PROBLEMS' },
  { id: 'cf_c', name: 'CF CONTEST', target: 1, unit: 'CONTEST' },
  { id: 'x', name: 'CS50X', target: 1, unit: 'LECTURE' },
  { id: 'p', name: 'CS50P', target: 1, unit: 'PROB SET' },
];

export const RANKS = [
  { l: 'E', min: 0, max: 1000 },
  { l: 'D', min: 1000, max: 3000 },
  { l: 'C', min: 3000, max: 8000 },
  { l: 'B', min: 8000, max: 20000 },
  { l: 'A', min: 20000, max: 50000 },
  { l: 'S', min: 50000, max: Infinity },
];

export const SHOP = [
  { id: 's1', name: 'Coffee Break', cost: 10, desc: 'Take a 15min break guilt-free' },
  { id: 's2', name: 'Gaming Hour', cost: 50, desc: '1 hour of gaming time' },
  { id: 's3', name: 'Cheat Meal', cost: 100, desc: 'One guilt-free cheat meal' },
  { id: 's4', name: 'Movie Night', cost: 200, desc: 'Watch a movie of your choice' },
  { id: 's5', name: 'Rest Day', cost: 500, desc: 'Take a full day off from all quests' }
];

export const EQUIPMENT_ITEMS = [
  { id: 'eq_sword_1', name: 'Iron Sword', slot: 'weapon', cost: 200, stats: { builder: 1, vitality: 1 }, desc: 'A basic iron sword.' },
  { id: 'eq_sword_2', name: 'Obsidian Blade', slot: 'weapon', cost: 1000, stats: { builder: 3, vitality: 2 }, desc: 'Forged in the dark depths.' },
  { id: 'eq_hat_1', name: 'Scholar Hat', slot: 'head', cost: 200, stats: { intelligence: 2 }, desc: 'Increases your mental capacity.' },
  { id: 'eq_armor_1', name: 'Leather Tunic', slot: 'body', cost: 250, stats: { vitality: 2 }, desc: 'Basic protection for the body.' },
  { id: 'eq_ring_1', name: 'Ring of Focus', slot: 'accessory', cost: 500, stats: { discipline: 3 }, desc: 'Keeps your mind sharp.' }
];

export const THEMES = [
  { id: 'theme-default', name: 'Monochrome (Default)', cost: 0 },
  { id: 'theme-blood', name: 'Blood Moon', cost: 5000 },
  { id: 'theme-matrix', name: 'The Matrix', cost: 5000 }
];

export const EXP_CATS = ['FOOD', 'TRAVEL', 'COLLEGE', 'ENTERTAIN', 'MISC'];
export const CAT_CLR: Record<string, string> = { FOOD: '#16a34a', TRAVEL: '#4ade80', COLLEGE: '#86efac', ENTERTAIN: '#666', MISC: '#999' };
export const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
export const MONTHS_S = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
export const STATS = ['intelligence', 'builder', 'discipline', 'vitality', 'wealth'];
export const SICON: Record<string, string> = { intelligence: '◆', builder: '⬡', discipline: '◈', vitality: '♡', wealth: '◎' };
export const IC = ['transparent', '#16a34a', '#4ade80', '#86efac']; // Inten colors for dark mode (inverted slightly)
export const IL = ['NONE', 'LOW', 'MEDIUM', 'HIGH'];

export const DEFAULT_BOSSES = [
  { id: 'b1', name: 'Mora Daemoni', title: 'The Procrastination Demon', maxHp: 1000, hp: 1000, xpReward: 2000, coinReward: 300, actionDesc: 'Complete a Deep Work Session', damage: 100 },
  { id: 'b2', name: 'Sacchara Slime', title: 'The Sugar Slime', maxHp: 500, hp: 500, xpReward: 1000, coinReward: 150, actionDesc: 'Clean Diet Day', damage: 100 },
  { id: 'b3', name: 'Ignis Corpus', title: 'The Couch Behemoth', maxHp: 2000, hp: 2000, xpReward: 5000, coinReward: 500, actionDesc: 'Heavy Workout', damage: 200 },
  { id: 'b4', name: 'Tempus Fugit', title: 'The Chronos Wraith', maxHp: 1200, hp: 1200, xpReward: 2500, coinReward: 350, actionDesc: 'Complete 60min Pomodoro', damage: 100 },
  { id: 'b5', name: 'Titanus Lxxv', title: 'The 75 Hard Titan', maxHp: 7500, hp: 7500, xpReward: 50000, coinReward: 5000, actionDesc: 'Flawless Daily Quests', damage: 100 }
];

export const ACHIEVEMENTS = [
  { id: 'first_blood', name: 'FIRST BLOOD', desc: 'Complete your first quest', xpReward: 100 },
  { id: 'streak_7', name: '7-DAY STREAK', desc: 'Maintain a 7-day streak', xpReward: 500 },
  { id: 'streak_30', name: '30-DAY STREAK', desc: 'Maintain a 30-day streak', xpReward: 2000 },
  { id: 'boss_slayer', name: 'BOSS SLAYER', desc: 'Defeat your first boss', xpReward: 1000 },
  { id: 'xp_1k', name: 'NOVICE HUNTER', desc: 'Earn 1,000 total XP', xpReward: 200 },
  { id: 'xp_10k', name: 'ADEPT HUNTER', desc: 'Earn 10,000 total XP', xpReward: 1000 },
  { id: 'rank_s', name: 'S-CLASS HUNTER', desc: 'Reach S-Rank', xpReward: 5000 },
  { id: 'shopaholic', name: 'SHOPAHOLIC', desc: 'Redeem 10 items from the shop', xpReward: 500 },
];

export const INIT = {
  setupDone: false,
  user: {
    name: '', totalXp: 0, coins: 0, longestStreak: 0,
    stats: { intelligence: 0, builder: 0, discipline: 0, vitality: 0, wealth: 0 }
  },
  quests: QUESTS,
  weekly: WEEKLY,
  dayData: {} as Record<string, any>,
  weeklyProgress: {} as Record<string, any>,
  backlogs: [] as any[],
  redeemed: [] as any[],
  notes: [] as any[],
  health: { weights: [] as any[], foodLogs: [] as any[], targets: { calories: 2500, protein: 100, targetWeight: 65, startWeight: 56 } },
  finance: { expenses: [] as any[], monthlyBudget: 5000 },
  bosses: DEFAULT_BOSSES as any[],
  lastBacklogCheck: null as string | null,
  achievements: [] as string[],
  achievementQueue: [] as string[],
  inventory: [] as string[],
  theme: 'theme-default' as string,
  unlockedThemes: ['theme-default'] as string[],
  equipped: {
    head: null as string | null,
    body: null as string | null,
    weapon: null as string | null,
    accessory: null as string | null,
  }
};
