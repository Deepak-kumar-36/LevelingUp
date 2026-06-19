import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { QUESTS } from '../../lib/html-constants';

const FOCUS_AREAS: { id: string; label: string; icon: string; quests: any[] }[] = [
  {
    id: 'coding', label: 'CODING', icon: '⌨',
    quests: [
      { id: 'q_dsa', name: 'DSA PRACTICE', xp: 50, coins: 10, gains: { intelligence: 2, discipline: 1 } },
      { id: 'q_dev', name: 'DEV WORK', xp: 50, coins: 10, gains: { builder: 2, discipline: 1 } },
      { id: 'q_contest', name: 'CONTEST PROBLEM', xp: 30, coins: 5, gains: { intelligence: 1, discipline: 1 } },
    ]
  },
  {
    id: 'fitness', label: 'FITNESS', icon: '💪',
    quests: [
      { id: 'q_gym', name: 'GYM / WORKOUT', xp: 40, coins: 8, gains: { vitality: 3, discipline: 1 } },
      { id: 'q_cal', name: 'CALORIES GOAL', xp: 20, coins: 5, gains: { vitality: 2 } },
      { id: 'q_prot', name: 'PROTEIN GOAL', xp: 20, coins: 5, gains: { vitality: 2 } },
    ]
  },
  {
    id: 'study', label: 'STUDY', icon: '📚',
    quests: [
      { id: 'q_lecture', name: 'ATTEND LECTURE', xp: 30, coins: 5, gains: { intelligence: 2 } },
      { id: 'q_read', name: 'READING (30MIN)', xp: 25, coins: 5, gains: { intelligence: 1, discipline: 1 } },
      { id: 'q_revision', name: 'REVISION / NOTES', xp: 20, coins: 5, gains: { intelligence: 1, discipline: 1 } },
    ]
  },
  {
    id: 'finance', label: 'FINANCE', icon: '💰',
    quests: [
      { id: 'q_expense', name: 'EXPENSE ENTRY', xp: 10, coins: 2, gains: { wealth: 1, discipline: 1 } },
      { id: 'q_save', name: 'NO UNNECESSARY SPEND', xp: 15, coins: 3, gains: { wealth: 2, discipline: 1 } },
    ]
  },
  {
    id: 'creative', label: 'CREATIVE', icon: '🎨',
    quests: [
      { id: 'q_create', name: 'CREATIVE WORK (1HR)', xp: 40, coins: 8, gains: { builder: 2, intelligence: 1 } },
      { id: 'q_journal', name: 'JOURNALING', xp: 15, coins: 3, gains: { discipline: 1 } },
    ]
  },
  {
    id: 'habits', label: 'HABITS', icon: '⚡',
    quests: [
      { id: 'q_note', name: 'DAILY NOTE', xp: 10, coins: 2, gains: { discipline: 1 } },
      { id: 'q_sleep', name: 'SLEEP BY 11PM', xp: 15, coins: 3, gains: { vitality: 1, discipline: 1 } },
      { id: 'q_screen', name: 'SCREEN TIME < 2HR', xp: 20, coins: 5, gains: { discipline: 2 } },
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
    const chosenQuests: any[] = FOCUS_AREAS
      .filter(a => selected.includes(a.id))
      .flatMap(a => a.quests);

    // If nothing picked, give them default quests
    const finalQuests: any[] = chosenQuests.length > 0 ? chosenQuests : QUESTS as any[];

    setData(d => ({
      ...d,
      setupDone: true,
      user: { ...d.user, name: (name || 'HUNTER').toUpperCase() },
      quests: finalQuests as any
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Progress Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-[3px] flex-1 transition-all duration-500 ${i <= step ? 'bg-foreground' : 'bg-muted'}`} />
          ))}
        </div>
      </div>

      {/* Step 0: Name */}
      {step === 0 && (
        <div className="max-w-md w-full text-center fade-in">
          <svg width="48" height="48" viewBox="0 0 1024 1024" className="text-foreground mx-auto mb-6">
            <g>
              <path d="M 250 800 L 380 800 L 512 600 L 644 800 L 774 800 L 512 350 Z" fill="currentColor" />
              <path d="M 512 470 L 350 730 L 430 730 L 512 600 L 594 730 L 674 730 Z" fill="currentColor" />
            </g>
          </svg>
          <h1 className="text-xl font-bold tracking-[4px] mb-2 uppercase">LEVELING UP</h1>
          <p className="text-[11px] text-muted-foreground tracking-[2px] mb-8 uppercase">
            Turn your life into a game
          </p>

          <div className="bg-card border border-border p-6 text-left">
            <div className="text-[10px] text-muted-foreground uppercase tracking-[3px] mb-2">
              What is your Hunter name?
            </div>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="ENTER YOUR NAME"
              className="w-full bg-background border border-border p-3 mb-4 font-mono text-sm outline-none text-foreground tracking-[2px] uppercase"
              autoFocus
            />
            <button
              onClick={() => setStep(1)}
              disabled={!name.trim()}
              className={`w-full p-3 text-[11px] font-bold tracking-[3px] uppercase border transition-colors ${
                name.trim()
                  ? 'bg-foreground text-background border-foreground hover:opacity-90'
                  : 'bg-muted text-muted-foreground border-border cursor-not-allowed'
              }`}
            >
              CONTINUE →
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Focus Areas */}
      {step === 1 && (
        <div className="max-w-md w-full text-center fade-in">
          <h2 className="text-lg font-bold tracking-[3px] mb-1 uppercase">CHOOSE YOUR PATH</h2>
          <p className="text-[10px] text-muted-foreground tracking-[2px] mb-6 uppercase">
            Pick the areas you want to level up (select multiple)
          </p>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {FOCUS_AREAS.map(area => {
              const active = selected.includes(area.id);
              return (
                <button
                  key={area.id}
                  onClick={() => toggleArea(area.id)}
                  className={`p-4 border text-left transition-all ${
                    active
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-card border-border hover:bg-muted'
                  }`}
                >
                  <div className="text-xl mb-1">{area.icon}</div>
                  <div className="text-[11px] font-bold tracking-[2px] uppercase">{area.label}</div>
                  <div className="text-[9px] tracking-[1px] mt-1 opacity-70">
                    {area.quests.length} QUESTS
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(0)}
              className="px-4 py-3 border border-border text-[11px] tracking-[2px] uppercase bg-background hover:bg-muted"
            >
              ← BACK
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={selected.length === 0}
              className={`flex-1 py-3 text-[11px] font-bold tracking-[3px] uppercase border transition-colors ${
                selected.length > 0
                  ? 'bg-foreground text-background border-foreground hover:opacity-90'
                  : 'bg-muted text-muted-foreground border-border cursor-not-allowed'
              }`}
            >
              CONTINUE →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Summary & Begin */}
      {step === 2 && (
        <div className="max-w-md w-full text-center fade-in">
          <h2 className="text-lg font-bold tracking-[3px] mb-1 uppercase">READY, {name.toUpperCase()}?</h2>
          <p className="text-[10px] text-muted-foreground tracking-[2px] mb-6 uppercase">
            Here is your starting loadout
          </p>

          <div className="bg-card border border-border p-4 mb-4 text-left">
            <div className="text-[10px] font-bold tracking-[2px] mb-3 text-muted-foreground uppercase">
              YOUR DAILY QUESTS
            </div>
            {FOCUS_AREAS.filter(a => selected.includes(a.id)).flatMap(a => a.quests).map((q: any) => (
              <div key={q.id} className="flex justify-between py-1.5 border-b border-border text-[11px]">
                <span className="tracking-[1px]">{q.name}</span>
                <span className="text-muted-foreground">+{q.xp} XP</span>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border p-4 mb-6 text-left">
            <div className="text-[10px] font-bold tracking-[2px] mb-3 text-muted-foreground uppercase">
              HOW IT WORKS
            </div>
            <div className="space-y-2 text-[11px] tracking-[1px]">
              <div className="flex gap-2">
                <span className="text-success">✓</span>
                <span>Complete quests daily to earn <span className="font-bold">XP</span> and <span className="font-bold">Coins</span></span>
              </div>
              <div className="flex gap-2">
                <span className="text-success">✓</span>
                <span>Maintain your <span className="font-bold">Streak</span> by finishing 70%+ daily</span>
              </div>
              <div className="flex gap-2">
                <span className="text-success">✓</span>
                <span>Rank up from <span className="font-bold">E → D → C → B → A → S</span></span>
              </div>
              <div className="flex gap-2">
                <span className="text-success">✓</span>
                <span>Fight <span className="font-bold">Bosses</span> and spend Coins in the <span className="font-bold">Shop</span></span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-3 border border-border text-[11px] tracking-[2px] uppercase bg-background hover:bg-muted"
            >
              ← BACK
            </button>
            <button
              onClick={finish}
              className="flex-1 py-3 text-[11px] font-bold tracking-[3px] uppercase bg-foreground text-background border border-foreground hover:opacity-90"
            >
              ⚔ BEGIN YOUR JOURNEY
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
