import { useState } from 'react';
import { useAppStore, formatDateKey, getIntensity } from '../../store/useAppStore';
import { DEFAULT_QUESTS, MONTH_NAMES, MONTH_NAMES_SHORT, DAY_NAMES } from '../../lib/constants';
import { buildMonthGrid } from '../../lib/utils';
import { YearView } from './YearView';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CalendarView() {
  const { data } = useAppStore();
  const [calDate, setCalDate] = useState(new Date());
  const [selDay, setSelDay] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'month'|'year'>('month');

  const myQuests = data.quests ?? DEFAULT_QUESTS;

  const TK = formatDateKey(new Date());
  const y = calDate.getFullYear();
  const m = calDate.getMonth();
  const cells = buildMonthGrid(y, m);

  // Use primary color with opacity for intensity
  const INTENSITY_COLORS = [
    'var(--color-surface)',
    'var(--color-primary-muted)', 
    'color-mix(in srgb, var(--color-primary) 50%, transparent)',
    'var(--color-primary)'
  ];
  
  const INTENSITY_LABELS = ['None', 'Light', 'Moderate', 'High'];

  return (
    <div className="flex flex-col gap-10 fade-in">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Calendar</h1>
          <p className="text-[14px] text-foreground-muted mt-1">Review your habit consistency</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-surface rounded-lg p-1">
          <button 
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 text-[13px] rounded-md transition-colors ${viewMode === 'month' ? 'bg-card text-foreground font-medium shadow-sm' : 'text-foreground-muted hover:text-foreground'}`}
          >
            Month
          </button>
          <button 
            onClick={() => setViewMode('year')}
            className={`px-3 py-1.5 text-[13px] rounded-md transition-colors ${viewMode === 'year' ? 'bg-card text-foreground font-medium shadow-sm' : 'text-foreground-muted hover:text-foreground'}`}
          >
            Year
          </button>
        </div>
      </div>

      {viewMode === 'year' ? (
        <YearView />
      ) : (
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Calendar Grid */}
          <div className="flex-1 bg-card border border-border rounded-xl p-6 shadow-sm w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="text-[16px] font-semibold text-foreground">
                {MONTH_NAMES[m]} {y}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="p-1.5 hover:bg-surface rounded-md text-foreground-muted transition-colors"
                  onClick={() => setCalDate(new Date(y, m - 1, 1))}
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  className="p-1.5 hover:bg-surface rounded-md text-foreground-muted transition-colors"
                  onClick={() => setCalDate(new Date(y, m + 1, 1))}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {DAY_NAMES.map(d => (
                <div key={d} className="text-center text-[12px] font-medium text-foreground-muted py-2">
                  {d.slice(0, 3)}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {cells.map((day, i) => {
                if (!day) return <div key={i} className="min-h-[44px]" />;
                
                const k = formatDateKey(new Date(y, m, day));
                const dd = data.dayData[k] ?? { quests: [], xp: 0, coins: 0 };
                const inten = getIntensity(dd.quests.length, myQuests.length);
                const isT = k === TK;
                const isSel = k === selDay;
                
                return (
                  <div 
                    key={i} 
                    className={`min-h-[44px] rounded-md text-[13px] flex flex-col items-center justify-center cursor-pointer transition-all ${isSel ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : 'hover:opacity-80'} ${isT ? 'font-bold' : 'font-medium'}`}
                    style={{ 
                      backgroundColor: INTENSITY_COLORS[inten],
                      color: inten > 1 ? 'white' : 'var(--color-foreground)'
                    }}
                    onClick={() => setSelDay(k)}
                  >
                    <div>{day}</div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-8 text-[12px] text-foreground-muted">
              <span className="mr-2">Consistency:</span>
              {INTENSITY_LABELS.map((l, i) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm border border-black/5" style={{ backgroundColor: INTENSITY_COLORS[i] }} />
                  <span>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Summary Side Panel */}
          <div className="w-full md:w-[320px] bg-card border border-border rounded-xl p-6 shadow-sm sticky top-4">
            <h3 className="text-[14px] font-semibold text-foreground mb-4">Daily Summary</h3>
            
            {selDay ? (() => {
              const sd = data.dayData[selDay] ?? { quests: [], xp: 0, coins: 0 };
              const dt = new Date(selDay + 'T00:00:00');
              const inten = getIntensity(sd.quests.length, myQuests.length);
              
              return (
                <div className="flex flex-col gap-5">
                  <div className="pb-4 border-b border-border">
                    <div className="font-medium text-[15px] text-foreground mb-0.5">
                      {MONTH_NAMES_SHORT[dt.getMonth()]} {dt.getDate()}, {dt.getFullYear()}
                    </div>
                    <div className="text-[13px] text-foreground-muted">
                      {INTENSITY_LABELS[inten]} activity
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1 bg-surface p-3 rounded-lg">
                      <div className="text-[12px] text-foreground-muted mb-1">Completed</div>
                      <div className="font-semibold text-[18px] text-foreground">{sd.quests.length}</div>
                    </div>
                    <div className="flex-1 bg-surface p-3 rounded-lg">
                      <div className="text-[12px] text-foreground-muted mb-1">Completion</div>
                      <div className="font-semibold text-[18px] text-primary">{Math.round((sd.quests.length / Math.max(1, myQuests.length)) * 100)}%</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 mt-2">
                    <div className="text-[12px] font-semibold text-foreground-muted uppercase tracking-wider mb-1">Tasks</div>
                    {myQuests.map((q) => {
                      const done = sd.quests.includes(q.id);
                      return (
                        <div key={q.id} className="text-[13px] flex gap-3 items-center">
                          <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${done ? 'bg-primary text-primary-foreground' : 'bg-surface border border-border'}`}>
                            {done && <span className="text-[10px]">✓</span>}
                          </div>
                          <span className={done ? 'text-foreground' : 'text-foreground-muted'}>{q.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })() : (
              <div className="text-[13px] text-foreground-muted flex flex-col items-center justify-center py-10 text-center">
                Select a day on the calendar to view details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
