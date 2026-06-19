import { useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { INIT, THEMES } from '../../lib/html-constants';
import { vibrateSuccess, vibrateError, vibrateLight } from '../../lib/haptics';

export function SettingsView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();
  const fileInput = useRef<HTMLInputElement>(null);
  const [showReset, setShowReset] = useState(false);

  const exportData = () => {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `levelingup-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast('✓ BACKUP EXPORTED');
    } catch {
      toast('✗ EXPORT FAILED');
    }
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string);
        if (!imported.user || !imported.setupDone) {
          toast('✗ INVALID BACKUP FILE');
          return;
        }
        setData(() => ({ ...INIT, ...imported }));
        toast('✓ DATA RESTORED SUCCESSFULLY');
      } catch {
        toast('✗ FAILED TO READ FILE');
      }
    };
    reader.readAsText(file);
    if (fileInput.current) fileInput.current.value = '';
  };

  const resetAll = () => {
    setData(() => INIT);
    setShowReset(false);
    toast('✓ ALL DATA RESET');
  };

  // Calculate stats
  const totalDays = Object.keys(data.dayData || {}).length;
  const totalQuestsCompleted = Object.values(data.dayData || {}).reduce((sum: number, d: any) => sum + (d.quests?.length || 0), 0);
  const bossesDefeated = (data.bosses || []).reduce((sum: number, b: any) => {
    const totalDamageDealt = b.maxHp - b.hp;
    return sum + Math.floor(totalDamageDealt / b.maxHp);
  }, 0);

  const purchaseTheme = (themeId: string, cost: number) => {
    setData(d => {
      if (d.user.coins < cost) {
        vibrateError();
        toast('✗ INSUFFICIENT COINS');
        return d;
      }
      vibrateSuccess();
      toast('✓ THEME UNLOCKED');
      return {
        ...d,
        user: { ...d.user, coins: d.user.coins - cost },
        unlockedThemes: [...(d.unlockedThemes || []), themeId],
        theme: themeId
      };
    });
  };

  const selectTheme = (themeId: string) => {
    vibrateLight();
    setData(d => ({ ...d, theme: themeId }));
  };

  return (
    <div className="animate-in fade-in flex flex-col gap-3">
      {/* Profile Card */}
      <div className="bg-card border border-border/50 rounded-xl card-shadow p-4">
        <div className="text-[11px] font-bold tracking-wide mb-3 flex items-center gap-1.5">
          ⚙ HUNTER PROFILE
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-border p-3">
            <div className="text-[10px] text-muted-foreground tracking-wide uppercase mb-1">NAME</div>
            <div className="text-[14px] font-bold tracking-wide">{data.user?.name || 'UNKNOWN'}</div>
          </div>
          <div className="border border-border p-3">
            <div className="text-[10px] text-muted-foreground tracking-wide uppercase mb-1">TOTAL XP</div>
            <div className="text-[14px] font-bold tracking-wide">{(data.user?.totalXp || 0).toLocaleString()}</div>
          </div>
          <div className="border border-border p-3">
            <div className="text-[10px] text-muted-foreground tracking-wide uppercase mb-1">DAYS ACTIVE</div>
            <div className="text-[14px] font-bold tracking-wide">{totalDays}</div>
          </div>
          <div className="border border-border p-3">
            <div className="text-[10px] text-muted-foreground tracking-wide uppercase mb-1">QUESTS DONE</div>
            <div className="text-[14px] font-bold tracking-wide">{totalQuestsCompleted}</div>
          </div>
          <div className="border border-border p-3">
            <div className="text-[10px] text-muted-foreground tracking-wide uppercase mb-1">LONGEST STREAK</div>
            <div className="text-[14px] font-bold tracking-wide">🔥 {data.user?.longestStreak || 0}D</div>
          </div>
          <div className="border border-border p-3">
            <div className="text-[10px] text-muted-foreground tracking-wide uppercase mb-1">BOSSES SLAIN</div>
            <div className="text-[14px] font-bold tracking-wide">☠ {bossesDefeated}</div>
          </div>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="bg-card border border-border/50 rounded-xl card-shadow p-4">
        <div className="text-[11px] font-bold tracking-wide mb-3 flex items-center gap-1.5">
          🎨 TERMINAL THEME
        </div>
        <div className="grid grid-cols-1 gap-2">
          {THEMES.map(t => {
            const unlocked = (data.unlockedThemes || []).includes(t.id);
            const active = data.theme === t.id;
            const canAfford = data.user.coins >= t.cost;
            return (
              <div key={t.id} className={`flex justify-between items-center p-3 border ${active ? 'border-foreground bg-foreground text-background' : 'border-border'}`}>
                <div className="text-[11px] font-bold tracking-wide uppercase">{t.name}</div>
                {unlocked ? (
                  <button
                    onClick={() => selectTheme(t.id)}
                    disabled={active}
                    className={`text-[10px] tracking-wide uppercase px-3 py-1 border transition-colors ${active ? 'border-background text-background' : 'border-border bg-background hover:bg-muted'}`}
                  >
                    {active ? 'ACTIVE' : 'SELECT'}
                  </button>
                ) : (
                  <button
                    onClick={() => purchaseTheme(t.id, t.cost)}
                    disabled={!canAfford}
                    className={`text-[10px] tracking-wide uppercase px-3 py-1 border transition-colors ${canAfford ? 'border-foreground bg-foreground text-background hover:opacity-90' : 'border-border bg-muted text-muted-foreground opacity-50 cursor-not-allowed'}`}
                  >
                    {t.cost} COINS
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="bg-card border border-border/50 rounded-xl card-shadow p-4">
        <div className="text-[11px] font-bold tracking-wide mb-1 flex items-center gap-1.5">
          💾 BACKUP & RESTORE
        </div>
        <div className="text-[10px] text-muted-foreground tracking-wide mb-4 uppercase">
          Your data is stored locally. Export it to keep it safe.
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={exportData}
            className="w-full p-3 bg-foreground text-background border border-foreground text-[11px] font-bold tracking-wide uppercase hover:opacity-90"
          >
            ↓ EXPORT BACKUP
          </button>

          <button
            onClick={() => fileInput.current?.click()}
            className="w-full p-3 bg-background border border-border text-[11px] font-bold tracking-wide uppercase hover:bg-muted"
          >
            ↑ IMPORT BACKUP
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".json"
            onChange={importData}
            className="hidden"
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card border border-destructive p-4">
        <div className="text-[11px] font-bold tracking-wide mb-1 flex items-center gap-1.5 text-destructive">
          ⚠ DANGER ZONE
        </div>
        <div className="text-[10px] text-muted-foreground tracking-wide mb-4 uppercase">
          This will permanently erase all your progress.
        </div>

        {!showReset ? (
          <button
            onClick={() => setShowReset(true)}
            className="w-full p-3 border border-destructive text-destructive text-[11px] font-bold tracking-wide uppercase hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            FACTORY RESET
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setShowReset(false)}
              className="flex-1 p-3 border border-border text-[11px] tracking-wide uppercase bg-background hover:bg-muted"
            >
              CANCEL
            </button>
            <button
              onClick={resetAll}
              className="flex-1 p-3 bg-destructive text-destructive-foreground border border-destructive text-[11px] font-bold tracking-wide uppercase"
            >
              CONFIRM RESET
            </button>
          </div>
        )}
      </div>

      {/* App Info */}
      <div className="bg-card border border-border/50 rounded-xl card-shadow p-4">
        <div className="text-[11px] font-bold tracking-wide mb-3 flex items-center gap-1.5">
          ℹ ABOUT
        </div>
        <div className="space-y-1 text-[11px] text-muted-foreground tracking-wide">
          <div>APP: LEVELING UP v1.0</div>
          <div>DATA: 100% OFFLINE</div>
          <div>STORAGE: LOCAL INDEXEDDB</div>
        </div>
      </div>
    </div>
  );
}
