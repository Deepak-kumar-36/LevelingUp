import { useAppStore, dKey, wKey, calcStreak, numId } from '../../store/useAppStore';
import { QUESTS as DEF_QUESTS, WEEKLY as DEF_WEEKLY, STATS, SICON, RANKS } from '../../lib/html-constants';
import { useMemo, useState } from 'react';

export function DashboardView() {
  const { data, setData } = useAppStore();
  
  const TK = dKey(new Date());
  const todayData = data.dayData[TK] ?? { quests: [], xp: 0, coins: 0 };
  
  const myQuests = data.quests ?? DEF_QUESTS;
  const myWeekly = data.weekly ?? DEF_WEEKLY;

  const getRank = (xp: number) => RANKS.find(r => xp >= r.min && xp < r.max) ?? RANKS[5];
  const rank = getRank(data.user.totalXp);
  const rankIdx = RANKS.findIndex(r => r.l === rank.l);
  const nextRank = RANKS[rankIdx + 1];
  const xpPct = nextRank ? Math.min(100, Math.round(((data.user.totalXp - rank.min) / (nextRank.min - rank.min)) * 100)) : 100;
  
  const wk = wKey(new Date());
  const weekProg = data.weeklyProgress[wk] ?? {};
  const streak = useMemo(() => calcStreak(data.dayData, myQuests.length), [data.dayData, myQuests.length]);

  const [showAddQuest, setShowAddQuest] = useState(false);
  const [qName, setQName] = useState('');
  const [qXp, setQXp] = useState('10');
  const [qCoins, setQCoins] = useState('2');

  const [showAddWeekly, setShowAddWeekly] = useState(false);
  const [wName, setWName] = useState('');
  const [wTarget, setWTarget] = useState('7');
  const [wUnit, setWUnit] = useState('TIMES');

  const toggleQuest = (qid: string) => {
    setData(d => {
      const q = (d.quests ?? DEF_QUESTS).find((x: any) => x.id === qid)!;
      const day = d.dayData[TK] ?? { quests: [], xp: 0, coins: 0 };
      const isDone = day.quests.includes(qid);
      const newQ = isDone ? day.quests.filter((x: string) => x !== qid) : [...day.quests, qid];
      const m = isDone ? -1 : 1;
      const newStats = { ...d.user.stats };
      if (q.gains) {
        Object.entries(q.gains).forEach(([k, v]) => {
          newStats[k as keyof typeof newStats] = Math.max(0, newStats[k as keyof typeof newStats] + (v as number) * m);
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
      const ns = calcStreak(newDD, (d.quests ?? DEF_QUESTS).length);
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

  const adjWeekly = (gid: string, delta: number) => {
    setData(d => {
      const g = (d.weekly ?? DEF_WEEKLY).find((x: any) => x.id === gid)!;
      const wp = d.weeklyProgress[wk] ?? {};
      const cur = wp[gid] ?? 0;
      const nv = Math.max(0, Math.min(cur + delta, g.target));
      return { ...d, weeklyProgress: { ...d.weeklyProgress, [wk]: { ...wp, [gid]: nv } } };
    });
  };

  const clearBacklog = (id: string) => {
    setData(d => ({ ...d, backlogs: (d.backlogs ?? []).filter(b => b.id !== id) }));
  };

  const addQuest = () => {
    if (!qName.trim()) return;
    setData(d => {
      const qs = d.quests ?? DEF_QUESTS;
      const newQ = {
        id: 'q_' + numId(),
        name: qName.trim().toUpperCase(),
        xp: parseInt(qXp) || 10,
        coins: parseInt(qCoins) || 2,
        gains: {}
      } as any;
      return { ...d, quests: [...qs, newQ] };
    });
    setQName('');
    setShowAddQuest(false);
  };

  const addWeekly = () => {
    if (!wName.trim()) return;
    setData(d => {
      const ws = d.weekly ?? DEF_WEEKLY;
      const newW = {
        id: 'w_' + numId(),
        name: wName.trim().toUpperCase(),
        target: parseInt(wTarget) || 7,
        unit: wUnit.trim().toUpperCase()
      };
      return { ...d, weekly: [...ws, newW] };
    });
    setWName('');
    setShowAddWeekly(false);
  };

  const dc = todayData.quests.length;
  const pct = Math.round((dc / Math.max(1, myQuests.length)) * 100);

  return (
    <div className="animate-in fade-in">
      <div className="bg-card border border-border p-3 mb-3 flex gap-5 items-center flex-wrap">
        <div className="min-w-[55px]">
          <div className="text-[11px] text-muted-foreground tracking-[1px]">RANK</div>
          <div className="text-[34px] font-bold tracking-[4px] leading-none">{rank.l}</div>
          {nextRank && (
            <div className="text-[9px] text-muted-foreground mt-0.5">
              {(nextRank.min - data.user.totalXp).toLocaleString()} XP → {nextRank.l}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-[180px]">
          <div className="flex justify-between mb-1">
            <span className="text-[11px] text-muted-foreground tracking-[1px]">XP</span>
            <span className="text-[11px] text-muted-foreground">
              {data.user.totalXp.toLocaleString()} / {nextRank ? nextRank.min.toLocaleString() : 'MAX'}
            </span>
          </div>
          <div className="h-[10px] bg-muted overflow-hidden">
            <div className="h-full bg-foreground transition-all duration-300" style={{ width: `${Math.max(0, Math.min(100, xpPct))}%` }} />
          </div>
        </div>
        <div className="text-center">
          <div className="text-[11px] text-muted-foreground tracking-[1px]">STREAK</div>
          <div className={`text-[22px] font-bold ${streak > 0 ? 'text-success' : 'text-foreground'}`}>🔥{streak}D</div>
        </div>
        <div className="text-center">
          <div className="text-[11px] text-muted-foreground tracking-[1px]">COINS</div>
          <div className="text-[22px] font-bold">⚡{data.user.coins}</div>
        </div>
        <div className="text-center">
          <div className="text-[11px] text-muted-foreground tracking-[1px]">TODAY</div>
          <div className={`text-[22px] font-bold ${pct >= 70 ? 'text-success' : 'text-foreground'}`}>{pct}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-3">
        <div>
          <div className="bg-card border border-border p-3 mb-3">
            <div className="text-[11px] font-bold tracking-[2px] mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                📋 TODAY'S QUESTS
                <button 
                  onClick={() => setShowAddQuest(!showAddQuest)}
                  className="ml-2 px-1.5 border border-border bg-background text-[10px] hover:bg-muted"
                >
                  {showAddQuest ? '✕' : '+'}
                </button>
              </div>
              <span className="text-[11px] text-muted-foreground font-normal tracking-normal">
                {dc}/{myQuests.length} · +{todayData.xp ?? 0} XP
              </span>
            </div>
            
            {showAddQuest && (
              <div className="mb-3 p-2 border border-border bg-background">
                <div className="flex gap-2 mb-2">
                  <input 
                    value={qName} 
                    onChange={e => setQName(e.target.value)}
                    placeholder="QUEST NAME" 
                    className="flex-1 bg-background border border-border p-1 text-[11px] outline-none tracking-[1px]"
                  />
                  <input 
                    value={qXp} 
                    onChange={e => setQXp(e.target.value)}
                    placeholder="XP" 
                    type="number"
                    className="w-[50px] bg-background border border-border p-1 text-[11px] outline-none"
                  />
                  <input 
                    value={qCoins} 
                    onChange={e => setQCoins(e.target.value)}
                    placeholder="COINS" 
                    type="number"
                    className="w-[60px] bg-background border border-border p-1 text-[11px] outline-none"
                  />
                </div>
                <button 
                  onClick={addQuest}
                  className="w-full bg-foreground text-background border border-foreground p-1 text-[10px] tracking-[2px] uppercase font-bold"
                >
                  ADD QUEST
                </button>
              </div>
            )}

            {myQuests.map((q: any) => {
              const c = todayData.quests.includes(q.id);
              return (
                <div 
                  key={q.id} 
                  className={`flex items-center gap-2 py-1.5 border-b border-border cursor-pointer select-none ${c ? 'opacity-60' : 'opacity-100'}`}
                  onClick={() => toggleQuest(q.id)}
                >
                  <div className={`w-3.5 h-3.5 border border-border flex-shrink-0 flex items-center justify-center text-[10px] ${c ? 'bg-foreground text-background' : 'bg-background'}`}>
                    {c && '✓'}
                  </div>
                  <div className={`flex-1 tracking-[1px] ${c ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {q.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground text-right leading-tight tracking-[1px]">
                    <div>+{q.xp}XP</div>
                    <div>+{q.coins}⚡</div>
                  </div>
                </div>
              );
            })}
            <div className="mt-2 pt-1.5 border-t border-border text-[11px] text-muted-foreground flex justify-between tracking-[1px]">
              <span>{dc}/{myQuests.length} COMPLETE</span>
              <span>{pct >= 70 ? '✓ STREAK SAFE' : `⚠ NEED ${Math.max(0, Math.ceil(myQuests.length * 0.7) - dc)} MORE`}</span>
            </div>
          </div>

          {(data.backlogs ?? []).length > 0 && (
            <div className="bg-card border border-border p-3 mb-3">
              <div className="text-[11px] font-bold tracking-[2px] mb-2.5 flex items-center gap-1.5">
                ⚠ BACKLOG ({(data.backlogs ?? []).length})
              </div>
              {(data.backlogs ?? []).map(b => (
                <div key={b.id} className="flex items-center justify-between py-1.5 border-b border-border">
                  <div>
                    <div className="tracking-[1px]">{b.name}</div>
                    <div className="text-[11px] text-muted-foreground">+{b.xp} XP · +{b.coins} COINS</div>
                  </div>
                  <button 
                    onClick={() => clearBacklog(b.id)} 
                    className="px-2 py-0.5 border border-border bg-background text-foreground text-[10px] tracking-[1px] uppercase hover:bg-muted"
                  >
                    CLEAR
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="bg-card border border-border p-3 mb-3">
            <div className="text-[11px] font-bold tracking-[2px] mb-2.5 flex items-center gap-1.5">
              ⬡ CHARACTER STATS
            </div>
            {STATS.map(stat => {
              const val = data.user.stats[stat as keyof typeof data.user.stats];
              const pct = Math.min(100, val / 2);
              return (
                <div key={stat} className="mb-2">
                  <div className="flex justify-between mb-[3px]">
                    <span className="text-[11px] tracking-[1px]">{SICON[stat]} {stat.toUpperCase()}</span>
                    <span className="text-[11px] font-bold">{val}</span>
                  </div>
                  <div className="h-[6px] bg-muted overflow-hidden">
                    <div className="h-full bg-success transition-all duration-300" style={{ width: `${Math.max(0, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-card border border-border p-3">
            <div className="text-[11px] font-bold tracking-[2px] mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                WEEKLY GOALS
                <button 
                  onClick={() => setShowAddWeekly(!showAddWeekly)}
                  className="ml-2 px-1.5 border border-border bg-background text-[10px] hover:bg-muted"
                >
                  {showAddWeekly ? '✕' : '+'}
                </button>
              </div>
            </div>

            {showAddWeekly && (
              <div className="mb-3 p-2 border border-border bg-background">
                <div className="flex gap-2 mb-2">
                  <input 
                    value={wName} 
                    onChange={e => setWName(e.target.value)}
                    placeholder="GOAL NAME" 
                    className="flex-1 bg-background border border-border p-1 text-[11px] outline-none tracking-[1px]"
                  />
                  <input 
                    value={wTarget} 
                    onChange={e => setWTarget(e.target.value)}
                    placeholder="TARGET" 
                    type="number"
                    className="w-[60px] bg-background border border-border p-1 text-[11px] outline-none"
                  />
                  <input 
                    value={wUnit} 
                    onChange={e => setWUnit(e.target.value)}
                    placeholder="UNIT" 
                    className="w-[60px] bg-background border border-border p-1 text-[11px] outline-none"
                  />
                </div>
                <button 
                  onClick={addWeekly}
                  className="w-full bg-foreground text-background border border-foreground p-1 text-[10px] tracking-[2px] uppercase font-bold"
                >
                  ADD GOAL
                </button>
              </div>
            )}

            {myWeekly.map((g: any) => {
              const cur = weekProg[g.id] ?? 0;
              const p = Math.round((cur / g.target) * 100);
              const done = cur >= g.target;
              return (
                <div key={g.id} className="mb-2.5">
                  <div className="flex justify-between items-center mb-[3px]">
                    <span className={`text-[11px] tracking-[1px] ${done ? 'text-success' : 'text-foreground'}`}>
                      {done ? '✓ ' : ''}{g.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => adjWeekly(g.id, -1)} className="px-2 border border-border bg-background text-[14px] leading-none py-0.5 hover:bg-muted">−</button>
                      <span className="text-[11px] min-w-[30px] text-center">{cur}/{g.target}</span>
                      <button onClick={() => adjWeekly(g.id, 1)} className="px-2 border border-border bg-background text-[14px] leading-none py-0.5 hover:bg-muted">+</button>
                    </div>
                  </div>
                  <div className="h-[5px] bg-muted overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${done ? 'bg-success' : 'bg-success-alt'}`} style={{ width: `${Math.max(0, Math.min(100, p))}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
