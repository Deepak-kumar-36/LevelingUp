import { useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { INITIAL_STATE, THEMES } from '../../lib/constants';
import { vibrateSuccess, vibrateError, vibrateLight } from '../../lib/haptics';
import type { AppState } from '../../types';

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
      toast('✓ ARCHIVE EXPORTED');
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
        const imported = JSON.parse(ev.target?.result as string) as AppState;
        if (!imported.user || !imported.setupDone) {
          toast('✗ INVALID ARCHIVE FILE');
          return;
        }
        setData(() => ({ ...INITIAL_STATE, ...imported }));
        toast('✓ SYSTEM RESTORED');
      } catch {
        toast('✗ FAILED TO READ ARCHIVE');
      }
    };
    reader.readAsText(file);
    if (fileInput.current) fileInput.current.value = '';
  };

  const resetAll = () => {
    setData(() => INITIAL_STATE);
    setShowReset(false);
    toast('✓ SYSTEM PURGED');
  };

  const totalDays = Object.keys(data.dayData || {}).length;
  const totalQuestsCompleted = Object.values(data.dayData || {}).reduce((sum, d) => sum + (d.quests?.length || 0), 0);
  const bossesDefeated = (data.bosses || []).reduce((sum, b) => {
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
    <div className="animate-in fade-in flex flex-col gap-16 max-w-4xl mx-auto z-10 relative pointer-events-auto h-full px-4 pt-10 pb-24 overflow-y-auto no-scrollbar">
      
      {/* Profile Metrics */}
      <div>
        <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-8">
          System Identity
        </div>
        <div className="flex flex-col gap-4">
          {[
            ['DESIGNATION', data.user?.name || 'UNKNOWN'],
            ['TOTAL XP', (data.user?.totalXp || 0).toLocaleString()],
            ['UPTIME (DAYS)', totalDays],
            ['PROTOCOLS EXECUTED', totalQuestsCompleted],
            ['MAXIMUM STREAK', data.user?.longestStreak || 0],
            ['THREATS ELIMINATED', bossesDefeated]
          ].map(([label, value]) => (
            <div key={label as string} className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{label}</span>
              <span className="text-[12px] font-bold font-mono tracking-[0.1em] text-primary">{value as React.ReactNode}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Theme */}
      <div>
        <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-8">
          Visual Interface
        </div>
        <div className="flex flex-col gap-6">
          {THEMES.map(t => {
            const unlocked = (data.unlockedThemes || []).includes(t.id);
            const active = data.theme === t.id;
            const canAfford = data.user.coins >= t.cost;
            return (
              <div key={t.id} className="flex justify-between items-center border-b border-white/5 pb-2 transition-opacity hover:opacity-100 opacity-80">
                <span className={`text-[12px] tracking-[0.2em] uppercase ${active ? 'text-primary font-bold' : 'text-foreground'}`}>
                  {t.name}
                </span>
                {unlocked ? (
                  <button
                    onClick={() => selectTheme(t.id)}
                    disabled={active}
                    className={`text-[10px] tracking-[0.2em] uppercase font-bold transition-colors ${
                      active ? 'text-primary cursor-default' : 'text-muted-foreground hover:text-white'
                    }`}
                  >
                    {active ? '[ ACTIVE ]' : '[ SELECT ]'}
                  </button>
                ) : (
                  <button
                    onClick={() => purchaseTheme(t.id, t.cost)}
                    disabled={!canAfford}
                    className={`text-[10px] tracking-[0.2em] uppercase font-bold transition-colors ${
                      canAfford ? 'text-primary hover:text-white' : 'text-muted-foreground/30 cursor-not-allowed'
                    }`}
                  >
                    [ ACQUIRE: {t.cost} C ]
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Management */}
      <div>
        <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-8">
          Data Preservation
        </div>
        <div className="flex flex-col gap-6">
          <button
            onClick={exportData}
            className="text-left text-[12px] font-bold tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors"
          >
            [ EXPORT ARCHIVE ]
          </button>
          
          <button
            onClick={() => fileInput.current?.click()}
            className="text-left text-[12px] font-bold tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors"
          >
            [ RESTORE ARCHIVE ]
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
      <div className="pt-10">
        <div className="text-[11px] text-destructive tracking-[0.3em] uppercase mb-8">
          Critical Operations
        </div>
        {!showReset ? (
          <button
            onClick={() => setShowReset(true)}
            className="text-left text-[12px] font-bold tracking-[0.2em] uppercase text-destructive hover:text-white transition-colors"
          >
            [ PURGE SYSTEM DATA ]
          </button>
        ) : (
          <div className="flex gap-8">
            <button
              onClick={() => setShowReset(false)}
              className="text-[12px] font-bold tracking-[0.2em] uppercase text-muted-foreground hover:text-white transition-colors"
            >
              [ ABORT ]
            </button>
            <button
              onClick={resetAll}
              className="text-[12px] font-bold tracking-[0.2em] uppercase text-destructive text-glow hover:text-white transition-colors"
            >
              [ CONFIRM PURGE ]
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-10 border-t border-white/5 pt-8 text-center text-[9px] text-muted-foreground/50 tracking-[0.3em] font-mono">
        LEVELING UP v1.0<br/>
        LOCAL STORAGE ARCHITECTURE
      </div>
    </div>
  );
}
