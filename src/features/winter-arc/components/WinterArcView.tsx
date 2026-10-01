import { useState, useEffect } from 'react';
import { wadb } from '../data/db';
import { WinterArcImporter } from './WinterArcImporter';
import type { WAProgram, WAGoal, WAHabit, WASchedule, WAStudyTrack, WATrackStage, WAMilestone } from '../data/db';
import { Snowflake, Upload, ChevronRight } from 'lucide-react';

export function WinterArcView() {
  const [activeProgram, setActiveProgram] = useState<WAProgram | null>(null);
  const [goals, setGoals] = useState<WAGoal[]>([]);
  const [habits, setHabits] = useState<WAHabit[]>([]);
  const [schedules, setSchedules] = useState<WASchedule[]>([]);
  const [tracks, setTracks] = useState<WAStudyTrack[]>([]);
  const [stages, setStages] = useState<WATrackStage[]>([]);
  const [milestones, setMilestones] = useState<WAMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImporter, setShowImporter] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const programs = await wadb.programs.toArray();
      const active = programs.find(p => p.status === 'active') || programs[0];
      if (active) {
        setActiveProgram(active);
        const [gs, hs, scheds, ts, ss, ms] = await Promise.all([
          wadb.goals.where('programId').equals(active.id).toArray(),
          wadb.habits.where('programId').equals(active.id).toArray(),
          wadb.schedules.where('programId').equals(active.id).toArray(),
          wadb.tracks.where('programId').equals(active.id).toArray(),
          wadb.trackStages.toArray(),
          wadb.milestones.where('programId').equals(active.id).toArray(),
        ]);
        setGoals(gs);
        setHabits(hs);
        setSchedules(scheds);
        setTracks(ts);
        setStages(ss);
        setMilestones(ms);
      } else {
        setActiveProgram(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <div className="text-sm text-foreground-muted py-8">Loading...</div>;

  if (showImporter || !activeProgram) {
    return (
      <div className="flex flex-col gap-8 fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Winter Arc</h1>
            <p className="text-[14px] text-foreground-muted mt-1">Import your program plan</p>
          </div>
          {activeProgram && (
            <button onClick={() => setShowImporter(false)} className="text-[13px] text-primary hover:underline">
              Back to program
            </button>
          )}
        </div>
        <WinterArcImporter onComplete={() => { setShowImporter(false); loadData(); }} />
      </div>
    );
  }

  // Calculate program progress
  const startDate = activeProgram.startDate ? new Date(activeProgram.startDate) : new Date();
  const now = new Date();
  const weeksElapsed = Math.max(1, Math.ceil((now.getTime() - startDate.getTime()) / (7 * 86400000)));
  const progressPct = Math.min(100, Math.round((weeksElapsed / activeProgram.durationWeeks) * 100));

  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;

  return (
    <div className="flex flex-col gap-10 fade-in">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Snowflake size={20} className="text-primary" />
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Winter Arc</h1>
          </div>
          <p className="text-[14px] text-foreground-muted">
            {activeProgram.durationWeeks}-week personal development plan
          </p>
        </div>
        <button
          onClick={() => setShowImporter(true)}
          className="flex items-center gap-2 text-[13px] text-foreground-secondary hover:text-primary transition-colors px-3 py-2 border border-border rounded-lg"
        >
          <Upload size={14} />
          Import
        </button>
      </div>

      {/* Program Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-semibold text-foreground">{activeProgram.name}</h2>
            <p className="text-[13px] text-foreground-muted mt-0.5">
              Week {Math.min(weeksElapsed, activeProgram.durationWeeks)} of {activeProgram.durationWeeks}
            </p>
          </div>
          <div className="text-2xl font-semibold text-foreground tabular-nums">{progressPct}%</div>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-border">
          <div>
            <div className="text-[12px] text-foreground-muted">Goals</div>
            <div className="text-[16px] font-semibold text-foreground tabular-nums">{completedGoals}/{goals.length}</div>
          </div>
          <div>
            <div className="text-[12px] text-foreground-muted">Habits</div>
            <div className="text-[16px] font-semibold text-foreground tabular-nums">{habits.filter(h => h.active).length} active</div>
          </div>
          <div>
            <div className="text-[12px] text-foreground-muted">Milestones</div>
            <div className="text-[16px] font-semibold text-foreground tabular-nums">{completedMilestones}/{milestones.length}</div>
          </div>
        </div>
      </div>

      {/* Learning Tracks */}
      {tracks.length > 0 && (
        <section>
          <h2 className="text-[15px] font-semibold text-foreground mb-4">Learning tracks</h2>
          <div className="flex flex-col gap-3">
            {tracks.map(track => {
              const trackStages = stages.filter(s => s.trackId === track.id).sort((a, b) => a.order - b.order);
              const completed = trackStages.filter(s => s.status === 'completed').length;
              const activeStage = trackStages.find(s => s.status === 'active');
              return (
                <div key={track.id} className="bg-card border border-border rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[14px] font-medium text-foreground">{track.name}</h3>
                    <span className="text-[12px] text-foreground-muted tabular-nums">{completed}/{trackStages.length} topics</span>
                  </div>
                  {activeStage && (
                    <div className="flex items-center gap-2 text-[13px] text-primary mb-3">
                      <ChevronRight size={14} />
                      Currently: {activeStage.name}
                    </div>
                  )}
                  {trackStages.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {trackStages.map(s => (
                        <span
                          key={s.id}
                          className={`text-[11px] px-2 py-0.5 rounded-md ${
                            s.status === 'completed' ? 'bg-success-muted text-success' :
                            s.status === 'active' ? 'bg-primary-muted text-primary font-medium' :
                            'bg-surface text-foreground-muted'
                          }`}
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Goals */}
      {goals.length > 0 && (
        <section>
          <h2 className="text-[15px] font-semibold text-foreground mb-4">Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goals.map(g => (
              <div key={g.id} className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-foreground">{g.title}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-md ${
                    g.status === 'completed' ? 'bg-success-muted text-success' : 'bg-surface text-foreground-muted'
                  }`}>
                    {g.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[12px] text-foreground-muted">
                  <span>{g.progress}/{g.target} {g.unit}</span>
                  <span>{Math.round((g.progress / Math.max(1, g.target)) * 100)}%</span>
                </div>
                <div className="h-1 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (g.progress / Math.max(1, g.target)) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Weekly Schedule */}
      {schedules.length > 0 && (
        <section>
          <h2 className="text-[15px] font-semibold text-foreground mb-4">Weekly schedule</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => {
              const full = { MON: 'MONDAY', TUE: 'TUESDAY', WED: 'WEDNESDAY', THU: 'THURSDAY', FRI: 'FRIDAY', SAT: 'SATURDAY', SUN: 'SUNDAY' }[day] || day;
              const blocks = schedules.filter(s => s.dayOfWeek === full);
              return (
                <div key={day} className="bg-card border border-border rounded-lg p-3">
                  <div className="text-[11px] font-semibold text-foreground-muted uppercase mb-2">{day}</div>
                  {blocks.length === 0 && <div className="text-[12px] text-foreground-muted/40">—</div>}
                  {blocks.map(b => (
                    <div key={b.id} className="text-[12px] text-foreground mb-1.5 last:mb-0">
                      <div className="font-medium">{b.title}</div>
                      <div className="text-foreground-muted">{b.durationMinutes} min</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Milestones */}
      {milestones.length > 0 && (
        <section>
          <h2 className="text-[15px] font-semibold text-foreground mb-4">Milestones</h2>
          <div className="flex flex-col gap-2">
            {milestones.sort((a, b) => a.weekNumber - b.weekNumber).map(m => (
              <div key={m.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${m.status === 'completed' ? 'bg-success' : 'bg-border'}`} />
                <span className="text-[13px] text-foreground flex-1">{m.title}</span>
                <span className="text-[12px] text-foreground-muted tabular-nums">Week {m.weekNumber}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
