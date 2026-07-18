/**
 * Constants and default data for LevelingUp.
 *
 * All game-balance numbers (XP values, boss HP, shop prices, rank thresholds)
 * live here so they can be tuned in one place.
 */

import type {
  Quest,
  WeeklyGoal,
  Rank,
  ShopItem,
  EquipmentItem,
  ThemeDef,
  AchievementDef,
  Boss,
  AppState,
} from '../types';

// ---------------------------------------------------------------------------
// Daily Quests
// ---------------------------------------------------------------------------

export const DEFAULT_QUESTS: Quest[] = [
  { id: 'striver', name: 'STRIVER PROGRESS', xp: 50, coins: 10, gains: { intelligence: 2, discipline: 1 } },
  { id: 'webdev', name: 'WEB DEVELOPMENT', xp: 50, coins: 10, gains: { builder: 2, discipline: 1 } },
  { id: 'cf', name: 'CODEFORCES PROBLEM', xp: 30, coins: 5, gains: { intelligence: 1, discipline: 1 } },
  { id: 'calories', name: 'CALORIES GOAL', xp: 20, coins: 5, gains: { vitality: 2 } },
  { id: 'protein', name: 'PROTEIN GOAL', xp: 20, coins: 5, gains: { vitality: 2 } },
  { id: 'expense', name: 'EXPENSE ENTRY', xp: 10, coins: 2, gains: { wealth: 1 } },
  { id: 'note', name: 'DAILY NOTE', xp: 10, coins: 2, gains: { discipline: 1 } },
];

// ---------------------------------------------------------------------------
// Weekly Goals
// ---------------------------------------------------------------------------

export const DEFAULT_WEEKLY: WeeklyGoal[] = [
  { id: 'lc', name: 'LEETCODE', target: 7, unit: 'PROBLEMS' },
  { id: 'lc_c', name: 'LEETCODE CONTEST', target: 1, unit: 'CONTEST' },
  { id: 'cfw', name: 'CODEFORCES', target: 5, unit: 'PROBLEMS' },
  { id: 'cf_c', name: 'CF CONTEST', target: 1, unit: 'CONTEST' },
  { id: 'x', name: 'CS50X', target: 1, unit: 'LECTURE' },
  { id: 'p', name: 'CS50P', target: 1, unit: 'PROB SET' },
];

// ---------------------------------------------------------------------------
// Ranks (XP thresholds)
// ---------------------------------------------------------------------------

export const RANKS: Rank[] = [
  { label: 'E', min: 0, max: 1000 },
  { label: 'D', min: 1000, max: 3000 },
  { label: 'C', min: 3000, max: 8000 },
  { label: 'B', min: 8000, max: 20000 },
  { label: 'A', min: 20000, max: 50000 },
  { label: 'S', min: 50000, max: Infinity },
];

// ---------------------------------------------------------------------------
// Classes
// ---------------------------------------------------------------------------

export const CLASSES = [
  { id: 'SHADOW', name: 'SHADOW', desc: 'Masters of self-control. Grants bonus Discipline.', buff: { discipline: 5 } },
  { id: 'BERSERKER', name: 'BERSERKER', desc: 'Relentless and unstoppable. Grants bonus Vitality.', buff: { vitality: 5 } },
  { id: 'SAGE', name: 'SAGE', desc: 'Seekers of forbidden knowledge. Grants bonus Intelligence.', buff: { intelligence: 5 } },
];

export const PERKS = {
  SHADOW: [
    { id: 'p_shadow_1', name: 'GHOST MODE', desc: 'Streak is protected if you miss exactly one day.', cost: 1 },
    { id: 'p_shadow_2', name: 'NIGHT OWL', desc: 'Completing quests after 10PM gives +20% XP.', cost: 1 },
    { id: 'p_shadow_3', name: 'VOID WALK', desc: 'Ignore backlog penalties completely.', cost: 1 },
  ],
  BERSERKER: [
    { id: 'p_berserk_1', name: 'ADRENALINE', desc: '10% chance to double XP from any quest.', cost: 1 },
    { id: 'p_berserk_2', name: 'BLOODLUST', desc: 'Boss damage is increased by 20%.', cost: 1 },
    { id: 'p_berserk_3', name: 'UNYIELDING', desc: 'Gain +1 Max HP when fighting bosses.', cost: 1 },
  ],
  SAGE: [
    { id: 'p_sage_1', name: 'ALCHEMY', desc: 'All shop items are 15% cheaper.', cost: 1 },
    { id: 'p_sage_2', name: 'TIME WEAVER', desc: 'Pomodoro sessions give +15 XP upon completion.', cost: 1 },
    { id: 'p_sage_3', name: 'ENLIGHTENMENT', desc: 'Base XP from all quests increased by 5.', cost: 1 },
  ]
};

// ---------------------------------------------------------------------------
// Shop
// ---------------------------------------------------------------------------

