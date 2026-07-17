import { useState } from 'react';
import { useAppStore, formatDateKey, getIntensity } from '../../store/useAppStore';
import { DEFAULT_QUESTS, MONTH_NAMES, MONTH_NAMES_SHORT, DAY_NAMES, INTENSITY_LABELS } from '../../lib/constants';
import { buildMonthGrid } from '../../lib/utils';

export function CalendarView() {
  const { data } = useAppStore();
  const [calDate, setCalDate] = useState(new Date());
  const [selDay, setSelDay] = useState<string | null>(null);

  const myQuests = data.quests ?? DEFAULT_QUESTS;

  const TK = formatDateKey(new Date());
  const y = calDate.getFullYear();
  const m = calDate.getMonth();
  const cells = buildMonthGrid(y, m);

  // Override intensity colors to fit the void theme (shades of red)
  const VOID_COLORS = ['transparent', 'rgba(220, 38, 38, 0.2)', 'rgba(220, 38, 38, 0.5)', 'rgba(220, 38, 38, 0.9)'];

  return (
    <div className="animate-in fade-in flex flex-col md:flex-row gap-12 max-w-4xl mx-auto z-10 relative pointer-events-auto">
      
      {/* Calendar Grid */}
      <div className="flex-1">
        <div className="flex flex-col gap-6 mb-8 items-center md:items-start">
          <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase">
            Habit Calendar
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              className="text-[11px] tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors uppercase"
              onClick={() => setCalDate(new Date(y, m - 1, 1))}
            >
              PREV
            </button>
            <div className="text-[16px] font-bold tracking-[0.2em] text-foreground">
              {MONTH_NAMES[m]} {y}
            </div>
            <button 
              className="text-[11px] tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors uppercase"
              onClick={() => setCalDate(new Date(y, m + 1, 1))}
            >
              NEXT
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAY_NAMES.map(d => (
            <div key={d} className="text-center text-[10px] text-muted-foreground tracking-[0.1em] py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {cells.map((day, i) => {
            if (!day) return <div key={i} className="min-h-[50px]" />;
            
            const k = formatDateKey(new Date(y, m, day));
            const dd = data.dayData[k] ?? { quests: [], xp: 0, coins: 0 };
            const inten = getIntensity(dd.quests.length, myQuests.length);
            const isT = k === TK;
            const isSel = k === selDay;
            
            return (
              <div 
                key={i} 
                className={`min-h-[50px] p-2 text-[11px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isSel ? 'ring-1 ring-primary/50' : 'hover:bg-white/5'} ${isT ? 'text-primary font-bold' : 'text-foreground'}`}
                style={{ backgroundColor: VOID_COLORS[inten] }}
                onClick={() => setSelDay(k)}
              >
                <div>{day}</div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8 text-[10px] text-muted-foreground tracking-[0.2em]">
          <span>INTENSITY:</span>
          {INTENSITY_LABELS.map((l, i) => (
            <div key={l} className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ backgroundColor: VOID_COLORS[i] }} />
              <span>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Summary Side Panel */}
      <div className="w-full md:w-[280px] flex flex-col gap-6">
        <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase">
          Daily Summary
        </div>
        
        {selDay ? (() => {
          const sd = data.dayData[selDay] ?? { quests: [], xp: 0, coins: 0 };
          const dt = new Date(selDay + 'T00:00:00');
          const inten = getIntensity(sd.quests.length, myQuests.length);
          
          return (
            <div className="flex flex-col gap-6">
              <div>
                <div className="font-bold tracking-[0.1em] text-[14px] text-foreground mb-1">
                  {MONTH_NAMES_SHORT[dt.getMonth()]} {dt.getDate()}, {dt.getFullYear()}
                </div>
                <div className="text-[11px] text-muted-foreground tracking-[0.1em]">
                  {INTENSITY_LABELS[inten]} LEVEL
                </div>
              </div>
              
              <div className="flex gap-8">
                <div>
                  <div className="text-[10px] text-muted-foreground tracking-[0.2em] mb-1">XP</div>
                  <div className="font-bold text-[18px] text-foreground">{sd.xp ?? 0}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground tracking-[0.2em] mb-1">COINS</div>
                  <div className="font-bold text-[18px] text-primary">{sd.coins ?? 0}</div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <div className="text-[10px] text-muted-foreground tracking-[0.2em]">QUESTS</div>
                {myQuests.map((q) => {
                  const done = sd.quests.includes(q.id);
                  return (
                    <div key={q.id} className="text-[11px] flex gap-3 items-center">
                      <span className={done ? 'text-primary' : 'text-muted-foreground/30'}>{done ? '✓' : '—'}</span>
                      <span className={`tracking-[0.1em] uppercase ${done ? 'text-foreground' : 'text-muted-foreground'}`}>{q.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })() : (
          <div className="text-[11px] text-muted-foreground tracking-[0.1em] opacity-50">
            Select a day in the calendar to view records.
          </div>
        )}
      </div>
    </div>
  );
}
