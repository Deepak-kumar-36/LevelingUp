import { useAppStore } from '../../store/useAppStore';
import { CLASSES } from '../../lib/constants';
import { vibrateHeavy } from '../../lib/haptics';
import type { CharacterClass } from '../../types';

export function AwakeningView({ onComplete }: { onComplete: () => void }) {
  const { setData } = useAppStore();

  const handleAwaken = (clsId: string) => {
    vibrateHeavy();
    const cls = CLASSES.find(c => c.id === clsId);
    if (!cls) return;

    setData(d => {
      const newStats = { ...d.user.stats };
      Object.entries(cls.buff).forEach(([stat, val]) => {
        const k = stat as keyof typeof newStats;
        newStats[k] += val;
      });

      return {
        ...d,
        user: {
          ...d.user,
          userClass: clsId as CharacterClass,
          stats: newStats
        }
      };
    });
    
    onComplete();
  };

  return (
    <div className="animate-in fade-in flex flex-col items-center justify-center min-h-screen p-4 z-10 relative bg-[#030303]">
      <div className="absolute inset-0 z-0 pointer-events-none void-gradient" />

      <div className="z-10 text-[10px] text-muted-foreground tracking-[0.3em] uppercase mb-16 absolute top-12">
        [ THE AWAKENING ]
      </div>

      <div className="max-w-md w-full text-center fade-in z-10">
        <h1 className="text-[24px] font-bold tracking-[0.2em] mb-2 uppercase text-glow text-primary">CHOOSE YOUR PATH</h1>
        <p className="text-[11px] text-muted-foreground tracking-[0.2em] mb-12 uppercase opacity-70">
          This choice is permanent. It will define your resonance in the void.
        </p>

        <div className="flex flex-col gap-8 mb-16 max-h-[50vh] overflow-y-auto no-scrollbar">
          {CLASSES.map(cls => (
            <button
              key={cls.id}
              onClick={() => handleAwaken(cls.id)}
              className="group text-left flex flex-col border-b border-white/10 pb-4 transition-all duration-300 hover:opacity-100 opacity-60 hover:border-primary/50"
            >
              <div className="flex justify-between items-end w-full mb-2">
                <span className="text-[16px] font-bold tracking-[0.3em] uppercase group-hover:text-primary transition-colors">
                  {cls.name}
                </span>
                <span className="text-[10px] font-mono tracking-[0.1em] text-primary">
                  {Object.entries(cls.buff).map(([k, v]) => `+${v} ${k.toUpperCase()}`).join(', ')}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase leading-relaxed">
                {cls.desc}
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={() => onComplete()}
          className="text-[10px] tracking-[0.2em] text-muted-foreground hover:text-white uppercase transition-colors"
        >
          [ RETURN TO VOID ]
        </button>
      </div>
    </div>
  );
}
