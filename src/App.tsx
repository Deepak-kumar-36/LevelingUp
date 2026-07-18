import { useEffect, useState } from 'react';
import { useAppStore, formatDateKey, formatWeekKey } from './store/useAppStore';
import { DEFAULT_QUESTS, RANKS, POSSIBLE_BOUNTIES } from './lib/constants';
import { DashboardView } from './features/dashboard/DashboardView';
import { CalendarView } from './features/calendar/CalendarView';
import { NotesView } from './features/notes/NotesView';
import { HealthView } from './features/health/HealthView';
import { FinanceView } from './features/finance/FinanceView';
import { StatsView } from './features/stats/StatsView';
import { ShopView } from './features/shop/ShopView';
import { InventoryView } from './features/inventory/InventoryView';
import { BossView } from './features/bosses/BossView';
import { AchievementsView } from './features/achievements/AchievementsView';
import { OnboardingView } from './features/onboarding/OnboardingView';
import { SettingsView } from './features/settings/SettingsView';
import { AwakeningView } from './features/awakening/AwakeningView';
import { SkillTreeView } from './features/skills/SkillTreeView';
import { vibrateLight } from './lib/haptics';

export default function App() {
  const { isReady, loadFromDb, data, setData } = useAppStore();
  const [view, setView] = useState('dash');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const myQuests = data?.quests ?? DEFAULT_QUESTS;
  const getRank = (xp: number) => RANKS.find(r => xp >= r.min && xp < r.max) ?? RANKS[5];

  useEffect(() => {
    loadFromDb();
  }, [loadFromDb]);

  const toast = (m: string) => {
    setToastMsg(m);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Backlog detection
  useEffect(() => {
    if (!isReady || !data.setupDone) return;
    const yesterday = formatDateKey(new Date(Date.now() - 86400000));
    if (data.lastBacklogCheck === yesterday) return;

    const yData = data.dayData[yesterday];
    if (!yData) {
      setData(d => ({ ...d, lastBacklogCheck: yesterday }));
      return;
    }

    const incomplete = myQuests.filter(q => !(yData.quests || []).includes(q.id));
    if (incomplete.length === 0) {
      setData(d => ({ ...d, lastBacklogCheck: yesterday }));
      return;
    }

    const existing = new Set((data.backlogs || []).map(b => b.id));
    const isVoidWalk = (data.user.unlockedPerks || []).includes('p_shadow_3');
    
    const newBL = isVoidWalk ? [] : incomplete
      .filter(q => !existing.has(q.id))
      .map(q => ({ id: q.id, name: q.name, xp: Math.floor(q.xp / 2), coins: Math.floor(q.coins / 2) }));

    if (newBL.length > 0) {
      setData(d => ({
        ...d,
        lastBacklogCheck: yesterday,
        backlogs: [...(d.backlogs || []), ...newBL]
      }));
    } else {
      setData(d => ({ ...d, lastBacklogCheck: yesterday }));
    }
  }, [isReady, data.setupDone, data.lastBacklogCheck, data.dayData, data.backlogs, myQuests, setData]);

  // Bounty generation
  useEffect(() => {
    if (!isReady || !data.setupDone) return;
    const currentWeek = formatWeekKey(new Date());
    
    if (data.lastBountyRefresh !== currentWeek) {
      // Pick 3 random bounties
      const shuffled = [...POSSIBLE_BOUNTIES].sort(() => 0.5 - Math.random());
      const newBounties = shuffled.slice(0, 3);
      
      setData(d => ({
        ...d,
        lastBountyRefresh: currentWeek,
        bounties: newBounties,
        completedBounties: []
      }));
    }
  }, [isReady, data.setupDone, data.lastBountyRefresh, setData]);

  // Sync theme to body class
  useEffect(() => {
    if (data.theme) {
      document.body.className = data.theme;
    }
  }, [data.theme]);

  // Achievement toast queue
  useEffect(() => {
    if (data.achievementQueue && data.achievementQueue.length > 0) {
      // Create a copy of the queue to toast
      const msgs = [...data.achievementQueue];
      
      // Toast each message with a small delay between them
      msgs.forEach((msg, i) => {
        setTimeout(() => toast(msg), i * 3000);
      });
      
      // Clear the queue in state
      setData(d => ({ ...d, achievementQueue: [] }));
    }
  }, [data.achievementQueue, setData]);

  if (!isReady) return null;

  if (!data.setupDone) {
    return <OnboardingView />;
  }

  const navs = [
    { id: 'dash', label: 'DASH' },
    { id: 'cal', label: 'CAL' },
    { id: 'notes', label: 'NOTES' },
    { id: 'health', label: 'HEALTH' },
    { id: 'finance', label: 'FINANCE' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'stats', label: 'STATS' },
    { id: 'awards', label: 'AWARDS' },
    { id: 'inventory', label: 'INVENTORY' },
    { id: 'shop', label: 'SHOP' },
    { id: 'bosses', label: 'BOSSES' },
    { id: 'settings', label: '⚙' }
  ];

  return (
    <div className="min-h-screen relative font-mono text-foreground overflow-hidden">
      <div className="void-gradient" />
      
      {/* Top Bar - Borderless, floating */}
      <div className="sticky top-0 z-50 flex flex-col gap-2 p-4 pt-[max(env(safe-area-inset-top),1rem)]">
        {/* Header Row */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 1024 1024" className="text-foreground">
              <g transform="translate(0, 0)">
                <path d="M 250 800 L 380 800 L 512 600 L 644 800 L 774 800 L 512 350 Z" fill="currentColor" />
                <path d="M 512 470 L 350 730 L 430 730 L 512 600 L 594 730 L 674 730 Z" fill="currentColor" />
              </g>
            </svg>
            <div className="font-bold text-[13px] tracking-[0.2em] text-muted-foreground">
              &gt;_ LEVELING UP
            </div>
          </div>
          <div className="text-[11px] tracking-[0.1em] text-muted-foreground">
            <span className="text-primary font-bold">●</span> {getRank(data?.user?.totalXp ?? 0).label} | {data?.user?.name || 'USER'}
          </div>
        </div>

        {/* Navigation Slider */}
        <div className="flex items-center gap-1 md:gap-1.5 overflow-x-auto no-scrollbar pb-1 w-full">
          {navs.map(n => (
            <button
              key={n.id}
              onClick={() => {
                vibrateLight();
                setView(n.id);
              }}
              className={`px-3 py-1 text-[10px] md:text-[11px] tracking-[0.1em] uppercase transition-colors whitespace-nowrap flex-shrink-0 ${view === n.id ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 md:p-6 h-[calc(100vh-100px)] overflow-y-auto no-scrollbar">
        {view === 'awakening' && <AwakeningView onComplete={() => setView('dash')} />}
        {view === 'dash' && <DashboardView setView={setView} />}
        {view === 'cal' && <CalendarView />}
        {view === 'notes' && <NotesView toast={toast} />}
        {view === 'health' && <HealthView toast={toast} />}
        { view === 'finance' && <FinanceView toast={toast} /> }
        { view === 'skills' && <SkillTreeView /> }
        { view === 'stats' && <StatsView /> }
        {view === 'awards' && <AchievementsView />}
        {view === 'inventory' && <InventoryView toast={toast} />}
        {view === 'shop' && <ShopView toast={toast} />}
        {view === 'bosses' && <BossView toast={toast} />}
        {view === 'settings' && <SettingsView toast={toast} />}
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 bg-foreground text-background px-4 py-2 text-[11px] font-bold tracking-wide shadow-lg animate-in slide-in-from-bottom-4 z-50">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