export const SHOP_ITEMS: ShopItem[] = [
  { id: 's1', name: 'Coffee Break', cost: 10, desc: 'Take a 15min break guilt-free' },
  { id: 's2', name: 'Gaming Hour', cost: 50, desc: '1 hour of gaming time' },
  { id: 's3', name: 'Cheat Meal', cost: 100, desc: 'One guilt-free cheat meal' },
  { id: 's4', name: 'Movie Night', cost: 200, desc: 'Watch a movie of your choice' },
  { id: 's5', name: 'Rest Day', cost: 500, desc: 'Take a full day off from all quests' },
];

// ---------------------------------------------------------------------------
// Equipment
// ---------------------------------------------------------------------------

export const EQUIPMENT_ITEMS: EquipmentItem[] = [
  { id: 'eq_sword_1', name: 'Iron Sword', slot: 'weapon', cost: 200, stats: { builder: 1, vitality: 1 }, desc: 'A basic iron sword.' },
  { id: 'eq_sword_2', name: 'Obsidian Blade', slot: 'weapon', cost: 1000, stats: { builder: 3, vitality: 2 }, desc: 'Forged in the dark depths.' },
  { id: 'eq_hat_1', name: 'Scholar Hat', slot: 'head', cost: 200, stats: { intelligence: 2 }, desc: 'Increases your mental capacity.' },
  { id: 'eq_armor_1', name: 'Leather Tunic', slot: 'body', cost: 250, stats: { vitality: 2 }, desc: 'Basic protection for the body.' },
  { id: 'eq_ring_1', name: 'Ring of Focus', slot: 'accessory', cost: 500, stats: { discipline: 3 }, desc: 'Keeps your mind sharp.' },
];

export const FORGE_ITEMS = [
  { 
    id: 'f_void_crown', name: 'Void Crown', slot: 'head', 
    stats: { intelligence: 10, discipline: 5 }, desc: 'A crown forged from the abyss.',
    cost: { m_void_shard: 3, m_dark_iron: 2 } 
  },
  { 
    id: 'f_demon_armor', name: 'Demon Carapace', slot: 'body', 
    stats: { vitality: 15, builder: 5 }, desc: 'Impenetrable armor from a defeated demon.',
    cost: { m_demon_blood: 2, m_dark_iron: 5 } 
  },
  { 
    id: 'f_chronos_blade', name: 'Chronos Blade', slot: 'weapon', 
    stats: { builder: 10, intelligence: 10 }, desc: 'A blade that cuts through time itself.',
    cost: { m_chronos_gear: 1, m_void_shard: 2, m_demon_blood: 1 } 
  },
];

// ---------------------------------------------------------------------------
// Themes
// ---------------------------------------------------------------------------

export const THEMES: ThemeDef[] = [
  { id: 'theme-default', name: 'Light Mode (Default)', cost: 0 },
  { id: 'theme-dark', name: 'Dark Mode', cost: 1000 },
  { id: 'theme-sakura', name: 'Sakura Blossom', cost: 5000 },
  { id: 'theme-ocean', name: 'Ocean Breeze', cost: 5000 },
];

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_blood', name: 'FIRST BLOOD', desc: 'Complete your first quest', xpReward: 100 },
  { id: 'streak_7', name: '7-DAY STREAK', desc: 'Maintain a 7-day streak', xpReward: 500 },
  { id: 'streak_30', name: '30-DAY STREAK', desc: 'Maintain a 30-day streak', xpReward: 2000 },
  { id: 'boss_slayer', name: 'BOSS SLAYER', desc: 'Defeat your first boss', xpReward: 1000 },
  { id: 'xp_1k', name: 'NOVICE HUNTER', desc: 'Earn 1,000 total XP', xpReward: 200 },
  { id: 'xp_10k', name: 'ADEPT HUNTER', desc: 'Earn 10,000 total XP', xpReward: 1000 },
  { id: 'rank_s', name: 'S-CLASS HUNTER', desc: 'Reach S-Rank', xpReward: 5000 },
  { id: 'shopaholic', name: 'SHOPAHOLIC', desc: 'Redeem 10 items from the shop', xpReward: 500 },
];

// ---------------------------------------------------------------------------
// Default Bosses
// ---------------------------------------------------------------------------

export const DEFAULT_BOSSES: Boss[] = [
  { id: 'b1', name: 'Mora Daemoni', title: 'The Procrastination Demon', maxHp: 1000, hp: 1000, xpReward: 2000, coinReward: 300, actionDesc: 'Complete a Deep Work Session', damage: 100 },
  { id: 'b2', name: 'Sacchara Slime', title: 'The Sugar Slime', maxHp: 500, hp: 500, xpReward: 1000, coinReward: 150, actionDesc: 'Clean Diet Day', damage: 100 },
  { id: 'b3', name: 'Ignis Corpus', title: 'The Couch Behemoth', maxHp: 2000, hp: 2000, xpReward: 5000, coinReward: 500, actionDesc: 'Heavy Workout', damage: 200 },
  { id: 'b4', name: 'Tempus Fugit', title: 'The Chronos Wraith', maxHp: 1200, hp: 1200, xpReward: 2500, coinReward: 350, actionDesc: 'Complete 60min Pomodoro', damage: 100 },
  { id: 'b5', name: 'Titanus Lxxv', title: 'The 75 Hard Titan', maxHp: 7500, hp: 7500, xpReward: 50000, coinReward: 5000, actionDesc: 'Flawless Daily Quests', damage: 100 },
];

