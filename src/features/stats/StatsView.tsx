import { useAppStore, calcStreak } from '../../store/useAppStore';
import { QUESTS, STATS, SICON, DAYS, EQUIPMENT_ITEMS } from '../../lib/html-constants';
import { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export function StatsView() {
  const { data } = useAppStore();

  const myQuests = data.quests ?? QUESTS;
  const streak = useMemo(() => calcStreak(data.dayData, myQuests.length), [data.dayData, myQuests.length]);

  const allDays = Object.entries(data.dayData);
  const total = allDays.length;

  const qRates = myQuests.map((q: any) => {
    const done = allDays.filter(([, dd]: [string, any]) => dd.quests.includes(q.id)).length;
    return { ...q, done, rate: total ? Math.round((done / total) * 100) : 0 };
  });

  const dow = Array(7).fill(null).map(() => ({ qc: Array(myQuests.length).fill(0), tot: 0 }));
  
  allDays.forEach(([k, dd]: [string, any]) => {
    const d = new Date(k + 'T00:00:00');
    const i = (d.getDay() + 6) % 7;
    dow[i].tot++;
    myQuests.forEach((q: any, qi: number) => {
      if (dd.quests.includes(q.id)) dow[i].qc[qi]++;
    });
  });

  // Calculate daily XP for chart
  const xpData = useMemo(() => {
    const chartData = [];
    const d = new Date();
    d.setDate(d.getDate() - 14); // Last 14 days
    for (let i = 0; i < 14; i++) {
      const k = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      const dd = data.dayData?.[k] || { quests: [] };
      const xp = dd.quests.reduce((sum: number, qid: string) => {
        const quest = myQuests.find((q: any) => q.id === qid);
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
          if (k in bonuses) bonuses[k as keyof typeof bonuses] += v;
        });
      }
    });
    return bonuses;
  }, [data.equipped]);

  return (
    <div className="animate-in fade-in flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-card border border-border/50 rounded-xl card-shadow p-3">
          <div className="text-[11px] font-bold tracking-wide mb-2.5 flex items-center gap-1.5">🔥 STREAKS</div>
          <div className="mb-3.5">
            <div className="text-[11px] text-muted-foreground tracking-wide">CURRENT STREAK</div>
            <div className={`text-[32px] font-bold leading-[1.1] ${streak > 0 ? 'text-success' : 'text-foreground'}`}>
              {streak} DAYS
            </div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground tracking-wide">LONGEST STREAK</div>
            <div className="text-[20px] font-bold">{data.user.longestStreak} DAYS</div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl card-shadow p-3">
          <div className="text-[11px] font-bold tracking-wide mb-2.5 flex items-center gap-1.5">OVERVIEW</div>
          {[
            ['DAYS TRACKED', total],
            ['TOTAL XP', data.user.totalXp.toLocaleString()],
            ['COINS HELD', data.user.coins],
            ['NOTES WRITTEN', (data.notes ?? []).length]
          ].map(([l, v]) => (
            <div key={l as string} className="flex justify-between py-1.5 border-b border-border text-[11px]">
              <span className="text-muted-foreground tracking-wide">{l}</span>
              <span className="font-bold">{v}</span>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border/50 rounded-xl card-shadow p-3">
          <div className="text-[11px] font-bold tracking-wide mb-2.5 flex items-center gap-1.5">⬡ CHARACTER STATS</div>
          {STATS.map(stat => {
            const val = data.user.stats[stat as keyof typeof data.user.stats];
            const bonus = bonusStats[stat as keyof typeof bonusStats];

            return (
              <div key={stat} className="mb-2">
                <div className="flex justify-between mb-0.5">
                  <span className="text-[11px] tracking-wide">{SICON[stat]} {stat.toUpperCase()}</span>
                  <span className="text-[11px] font-bold">
                    {val} {bonus > 0 && <span className="text-success ml-1">+{bonus}</span>}
                  </span>
                </div>
                <div className="h-[5px] bg-muted overflow-hidden flex">
                  <div className="h-full bg-foreground transition-all duration-300" style={{ width: `${Math.max(0, Math.min(100, val / 2))}%` }} />
                  {bonus > 0 && <div className="h-full bg-success transition-all duration-300" style={{ width: `${Math.max(0, Math.min(100, bonus / 2))}%` }} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl card-shadow p-3">
        <div className="text-[11px] font-bold tracking-wide mb-2.5 flex items-center gap-1.5">📈 XP GAINS (LAST 14 DAYS)</div>
        <div className="h-[120px] w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={xpData}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="currentColor" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="currentColor" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', fontSize: '11px', textTransform: 'uppercase', borderRadius: '0' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="xp" stroke="hsl(var(--foreground))" strokeWidth={2} fillOpacity={1} fill="url(#colorXp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl card-shadow p-3">
        <div className="text-[11px] font-bold tracking-wide mb-2.5 flex items-center gap-1.5">COMPLETION RATES</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
          {qRates.map(q => (
            <div key={q.id}>
              <div className="flex justify-between mb-0.5">
                <span className="text-[11px] tracking-wide">{q.name}</span>
                <span className="text-[11px] font-bold">{q.rate}%</span>
              </div>
              <div className="h-[6px] bg-muted overflow-hidden">
                <div className="h-full bg-success transition-all duration-300" style={{ width: `${Math.max(0, q.rate)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl card-shadow p-3">
        <div className="text-[11px] font-bold tracking-wide mb-2.5 flex items-center gap-1.5">DAILY PATTERNS</div>
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day, di) => {
            const { qc, tot } = dow[di];
            const sum = qc.reduce((a, b) => a + b, 0);
            const avg = tot ? Math.round((sum / tot / myQuests.length) * 100) : 0;
            return (
              <div key={day} className="text-center">
                <div className="text-[11px] text-muted-foreground tracking-wide mb-1.5">{day}</div>
                {myQuests.map((q: any, qi: number) => {
                  const p = tot ? Math.round((qc[qi] / tot) * 100) : 0;
                  return (
                    <div key={q.id} className="flex mb-0.5">
                      <div className="flex-1 h-[6px] bg-muted overflow-hidden">
                        <div className="h-full bg-success-alt transition-all duration-300" style={{ width: `${p}%` }} />
                      </div>
                    </div>
                  );
                })}
                <div className={`text-[10px] mt-1 font-bold ${avg >= 70 ? 'text-success' : 'text-muted-foreground'}`}>
                  {avg}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
