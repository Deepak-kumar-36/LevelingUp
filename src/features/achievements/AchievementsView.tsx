import { useAppStore } from '../../store/useAppStore';
import { ACHIEVEMENTS } from '../../lib/constants';

export function AchievementsView() {
  const { data } = useAppStore();
  const unlocked = new Set(data.achievements || []);

  return (
    <div className="animate-in fade-in flex flex-col gap-12 max-w-3xl mx-auto z-10 relative pointer-events-auto h-full px-4 pt-10">
      
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-1">
            System Milestones
          </div>
          <div className="text-[24px] font-bold tracking-[0.1em] text-foreground uppercase">
            Achievements
          </div>
        </div>
        <div className="text-[12px] font-mono tracking-[0.2em] text-primary">
          {unlocked.size} <span className="text-[10px] text-muted-foreground">/ {ACHIEVEMENTS.length}</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto no-scrollbar pb-20">
        {ACHIEVEMENTS.map(a => {
          const isUnlocked = unlocked.has(a.id);
          return (
            <div 
              key={a.id} 
              className={`flex items-start gap-6 transition-all duration-500 ${
                isUnlocked ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center font-mono text-[14px] ${
                isUnlocked ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {isUnlocked ? '[ 🏆 ]' : '[ 🔒 ]'}
              </div>
              <div className="flex flex-col gap-1 w-full border-b border-white/5 pb-6">
                <div className="flex justify-between items-start">
                  <div className={`font-bold tracking-[0.2em] text-[14px] uppercase ${isUnlocked ? 'text-foreground text-glow' : 'text-muted-foreground'}`}>
                    {a.name}
                  </div>
                  <div className="text-[10px] font-bold font-mono tracking-[0.1em] text-primary">
                    +{a.xpReward} XP
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground/70 leading-relaxed uppercase tracking-[0.1em]">
                  {a.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
