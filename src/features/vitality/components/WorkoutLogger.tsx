import { useState } from 'react';
import { db } from '../data/db'; import type { Workout, WorkoutExercise } from '../data/db';
import { generateId } from '../../../store/useAppStore';
import { vibrateLight, vibrateSuccess } from '../../../lib/haptics';
import { Save, Plus, Trash2 } from 'lucide-react';

interface Props {
  onXpEvent?: (event: 'workout_logged' | 'pr_achieved', payload?: any) => void;
  onClose: () => void;
}

export function WorkoutLogger({ onXpEvent, onClose }: Props) {
  const today = new Date().toISOString().split('T')[0];
  
  const [workout, setWorkout] = useState<Partial<Workout>>({
    date: today,
    type: 'STRENGTH',
    exercises: [],
    totalDurationMin: 60,
    notes: ''
  });

  const addExercise = () => {
    vibrateLight();
    setWorkout(prev => ({
      ...prev,
      exercises: [...(prev.exercises || []), { name: '', sets: 1, reps: 0, weight: 0, durationMin: 0 }]
    }));
  };

  const updateExercise = (idx: number, field: keyof WorkoutExercise, value: string | number) => {
    const newEx = [...(workout.exercises || [])];
    newEx[idx] = { ...newEx[idx], [field]: value };
    setWorkout({ ...workout, exercises: newEx });
  };

  const removeExercise = (idx: number) => {
    vibrateLight();
    const newEx = [...(workout.exercises || [])];
    newEx.splice(idx, 1);
    setWorkout({ ...workout, exercises: newEx });
  };

  const detectPRs = async (exercises: WorkoutExercise[]) => {
    let prHit = false;
    // Iterate over historical workouts
    const history = await db.workouts.toArray();
    
    for (const ex of exercises) {
      if (!ex.name.trim()) continue;
      
      const currentVolume = ex.weight * ex.reps * ex.sets;
      if (currentVolume === 0) continue;

      let maxHistoricalVolume = 0;
      history.forEach(hw => {
        hw.exercises.forEach(hex => {
          if (hex.name.toLowerCase() === ex.name.toLowerCase()) {
            const vol = hex.weight * hex.reps * hex.sets;
            if (vol > maxHistoricalVolume) maxHistoricalVolume = vol;
          }
        });
      });

      if (currentVolume > maxHistoricalVolume && maxHistoricalVolume > 0) {
        prHit = true;
      }
    }
    return prHit;
  };

  const handleSave = async () => {
    vibrateSuccess();
    
    const isPr = await detectPRs(workout.exercises || []);
    if (isPr && onXpEvent) {
      onXpEvent('pr_achieved', { type: workout.type });
    }

    const newWorkout: Workout = {
      id: 'wo_' + generateId(),
      date: workout.date || today,
      type: workout.type || 'UNKNOWN',
      exercises: workout.exercises || [],
      totalDurationMin: workout.totalDurationMin || 0,
      notes: workout.notes || ''
    };

    await db.workouts.put(newWorkout);
    if (onXpEvent) onXpEvent('workout_logged');
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] p-4 text-foreground font-mono animate-in fade-in overflow-y-auto">
      <div className="mb-6 border-b border-primary/20 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-[16px] text-primary font-bold tracking-[0.2em] uppercase">COMBAT LOG</h2>
          <p className="text-[10px] text-muted-foreground tracking-[0.1em]">{workout.date}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        
        {/* Metadata */}
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col">
            <label className="text-[9px] text-primary mb-1 tracking-[0.2em]">PROTOCOL TYPE</label>
            <input 
              value={workout.type}
              onChange={e => setWorkout({...workout, type: e.target.value})}
              className="bg-black/60 border border-white/20 p-2 text-[12px] uppercase focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-[9px] text-primary mb-1 tracking-[0.2em]">DURATION (MIN)</label>
            <input 
              type="number"
              value={workout.totalDurationMin}
              onChange={e => setWorkout({...workout, totalDurationMin: parseInt(e.target.value) || 0})}
              className="bg-black/60 border border-white/20 p-2 text-[12px] focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Exercises */}
        <div className="mt-4">
          <div className="text-[10px] text-primary mb-3 tracking-[0.2em] flex justify-between items-center">
            <span>EXERCISES</span>
            <button onClick={addExercise} className="text-primary hover:text-white"><Plus size={14}/></button>
          </div>
          
          <div className="flex flex-col gap-2">
            {(workout.exercises || []).map((ex, i) => (
              <div key={i} className="flex gap-2 items-center bg-black/40 border border-white/10 p-2">
                <input 
                  placeholder="NAME"
                  value={ex.name}
                  onChange={e => updateExercise(i, 'name', e.target.value)}
                  className="bg-transparent w-1/3 text-[11px] uppercase focus:outline-none border-b border-white/10"
                />
                <input 
                  type="number"
                  placeholder="SETS"
                  value={ex.sets || ''}
                  onChange={e => updateExercise(i, 'sets', parseInt(e.target.value) || 0)}
                  className="bg-transparent w-1/6 text-[11px] focus:outline-none border-b border-white/10 text-center"
                />
                <span className="text-[10px] text-muted-foreground">x</span>
                <input 
                  type="number"
                  placeholder="REPS"
                  value={ex.reps || ''}
                  onChange={e => updateExercise(i, 'reps', parseInt(e.target.value) || 0)}
                  className="bg-transparent w-1/6 text-[11px] focus:outline-none border-b border-white/10 text-center"
                />
                <input 
                  type="number"
                  placeholder="KG"
                  value={ex.weight || ''}
                  onChange={e => updateExercise(i, 'weight', parseFloat(e.target.value) || 0)}
                  className="bg-transparent w-1/6 text-[11px] focus:outline-none border-b border-white/10 text-right pr-1"
                />
                <button onClick={() => removeExercise(i)} className="p-1 text-muted-foreground hover:text-red-500">
                  <Trash2 size={12}/>
                </button>
              </div>
            ))}
            {(workout.exercises?.length === 0) && (
              <div className="text-[10px] text-muted-foreground/50 text-center py-4 tracking-[0.1em] border border-dashed border-white/10">
                NO EXERCISES LOGGED
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="mt-8 mb-4">
        <button 
          onClick={handleSave}
          className="w-full bg-primary/10 border border-primary text-primary py-4 font-bold tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary hover:text-black transition-colors"
        >
          <Save size={16} /> SEAL RECORD
        </button>
      </div>

    </div>
  );
}
