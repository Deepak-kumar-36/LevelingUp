import { db } from '../database/db';

export class StreakService {
  /**
   * Recalculates the streak based on quest completion history.
   * A day counts if >= 70% of daily quests are completed.
   */
  static async calculateStreak(): Promise<number> {
    let streak = 0;
    const d = new Date();
    d.setHours(0, 0, 0, 0);

    const activeDailyQuests = await db.quests
      .filter((q) => q.isActive && q.frequency === 'daily')
      .toArray();

    if (activeDailyQuests.length === 0) return 0;

    for (let i = 0; i < 3650; i++) {
      const dateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      
      const logsForDay = await db.questLogs
        .where('date')
        .equals(dateStr)
        .and((log) => log.completed)
        .toArray();

      // Count how many of the currently active daily quests were completed that day
      // Wait, we should probably check against historical quest requirement, 
      // but for simplicity we check against current active daily quests if historical snapshot isn't available
      const completedDailyQuests = logsForDay.filter(log => 
        activeDailyQuests.some(q => q.id === log.questId)
      ).length;

      const completionRate = completedDailyQuests / activeDailyQuests.length;

      if (completionRate >= 0.7) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        // Did they use a skip pass? For now, we assume break if < 70%.
        // We can check if a "skip" was redeemed that day.
        const skipRedeemed = false; // TODO: integrate shop redeemed items logic
        if (skipRedeemed) {
          d.setDate(d.getDate() - 1);
          continue;
        } else {
          // If we are looking at today and they haven't finished today, we don't break streak yet.
          if (i === 0) {
            d.setDate(d.getDate() - 1);
            continue;
          }
          break;
        }
      }
    }

    return streak;
  }
}
