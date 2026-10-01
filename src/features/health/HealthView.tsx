import { useState, useEffect } from 'react';
import { db } from '../vitality/data/db';
import type { VitalsEntry, Workout } from '../vitality/data/db';
import { formatDateKey } from '../../store/useAppStore';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Plus, X, Activity } from 'lucide-react';

export function HealthView({ toast }: { toast: (msg: string) => void }) {
  const TK = formatDateKey(new Date());

  const [vitals, setVitals] = useState<VitalsEntry[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showVitalsForm, setShowVitalsForm] = useState(false);
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  
  // Vitals form
  const [weight, setWeight] = useState('');
  const [sleep, setSleep] = useState('');
  
  // Workout form
  const [workoutType, setWorkoutType] = useState('Strength');
  const [duration, setDuration] = useState('');
  const [workoutNotes, setWorkoutNotes] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [vs, ws] = await Promise.all([
        db.vitals.orderBy('date').reverse().limit(14).toArray(),
        db.workouts.orderBy('date').reverse().limit(10).toArray(),
      ]);
      setVitals(vs.reverse()); // Chronological for chart
      setWorkouts(ws);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const saveVitals = async () => {
    const w = parseFloat(weight);
    const s = parseFloat(sleep);
    
    if (isNaN(w) && isNaN(s)) return;

    try {
      const existing = await db.vitals.get(TK);
      await db.vitals.put({
        date: TK,
        sleepHours: isNaN(s) ? (existing?.sleepHours || null) : s,
        sleepQuality: existing?.sleepQuality || null,
        waterIntakeMl: existing?.waterIntakeMl || 0,
        mood: existing?.mood || null,
        energy: existing?.energy || null,
        weightKg: isNaN(w) ? (existing?.weightKg || null) : w,
        notes: existing?.notes || ''
      });
      setShowVitalsForm(false);
      setWeight('');
      setSleep('');
      toast('Vitals saved');
      loadData();
    } catch (e) {
      toast('Failed to save vitals');
    }
  };

  const saveWorkout = async () => {
    const d = parseInt(duration, 10);
    if (isNaN(d) || !workoutType.trim()) return;

    try {
      await db.workouts.add({
        id: 'w_' + Date.now().toString(36),
        date: TK,
        type: workoutType,
        exercises: [],
        totalDurationMin: d,
        notes: workoutNotes
      });
      setShowWorkoutForm(false);
      setWorkoutType('Strength');
      setDuration('');
      setWorkoutNotes('');
      toast('Workout logged');
      loadData();
    } catch (e) {
      toast('Failed to save workout');
    }
  };

  if (loading) return <div className="text-sm text-foreground-muted py-8">Loading...</div>;

  // Weight Trend Data
  const weightData = vitals
    .filter(v => v.weightKg !== null)
    .map(v => ({ date: v.date.slice(5), weight: v.weightKg as number }));

  const currentWeight = weightData.length > 0 ? weightData[weightData.length - 1].weight : null;
  const firstWeight = weightData.length > 0 ? weightData[0].weight : null;
  const weightChange = (currentWeight && firstWeight) ? (currentWeight - firstWeight).toFixed(1) : '0.0';

  return (
    <div className="flex flex-col gap-10 fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Health</h1>
          <p className="text-[14px] text-foreground-muted mt-1">Track physical progress and recovery</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Weight Trend */}
        <section className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[14px] font-medium text-foreground">Weight trend</h2>
              <div className="text-[12px] text-foreground-muted">Last 14 days</div>
            </div>
            {currentWeight && (
              <div className="text-right">
                <div className="text-[20px] font-semibold tabular-nums">{currentWeight} kg</div>
                <div className={`text-[12px] tabular-nums ${parseFloat(weightChange) >= 0 ? 'text-success' : 'text-foreground-muted'}`}>
                  {parseFloat(weightChange) >= 0 ? '+' : ''}{weightChange} kg
                </div>
              </div>
            )}
          </div>
          
          <div className="h-[160px] w-full">
            {weightData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="var(--color-border)" tick={{ fontSize: 11, fill: 'var(--color-foreground-muted)' }} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="var(--color-border)" tick={{ fontSize: 11, fill: 'var(--color-foreground-muted)' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Line type="monotone" dataKey="weight" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-card)', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[13px] text-foreground-muted">
                Not enough data for trend line.
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setShowVitalsForm(true)}
            className="w-full mt-4 py-2 bg-surface hover:bg-surface-hover text-foreground-secondary text-[13px] rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Log weight & sleep
          </button>
        </section>

        {/* Workouts */}
        <section className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-medium text-foreground">Recent workouts</h2>
            <button 
              onClick={() => setShowWorkoutForm(true)}
              className="p-1.5 bg-surface hover:bg-surface-hover text-foreground-secondary rounded-md transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          
          {workouts.length === 0 ? (
            <div className="text-[13px] text-foreground-muted text-center py-8">
              No workouts logged recently.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {workouts.slice(0, 5).map(w => (
                <div key={w.id} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-muted text-primary rounded-md">
                      <Activity size={16} />
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-foreground">{w.type}</div>
                      <div className="text-[12px] text-foreground-muted">{w.date}</div>
                    </div>
                  </div>
                  <div className="text-[13px] text-foreground-secondary tabular-nums">
                    {w.totalDurationMin} min
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Forms (Modals) */}
      {showVitalsForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4" onClick={() => setShowVitalsForm(false)}>
          <div className="w-full max-w-sm bg-card border border-border rounded-xl p-6 shadow-lg flex flex-col gap-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[16px] font-semibold text-foreground">Log vitals</h3>
              <button onClick={() => setShowVitalsForm(false)} className="p-1 text-foreground-muted hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            
            <div>
              <label className="text-[12px] text-foreground-muted mb-1.5 block">Weight (kg)</label>
              <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-[14px] bg-background" autoFocus />
            </div>
            <div>
              <label className="text-[12px] text-foreground-muted mb-1.5 block">Sleep (hours)</label>
              <input type="number" step="0.5" value={sleep} onChange={e => setSleep(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-[14px] bg-background" />
            </div>
            
            <button onClick={saveVitals} className="w-full mt-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-[14px] font-medium">Save</button>
          </div>
        </div>
      )}

      {showWorkoutForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4" onClick={() => setShowWorkoutForm(false)}>
          <div className="w-full max-w-sm bg-card border border-border rounded-xl p-6 shadow-lg flex flex-col gap-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[16px] font-semibold text-foreground">Log workout</h3>
              <button onClick={() => setShowWorkoutForm(false)} className="p-1 text-foreground-muted hover:text-foreground"><X size={18} /></button>
            </div>
            
            <div>
              <label className="text-[12px] text-foreground-muted mb-1.5 block">Type</label>
              <select value={workoutType} onChange={e => setWorkoutType(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-[14px] bg-background">
                <option>Strength</option>
                <option>Cardio</option>
                <option>Mobility</option>
                <option>Sport</option>
              </select>
            </div>
            <div>
              <label className="text-[12px] text-foreground-muted mb-1.5 block">Duration (minutes)</label>
              <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-[14px] bg-background" />
            </div>
            <div>
              <label className="text-[12px] text-foreground-muted mb-1.5 block">Notes</label>
              <input type="text" value={workoutNotes} onChange={e => setWorkoutNotes(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-[14px] bg-background" placeholder="e.g. Legs focus, felt good" />
            </div>
            
            <button onClick={saveWorkout} className="w-full mt-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-[14px] font-medium">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
