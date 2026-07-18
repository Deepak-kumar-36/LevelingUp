import { useAppStore, formatDateKey, calculateStreak } from '../../store/useAppStore';
import { DEFAULT_QUESTS, RANKS } from '../../lib/constants';
import { vibrateSuccess, vibrateLight } from '../../lib/haptics';
import { useMemo } from 'react';
import type { StatName } from '../../types';

export function DashboardView({ setView }: { setView: (v: string) => void }) {
  const { data, setData } = useAppStore();
  
  const TK = formatDateKey(new Date());
  const todayData = data.dayData[TK] ?? { quests: [], xp: 0, coins: 0 };
  const myQuests = data.quests ?? DEFAULT_QUESTS;

  const getRank = (xp: number) => RANKS.find(r => xp >= r.min && xp < r.max) ?? RANKS[5];
  const rank = getRank(data.user.totalXp);
  
  const hasGhostMode = (data.user.unlockedPerks || []).includes('p_shadow_1');
  const streak = useMemo(() => calculateStreak(data.dayData, myQuests.length, hasGhostMode), [data.dayData, myQuests.length, hasGhostMode]);

  const dc = todayData.quests.length;
  const total = myQuests.length;
  
  const toggleQuest = (qid: string) => {
    vibrateLight();
    setData(d => {
      const q = (d.quests ?? DEFAULT_QUESTS).find(x => x.id === qid);
      if (!q) return d;
      const day = d.dayData[TK] ?? { quests: [], xp: 0, coins: 0 };
      const isDone = day.quests.includes(qid);
      const newQ = isDone ? day.quests.filter(x => x !== qid) : [...day.quests, qid];
      let xpDelta = q.xp;
      let coinDelta = q.coins;

      const perks = d.user.unlockedPerks || [];
      
      if (!isDone) {
        // Apply buffs when completing
        if (perks.includes('p_sage_3')) xpDelta += 5; // Enlightenment
        if (perks.includes('p_shadow_2') && new Date().getHours() >= 22) xpDelta = Math.floor(xpDelta * 1.2); // Night Owl
        
        // Adrenaline (10% chance per quest per day, deterministic to avoid toggle-farming)
        if (perks.includes('p_berserk_1') && (q.id.charCodeAt(0) + new Date().getDate()) % 10 === 0) {
          xpDelta *= 2;
        }
      } else {
        // When untoggling, we must subtract what we roughly added to avoid massive exploits. 
        // We'll use the same deterministic logic.
        if (perks.includes('p_sage_3')) xpDelta += 5;
        if (perks.includes('p_shadow_2') && new Date().getHours() >= 22) xpDelta = Math.floor(xpDelta * 1.2);
        if (perks.includes('p_berserk_1') && (q.id.charCodeAt(0) + new Date().getDate()) % 10 === 0) xpDelta *= 2;
      }

      const m = isDone ? -1 : 1;
      xpDelta *= m;
      coinDelta *= m;
      
      const newStats = { ...d.user.stats };
      if (q.gains) {
        Object.entries(q.gains).forEach(([k, v]) => {
          const statKey = k as StatName;
          newStats[statKey] = Math.max(0, newStats[statKey] + (v as number) * m);
        });
      }
      
      const newDD = {
        ...d.dayData,
        [TK]: {
          quests: newQ,
          xp: Math.max(0, (day.xp ?? 0) + xpDelta),
          coins: Math.max(0, (day.coins ?? 0) + coinDelta)
        }
      };
      
      const ns = calculateStreak(newDD, (d.quests ?? DEFAULT_QUESTS).length, perks.includes('p_shadow_1'));
      if (!isDone) vibrateSuccess();
      
      return {
        ...d,
        user: {
          ...d.user,
          totalXp: Math.max(0, d.user.totalXp + xpDelta),
          coins: Math.max(0, d.user.coins + coinDelta),
          stats: newStats,
          longestStreak: Math.max(d.user.longestStreak, ns)
        },
        dayData: newDD
      };
    });
  };

  const toggleBounty = (bid: string) => {
    vibrateLight();
    setData(d => {
      const b = (d.bounties || []).find(x => x.id === bid);
      if (!b) return d;
      const completed = d.completedBounties || [];
      const isDone = completed.includes(bid);
      const newCompleted = isDone ? completed.filter(x => x !== bid) : [...completed, bid];
      
      const m = isDone ? -1 : 1;
      const xpDelta = b.xp * m;
      const coinDelta = b.coins * m;
      
      const newStats = { ...d.user.stats };
      if (b.gains) {
        Object.entries(b.gains).forEach(([k, v]) => {
          const statKey = k as StatName;
          newStats[statKey] = Math.max(0, newStats[statKey] + (v as number) * m);
        });
      }

      if (!isDone) vibrateSuccess();
      
      return {
        ...d,
        completedBounties: newCompleted,
        user: {
          ...d.user,
          totalXp: Math.max(0, d.user.totalXp + xpDelta),
          coins: Math.max(0, d.user.coins + coinDelta),
          stats: newStats
        }
      };
    });
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-between font-mono p-6 pointer-events-none">
      

      {/* Top Section */}
      <div className="flex justify-between items-start z-10 w-full">
        {/* Left: LVL and XP */}
        <div className="flex flex-col gap-2">
          <div className="text-[14px] text-muted-foreground tracking-[0.2em] font-medium">
            LVL {rank.label.split(' ')[0] || rank.label} {data.user.userClass !== 'NONE' ? `[ ${data.user.userClass} ]` : ''}
          </div>
          <div className="text-[12px] text-muted-foreground/50 tracking-[0.1em]">
            {data.user.totalXp.toLocaleString()} XP
          </div>
        </div>

        {/* Right: Streak */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          <div className="text-[14px] text-primary font-bold tracking-[0.2em] text-glow">
            🔥 {streak} STREAK
          </div>
          
          {data.user.userClass === 'NONE' && data.user.totalXp >= 1000 && (
            <button
              onClick={() => setView('awakening')}
              className="mt-2 text-[10px] font-bold tracking-[0.3em] uppercase text-primary animate-pulse hover:text-white transition-colors"
            >
              [ AWAKEN ]
            </button>
          )}
        </div>
      </div>

      {/* Spacer for center void */}
      <div className="flex-1" />

      {/* Bottom Section: Quests */}
      <div className="z-10 w-full max-w-md mx-auto pointer-events-auto pb-4">
        
        <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-6 text-center opacity-70">
          Today's Ritual
        </div>

        <div className="flex flex-col gap-6 mb-10">
          {myQuests.map((q, i) => {
            const isDone = todayData.quests.includes(q.id);
            return (
              <button
                key={q.id}
                onClick={() => toggleQuest(q.id)}
                className={`w-full text-left flex gap-4 items-center transition-all duration-500 ${isDone ? 'opacity-20' : 'opacity-100 hover:opacity-80'}`}
              >
                <span className={`text-[12px] tracking-[0.1em] ${isDone ? 'text-muted-foreground' : 'text-primary'}`}>
                  {String(i + 1).padStart(2, '0')}.
                </span>
                <span className={`text-[14px] tracking-[0.15em] uppercase ${isDone ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {q.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer Progress */}
        <div className="text-[11px] text-primary/60 tracking-[0.3em] uppercase text-center mb-8">
          {dc} / {total} SEALED
        </div>
        
        {/* Weekly Bounties */}
        {data.bounties && data.bounties.length > 0 && (
          <div className="mt-8 border-t border-white/10 pt-8">
            <div className="text-[11px] text-destructive tracking-[0.3em] uppercase mb-6 text-center animate-pulse">
              Void Bounties (Weekly)
            </div>
            <div className="flex flex-col gap-6 mb-10">
              {data.bounties.map((b, i) => {
                const isDone = (data.completedBounties || []).includes(b.id);
                return (
                  <button
                    key={b.id}
                    onClick={() => toggleBounty(b.id)}
                    className={`w-full text-left flex flex-col gap-2 transition-all duration-500 ${isDone ? 'opacity-20' : 'opacity-100 hover:opacity-80'}`}
                  >
                    <div className="flex gap-4 items-center">
                      <span className={`text-[12px] tracking-[0.1em] ${isDone ? 'text-muted-foreground' : 'text-destructive'}`}>
                        V{String(i + 1)}.
                      </span>
                      <span className={`text-[14px] tracking-[0.15em] uppercase ${isDone ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {b.name}
                      </span>
                    </div>
                    <div className="pl-8 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                      +{b.xp} XP / +{b.coins} C
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
