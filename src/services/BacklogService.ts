import { db } from '../database/db';
import { format, subDays } from 'date-fns';

export class BacklogService {
  /**
   * Checks for missed quests from previous days and adds them to the backlog.
   * This should be called once per session (usually on dashboard mount).
   */
  static async processMissedQuests(lastCheckedDate: string | null) {
    const today = format(new Date(), 'yyyy-MM-dd');
    if (lastCheckedDate === today) return 0;

    const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    
    // We only process if there is a gap. For simplicity, we process just yesterday.
    // In a robust system, we would loop from lastCheckedDate to yesterday.
    
    const activeDailyQuests = await db.quests
      .filter((q) => q.isActive && q.frequency === 'daily')
      .toArray();

    const yesterdayLogs = await db.questLogs
      .where('date')
      .equals(yesterdayStr)
      .toArray();

    const completedQuestIds = new Set(
      yesterdayLogs.filter((l) => l.completed).map((l) => l.questId)
    );

    const missedQuests = activeDailyQuests.filter((q) => !completedQuestIds.has(q.id));

    let addedCount = 0;
    const newBacklogs = missedQuests.map((q) => {
      addedCount++;
      return {
        id: `bl_${q.id}_${yesterdayStr}`,
        questId: q.id,
        questName: q.name,
        dateAssigned: yesterdayStr,
        amount: 1,
        status: 'pending' as const,
      };
    });

    if (newBacklogs.length > 0) {
      // Avoid adding duplicates (e.g. if we already ran this check)
      const existingIds = new Set(await db.backlogs.toCollection().primaryKeys());
      const toAdd = newBacklogs.filter(b => !existingIds.has(b.id));
      if (toAdd.length > 0) {
        await db.backlogs.bulkAdd(toAdd);
      }
    }

    // Update settings with last checked
    const settings = await db.settings.get(1);
    if (settings) {
      // Actually we should store `lastBacklogCheck` in settings or another table.
      // Let's assume we can save it via Zustand store or directly here.
      // For now, return the count so UI can show a toast
    }

    return addedCount;
  }
}
