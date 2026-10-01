import { wadb } from '../data/db';
import type { WinterArcConfig } from '../data/types';

export async function executeImportTransaction(config: WinterArcConfig): Promise<void> {
  // @ts-ignore
  const pId = config.program.id;

  await wadb.transaction('rw', [
    wadb.programs,
    wadb.categories,
    wadb.goals,
    wadb.habits,
    wadb.tasks,
    wadb.workouts,
    wadb.exercises,
    wadb.tracks,
    wadb.trackStages,
    wadb.schedules,
    wadb.scorecards,
    wadb.reviews,
    wadb.milestones,
    wadb.ideas,
    wadb.meta
  ], async () => {

    // UPSERT PROGRAM
    await wadb.programs.put(config.program);

    // UPSERT CATEGORIES
    await wadb.categories.bulkPut(config.categories);

    // GOALS: Protect user progress
    for (const goal of config.goals) {
      const existing = await wadb.goals.get(goal.id);
      if (existing) {
        goal.progress = existing.progress;
      }
      await wadb.goals.put(goal);
    }

    // HABITS
    await wadb.habits.bulkPut(config.habits);

    // TASKS: Protect completion status
    for (const task of config.tasks) {
      const existing = await wadb.tasks.get(task.id);
      if (existing) {
        task.status = existing.status;
        task.completedAt = existing.completedAt;
      }
      await wadb.tasks.put(task);
    }

    // WORKOUTS & EXERCISES
    await wadb.workouts.bulkPut(config.workouts);
    await wadb.exercises.bulkPut(config.exercises);

    // STUDY TRACKS & STAGES
    await wadb.tracks.bulkPut(config.tracks);
    for (const stage of config.trackStages) {
      const existing = await wadb.trackStages.get(stage.id);
      if (existing) {
        stage.status = existing.status;
        stage.completedAt = existing.completedAt;
      }
      await wadb.trackStages.put(stage);
    }

    // SCHEDULES, SCORECARDS, MILESTONES, IDEAS
    await wadb.schedules.bulkPut(config.schedules);
    await wadb.scorecards.bulkPut(config.scorecards);
    
    for (const ms of config.milestones) {
      const existing = await wadb.milestones.get(ms.id);
      if (existing) ms.status = existing.status;
      await wadb.milestones.put(ms);
    }

    await wadb.ideas.bulkPut(config.ideas);

  });
}
