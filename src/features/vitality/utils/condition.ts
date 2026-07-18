import { db } from '../data/db';

export interface ConditionReport {
  score: number;
  tags: string[];
}

export const getCondition = async (dateStr: string): Promise<ConditionReport> => {
  let score = 50; // base score
  const tags: string[] = [];

  // 1. Sleep & Vitals
  const vitals = await db.vitals.get(dateStr);
  if (vitals) {
    // Sleep (Target: 7-9 hours)
    if (vitals.sleepHours) {
      if (vitals.sleepHours >= 7 && vitals.sleepHours <= 9) {
        score += 15;
      } else if (vitals.sleepHours < 5) {
        score -= 15;
        tags.push('Fatigued');
      } else {
        score += 5;
      }
    }

    // Hydration (Target: > 2000ml)
    if (vitals.waterIntakeMl >= 2000) {
      score += 10;
      tags.push('Hydrated');
    } else if (vitals.waterIntakeMl < 1000) {
      score -= 10;
      tags.push('Dehydrated');
    }
  }

  // 2. Training / Mobility (within last 48 hours)
  const d = new Date(dateStr);
  const yesterday = new Date(d);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const recentWorkout = await db.workouts.where('date').anyOf(dateStr, yesterdayStr).first();
  if (recentWorkout) {
    score += 15;
    tags.push('Pumped');
  }

  const recentMobility = await db.mobility.where('date').anyOf(dateStr, yesterdayStr).first();
  if (recentMobility) {
    score += 10;
    tags.push('Limber');
  }

  // 3. Meditation Streak (simple check: today or yesterday)
  const recentMeditation = await db.meditation.where('date').anyOf(dateStr, yesterdayStr).first();
  if (recentMeditation) {
    tags.push('Zen');
    score += 5;
  }

  // 4. Meals (Logged today)
  const mealsToday = await db.meals.where('date').equals(dateStr).count();
  if (mealsToday > 0) {
    tags.push('Fed');
    score += 5;
  }

  // 5. Injuries
  const activeInjuries = await db.injuries.where('status').equals('active').toArray();
  const recoveringInjuries = await db.injuries.where('status').equals('recovering').toArray();
  
  if (activeInjuries.length > 0) {
    score -= 25 * activeInjuries.length;
    tags.push('Injured');
  }
  if (recoveringInjuries.length > 0) {
    score -= 10 * recoveringInjuries.length;
    tags.push('Recovering');
  }

  if (score > 80 && activeInjuries.length === 0) {
    tags.push('Optimal');
  }

  // Clamp score 0 - 100
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Deduplicate tags
  const uniqueTags = [...new Set(tags)];

  return { score, tags: uniqueTags };
};
