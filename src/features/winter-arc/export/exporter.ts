import { wadb } from '../data/db';


export async function exportWinterArcToMarkdown(programId: string): Promise<string> {
  const p = await wadb.programs.get(programId);
  if (!p) throw new Error('Program not found');

  const categories = await wadb.categories.where('programId').equals(programId).toArray();
  const goals = await wadb.goals.where('programId').equals(programId).toArray();
  const habits = await wadb.habits.where('programId').equals(programId).toArray();
  const tasks = await wadb.tasks.where('programId').equals(programId).toArray();
  const workouts = await wadb.workouts.where('programId').equals(programId).toArray();
  const exercises = await wadb.exercises.toArray(); // Filter later
  const tracks = await wadb.tracks.where('programId').equals(programId).toArray();
  const stages = await wadb.trackStages.toArray(); // Filter later
  const schedules = await wadb.schedules.where('programId').equals(programId).toArray();
  const scorecards = await wadb.scorecards.where('programId').equals(programId).toArray();
  const milestones = await wadb.milestones.where('programId').equals(programId).toArray();
  const ideas = await wadb.ideas.where('programId').equals(programId).toArray();

  let md = `# Imported Winter Arc\n\n`;
  md += `name: "${p.name}"\n`;
  md += `startDate: "${p.startDate}"\n`;
  md += `durationWeeks: ${p.durationWeeks}\n`;
  md += `status: "${p.status}"\n\n`;

  md += `## Categories\n\n`;
  categories.sort((a, b) => a.order - b.order).forEach((c, i) => {
    if (c.name !== 'General') {
      md += `${i + 1}. ${c.name}\n`;
    }
  });
  md += `\n`;

  md += `## Goals\n\n`;
  goals.forEach(g => {
    md += `Goal: "${g.title}"\n`;
  });
  md += `\n`;

  md += `## Habits\n\n`;
  habits.forEach(h => {
    md += `Habit: "${h.title}"\n`;
    md += `frequency: "${h.frequency}"\n\n`;
  });

  md += `## Tasks\n\n`;
  tasks.forEach(t => {
    md += `- ${t.title}\n`;
  });
  md += `\n`;

  md += `## Workouts\n\n`;
  workouts.forEach(w => {
    md += `### ${w.dayOfWeek}\n${w.name !== w.dayOfWeek ? w.name + '\n' : ''}\n`;
    const wEx = exercises.filter(e => e.workoutId === w.id);
    if (wEx.length === 0) {
      md += `- Rest\n`;
    } else {
      wEx.forEach(e => {
        md += `- ${e.name} — ${e.notes}\n`;
      });
    }
    md += `\n`;
  });

  md += `## Study Tracks\n\n`;
  tracks.forEach(t => {
    md += `### ${t.name}\n\n`;
    const tStages = stages.filter(s => s.trackId === t.id).sort((a, b) => a.order - b.order);
    if (tStages.length > 0) {
      md += tStages.map(s => s.name).join('\n↓\n') + '\n\n';
    }
  });

  md += `## Weekly Schedule\n\n`;
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  days.forEach(d => {
    const dayScheds = schedules.filter(s => s.dayOfWeek === d);
    if (dayScheds.length > 0) {
      md += `${d}:\n`;
      dayScheds.forEach(s => {
        md += `- ${s.title} — ${s.durationMinutes} min\n`;
      });
      md += `\n`;
    }
  });

  md += `## Daily Scorecard\n\n`;
  scorecards.forEach((s, i) => {
    md += `${i + 1}. ${s.title}\n`;
  });
  md += `\n`;

  md += `## Milestones\n\n`;
  milestones.sort((a, b) => a.weekNumber - b.weekNumber).forEach(m => {
    md += `Week ${m.weekNumber}:\n"${m.title}"\n\n`;
  });

  md += `## Projects\n\n`;
  ideas.forEach(i => {
    md += `- ${i.title}\n`;
  });
  md += `\n`;

  return md;
}
