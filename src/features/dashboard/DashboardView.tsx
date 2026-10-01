import { useAppStore, formatDateKey } from '../../store/useAppStore';
import { DEFAULT_QUESTS } from '../../lib/constants';
import { useMemo } from 'react';
import type { StatName } from '../../types';
import { CheckCircle2, Circle } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardView() {
  const { data, setData } = useAppStore();

  const now = new Date();
  const TK = formatDateKey(now);
  const todayData = data.dayData[TK] ?? { quests: [], xp: 0, coins: 0 };
  const myQuests = data.quests ?? DEFAULT_QUESTS;

  const dayName = DAYS[now.getDay()];
  const monthName = MONTHS[now.getMonth()];
  const dateStr = `${dayName}, ${monthName} ${now.getDate()}`;

  const dc = todayData.quests.length;
  const total = myQuests.length;

  // Is it a college day? (Wed-Sun = day indices 0,3,4,5,6)
  const isCollegeDay = [0, 3, 4, 5, 6].includes(now.getDay());

  // Weekly completion stats
  const weekStats = useMemo(() => {
    const stats: Record<string, number> = {};
    const d = new Date();
    const dayOfWeek = (d.getDay() + 6) % 7; // Mon=0
    d.setDate(d.getDate() - dayOfWeek); // Go to Monday
    for (let i = 0; i < 7; i++) {
      const k = formatDateKey(d);
      const dd = data.dayData[k];
      if (dd) {
        dd.quests.forEach(qid => {
          stats[qid] = (stats[qid] || 0) + 1;
        });
      }
      d.setDate(d.getDate() + 1);
    }
    return stats;
  }, [data.dayData]);

  // Total days active
  const totalDays = Object.keys(data.dayData).length;
  const totalCompleted = Object.values(data.dayData).reduce((sum, d) => sum + (d.quests?.length || 0), 0);

  const toggleQuest = (qid: string) => {
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

      return {
        ...d,
        user: {
          ...d.user,
          stats: newStats
        },
        dayData: {
          ...d.dayData,
          [TK]: {
            quests: newQ,
            xp: Math.max(0, (day.xp ?? 0) + q.xp * m),
            coins: Math.max(0, (day.coins ?? 0) + q.coins * m)
          }
        }
      };
    });
  };

  return (
    <div className="flex flex-col gap-10 fade-in">

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          {getGreeting()}, {data.user?.name || 'there'}.
        </h1>
        <p className="text-[14px] text-foreground-muted mt-1">
          {dateStr}
        </p>
      </div>

      {/* Today's Tasks */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-foreground">Today</h2>
          <span className="text-[13px] text-foreground-muted">
            {dc} of {total} completed
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-surface rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${total > 0 ? (dc / total) * 100 : 0}%` }}
          />
        </div>

        <div className="flex flex-col gap-1">
          {myQuests.map(q => {
            const isDone = todayData.quests.includes(q.id);
            return (
              <button
                key={q.id}
                onClick={() => toggleQuest(q.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all w-full group ${
                  isDone
                    ? 'opacity-50'
                    : 'hover:bg-surface'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 size={18} className="text-primary shrink-0" />
                ) : (
                  <Circle size={18} className="text-border group-hover:text-foreground-muted shrink-0" />
                )}
                <span className={`text-[14px] ${isDone ? 'line-through text-foreground-muted' : 'text-foreground'}`}>
                  {q.name.charAt(0) + q.name.slice(1).toLowerCase()}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Quick Stats */}
      <section>
        <h2 className="text-[15px] font-semibold text-foreground mb-4">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Days active', value: totalDays },
            { label: 'Tasks completed', value: totalCompleted },
            { label: 'Today', value: `${dc}/${total}` },
            { label: isCollegeDay ? 'College day' : 'Deep work day', value: isCollegeDay ? 'Wed–Sun' : 'Mon–Tue' },
          ].map(stat => (
            <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
              <div className="text-[12px] text-foreground-muted mb-1">{stat.label}</div>
              <div className="text-[20px] font-semibold text-foreground tabular-nums">{stat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* This Week */}
      <section>
        <h2 className="text-[15px] font-semibold text-foreground mb-4">This week</h2>
        <div className="flex flex-col gap-2">
          {myQuests.map(q => {
            const count = weekStats[q.id] || 0;
            return (
              <div key={q.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-[13px] text-foreground">
                  {q.name.charAt(0) + q.name.slice(1).toLowerCase()}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[0,1,2,3,4,5,6].map(i => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-sm ${i < count ? 'bg-primary' : 'bg-surface'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[12px] text-foreground-muted tabular-nums w-8 text-right">
                    {count}/7
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
