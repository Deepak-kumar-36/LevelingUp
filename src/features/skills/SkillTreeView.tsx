import { useAppStore } from '../../store/useAppStore';
import { PERKS, RANKS } from '../../lib/constants';
import { vibrateHeavy, vibrateError } from '../../lib/haptics';

export function SkillTreeView() {
  const { data, setData } = useAppStore();
  const user = data.user;

  if (user.userClass === 'NONE') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-[12px] tracking-[0.2em] text-muted-foreground uppercase opacity-50">
          [ SYSTEM LOCKED ]<br/><br/>
          AWAKEN A CLASS TO ACCESS THE VOID TREE
        </div>
      </div>
    );
  }

  const rankIndex = RANKS.findIndex(r => user.totalXp >= r.min && user.totalXp < r.max);
  const earnedSp = Math.max(0, rankIndex); // E=0, D=1, C=2, etc.
  const spentSp = user.unlockedPerks?.length || 0;
  const availableSp = earnedSp - spentSp;

  const classPerks = PERKS[user.userClass as keyof typeof PERKS] || [];

  const unlockPerk = (perkId: string, cost: number) => {
    if (availableSp < cost) {
      vibrateError();
      return;
    }
    if ((user.unlockedPerks || []).includes(perkId)) {
      return;
    }

    vibrateHeavy();
    setData(d => ({
      ...d,
      user: {
        ...d.user,
        unlockedPerks: [...(d.user.unlockedPerks || []), perkId]
      }
    }));
  };

  return (
    <div className="animate-in fade-in flex flex-col gap-12 max-w-2xl mx-auto z-10 relative pointer-events-auto h-full px-4 pt-10 pb-24 overflow-y-auto no-scrollbar">
      
      {/* Header */}
      <div className="text-center border-b border-white/10 pb-8">
        <h1 className="text-[20px] font-bold tracking-[0.3em] text-glow text-primary uppercase mb-4">
          VOID TREE: {user.userClass}
        </h1>
        <div className="text-[12px] tracking-[0.2em] text-muted-foreground flex justify-center gap-6">
          <span>SP EARNED: {earnedSp}</span>
          <span className="text-primary font-bold">SP AVAILABLE: {availableSp}</span>
        </div>
      </div>

      {/* Perks List */}
      <div className="flex flex-col gap-6">
        {classPerks.map((perk) => {
          const unlocked = (user.unlockedPerks || []).includes(perk.id);
          const canAfford = availableSp >= perk.cost;

          return (
            <div 
              key={perk.id}
              className={`border-l-2 pl-4 py-2 transition-all duration-300 ${
                unlocked ? 'border-primary opacity-100' : 'border-white/10 opacity-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[14px] font-bold tracking-[0.2em] uppercase ${unlocked ? 'text-primary' : 'text-foreground'}`}>
                  {perk.name}
                </span>
                
                {unlocked ? (
                  <span className="text-[10px] tracking-[0.2em] text-primary uppercase">[ UNLOCKED ]</span>
                ) : (
                  <button
                    onClick={() => unlockPerk(perk.id, perk.cost)}
                    disabled={!canAfford}
                    className={`text-[10px] tracking-[0.2em] uppercase font-bold transition-colors ${
                      canAfford ? 'text-foreground hover:text-primary' : 'text-muted-foreground/30 cursor-not-allowed'
                    }`}
                  >
                    [ UNLOCK: {perk.cost} SP ]
                  </button>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                {perk.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-[9px] text-center text-muted-foreground/40 tracking-[0.2em] uppercase">
        GAIN 1 SP PER RANK INCREASE (D, C, B, A, S)
      </div>

    </div>
  );
}
