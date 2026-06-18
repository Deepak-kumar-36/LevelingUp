import { db } from '../database/db';

export class BossService {
  /**
   * Evaluates and updates bosses that are ready to be unlocked
   */
  static async checkBossUnlocks() {
    const lockedBosses = await db.bosses.where('status').equals('locked').toArray();
    
    for (const boss of lockedBosses) {
      if (boss.requiredNodeId) {
        const node = await db.progressNodes.get(boss.requiredNodeId);
        if (node && node.status === 'completed') {
          await db.bosses.update(boss.id, { status: 'active' });
        }
      }
    }
  }

  static async defeatBoss(bossId: string): Promise<boolean> {
    const boss = await db.bosses.get(bossId);
    if (!boss || boss.status !== 'active') return false;

    await db.bosses.update(bossId, { status: 'completed' });
    return true;
  }
}
