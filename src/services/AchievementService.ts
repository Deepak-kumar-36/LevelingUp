import { ACHIEVEMENTS } from '../lib/html-constants';
import { calcStreak } from '../store/useAppStore';

export const checkAchievements = (data: any): { unlocked: any[], newData: any } => {
  const currentAchievements = new Set(data.achievements || []);
  const newlyUnlocked: any[] = [];
  
  // Helper to check and unlock
  const check = (id: string, condition: boolean) => {
    if (condition && !currentAchievements.has(id)) {
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      if (achievement) {
        newlyUnlocked.push(achievement);
      }
    }
  };

  // Conditions
  const totalQuestsCompleted = Object.values(data.dayData || {}).reduce((sum: number, d: any) => sum + (d.quests?.length || 0), 0);
  const currentStreak = calcStreak(data.dayData, data.quests?.length || 0);
  const longestStreak = Math.max(data.user.longestStreak || 0, currentStreak);
  const bossesDefeated = (data.bosses || []).reduce((sum: number, b: any) => {
    return sum + Math.floor((b.maxHp - b.hp) / b.maxHp);
  }, 0);

  check('first_blood', totalQuestsCompleted >= 1);
  check('streak_7', longestStreak >= 7);
  check('streak_30', longestStreak >= 30);
  check('boss_slayer', bossesDefeated >= 1);
  check('xp_1k', data.user.totalXp >= 1000);
  check('xp_10k', data.user.totalXp >= 10000);
  check('rank_s', data.user.totalXp >= 50000);
  check('shopaholic', (data.redeemed || []).length >= 10);

  if (newlyUnlocked.length > 0) {
    let bonusXp = 0;
    newlyUnlocked.forEach(a => {
      bonusXp += a.xpReward;
    });

    const newData = {
      ...data,
      achievements: [...(data.achievements || []), ...newlyUnlocked.map(a => a.id)],
      achievementQueue: [...(data.achievementQueue || []), ...newlyUnlocked.map(a => `🏆 ${a.name} UNLOCKED! +${a.xpReward}XP`)],
      user: {
        ...data.user,
        totalXp: data.user.totalXp + bonusXp
      }
    };
    return { unlocked: newlyUnlocked, newData };
  }

  return { unlocked: [], newData: data };
};
