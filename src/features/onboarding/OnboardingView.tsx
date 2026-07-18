import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { DEFAULT_QUESTS } from '../../lib/constants';
import type { Quest } from '../../types';

const FOCUS_AREAS: { id: string; label: string; icon: string; quests: Quest[] }[] = [
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
    const chosenQuests = FOCUS_AREAS
      .filter(a => selected.includes(a.id))
      .flatMap(a => a.quests);

    const finalQuests = chosenQuests.length > 0 ? chosenQuests : DEFAULT_QUESTS;

    setData(d => ({
      ...d,
      setupDone: true,
      user: { ...d.user, name: (name || 'HUNTER').toUpperCase() },
      quests: finalQuests
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 z-10 relative bg-[#030303]">
      <div className="absolute inset-0 z-0 pointer-events-none void-gradient" />

      {/* Progress Indicator */}
      <div className="z-10 text-[10px] text-muted-foreground tracking-[0.3em] uppercase mb-16 absolute top-12">
        [ INITIATION : STEP {step + 1}/3 ]
      </div>

      {/* Step 0: Name */}
      {step === 0 && (
        <div className="max-w-md w-full text-center fade-in z-10">
          <h1 className="text-[24px] font-bold tracking-[0.2em] mb-2 uppercase text-glow text-primary">LEVELING UP</h1>
          <p className="text-[11px] text-muted-foreground tracking-[0.2em] mb-16 uppercase opacity-70">
            System Initialization
          </p>

          <div className="text-left flex flex-col items-center">
            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-8">
              Designate Identity
            </div>
            
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="ENTER DESIGNATION..."
              className="w-64 bg-transparent border-b border-white/20 p-2 mb-12 font-mono text-[14px] outline-none text-foreground tracking-[0.2em] uppercase text-center focus:border-primary transition-colors placeholder:text-muted-foreground/30"
              autoFocus
            />
            
            <button
              onClick={() => setStep(1)}
              disabled={!name.trim()}
              className={`text-[12px] font-bold tracking-[0.3em] uppercase transition-colors ${
                name.trim()
                  ? 'text-primary hover:text-white'
                  : 'text-muted-foreground/30 cursor-not-allowed'
              }`}
            >
              [ PROCEED ]
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Focus Areas */}
      {step === 1 && (
        <div className="max-w-lg w-full text-center fade-in z-10">
          <h2 className="text-[16px] font-bold tracking-[0.2em] mb-2 uppercase text-foreground">SELECT PROTOCOLS</h2>
          <p className="text-[10px] text-muted-foreground tracking-[0.2em] mb-12 uppercase opacity-70">
            Identify focal areas for optimization
          </p>

          <div className="flex flex-col gap-6 mb-16 max-h-[40vh] overflow-y-auto no-scrollbar">
            {FOCUS_AREAS.map(area => {
              const active = selected.includes(area.id);
              return (
                <button
                  key={area.id}
                  onClick={() => toggleArea(area.id)}
                  className={`text-left flex items-center justify-between border-b border-white/5 pb-4 transition-all duration-300 ${
                    active ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <span className="text-[18px] opacity-50">{area.icon}</span>
                    <div className="flex flex-col">
                      <span className={`text-[13px] font-bold tracking-[0.2em] uppercase ${active ? 'text-primary text-glow' : 'text-foreground'}`}>
                        {area.label}
                      </span>
                      <span className="text-[9px] text-muted-foreground tracking-[0.1em] mt-1">
                        {area.quests.length} SUB-ROUTINES
                      </span>
                    </div>
                  </div>
                  {active && <span className="text-[10px] text-primary tracking-[0.2em]">[ SELECTED ]</span>}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center px-4">
            <button
              onClick={() => setStep(0)}
              className="text-[10px] tracking-[0.2em] text-muted-foreground hover:text-white uppercase transition-colors"
            >
              [ BACK ]
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={selected.length === 0}
              className={`text-[12px] font-bold tracking-[0.3em] uppercase transition-colors ${
                selected.length > 0
                  ? 'text-primary hover:text-white'
                  : 'text-muted-foreground/30 cursor-not-allowed'
              }`}
            >
              [ PROCEED ]
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Summary & Begin */}
      {step === 2 && (
        <div className="max-w-lg w-full text-center fade-in z-10">
          <h2 className="text-[16px] font-bold tracking-[0.2em] mb-2 uppercase text-primary text-glow">OVERVIEW: {name.toUpperCase()}</h2>
          <p className="text-[10px] text-muted-foreground tracking-[0.2em] mb-12 uppercase opacity-70">
            System ready for deployment
          </p>

          <div className="text-left mb-12">
            <div className="text-[10px] font-bold tracking-[0.2em] mb-4 text-muted-foreground uppercase border-b border-white/10 pb-2">
              &gt; ACTIVE PROTOCOLS
            </div>
            <div className="flex flex-col gap-3 max-h-[30vh] overflow-y-auto no-scrollbar mb-8">
              {FOCUS_AREAS.filter(a => selected.includes(a.id)).flatMap(a => a.quests).map((q) => (
                <div key={q.id} className="flex justify-between text-[11px] font-mono tracking-[0.1em] opacity-80">
                  <span className="uppercase text-foreground">- {q.name}</span>
                  <span className="text-primary font-bold">+{q.xp} XP</span>
                </div>
              ))}
            </div>
            
            <div className="text-[10px] font-bold tracking-[0.2em] mb-4 text-muted-foreground uppercase border-b border-white/10 pb-2">
              &gt; OPERATING PARAMETERS
            </div>
            <div className="space-y-3 text-[10px] tracking-[0.1em] uppercase opacity-70 font-mono">
              <div>&gt; EXECUTE DAILY PROTOCOLS FOR XP/COINS</div>
              <div>&gt; MAINTAIN &gt;70% SUCCESS FOR STREAK</div>
              <div>&gt; ASCEND RANKS E -&gt; S</div>
              <div>&gt; ENGAGE BOSSES &amp; ACQUIRE GEAR</div>
            </div>
          </div>

          <div className="flex justify-between items-center px-4">
            <button
              onClick={() => setStep(1)}
              className="text-[10px] tracking-[0.2em] text-muted-foreground hover:text-white uppercase transition-colors"
            >
              [ BACK ]
            </button>
            <button
              onClick={finish}
              className="text-[12px] font-bold tracking-[0.3em] uppercase text-primary hover:text-white transition-colors"
            >
              [ INITIALIZE SYSTEM ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
