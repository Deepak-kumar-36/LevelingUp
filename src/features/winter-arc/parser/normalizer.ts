import { flattenSections } from './markdownParser';
import type { MarkdownSection } from './markdownParser';
import type { WinterArcConfig } from '../data/types';

function generateSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/** Matches titles against semantic aliases */
function matchesAlias(title: string, aliases: string[]) {
  const t = title.toLowerCase();
  return aliases.some(a => t.includes(a));
}

export function normalizeMarkdown(_markdownText: string, parsedSections: MarkdownSection[]): WinterArcConfig {
  const sections = flattenSections(parsedSections);

  const config: WinterArcConfig = {
    program: {
      id: '', name: 'Unnamed Winter Arc', description: '', startDate: '', durationWeeks: 12, endDate: '', status: 'active', sourceFile: '', createdAt: Date.now(), updatedAt: Date.now()
    },
    categories: [],
    goals: [],
    habits: [],
    tasks: [],
    workouts: [],
    exercises: [],
    tracks: [],
    trackStages: [],
    schedules: [],
    scorecards: [],
    reviews: [],
    milestones: [],
    ideas: []
  };

  // Pre-pass: Find program name if possible. Default to generic slug if not found.
  let programSlug = "winter-arc-" + new Date().getFullYear();
  const programSection = sections.find(s => matchesAlias(s.title, ['program', 'imported winter arc', 'winter arc', 'overview']));
  if (programSection) {
    const lines = programSection.content.split('\n');
    lines.forEach(line => {
      const p = line.split(':');
      if (p.length >= 2) {
        const k = p[0].trim().toLowerCase();
        const v = p.slice(1).join(':').trim().replace(/"/g, '');
        if (k === 'name') config.program.name = v;
        if (k === 'startdate' || k === 'start date') config.program.startDate = v;
        if (k === 'durationweeks' || k === 'duration weeks') config.program.durationWeeks = parseInt(v, 10);
        if (k === 'status') config.program.status = v as any;
      }
    });
    if (config.program.name !== 'Unnamed Winter Arc') {
      programSlug = generateSlug(config.program.name);
    }
  }
  
  config.program.id = programSlug;
  
  // Create default category to catch things without category
  const defaultCategory = {
    id: `${programSlug}-cat-general`,
    programId: programSlug,
    name: 'General',
    description: '',
    priority: 99,
    order: 99
  };
  config.categories.push(defaultCategory);

  sections.forEach(sec => {
    // CATEGORIES
    if (matchesAlias(sec.title, ['category', 'categories'])) {
      parseCategories(sec.content, programSlug, config);
    }
    
    // GOALS
    if (matchesAlias(sec.title, ['goal', 'goals'])) {
      parseGoals(sec.content, programSlug, defaultCategory.id, config);
    }
    
    // HABITS
    if (matchesAlias(sec.title, ['habit', 'habits', 'routines'])) {
      parseHabits(sec.content, programSlug, defaultCategory.id, config);
    }
    
    // TASKS
    if (matchesAlias(sec.title, ['task', 'tasks', 'checklist'])) {
      parseTasks(sec.content, programSlug, defaultCategory.id, config);
    }

    // WORKOUTS
    if (matchesAlias(sec.title, ['workout', 'workouts', 'training', 'exercise'])) {
      // Workouts often have sub-sections for days
      parseWorkouts(sec, programSlug, config);
    }

    // STUDY TRACKS & ROADMAP
    if (matchesAlias(sec.title, ['study track', 'learning', 'roadmap', 'tracks'])) {
      parseTracks(sec, programSlug, defaultCategory.id, config);
    }

    // WEEKLY SCHEDULE
    if (matchesAlias(sec.title, ['weekly schedule', 'schedule', 'planner'])) {
      parseSchedule(sec, programSlug, defaultCategory.id, config);
    }

    // SCORECARD
    if (matchesAlias(sec.title, ['scorecard', 'daily score'])) {
      parseScorecard(sec.content, programSlug, config);
    }

    // MILESTONES
    if (matchesAlias(sec.title, ['milestone', 'milestones'])) {
      parseMilestones(sec.content, programSlug, config);
    }
    
    // PROJECTS & IDEAS
    if (matchesAlias(sec.title, ['project', 'projects', 'existing project', 'ideas'])) {
      parseProjects(sec.content, programSlug, config);
    }
  });

  return config;
}

function extractListItems(text: string): string[] {
  const items: string[] = [];
  const lines = text.split('\n');
  for (const line of lines) {
    const m = line.match(/^(\d+\.|-|\*)\s+(.*)/);
    if (m) {
      items.push(m[2].trim());
    }
  }
  return items;
}

function parseCategories(text: string, pId: string, config: WinterArcConfig) {
  const items = extractListItems(text);
  items.forEach((item, index) => {
    config.categories.push({
      id: `${pId}-cat-${generateSlug(item)}`,
      programId: pId,
      name: item,
      description: '',
      priority: index, // default priority based on list order
      order: index
    });
  });
}

function parseGoals(text: string, pId: string, defaultCatId: string, config: WinterArcConfig) {
  const lines = text.split('\n');
  let currentGoal: any = null;

  for (const line of lines) {
    if (line.toLowerCase().startsWith('goal:')) {
      if (currentGoal) config.goals.push(currentGoal);
      const title = line.substring(5).trim().replace(/"/g, '');
      currentGoal = {
        id: `${pId}-goal-${generateSlug(title)}`,
        programId: pId,
        categoryId: defaultCatId, // We might try to infer this later
        title,
        description: '',
        target: 1,
        unit: 'completion',
        deadline: '',
        status: 'active',
        progress: 0
      };
    }
  }
  if (currentGoal) config.goals.push(currentGoal);
}

function parseHabits(text: string, pId: string, defaultCatId: string, config: WinterArcConfig) {
  const lines = text.split('\n');
  let currentHabit: any = null;

  for (const line of lines) {
    const l = line.toLowerCase();
    if (l.startsWith('habit:')) {
      if (currentHabit) config.habits.push(currentHabit);
      const title = line.substring(6).trim().replace(/"/g, '');
      currentHabit = {
        id: `${pId}-habit-${generateSlug(title)}`,
        programId: pId,
        categoryId: defaultCatId,
        title,
        description: '',
        frequency: 'daily',
        target: 1,
        unit: 'time',
        active: true,
        trackingType: 'boolean'
      };
    } else if (currentHabit && l.startsWith('frequency:')) {
      const f = l.substring(10).trim().replace(/"/g, '');
      currentHabit.frequency = f;
    }
  }
  if (currentHabit) config.habits.push(currentHabit);
}

function parseTasks(text: string, pId: string, defaultCatId: string, config: WinterArcConfig) {
  const items = extractListItems(text);
  items.forEach(item => {
    config.tasks.push({
      id: `${pId}-task-${generateSlug(item)}`,
      programId: pId,
      categoryId: defaultCatId,
      title: item,
      description: '',
      status: 'pending',
      completedAt: null
    });
  });
}

function parseWorkouts(section: MarkdownSection, pId: string, config: WinterArcConfig) {
  // Check subsections for days (e.g. MONDAY)
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  const processWorkoutDay = (dayStr: string, content: string) => {
    const lines = content.split('\n');
    let name = dayStr;
    const items = extractListItems(content);
    if (lines.length > 0 && !lines[0].startsWith('-') && !lines[0].match(/^\d+\./)) {
        if (lines[0].trim().length > 0) name = lines[0].trim();
    }
    
    if (name.toLowerCase() === 'rest' || items.length === 0) return;

    const wId = `${pId}-workout-${dayStr.toLowerCase()}`;
    config.workouts.push({
      id: wId,
      programId: pId,
      name,
      dayOfWeek: dayStr.toUpperCase()
    });

    items.forEach((item, index) => {
      // e.g. "Push-ups — 3 sets"
      const parts = item.split('—').map(s => s.trim());
      const exName = parts[0];
      const setsStr = parts.length > 1 ? parts[1] : '3 sets';
      
      let sets = 3;
      const setsMatch = setsStr.match(/(\d+)\s+sets/i);
      if (setsMatch) sets = parseInt(setsMatch[1], 10);

      config.exercises.push({
        id: `${wId}-ex-${index}`,
        workoutId: wId,
        name: exName,
        sets,
        reps: '10', // Default if not found
        duration: 0,
        notes: setsStr,
        progressionPlan: []
      });
    });
  };

  section.subSections.forEach(sub => {
    if (days.includes(sub.title.toLowerCase())) {
      processWorkoutDay(sub.title, sub.content);
    }
  });
  
  // If no subsections, just look for day names in content
  if (section.subSections.length === 0) {
      // Rough parse by line
      let currentDay = '';
      let currentContent = '';
      for (const line of section.content.split('\n')) {
          if (days.includes(line.trim().toLowerCase())) {
              if (currentDay) processWorkoutDay(currentDay, currentContent);
              currentDay = line.trim();
              currentContent = '';
          } else {
              currentContent += line + '\n';
          }
      }
      if (currentDay) processWorkoutDay(currentDay, currentContent);
  }
}

function parseTracks(section: MarkdownSection, pId: string, defaultCatId: string, config: WinterArcConfig) {
  // Check for roadmaps "Python ↓ APIs ↓ LLM APIs"
  let currentTrackName = section.title; // Default track name
  
  const tracksMatch = extractListItems(section.content);
  if (tracksMatch.length > 0) {
      tracksMatch.forEach(t => {
          config.tracks.push({
            id: `${pId}-track-${generateSlug(t)}`,
            programId: pId,
            categoryId: defaultCatId,
            name: t,
            description: '',
            priority: 0,
            weeklyTargetMinutes: 0
          });
      });
  }

  // Very rough parsing for "↓" separated roadmaps
  const stageFlow = section.content.split(/↓/g).map(s => s.trim()).filter(s => s.length > 0);
  if (stageFlow.length > 1) {
      const trackId = `${pId}-track-${generateSlug(currentTrackName)}`;
      if (!config.tracks.find(t => t.id === trackId)) {
          config.tracks.push({
            id: trackId,
            programId: pId,
            categoryId: defaultCatId,
            name: currentTrackName,
            description: '',
            priority: 0,
            weeklyTargetMinutes: 0
          });
      }
      
      stageFlow.forEach((stage, idx) => {
          // clean stage (it might have newlines)
          const cleanStage = stage.replace(/\n/g, ' ').trim();
          config.trackStages.push({
              id: `${trackId}-stage-${idx}`,
              trackId,
              name: cleanStage,
              order: idx,
              status: idx === 0 ? 'active' : 'locked',
              completedAt: null
          });
      });
  }
}

function parseSchedule(section: MarkdownSection, pId: string, defaultCatId: string, config: WinterArcConfig) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let currentDay = '';
    const lines = section.content.split('\n');
    lines.forEach(line => {
        const l = line.trim();
        const dMatch = l.replace(/:$/, '').toLowerCase();
        if (days.includes(dMatch)) {
            currentDay = dMatch.toUpperCase();
        } else if (currentDay && (l.startsWith('-') || l.startsWith('*'))) {
            const content = l.substring(1).trim();
            // e.g. "College — 60 min"
            const parts = content.split('—').map(s => s.trim());
            const title = parts[0];
            let mins = 60;
            if (parts.length > 1) {
                const mm = parts[1].match(/(\d+)/);
                if (mm) mins = parseInt(mm[1], 10);
            }
            
            config.schedules.push({
                id: `${pId}-sched-${currentDay.toLowerCase()}-${generateSlug(title)}`,
                programId: pId,
                dayOfWeek: currentDay,
                title,
                categoryId: defaultCatId,
                durationMinutes: mins,
                type: 'block'
            });
        }
    });
}

function parseScorecard(content: string, pId: string, config: WinterArcConfig) {
    const items = extractListItems(content);
    items.forEach((item, index) => {
        config.scorecards.push({
            id: `${pId}-scorecard-${index}`,
            programId: pId,
            title: item,
            points: 1,
            trackingType: 'boolean',
            active: true
        });
    });
}

function parseMilestones(content: string, pId: string, config: WinterArcConfig) {
    const lines = content.split('\n');
    let currentWeek = 0;
    
    lines.forEach(line => {
        const weekMatch = line.match(/Week (\d+):/i);
        if (weekMatch) {
            currentWeek = parseInt(weekMatch[1], 10);
        } else if (line.startsWith('"') || line.trim().length > 3) {
            let title = line.trim().replace(/^"|"$/g, '');
            if (title.length > 0) {
                config.milestones.push({
                    id: `${pId}-ms-w${currentWeek}-${generateSlug(title)}`,
                    programId: pId,
                    weekNumber: currentWeek,
                    title,
                    status: 'pending'
                });
            }
        }
    });
}

function parseProjects(content: string, pId: string, config: WinterArcConfig) {
    const items = extractListItems(content);
    items.forEach(item => {
        config.ideas.push({
            id: `${pId}-proj-${generateSlug(item)}`,
            programId: pId,
            title: item,
            description: '',
            source: 'markdown',
            status: 'existing' // default as per instructions
        });
    });
}
