import { useAppStore, calculateStreak } from '../../store/useAppStore';
import { DEFAULT_QUESTS, STAT_NAMES, DAY_NAMES, EQUIPMENT_ITEMS } from '../../lib/constants';
import { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export function StatsView() {
  const { data } = useAppStore();

  const myQuests = data.quests ?? DEFAULT_QUESTS;
  const streak = useMemo(() => calculateStreak(data.dayData, myQuests.length), [data.dayData, myQuests.length]);

  const allDays = Object.entries(data.dayData);
  const total = allDays.length;

  const qRates = myQuests.map(q => {
    const done = allDays.filter(([, dd]) => dd.quests.includes(q.id)).length;
    return { ...q, done, rate: total ? Math.round((done / total) * 100) : 0 };
  });

  const dow = Array(7).fill(null).map(() => ({ qc: Array(myQuests.length).fill(0), tot: 0 }));
  
  allDays.forEach(([k, dd]) => {
    const d = new Date(k + 'T00:00:00');
    const i = (d.getDay() + 6) % 7;
    dow[i].tot++;
    myQuests.forEach((q, qi) => {
      if (dd.quests.includes(q.id)) dow[i].qc[qi]++;
    });
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

  return (
    <div className="animate-in fade-in flex flex-col gap-16 max-w-5xl mx-auto z-10 relative pointer-events-auto h-full px-4 pt-10 pb-20 overflow-y-auto no-scrollbar">
      
      {/* Top Section: Streak & Overview */}
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-4">
            Streak Status
          </div>
          <div className="flex flex-col gap-2">
            <div className={`text-[48px] md:text-[64px] font-bold font-mono tracking-widest leading-none ${streak > 0 ? 'text-primary text-glow' : 'text-foreground'}`}>
              {streak} <span className="text-[16px] text-muted-foreground tracking-[0.2em] opacity-50">DAYS</span>
            </div>
            <div className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
              Longest Maintained: <span className="text-foreground">{data.user.longestStreak}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-4">
            Global Metrics
          </div>
          <div className="flex flex-col gap-4">
            {[
              ['DAYS ACTIVE', total],
              ['TOTAL XP YIELD', data.user.totalXp.toLocaleString()],
              ['COIN RESERVES', data.user.coins],
              ['LOGS RECORDED', (data.notes ?? []).length]
            ].map(([l, v]) => (
              <div key={l as string} className="flex justify-between border-b border-white/5 pb-2 text-[11px] tracking-[0.2em]">
                <span className="text-muted-foreground uppercase">{l}</span>
                <span className="font-bold font-mono text-primary">{v as React.ReactNode}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-white/5" />

      {/* Middle Section: Attributes & Graph */}
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-8">
            Core Attributes
          </div>
          <div className="flex flex-col gap-6">
            {STAT_NAMES.map(stat => {
              const val = data.user.stats[stat];
              const bonus = bonusStats[stat];

              return (
                <div key={stat}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-foreground">{stat}</span>
                    <span className="text-[12px] font-bold font-mono text-primary">
                      {val} {bonus > 0 && <span className="text-muted-foreground text-[10px]">+{bonus}</span>}
                    </span>
                  </div>
                  <div className="h-[2px] w-full bg-white/5 relative">
                    <div className="absolute top-0 left-0 h-full bg-white transition-all duration-1000" style={{ width: `${Math.max(0, Math.min(100, val / 2))}%` }} />
                    {bonus > 0 && <div className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 opacity-50" style={{ width: `${Math.max(0, Math.min(100, (val + bonus) / 2))}%` }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-[1.5]">
          <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-8">
            XP Velocity (T-14 Days)
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#030303', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', textTransform: 'uppercase', borderRadius: '0', color: '#dc2626' }}
                  itemStyle={{ color: '#dc2626' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                />
                <Area type="step" dataKey="xp" stroke="#dc2626" strokeWidth={2} fillOpacity={1} fill="url(#colorXp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-white/5" />

      {/* Bottom Section: Completion Rates */}
      <div>
        <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-8">
          Protocol Consistency
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {qRates.map(q => (
            <div key={q.id}>
              <div className="flex justify-between mb-2">
                <span className="text-[10px] tracking-[0.2em] uppercase text-foreground">{q.name}</span>
                <span className={`text-[12px] font-bold font-mono ${q.rate > 50 ? 'text-primary' : 'text-muted-foreground'}`}>{q.rate}%</span>
              </div>
              <div className="h-[1px] w-full bg-white/5">
                <div className={`h-full transition-all duration-1000 ${q.rate > 50 ? 'bg-primary' : 'bg-white/20'}`} style={{ width: `${Math.max(0, q.rate)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
