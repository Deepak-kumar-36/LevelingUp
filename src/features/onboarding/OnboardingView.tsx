import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { DEFAULT_QUESTS } from '../../lib/constants';
import type { Quest } from '../../types';

const FOCUS_AREAS: { id: string; label: string; description: string; quests: Quest[] }[] = [
  {
    id: 'coding', label: 'Coding & DSA', description: 'Practice problems, dev work, contests',
    quests: [
      { id: 'q_dsa', name: 'DSA Practice', xp: 50, coins: 10, gains: { intelligence: 2, discipline: 1 } },
      { id: 'q_dev', name: 'Dev Work', xp: 50, coins: 10, gains: { builder: 2, discipline: 1 } },
      { id: 'q_contest', name: 'Contest Problem', xp: 30, coins: 5, gains: { intelligence: 1, discipline: 1 } },
    ]
  },
  {
    id: 'fitness', label: 'Health & Fitness', description: 'Workouts, nutrition, recovery',
    quests: [
      { id: 'q_gym', name: 'Workout', xp: 40, coins: 8, gains: { vitality: 3, discipline: 1 } },
      { id: 'q_cal', name: 'Calories Goal', xp: 20, coins: 5, gains: { vitality: 2 } },
      { id: 'q_prot', name: 'Protein Goal', xp: 20, coins: 5, gains: { vitality: 2 } },
    ]
  },
  {
    id: 'study', label: 'College & Study', description: 'Lectures, reading, revision',
    quests: [
      { id: 'q_lecture', name: 'Attend Lecture', xp: 30, coins: 5, gains: { intelligence: 2 } },
      { id: 'q_read', name: 'Reading (30min)', xp: 25, coins: 5, gains: { intelligence: 1, discipline: 1 } },
      { id: 'q_revision', name: 'Revision / Notes', xp: 20, coins: 5, gains: { intelligence: 1, discipline: 1 } },
    ]
  },
  {
    id: 'finance', label: 'Finance', description: 'Budget tracking, spending awareness',
    quests: [
      { id: 'q_expense', name: 'Expense Entry', xp: 10, coins: 2, gains: { wealth: 1, discipline: 1 } },
      { id: 'q_save', name: 'No Unnecessary Spend', xp: 15, coins: 3, gains: { wealth: 2, discipline: 1 } },
    ]
  },
  {
    id: 'creative', label: 'Creative Work', description: 'Projects, building, journaling',
    quests: [
      { id: 'q_create', name: 'Creative Work (1hr)', xp: 40, coins: 8, gains: { builder: 2, intelligence: 1 } },
      { id: 'q_journal', name: 'Journaling', xp: 15, coins: 3, gains: { discipline: 1 } },
    ]
  },
  {
    id: 'habits', label: 'Daily Habits', description: 'Routines, sleep, screen time',
    quests: [
      { id: 'q_note', name: 'Daily Note', xp: 10, coins: 2, gains: { discipline: 1 } },
      { id: 'q_sleep', name: 'Sleep by 11pm', xp: 15, coins: 3, gains: { vitality: 1, discipline: 1 } },
      { id: 'q_screen', name: 'Screen Time < 2hr', xp: 20, coins: 5, gains: { discipline: 2 } },
    ]
  }
];

export function OnboardingView() {
  const { setData } = useAppStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const toggleArea = (id: string) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const finish = () => {
    const chosenQuests = FOCUS_AREAS
      .filter(a => selected.includes(a.id))
      .flatMap(a => a.quests);
    const finalQuests = chosenQuests.length > 0 ? chosenQuests : DEFAULT_QUESTS;
    setData(d => ({
      ...d,
      setupDone: true,
      user: { ...d.user, name: name.trim() || 'User' },
      quests: finalQuests
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-background">
      <div className="w-full max-w-md">

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i <= step ? 'w-8 bg-primary' : 'w-4 bg-border'}`} />
          ))}
        </div>

        {/* Step 0: Name */}
        {step === 0 && (
          <div className="fade-in text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome to Leveling Up</h1>
            <p className="text-[14px] text-foreground-muted mb-10">Your personal productivity system.</p>

            <div className="text-left mb-8">
              <label className="text-[12px] text-foreground-muted mb-2 block">What should we call you?</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-border rounded-lg text-[15px] text-foreground bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                autoFocus
              />
            </div>

            <button
              onClick={() => setStep(1)}
              disabled={!name.trim()}
              className={`w-full py-3 rounded-lg text-[14px] font-medium transition-all ${
                name.trim()
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'bg-surface text-foreground-muted cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 1: Focus Areas */}
        {step === 1 && (
          <div className="fade-in">
            <h2 className="text-xl font-semibold text-foreground mb-2 text-center">What do you want to track?</h2>
            <p className="text-[14px] text-foreground-muted mb-8 text-center">Select the areas relevant to you.</p>

            <div className="flex flex-col gap-2 mb-8 max-h-[50vh] overflow-y-auto">
              {FOCUS_AREAS.map(area => {
                const active = selected.includes(area.id);
                return (
                  <button
                    key={area.id}
                    onClick={() => toggleArea(area.id)}
                    className={`text-left p-4 rounded-lg border transition-all ${
                      active
                        ? 'border-primary bg-primary-muted'
                        : 'border-border bg-card hover:border-foreground-muted'
                    }`}
                  >
                    <div className={`text-[14px] font-medium ${active ? 'text-primary' : 'text-foreground'}`}>
                      {area.label}
                    </div>
                    <div className="text-[12px] text-foreground-muted mt-0.5">{area.description}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 py-3 border border-border rounded-lg text-[14px] text-foreground-secondary hover:bg-surface transition-colors">
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={selected.length === 0}
                className={`flex-1 py-3 rounded-lg text-[14px] font-medium transition-all ${
                  selected.length > 0 ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-surface text-foreground-muted cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Summary */}
        {step === 2 && (
          <div className="fade-in">
            <h2 className="text-xl font-semibold text-foreground mb-2 text-center">Ready to go, {name}.</h2>
            <p className="text-[14px] text-foreground-muted mb-8 text-center">
              Here's what you'll be tracking daily.
            </p>

            <div className="bg-card border border-border rounded-lg p-4 mb-8">
              <div className="text-[12px] font-semibold text-foreground-muted uppercase tracking-wider mb-3">Daily tasks</div>
              <div className="flex flex-col gap-2">
                {FOCUS_AREAS.filter(a => selected.includes(a.id)).flatMap(a => a.quests).map(q => (
                  <div key={q.id} className="flex items-center gap-3 text-[14px] text-foreground py-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {q.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 border border-border rounded-lg text-[14px] text-foreground-secondary hover:bg-surface transition-colors">
                Back
              </button>
              <button
                onClick={finish}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg text-[14px] font-medium hover:opacity-90 transition-opacity"
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
