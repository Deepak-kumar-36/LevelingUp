import { useEffect, useState } from 'react';
import { useAppStore, dKey } from './store/useAppStore';
import { QUESTS as DEF_QUESTS, RANKS } from './lib/html-constants';
import { DashboardView } from './features/dashboard/DashboardView';
import { CalendarView } from './features/calendar/CalendarView';
import { YearView } from './features/calendar/YearView';
import { NotesView } from './features/notes/NotesView';
import { HealthView } from './features/health/HealthView';
import { FinanceView } from './features/finance/FinanceView';
import { StatsView } from './features/stats/StatsView';
import { ShopView } from './features/shop/ShopView';
import { BossView } from './features/bosses/BossView';

export default function App() {
  const { isReady, loadFromDb, data, setData } = useAppStore();
  const [view, setView] = useState('dash');
  const [setupName, setSetupName] = useState('DEEPAK');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const myQuests = data?.quests ?? DEF_QUESTS;
  const getRank = (xp: number) => RANKS.find(r => xp >= r.min && xp < r.max) ?? RANKS[5];

  useEffect(() => {
    loadFromDb();
  }, []);

  const toast = (m: string) => {
    setToastMsg(m);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Backlog detection
  useEffect(() => {
    if (!isReady || !data.setupDone) return;
    const yesterday = dKey(new Date(Date.now() - 86400000));
    if (data.lastBacklogCheck === yesterday) return;

    const yData = data.dayData[yesterday];
    if (!yData) {
      setData(d => ({ ...d, lastBacklogCheck: yesterday }));
      return;
    }

    const incomplete = myQuests.filter((q: any) => !(yData.quests || []).includes(q.id));
    if (incomplete.length === 0) {
      setData(d => ({ ...d, lastBacklogCheck: yesterday }));
      return;
    }

    const existing = new Set((data.backlogs || []).map(b => b.id));
    const newBL = incomplete
      .filter((q: any) => !existing.has(q.id))
      .map((q: any) => ({ id: q.id, name: q.name, xp: Math.floor(q.xp / 2), coins: Math.floor(q.coins / 2) }));

    if (newBL.length > 0) {
      setData(d => ({
        ...d,
        lastBacklogCheck: yesterday,
        backlogs: [...(d.backlogs || []), ...newBL]
      }));
    } else {
      setData(d => ({ ...d, lastBacklogCheck: yesterday }));
    }
  }, [isReady, data.setupDone]);

  if (!isReady) return null;

  if (!data.setupDone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold tracking-[3px] mb-8 uppercase">Initialize Protocol</h1>
        <div className="max-w-md w-full bg-card border border-border p-6">
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Hunter Designation</div>
          <input
            value={setupName}
            onChange={e => setSetupName(e.target.value)}
            className="w-full bg-background border border-border p-2 mb-6 font-mono text-sm outline-none text-foreground"
          />
          <button
            onClick={() => setData(d => ({ ...d, setupDone: true, user: { ...d.user, name: setupName.toUpperCase() } }))}
            className="w-full bg-foreground text-background border border-foreground p-3 font-bold tracking-widest uppercase hover:opacity-90"
          >
            Begin
          </button>
        </div>
      </div>
    );
  }

  const navs = [
    { id: 'dash', label: 'DASH' },
    { id: 'cal', label: 'CAL' },
    { id: 'year', label: 'YEAR' },
    { id: 'notes', label: 'NOTES' },
    { id: 'health', label: 'HEALTH' },
    { id: 'finance', label: 'FINANCE' },
    { id: 'stats', label: 'STATS' },
    { id: 'shop', label: 'SHOP' },
    { id: 'bosses', label: 'BOSSES' }
  ];

  return (
    <div className="min-h-screen pb-[max(env(safe-area-inset-bottom),1rem)] md:pb-0">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 flex flex-col gap-2 p-2 md:p-3 pt-[max(env(safe-area-inset-top),0.5rem)] md:pt-3 bg-background border-b border-border">
        {/* Header Row */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 1024 1024" className="text-foreground">
              <g transform="translate(0, -50)">
                <path d="M 250 750 L 380 750 L 512 550 L 644 750 L 774 750 L 512 300 Z" fill="currentColor" />
                <path d="M 512 420 L 350 680 L 430 680 L 512 550 L 594 680 L 674 680 Z" fill="currentColor" />
              </g>
            </svg>
            <div className="font-bold text-[13px] tracking-[4px]">
              MINIMAL
            </div>
          </div>
          <div className="px-3 py-1 border border-border text-[11px] tracking-[1px] flex items-center gap-1 bg-background whitespace-nowrap">
            <span className="text-success">●</span> {getRank(data?.user?.totalXp ?? 0).l} | {data?.user?.name || 'USER'}
          </div>
        </div>

        {/* Navigation Slider */}
        <div className="flex items-center gap-1 md:gap-1.5 overflow-x-auto no-scrollbar pb-1 w-full">
          {navs.map(n => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={`px-3 py-2 md:py-1 border border-border text-[10px] md:text-[11px] tracking-[1px] uppercase transition-colors whitespace-nowrap flex-shrink-0 ${view === n.id ? 'bg-foreground text-background font-bold' : 'bg-background hover:bg-card'}`}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 md:p-4">
        {view === 'dash' && <DashboardView />}
        {view === 'cal' && <CalendarView />}
        {view === 'year' && <YearView />}
        {view === 'notes' && <NotesView toast={toast} />}
        {view === 'health' && <HealthView toast={toast} />}
        {view === 'finance' && <FinanceView toast={toast} />}
        {view === 'stats' && <StatsView />}
        {view === 'shop' && <ShopView toast={toast} />}
        {view === 'bosses' && <BossView toast={toast} />}
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 bg-foreground text-background px-4 py-2 text-[11px] font-bold tracking-[2px] shadow-lg animate-in slide-in-from-bottom-4 z-50">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
