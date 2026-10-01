import { useState, useEffect } from 'react';
import { wadb } from '../data/db';
import { WinterArcImporter } from './WinterArcImporter';
import type { WAProgram, WAGoal, WAHabit, WASchedule } from '../data/db';

export function WinterArcView() {
  const [activeProgram, setActiveProgram] = useState<WAProgram | null>(null);
  const [goals, setGoals] = useState<WAGoal[]>([]);
  const [habits, setHabits] = useState<WAHabit[]>([]);
  const [schedules, setSchedules] = useState<WASchedule[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [showImporter, setShowImporter] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const programs = await wadb.programs.toArray();
      const active = programs.find(p => p.status === 'active') || programs[0];
      
      if (active) {
        setActiveProgram(active);
        const [, gs, hs, scheds] = await Promise.all([
          wadb.categories.where('programId').equals(active.id).toArray(),
          wadb.goals.where('programId').equals(active.id).toArray(),
          wadb.habits.where('programId').equals(active.id).toArray(),
          wadb.schedules.where('programId').equals(active.id).toArray(),
        ]);
        setGoals(gs);
        setHabits(hs);
        setSchedules(scheds);
      } else {
        setActiveProgram(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground uppercase tracking-widest text-[11px]">Loading Archives...</div>;
  }

  if (showImporter || !activeProgram) {
    return (
      <div className="p-4 md:p-8 overflow-y-auto no-scrollbar absolute inset-0 z-10 font-mono bg-[#050505]">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold tracking-[0.2em] uppercase text-primary">Winter Arc Systems</h2>
            {activeProgram && (
              <button 
                onClick={() => setShowImporter(false)}
                className="text-[11px] uppercase tracking-widest border border-white/20 px-3 py-1 hover:bg-white/10"
              >
                BACK
              </button>
            )}
          </div>
          <WinterArcImporter onComplete={() => { setShowImporter(false); loadData(); }} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 overflow-y-auto no-scrollbar absolute inset-0 z-10 font-mono bg-[#050505]">
      <div className="max-w-5xl mx-auto flex flex-col gap-12 pb-24">
        
        {/* Header */}
        <div className="flex justify-between items-start w-full border-b border-primary/20 pb-4 relative">
          <div className="flex flex-col gap-2">
            <div className="text-[10px] text-primary tracking-[0.4em] font-bold uppercase drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]">
              ACTIVE PROGRAM
            </div>
            <div className="text-[20px] md:text-[28px] text-white tracking-[0.2em] font-bold uppercase">
              {activeProgram.name}
            </div>
            <div className="text-[11px] text-muted-foreground tracking-[0.2em]">
              COMMENCES: {activeProgram.startDate || 'TBD'} // DURATION: {activeProgram.durationWeeks} WEEKS
            </div>
          </div>
          <button 
            onClick={() => setShowImporter(true)}
            className="px-4 py-2 bg-primary/10 text-primary border border-primary/50 hover:bg-primary/20 uppercase tracking-widest text-[10px]"
          >
            IMPORT / UPDATE
          </button>
        </div>

        {/* Goals & Habits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-black/40 border border-white/10 p-6 flex flex-col gap-6">
            <div className="text-[12px] text-primary tracking-[0.3em] uppercase">Primary Goals</div>
            <div className="flex flex-col gap-4">
              {goals.length === 0 && <div className="text-muted-foreground text-[10px]">No goals defined.</div>}
              {goals.map(g => (
                <div key={g.id} className="border-b border-white/5 pb-2">
                  <div className="text-[12px] text-white uppercase tracking-wider">{g.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">TARGET: {g.target} {g.unit}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 p-6 flex flex-col gap-6">
            <div className="text-[12px] text-primary tracking-[0.3em] uppercase">Core Habits</div>
            <div className="flex flex-col gap-4">
              {habits.length === 0 && <div className="text-muted-foreground text-[10px]">No habits defined.</div>}
              {habits.map(h => (
                <div key={h.id} className="border-b border-white/5 pb-2">
                  <div className="text-[12px] text-white uppercase tracking-wider">{h.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">FREQ: {h.frequency}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule Preview */}
        <div className="bg-black/40 border border-white/10 p-6 flex flex-col gap-6">
          <div className="text-[12px] text-primary tracking-[0.3em] uppercase">Weekly Block Schedule</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(day => {
              const dayBlocks = schedules.filter(s => s.dayOfWeek === day);
              return (
                <div key={day} className="flex flex-col gap-2 border border-white/5 p-3">
                  <div className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">{day}</div>
                  {dayBlocks.map(b => (
                    <div key={b.id} className="text-[11px] text-white border-l-2 border-primary pl-2 mb-2">
                      <div className="uppercase">{b.title}</div>
                      <div className="text-[9px] text-muted-foreground">{b.durationMinutes} MIN</div>
                    </div>
                  ))}
                  {dayBlocks.length === 0 && <div className="text-[10px] text-muted-foreground/30">REST</div>}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
