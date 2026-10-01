import { useState } from 'react';
import { useAppStore, formatDateKey, getIntensity } from '../../store/useAppStore';
import { DEFAULT_QUESTS, MONTH_NAMES_SHORT } from '../../lib/constants';
import { buildMonthGrid } from '../../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function YearView() {
  const { data } = useAppStore();
  const [yearDate, setYearDate] = useState(new Date());

  const myQuests = data.quests ?? DEFAULT_QUESTS;

  const y = yearDate.getFullYear();
  const TK = formatDateKey(new Date());

  const INTENSITY_COLORS = [
    'var(--color-surface)',
    'var(--color-primary-muted)', 
    'color-mix(in srgb, var(--color-primary) 50%, transparent)',
    'var(--color-primary)'
  ];
  
  const INTENSITY_LABELS = ['None', 'Light', 'Moderate', 'High'];

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm w-full fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[16px] font-semibold text-foreground">Yearly Overview</h2>
        
        <div className="flex items-center gap-4">
          <button 
            className="text-[12px] font-medium text-foreground-secondary hover:text-foreground transition-colors"
            onClick={() => setYearDate(new Date())}
          >
            Today
          </button>
          <div className="flex items-center gap-2">
            <button 
              className="p-1.5 hover:bg-surface rounded-md text-foreground-muted transition-colors"
              onClick={() => setYearDate(new Date(y - 1, 0, 1))}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[14px] font-semibold tabular-nums px-2">
              {y}
            </span>
            <button 
              className="p-1.5 hover:bg-surface rounded-md text-foreground-muted transition-colors"
              onClick={() => setYearDate(new Date(y + 1, 0, 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }, (_, mi) => {
          const cells = buildMonthGrid(y, mi);
          return (
            <div key={mi} className="border border-border/50 rounded-lg p-4 bg-background/50">
              <div className="text-[12px] font-semibold text-foreground-muted mb-3 uppercase tracking-wider">
                {MONTH_NAMES_SHORT[mi]}
              </div>
              <div className="grid grid-cols-[repeat(7,1fr)] gap-1 justify-items-center">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <div key={'h' + i} className="text-[10px] text-foreground-muted/50 mb-1">
                    {d}
                  </div>
                ))}
                {cells.map((day, i) => {
                  if (!day) return <div key={i} className="w-[14px] h-[14px]" />;
                  const k = formatDateKey(new Date(y, mi, day));
                  const dd = data.dayData[k] ?? { quests: [], xp: 0, coins: 0 };
                  const inten = getIntensity(dd.quests.length, myQuests.length);
                  const isT = k === TK;
                  
                  return (
                    <div 
                      key={i}
                      className={`w-[14px] h-[14px] rounded-sm cursor-help ${isT ? 'ring-1 ring-primary ring-offset-1 ring-offset-card' : ''}`}
                      style={{ backgroundColor: INTENSITY_COLORS[inten] }}
                      title={`${MONTH_NAMES_SHORT[mi]} ${day}: ${dd.quests.length}/${myQuests.length} tasks`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-8 text-[12px] text-foreground-muted pt-6 border-t border-border">
        <span className="mr-2">Consistency:</span>
        {INTENSITY_LABELS.map((l, i) => (
          <div key={l} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm border border-black/5" style={{ backgroundColor: INTENSITY_COLORS[i] }} />
            <span>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