// ---------------------------------------------------------------------------
// Void Bounties (Weekly Generation)
// ---------------------------------------------------------------------------

export const POSSIBLE_BOUNTIES: Quest[] = [
  { id: 'vb1', name: '7-DAY STREAK (HARD)', xp: 1500, coins: 500, gains: { discipline: 10 } },
  { id: 'vb2', name: 'SPEND NO MONEY FOR 3 DAYS', xp: 2000, coins: 1000, gains: { wealth: 10 } },
  { id: 'vb3', name: '10 HOURS OF DEEP WORK', xp: 3000, coins: 300, gains: { intelligence: 15 } },
  { id: 'vb4', name: 'RUN 20 KM TOTAL', xp: 2500, coins: 400, gains: { vitality: 15 } },
  { id: 'vb5', name: 'READ 1 FULL BOOK', xp: 4000, coins: 500, gains: { intelligence: 20 } },
  { id: 'vb6', name: 'NO SUGAR FOR 5 DAYS', xp: 3000, coins: 600, gains: { discipline: 15, vitality: 10 } },
];

export const BOSS_MATERIALS = [
  { id: 'm_void_shard', name: 'VOID SHARD', rarity: 'Rare', dropChance: 0.6 },
  { id: 'm_dark_iron', name: 'DARK IRON', rarity: 'Uncommon', dropChance: 0.8 },
  { id: 'm_demon_blood', name: 'DEMON BLOOD', rarity: 'Epic', dropChance: 0.3 },
  { id: 'm_chronos_gear', name: 'CHRONOS GEAR', rarity: 'Epic', dropChance: 0.2 },
];

// ---------------------------------------------------------------------------
// Stat display helpers
// ---------------------------------------------------------------------------

export const STAT_NAMES = ['intelligence', 'builder', 'discipline', 'vitality', 'wealth'] as const;

export const STAT_ICONS: Record<string, string> = {
  intelligence: '◆',
  builder: '⬡',
  discipline: '◈',
  vitality: '♡',
  wealth: '◎',
};

// ---------------------------------------------------------------------------
// Calendar / Date helpers
// ---------------------------------------------------------------------------

export const EXPENSE_CATEGORIES = ['PROVISIONS', 'SHELTER', 'ARSENAL', 'INTEL', 'COMBAT', 'RESTORATION', 'TRAVERSAL', 'TRIBUTE', 'CUSTOM'] as const;
export const INCOME_CATEGORIES = ['SALARY', 'BOUNTY', 'LOOT', 'YIELD', 'CUSTOM'] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  PROVISIONS: '#16a34a',
  SHELTER: '#f59e0b',
  ARSENAL: '#ef4444',
  INTEL: '#3b82f6',
  COMBAT: '#f43f5e',
  RESTORATION: '#10b981',
  TRAVERSAL: '#8b5cf6',
  TRIBUTE: '#64748b',
  CUSTOM: '#737373',
  SALARY: '#34d399',
  BOUNTY: '#fbbf24',
  LOOT: '#a78bfa',
  YIELD: '#38bdf8',
};

export const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

export const MONTH_NAMES_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

export const DAY_NAMES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const INTENSITY_COLORS = ['transparent', '#16a34a', '#4ade80', '#86efac'];
export const INTENSITY_LABELS = ['NONE', 'LOW', 'MEDIUM', 'HIGH'];

// ---------------------------------------------------------------------------
// Initial app state (used on first launch before onboarding)
// ---------------------------------------------------------------------------

export const INITIAL_STATE: AppState = {
  setupDone: false,
  user: {
    name: '',
    totalXp: 0,
    coins: 0,
    longestStreak: 0,
    stats: { intelligence: 0, builder: 0, discipline: 0, vitality: 0, wealth: 0 },
    userClass: 'NONE',
    unlockedPerks: [],
  },
  quests: DEFAULT_QUESTS,
  weekly: DEFAULT_WEEKLY,
  dayData: {},
  weeklyProgress: {},
  backlogs: [],
  redeemed: [],
  notes: [],
  links: [],
  health: {
    weights: [],
    foodLogs: [],
    targets: { calories: 2500, protein: 100, targetWeight: 65, startWeight: 56 },
  },
  finance: { 
    transactions: [],
    budgets: [],
    meta: { logStreak: 0, lastLogDate: null },
    monthlyBudget: 5000 
  },
  bosses: DEFAULT_BOSSES,
  lastBacklogCheck: null,
  achievements: [],
  achievementQueue: [],
  inventory: [],
  theme: 'theme-default',
  unlockedThemes: ['theme-default'],
  equipped: { head: null, body: null, weapon: null, accessory: null },
  bounties: [],
  completedBounties: [],
  lastBountyRefresh: null,
  materials: {},
};
