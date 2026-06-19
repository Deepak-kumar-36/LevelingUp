import { useAppStore } from '../../store/useAppStore';
import { ACHIEVEMENTS } from '../../lib/html-constants';

export function AchievementsView() {
  const { data } = useAppStore();
  const unlocked = new Set(data.achievements || []);

  return (
    <div className="animate-in fade-in flex flex-col gap-3">
      <div className="bg-card border border-border p-3">
        <div className="text-[11px] font-bold tracking-[2px] mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">🏆 ACHIEVEMENTS</div>
          <span className="text-[11px] text-muted-foreground font-normal tracking-normal">
            {unlocked.size} / {ACHIEVEMENTS.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
          {ACHIEVEMENTS.map(a => {
            const isUnlocked = unlocked.has(a.id);
            return (
              <div 
                key={a.id} 
                className={`border border-border p-3.5 flex items-start gap-3 transition-all ${
                  isUnlocked ? 'bg-background opacity-100 border-foreground' : 'bg-muted/30 opacity-50'
                }`}
              >
                <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center text-xl border ${
                  isUnlocked ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground border-border'
                }`}>
                  {isUnlocked ? '🏆' : '🔒'}
                </div>
                <div>
                  <div className={`font-bold tracking-[2px] mb-1 text-[12px] uppercase ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {a.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground mb-1.5 leading-[1.4] uppercase">
                    {a.desc}
                  </div>
                  <div className="text-[10px] font-bold tracking-[1px] text-success">
                    +{a.xpReward} XP
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
