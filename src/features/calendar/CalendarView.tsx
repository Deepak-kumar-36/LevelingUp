import { useState } from 'react';
import { useAppStore, dKey, getInten } from '../../store/useAppStore';
import { QUESTS, MONTHS, MONTHS_S, DAYS, IC, IL } from '../../lib/html-constants';
import { monthGrid } from '../../lib/utils';

export function CalendarView() {
  const { data } = useAppStore();
  const [calDate, setCalDate] = useState(new Date());
  const [selDay, setSelDay] = useState<string | null>(null);

  const myQuests = data.quests ?? QUESTS;

  const TK = dKey(new Date());
  const y = calDate.getFullYear();
  const m = calDate.getMonth();
  const cells = monthGrid(y, m);

  return (
    <div className="animate-in fade-in grid grid-cols-1 md:grid-cols-[1fr_270px] gap-3">
      <div className="bg-card border border-border/50 rounded-xl card-shadow p-3">
        <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
          <div className="text-[11px] font-bold tracking-wide flex items-center gap-1.5">
            HABIT CALENDAR
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button 
              className="px-2.5 py-1 border border-border bg-background text-[11px] tracking-wide uppercase hover:bg-muted"
              onClick={() => setCalDate(new Date(y, m - 1, 1))}
            >
              PREV
            </button>
            <div className="px-3 py-1 border border-border bg-card text-[12px] font-bold tracking-wide">
              {MONTHS[m]} {y}
            </div>
            <button 
              className="px-2.5 py-1 border border-border bg-background text-[11px] tracking-wide uppercase hover:bg-muted"
              onClick={() => setCalDate(new Date(y, m + 1, 1))}
            >
              NEXT
            </button>
            <button 
              className="px-2.5 py-1 border border-border bg-background text-[11px] tracking-wide uppercase hover:bg-muted"
              onClick={() => setCalDate(new Date())}
            >
              TODAY
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0.5 mb-0.5">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[11px] text-muted-foreground tracking-wide py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((day, i) => {
            if (!day) return <div key={i} className="min-h-[54px] bg-muted/30" />;
            
            const k = dKey(new Date(y, m, day));
            const dd = data.dayData[k] ?? { quests: [] };
            const inten = getInten(dd.quests.length, myQuests.length);
            const isT = k === TK;
            const isSel = k === selDay;
            
            let borderClass = 'border-border';
            if (isT) borderClass = 'border-foreground border-2';
            else if (isSel) borderClass = 'border-muted-foreground border-2';

            return (
              <div 
                key={i} 
                className={`min-h-[54px] p-1 text-[10px] flex flex-col justify-between cursor-pointer border transition-colors ${borderClass}`}
                style={{ backgroundColor: IC[inten] === 'transparent' ? 'transparent' : IC[inten] }}
                onClick={() => setSelDay(k)}
              >
                <div className={`${inten > 1 ? 'text-[#111111]' : 'text-foreground'} ${isT ? 'font-bold' : ''}`}>
                  {day}
                </div>
                {dd.quests.length > 0 && (
                  <div className={`text-[9px] ${inten > 1 ? 'text-[#111111]' : 'text-success'}`}>
                    {dd.quests.length}/{myQuests.length}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 mt-3 items-center text-[11px] text-muted-foreground tracking-wide">
          <span>INTENSITY LEVEL:</span>
          {IL.map((l, i) => (
            <div key={l} className="flex items-center gap-1">
              <div className="w-3 h-3 border border-border" style={{ backgroundColor: IC[i] === 'transparent' ? 'transparent' : IC[i] }} />
              <span>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl card-shadow p-3">
        <div className="text-[11px] font-bold tracking-wide mb-2.5 flex items-center gap-1.5">
          DAILY SUMMARY
        </div>
        {selDay ? (() => {
          const sd = data.dayData[selDay] ?? { quests: [], xp: 0, coins: 0 };
          const dt = new Date(selDay + 'T00:00:00');
          const inten = getInten(sd.quests.length, myQuests.length);
          
          return (
            <div>
              <div className="mb-2.5 pb-2 border-b border-border">
                <div className="font-bold tracking-wide mb-0.5 text-[13px]">
                  {MONTHS_S[dt.getMonth()]} {dt.getDate()}, {dt.getFullYear()}
                </div>
                <div className="text-[11px] text-muted-foreground tracking-wide">
                  {sd.quests.length}/{myQuests.length} · {IL[inten]}
                </div>
              </div>
              <div className="flex gap-4 mb-3">
                <div>
                  <div className="text-[11px] text-muted-foreground tracking-wide">XP</div>
                  <div className="font-bold text-[16px]">{sd.xp ?? 0}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground tracking-wide">COINS</div>
                  <div className="font-bold text-[16px]">{sd.coins ?? 0}</div>
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground tracking-wide mb-1.5">QUESTS</div>
              {myQuests.map((q: any) => {
                const done = sd.quests.includes(q.id);
                return (
                  <div key={q.id} className="text-[11px] py-1.5 border-b border-border flex gap-2 items-center">
                    <span className={done ? 'text-success' : 'text-muted'}>{done ? '✓' : '○'}</span>
                    <span className={`tracking-wide ${done ? 'opacity-100' : 'opacity-40'}`}>{q.name}</span>
                  </div>
                );
              })}
            </div>
          );
        })() : (
          <div className="text-[11px] text-muted-foreground tracking-wide leading-relaxed">
            Select a day in the calendar to see a summary.
          </div>
        )}
      </div>
    </div>
  );
}
