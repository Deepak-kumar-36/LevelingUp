import { useState } from 'react';
import { useAppStore, dKey, getInten } from '../../store/useAppStore';
import { QUESTS, MONTHS_S, IC, IL } from '../../lib/html-constants';
import { monthGrid } from '../../lib/utils';

export function YearView() {
  const { data } = useAppStore();
  const [yearDate, setYearDate] = useState(new Date());

  const myQuests = data.quests ?? QUESTS;

  const y = yearDate.getFullYear();
  const TK = dKey(new Date());

  return (
    <div className="bg-card border border-border p-3 animate-in fade-in">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div className="text-[11px] font-bold tracking-[2px] flex items-center gap-1.5">
          YEARLY OVERVIEW
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button 
            className="px-2.5 py-1 border border-border bg-background text-[11px] tracking-[1px] uppercase hover:bg-muted"
            onClick={() => setYearDate(new Date(y - 1, 0, 1))}
          >
            ← PREV
          </button>
          <span className="text-[16px] font-bold tracking-[4px] px-3">
            {y}
          </span>
          <button 
            className="px-2.5 py-1 border border-border bg-background text-[11px] tracking-[1px] uppercase hover:bg-muted"
            onClick={() => setYearDate(new Date(y + 1, 0, 1))}
          >
            NEXT →
          </button>
          <button 
            className="px-2.5 py-1 border border-border bg-background text-[11px] tracking-[1px] uppercase hover:bg-muted"
            onClick={() => setYearDate(new Date())}
          >
            TODAY
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[14px]">
        {Array.from({ length: 12 }, (_, mi) => {
          const cells = monthGrid(y, mi);
          return (
            <div key={mi} className="border border-border p-2.5">
              <div className="text-[11px] font-bold tracking-[2px] mb-2 text-center uppercase">
                {MONTHS_S[mi]}
              </div>
              <div className="grid grid-cols-[repeat(7,13px)] gap-0.5 justify-center">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <div key={'h' + i} className="w-[13px] h-[13px] text-[8px] text-muted-foreground text-center leading-[13px]">
                    {d}
                  </div>
                ))}
                {cells.map((day, i) => {
                  if (!day) return <div key={i} className="w-[13px] h-[13px]" />;
                  const k = dKey(new Date(y, mi, day));
                  const dd = data.dayData[k] ?? { quests: [] };
                  const inten = getInten(dd.quests.length, myQuests.length);
                  const isT = k === TK;
                  
                  return (
                    <div 
                      key={i}
                      className="w-[13px] h-[13px] cursor-pointer"
                      style={{ 
                        backgroundColor: IC[inten] === 'transparent' ? 'transparent' : IC[inten],
                        border: isT ? '1px solid #ffffff' : '1px solid transparent'
                      }}
                      title={`${MONTHS_S[mi]} ${day}: ${dd.quests.length}/${myQuests.length}`}
                      onClick={() => {
                        // Normally this would navigate to calendar and select day.
                        // We could achieve this by lifting setView up, but sticking to view-only for year is fine
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-4 items-center text-[11px] text-muted-foreground tracking-[1px]">
        <span>INTENSITY LEVEL:</span>
        {IL.map((l, i) => (
          <div key={l} className="flex items-center gap-1">
            <div className="w-3 h-3 border border-border" style={{ backgroundColor: IC[i] === 'transparent' ? 'transparent' : IC[i] }} />
            <span>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
