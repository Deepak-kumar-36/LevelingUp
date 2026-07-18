import { useAppStore, formatDateKey, calculateStreak } from '../../store/useAppStore';
import { DEFAULT_QUESTS, RANKS, STAT_NAMES, EQUIPMENT_ITEMS } from '../../lib/constants';
import { vibrateSuccess, vibrateLight } from '../../lib/haptics';
import { useMemo } from 'react';
import type { StatName } from '../../types';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

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

  // --- STATS LOGIC ---
  const allDays = Object.entries(data.dayData);
  const totalDays = allDays.length;

  const qRates = myQuests.map(q => {
    const done = allDays.filter(([, dd]) => dd.quests.includes(q.id)).length;
    return { ...q, done, rate: totalDays ? Math.round((done / totalDays) * 100) : 0 };
  });

  const xpData = useMemo(() => {
    const chartData = [];
    const d = new Date();
    d.setDate(d.getDate() - 14); // Last 14 days
    for (let i = 0; i < 14; i++) {
      const k = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      const dd = data.dayData?.[k] || { quests: [], xp: 0, coins: 0 };
      const xp = dd.quests.reduce((sum, qid) => {
        const quest = myQuests.find(q => q.id === qid);
        return sum + (quest?.xp || 0);
      }, 0);
      chartData.push({
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        xp
      });
      d.setDate(d.getDate() + 1);
    }
    return chartData;
  }, [data.dayData, myQuests]);

  const bonusStats = useMemo(() => {
    const bonuses = { intelligence: 0, builder: 0, discipline: 0, vitality: 0, wealth: 0 };
    const eqIds = [data.equipped?.head, data.equipped?.body, data.equipped?.weapon, data.equipped?.accessory];
    eqIds.forEach(id => {
      const item = EQUIPMENT_ITEMS.find(e => e.id === id);
      if (item && item.stats) {
        Object.entries(item.stats).forEach(([k, v]) => {
          if (k in bonuses) bonuses[k as keyof typeof bonuses] += v as number;
        });
      }
    });
    return bonuses;
  }, [data.equipped]);
  // -------------------
  
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
        if (perks.includes('p_sage_3')) xpDelta += 5;
        if (perks.includes('p_shadow_2') && new Date().getHours() >= 22) xpDelta = Math.floor(xpDelta * 1.2);
        if (perks.includes('p_berserk_1') && (q.id.charCodeAt(0) + new Date().getDate()) % 10 === 0) xpDelta *= 2;
      } else {
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
    <div className="absolute inset-0 font-mono p-4 md:p-8 overflow-y-auto overflow-x-hidden no-scrollbar bg-[#050505]">
      
      <div className="max-w-5xl mx-auto flex flex-col gap-12 pb-24">
        
        {/* --- 1. HEADS UP DISPLAY (HUD) HEADER --- */}
        <div className="flex justify-between items-start w-full border-b border-primary/20 pb-4 relative">
          <div className="absolute inset-0 bg-primary/5 blur-xl pointer-events-none" />
          
          <div className="flex flex-col gap-2 relative z-10">
            <div className="text-[10px] text-primary tracking-[0.4em] font-bold uppercase drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]">
              SYSTEM RANK
            </div>
            <div className="text-[20px] md:text-[28px] text-white tracking-[0.2em] font-bold uppercase">
              {rank.label.split(' ')[0] || rank.label} {data.user.userClass !== 'NONE' ? `[ ${data.user.userClass} ]` : ''}
            </div>
            <div className="text-[11px] text-muted-foreground tracking-[0.2em]">
              {data.user.totalXp.toLocaleString()} XP
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 relative z-10">
            <div className="text-[10px] text-primary tracking-[0.4em] font-bold uppercase drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]">
              MOMENTUM
            </div>
            <div className={`text-[20px] md:text-[28px] font-bold tracking-[0.2em] ${streak > 0 ? 'text-primary drop-shadow-[0_0_12px_rgba(var(--primary-rgb),0.8)]' : 'text-muted-foreground'}`}>
              {streak} <span className="text-[12px]">DAYS</span>
            </div>
            
            {data.user.userClass === 'NONE' && data.user.totalXp >= 1000 && (
              <button
                onClick={() => setView('awakening')}
                className="mt-2 text-[10px] font-bold tracking-[0.3em] uppercase bg-primary text-black px-4 py-1 hover:bg-white transition-colors animate-pulse"
              >
                [ AWAKEN ]
              </button>
            )}
          </div>
        </div>

        {/* --- 2. MAIN GRID (Quests + Core Attributes) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left: Quests & Rituals */}
          <div className="flex flex-col gap-8">
            <div className="bg-black/60 border border-white/10 p-6 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
              <div className="text-[12px] text-primary tracking-[0.3em] uppercase mb-6 drop-shadow-[0_0_5px_rgba(var(--primary-rgb),0.5)]">
                Active Protocol
              </div>

              <div className="flex flex-col gap-4 mb-8">
                {myQuests.map((q, i) => {
                  const isDone = todayData.quests.includes(q.id);
                  return (
                    <button
                      key={q.id}
                      onClick={() => toggleQuest(q.id)}
                      className={`w-full text-left flex gap-4 items-center transition-all duration-300 p-2 border ${isDone ? 'border-primary/20 bg-primary/5 opacity-50' : 'border-white/5 bg-white/5 hover:border-primary/50'}`}
                    >
                      <span className={`text-[10px] tracking-[0.2em] ${isDone ? 'text-primary/50' : 'text-primary'}`}>
                        {String(i + 1).padStart(2, '0')}.
                      </span>
                      <span className={`text-[12px] tracking-[0.2em] uppercase ${isDone ? 'line-through text-muted-foreground' : 'text-white'}`}>
                        {q.name}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              <div className="text-[10px] text-muted-foreground tracking-[0.4em] uppercase text-center mt-auto pt-4 border-t border-white/10">
                {dc} / {total} SEALED
              </div>
            </div>

            {/* Bounties */}
            {data.bounties && data.bounties.length > 0 && (
              <div className="bg-black/60 border border-destructive/20 p-6 flex flex-col">
                <div className="text-[12px] text-destructive tracking-[0.3em] uppercase mb-6 animate-pulse drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]">
                  Weekly Bounties
                </div>
                <div className="flex flex-col gap-4">
                  {data.bounties.map((b) => {
                    const isDone = (data.completedBounties || []).includes(b.id);
                    return (
                      <button
                        key={b.id}
                        onClick={() => toggleBounty(b.id)}
                        className={`w-full text-left flex flex-col gap-2 p-3 border transition-all duration-300 ${isDone ? 'border-destructive/20 bg-destructive/5 opacity-50' : 'border-destructive/20 hover:border-destructive hover:bg-destructive/10'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`text-[12px] tracking-[0.2em] uppercase ${isDone ? 'line-through text-muted-foreground' : 'text-white'}`}>
                            {b.name}
                          </span>
                          <span className="text-[9px] text-destructive tracking-[0.2em] uppercase">
                            +{b.xp} XP
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Core Attributes & Velocity */}
          <div className="flex flex-col gap-8">
            <div className="bg-black/60 border border-white/10 p-6">
              <div className="text-[12px] text-muted-foreground tracking-[0.3em] uppercase mb-6">
                Core Attributes
              </div>
              <div className="flex flex-col gap-5">
                {STAT_NAMES.map(stat => {
                  const val = data.user.stats[stat];
                  const bonus = bonusStats[stat];

                  return (
                    <div key={stat}>
                      <div className="flex justify-between mb-2">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-white">{stat}</span>
                        <span className="text-[10px] font-bold font-mono text-primary drop-shadow-[0_0_5px_rgba(var(--primary-rgb),0.5)]">
                          {val} {bonus > 0 && <span className="text-white/50">+{bonus}</span>}
                        </span>
                      </div>
                      <div className="h-[4px] w-full bg-white/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-white transition-all duration-1000" style={{ width: `${Math.max(0, Math.min(100, val / 2))}%` }} />
                        {bonus > 0 && <div className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 opacity-50" style={{ width: `${Math.max(0, Math.min(100, (val + bonus) / 2))}%` }} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-black/60 border border-white/10 p-6">
              <div className="text-[12px] text-muted-foreground tracking-[0.3em] uppercase mb-6">
                XP Velocity (14 Days)
              </div>
              <div className="h-[120px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={xpData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#050505', border: '1px solid var(--primary)', fontSize: '10px', textTransform: 'uppercase', borderRadius: '0', color: 'var(--primary)', fontFamily: 'monospace' }}
                      itemStyle={{ color: 'var(--primary)' }}
                      cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                    />
                    <Area type="step" dataKey="xp" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorXp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>

        {/* --- 3. METRICS FOOTER (Consistency) --- */}
        <div className="border-t border-white/10 pt-8 mt-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div>
            <div className="text-[11px] text-primary tracking-[0.4em] uppercase mb-6">
              Protocol Consistency
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {qRates.map(q => (
                <div key={q.id}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground">{q.name}</span>
                    <span className={`text-[10px] font-bold font-mono ${q.rate > 50 ? 'text-primary' : 'text-white/30'}`}>{q.rate}%</span>
                  </div>
                  <div className="h-[2px] w-full bg-white/5">
                    <div className={`h-full transition-all duration-1000 ${q.rate > 50 ? 'bg-primary' : 'bg-white/20'}`} style={{ width: `${Math.max(0, q.rate)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-primary tracking-[0.4em] uppercase mb-6">
              Global Logs
            </div>
            <div className="flex flex-col gap-4">
              {[
                ['DAYS ACTIVE', totalDays],
                ['TOTAL XP YIELD', data.user.totalXp.toLocaleString()],
                ['COIN RESERVES', data.user.coins],
                ['RECORDS WRITTEN', (data.notes ?? []).length]
              ].map(([l, v]) => (
                <div key={l as string} className="flex justify-between border-b border-white/5 pb-2 text-[10px] tracking-[0.2em]">
                  <span className="text-muted-foreground uppercase">{l}</span>
                  <span className="font-bold font-mono text-white">{v as React.ReactNode}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
