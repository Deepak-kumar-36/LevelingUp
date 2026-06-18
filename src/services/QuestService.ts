import { db } from '../database/db';

export class QuestService {
  /**
   * Toggles binary quest completion for a given date
   */
  static async toggleBinaryQuest(questId: string, date: string): Promise<boolean> {
    const quest = await db.quests.get(questId);
    if (!quest) throw new Error('Quest not found');

    const logId = `${questId}_${date}`;
    let log = await db.questLogs.get(logId);

    if (log) {
      log.completed = !log.completed;
      await db.questLogs.put(log);
      return log.completed;
    } else {
      log = {
        id: logId,
        questId,
        date,
        progress: 1,
        completed: true,
      };
      await db.questLogs.put(log);
      return true;
    }
  }

  static async getLogsForDate(date: string) {
    return db.questLogs.where('date').equals(date).toArray();
  }
}
