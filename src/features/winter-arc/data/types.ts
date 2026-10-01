import type { 
  WAProgram, WACategory, WAGoal, WAHabit, WATask, WAWorkout, 
  WAExercise, WAStudyTrack, WATrackStage, WASchedule, WAScorecardItem, 
  WAWeeklyReview, WAMilestone, WAIdea 
} from './db';

export interface WinterArcConfig {
  program: WAProgram;
  categories: WACategory[];
  goals: WAGoal[];
  habits: WAHabit[];
  tasks: WATask[];
  workouts: WAWorkout[];
  exercises: WAExercise[];
  tracks: WAStudyTrack[];
  trackStages: WATrackStage[];
  schedules: WASchedule[];
  scorecards: WAScorecardItem[];
  reviews: WAWeeklyReview[];
  milestones: WAMilestone[];
  ideas: WAIdea[];
}
