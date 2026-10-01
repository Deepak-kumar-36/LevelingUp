import { useEffect, useState } from 'react';
import { useAppStore, formatDateKey } from './store/useAppStore';

/* Views */
import { DashboardView } from './features/dashboard/DashboardView';
import { GoalsView } from './features/goals/GoalsView';
import { CalendarView } from './features/calendar/CalendarView';
import { NotesView } from './features/notes/NotesView';
import { HealthView } from './features/health/HealthView';
import { FinanceView } from './features/finance/FinanceView';
import { WinterArcView } from './features/winter-arc/components/WinterArcView';
import { ProjectsView } from './features/projects/ProjectsView';
import { IdeaVaultView } from './features/projects/IdeaVaultView';
import { OnboardingView } from './features/onboarding/OnboardingView';
import { SettingsView } from './features/settings/SettingsView';

/* Icons */
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Snowflake,
  Settings,
  Menu,
  X,
  Calendar,
  FileText,
  Heart,
  Wallet,
  FolderKanban,
  Lightbulb,
} from 'lucide-react';

type ViewId = 
  | 'dash' | 'tasks' | 'goals' | 'projects' | 'progress'
  | 'winter-arc' | 'ideas' | 'cal' | 'notes' | 'health' | 'finance' | 'settings';

interface NavItem {
  id: ViewId;
  label: string;
  icon: React.ReactNode;
  section?: 'primary' | 'secondary';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dash', label: 'Dashboard', icon: <LayoutDashboard size={18} />, section: 'primary' },
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={18} />, section: 'primary' },
  { id: 'goals', label: 'Goals', icon: <Target size={18} />, section: 'primary' },
  { id: 'projects', label: 'Projects', icon: <FolderKanban size={18} />, section: 'primary' },
  { id: 'cal', label: 'Calendar', icon: <Calendar size={18} />, section: 'primary' },
  { id: 'notes', label: 'Notes', icon: <FileText size={18} />, section: 'primary' },
  { id: 'health', label: 'Health', icon: <Heart size={18} />, section: 'primary' },
  { id: 'finance', label: 'Budget', icon: <Wallet size={18} />, section: 'primary' },
  { id: 'winter-arc', label: 'Winter Arc', icon: <Snowflake size={18} />, section: 'secondary' },
  { id: 'ideas', label: 'Idea Vault', icon: <Lightbulb size={18} />, section: 'secondary' },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} />, section: 'secondary' },
];

const MOBILE_NAV: ViewId[] = ['dash', 'tasks', 'cal', 'health', 'settings'];

export default function App() {
  const { isReady, loadFromDb, data, setData } = useAppStore();
  const [view, setView] = useState<ViewId>('dash');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);



  useEffect(() => {
    loadFromDb();
  }, [loadFromDb]);

  const toast = (m: string) => {
    setToastMsg(m);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Backlog detection (simplified — no gamification)
  useEffect(() => {
    if (!isReady || !data.setupDone) return;
    const yesterday = formatDateKey(new Date(Date.now() - 86400000));
    if (data.lastBacklogCheck === yesterday) return;
    setData(d => ({ ...d, lastBacklogCheck: yesterday }));
  }, [isReady, data.setupDone, data.lastBacklogCheck, setData]);

  // Theme (force light)
  useEffect(() => {
    document.body.className = '';
  }, []);

  if (!isReady) return null;
  if (!data.setupDone) return <OnboardingView />;

  const navigate = (id: ViewId) => {
    setView(id);
    setSidebarOpen(false);
  };

  const primaryNav = NAV_ITEMS.filter(n => n.section === 'primary');
  const secondaryNav = NAV_ITEMS.filter(n => n.section === 'secondary');

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      
      {/* Sidebar — Desktop */}
      <aside className="hidden md:flex flex-col w-[220px] border-r border-border bg-background-alt shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <div className="text-[15px] font-semibold text-foreground tracking-tight">
            Leveling Up
          </div>
          <div className="text-[12px] text-foreground-muted mt-0.5">
            {data.user?.name || 'User'}
          </div>
        </div>

        {/* Primary Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {primaryNav.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex items-center gap-3 px-3 py-2 text-[13px] rounded-lg transition-colors w-full text-left focus-ring ${
                view === item.id
                  ? 'bg-primary-muted text-primary font-medium'
                  : 'text-foreground-secondary hover:bg-surface-hover'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          <div className="h-px bg-border my-4" />

          {secondaryNav.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex items-center gap-3 px-3 py-2 text-[13px] rounded-lg transition-colors w-full text-left focus-ring ${
                view === item.id
                  ? 'bg-primary-muted text-primary font-medium'
                  : 'text-foreground-secondary hover:bg-surface-hover'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-background-alt border-r border-border flex flex-col fade-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="text-[15px] font-semibold">Leveling Up</div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-foreground-muted hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-[14px] rounded-lg transition-colors w-full text-left ${
                    view === item.id
                      ? 'bg-primary-muted text-primary font-medium'
                      : 'text-foreground-secondary hover:bg-surface-hover'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top bar — mobile only */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background-alt">
          <button onClick={() => setSidebarOpen(true)} className="p-1 text-foreground-secondary hover:text-foreground">
            <Menu size={20} />
          </button>
          <div className="text-[14px] font-semibold text-foreground">
            {NAV_ITEMS.find(n => n.id === view)?.label || 'Leveling Up'}
          </div>
          <div className="w-8" /> {/* spacer */}
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10">
            {view === 'dash' && <DashboardView />}
            {view === 'tasks' && <DashboardView />}
            {view === 'goals' && <GoalsView />}
            {view === 'projects' && <ProjectsView />}
            {view === 'cal' && <CalendarView />}
            {view === 'notes' && <NotesView toast={toast} />}
            {view === 'health' && <HealthView toast={toast} />}
            {view === 'finance' && <FinanceView toast={toast} />}
            {view === 'winter-arc' && <WinterArcView />}
            {view === 'ideas' && <IdeaVaultView />}
            {view === 'settings' && <SettingsView toast={toast} />}
          </div>
        </div>

        {/* Bottom nav — mobile only */}
        <nav className="md:hidden flex items-center justify-around border-t border-border bg-background-alt py-2 px-1 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
          {MOBILE_NAV.map(id => {
            const item = NAV_ITEMS.find(n => n.id === id)!;
            return (
              <button
                key={id}
                onClick={() => navigate(id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] transition-colors ${
                  view === id ? 'text-primary' : 'text-foreground-muted'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </main>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-20 md:bottom-6 right-6 bg-foreground text-background px-4 py-2.5 text-[13px] font-medium rounded-lg shadow-lg fade-in z-50">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
