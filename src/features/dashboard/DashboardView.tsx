import { useAppStore, formatDateKey, calculateStreak } from '../../store/useAppStore';
import { DEFAULT_QUESTS, RANKS } from '../../lib/constants';
import { vibrateSuccess, vibrateLight } from '../../lib/haptics';
import { useMemo } from 'react';
import type { StatName } from '../../types';

export function DashboardView() {
  const { data, setData } = useAppStore();
  
  const TK = formatDateKey(new Date());
  const todayData = data.dayData[TK] ?? { quests: [], xp: 0, coins: 0 };
  const myQuests = data.quests ?? DEFAULT_QUESTS;

  const getRank = (xp: number) => RANKS.find(r => xp >= r.min && xp < r.max) ?? RANKS[5];
  const rank = getRank(data.user.totalXp);
  
  const streak = useMemo(() => calculateStreak(data.dayData, myQuests.length), [data.dayData, myQuests.length]);

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
      const m = isDone ? -1 : 1;
      
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
          xp: Math.max(0, (day.xp ?? 0) + q.xp * m),
          coins: Math.max(0, (day.coins ?? 0) + q.coins * m)
        }
      };
      
      const ns = calculateStreak(newDD, (d.quests ?? DEFAULT_QUESTS).length);
      if (!isDone) vibrateSuccess();
      
      return {
        ...d,
        user: {
          ...d.user,
          totalXp: Math.max(0, d.user.totalXp + q.xp * m),
          coins: Math.max(0, d.user.coins + q.coins * m),
          stats: newStats,
          longestStreak: Math.max(d.user.longestStreak, ns)
        },
        dayData: newDD
      };
    });
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-between font-mono p-6 pointer-events-none">
      
      {/* Background Character Art (Optional/Faint) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10">
        <img 
          src="/assets/character/100.png" 
          alt="Void Entity"
          className="w-full h-full object-cover object-center mix-blend-screen"
        />
      </div>

      {/* Top Section */}
      <div className="flex justify-between items-start z-10 w-full">
        {/* Left: LVL and XP */}
        <div className="flex flex-col gap-2">
          <div className="text-[14px] text-muted-foreground tracking-[0.2em] font-medium">
            LVL {rank.label.split(' ')[0] || rank.label}
          </div>
          <div className="text-[12px] text-muted-foreground/50 tracking-[0.1em]">
            {data.user.totalXp.toLocaleString()} XP
          </div>
        </div>

        {/* Right: Streak */}
        <div className="flex flex-col items-end gap-2">
          <div className="text-[14px] text-primary font-bold tracking-[0.2em] text-glow">
            🔥 {streak} STREAK
          </div>
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
        <div className="text-[11px] text-primary/60 tracking-[0.3em] uppercase text-center">
          {dc} / {total} SEALED
        </div>
        
      </div>
    </div>
  );
}
