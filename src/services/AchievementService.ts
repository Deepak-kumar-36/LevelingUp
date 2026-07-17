/**
 * Achievement checking logic.
 *
 * Called automatically by the store on every state update.
 * Compares current progress against achievement thresholds and
 * unlocks any newly-earned achievements.
 */

import { ACHIEVEMENTS } from '../lib/constants';
import { calculateStreak } from '../store/useAppStore';
import type { AppState, AchievementDef, DayData } from '../types';

interface AchievementResult {
  unlocked: AchievementDef[];
  newData: AppState;
}

export function checkAchievements(data: AppState): AchievementResult {
  const earned = new Set(data.achievements);
  const newlyUnlocked: AchievementDef[] = [];

  function tryUnlock(id: string, condition: boolean): void {
    if (condition && !earned.has(id)) {
      const def = ACHIEVEMENTS.find((a) => a.id === id);
      if (def) newlyUnlocked.push(def);
    }
  }

  // Aggregate stats
  const totalQuestsCompleted = Object.values(data.dayData).reduce(
    (sum: number, day: DayData) => sum + (day.quests?.length ?? 0),
    0,
  );

  const currentStreak = calculateStreak(data.dayData, data.quests.length);
  const longestStreak = Math.max(data.user.longestStreak, currentStreak);

  const bossesDefeated = data.bosses.reduce((sum, boss) => {
    // A boss is "defeated" if its HP was drained to 0 at least once
    return sum + (boss.hp < boss.maxHp ? 1 : 0);
  }, 0);

  // Check each achievement
  tryUnlock('first_blood', totalQuestsCompleted >= 1);
  tryUnlock('streak_7', longestStreak >= 7);
  tryUnlock('streak_30', longestStreak >= 30);
  tryUnlock('boss_slayer', bossesDefeated >= 1);
  tryUnlock('xp_1k', data.user.totalXp >= 1000);
  tryUnlock('xp_10k', data.user.totalXp >= 10000);
  tryUnlock('rank_s', data.user.totalXp >= 50000);
  tryUnlock('shopaholic', data.redeemed.length >= 10);

  if (newlyUnlocked.length === 0) {
    return { unlocked: [], newData: data };
  }

  // Award bonus XP and queue toast notifications
  const bonusXp = newlyUnlocked.reduce((sum, a) => sum + a.xpReward, 0);

  const newData: AppState = {
    ...data,
    achievements: [...data.achievements, ...newlyUnlocked.map((a) => a.id)],
    achievementQueue: [
      ...data.achievementQueue,
      ...newlyUnlocked.map((a) => `🏆 ${a.name} UNLOCKED! +${a.xpReward}XP`),
    ],
    user: {
      ...data.user,
      totalXp: data.user.totalXp + bonusXp,
    },
  };

  return { unlocked: newlyUnlocked, newData };
}
