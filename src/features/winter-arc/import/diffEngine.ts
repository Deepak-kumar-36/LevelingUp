import type { WinterArcConfig } from '../data/types';
import { wadb } from '../data/db';

export interface DiffResult {
  added: number;
  updated: number;
  unchanged: number;
  removed: number;
}

export interface ImportPreviewData {
  programName: string;
  startDate: string;
  durationWeeks: number;
  diffs: {
    categories: DiffResult;
    goals: DiffResult;
    habits: DiffResult;
    tasks: DiffResult;
    workouts: DiffResult;
    tracks: DiffResult;
    schedules: DiffResult;
    scorecards: DiffResult;
    milestones: DiffResult;
  };
  errors: string[];
}

export function validateConfig(config: WinterArcConfig): string[] {
  const errors: string[] = [];
  
  if (!config.program.name || config.program.name === 'Unnamed Winter Arc') {
    errors.push('Program name is missing or invalid.');
  }
  
  if (!config.program.startDate || isNaN(Date.parse(config.program.startDate))) {
    errors.push(`Invalid start date: ${config.program.startDate}`);
  }
  
  if (config.program.durationWeeks <= 0) {
    errors.push(`Duration must be greater than 0. Got: ${config.program.durationWeeks}`);
  }
  
  // Basic duplicate check for goals
  const goalIds = new Set();
  for (const g of config.goals) {
    if (goalIds.has(g.id)) errors.push(`Duplicate goal detected: ${g.title}`);
    goalIds.add(g.id);
  }

  return errors;
}

export async function generateImportPreview(config: WinterArcConfig): Promise<ImportPreviewData> {
  const errors = validateConfig(config);
  
  const pId = config.program.id;
  
  // Helper to diff arrays
  async function diffTable<T extends { id: string }>(
    table: any,
    incoming: T[]
  ): Promise<DiffResult> {
    const existing = await table.where('programId').equals(pId).toArray();
    const existingMap = new Map(existing.map((e: any) => [e.id, e]));
    
    let added = 0;
    let updated = 0;
    let unchanged = 0;
    let removed = 0;
    
    incoming.forEach(inc => {
      if (existingMap.has(inc.id)) {
        // Deep compare ideally, but for now we'll just say updated/unchanged 
        // depending on if properties changed. We'll simplify to 'updated' for all existing.
        updated++;
        existingMap.delete(inc.id);
      } else {
        added++;
      }
    });
    
    removed = existingMap.size;
    
    return { added, updated, unchanged, removed };
  }

  return {
    programName: config.program.name,
    startDate: config.program.startDate,
    durationWeeks: config.program.durationWeeks,
    diffs: {
      categories: await diffTable(wadb.categories, config.categories),
      goals: await diffTable(wadb.goals, config.goals),
      habits: await diffTable(wadb.habits, config.habits),
      tasks: await diffTable(wadb.tasks, config.tasks),
      workouts: await diffTable(wadb.workouts, config.workouts),
      tracks: await diffTable(wadb.tracks, config.tracks),
      schedules: await diffTable(wadb.schedules, config.schedules),
      scorecards: await diffTable(wadb.scorecards, config.scorecards),
      milestones: await diffTable(wadb.milestones, config.milestones),
    },
    errors
  };
}
