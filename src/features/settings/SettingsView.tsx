import { useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { INITIAL_STATE } from '../../lib/constants';
import type { AppState } from '../../types';
import { Download, Upload, AlertTriangle, Info } from 'lucide-react';

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
      toast('Backup exported');
    } catch {
      toast('Export failed');
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
          toast('Invalid backup file');
          return;
        }
        setData(() => ({ ...INITIAL_STATE, ...imported }));
        toast('Data restored');
      } catch {
        toast('Failed to read backup');
      }
    };
    reader.readAsText(file);
    if (fileInput.current) fileInput.current.value = '';
  };

  const resetAll = () => {
    setData(() => INITIAL_STATE);
    setShowReset(false);
    toast('All data cleared');
  };

  const totalDays = Object.keys(data.dayData || {}).length;
  const totalCompleted = Object.values(data.dayData || {}).reduce((sum, d) => sum + (d.quests?.length || 0), 0);

  return (
    <div className="flex flex-col gap-10 fade-in max-w-xl">

      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Settings</h1>
        <p className="text-[14px] text-foreground-muted mt-1">Account and data management</p>
      </div>

      {/* Profile */}
      <section>
        <h2 className="text-[12px] font-semibold text-foreground-muted uppercase tracking-wider mb-4">Profile</h2>
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {[
            ['Name', data.user?.name || 'Unknown'],
            ['Days active', totalDays],
            ['Tasks completed', totalCompleted],
          ].map(([label, value]) => (
            <div key={label as string} className="flex items-center justify-between px-4 py-3">
              <span className="text-[14px] text-foreground">{label}</span>
              <span className="text-[14px] text-foreground-secondary font-medium tabular-nums">{value as React.ReactNode}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Data */}
      <section>
        <h2 className="text-[12px] font-semibold text-foreground-muted uppercase tracking-wider mb-4">Data</h2>
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          <button
            onClick={exportData}
            className="flex items-center gap-3 px-4 py-3 text-[14px] text-foreground hover:bg-surface-hover transition-colors w-full text-left"
          >
            <Download size={16} className="text-foreground-muted" />
            Export backup
          </button>
          <button
            onClick={() => fileInput.current?.click()}
            className="flex items-center gap-3 px-4 py-3 text-[14px] text-foreground hover:bg-surface-hover transition-colors w-full text-left"
          >
            <Upload size={16} className="text-foreground-muted" />
            Import backup
          </button>
          <input ref={fileInput} type="file" accept=".json" onChange={importData} className="hidden" />
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="text-[12px] font-semibold text-error uppercase tracking-wider mb-4">Danger zone</h2>
        <div className="bg-card border border-error/20 rounded-lg">
          {!showReset ? (
            <button
              onClick={() => setShowReset(true)}
              className="flex items-center gap-3 px-4 py-3 text-[14px] text-error hover:bg-error-muted transition-colors w-full text-left"
            >
              <AlertTriangle size={16} />
              Reset all data
            </button>
          ) : (
            <div className="px-4 py-4 flex flex-col gap-3">
              <p className="text-[13px] text-foreground-secondary">This will permanently delete all your data. This cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReset(false)}
                  className="flex-1 py-2 border border-border rounded-lg text-[13px] text-foreground-secondary hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={resetAll}
                  className="flex-1 py-2 bg-error text-white rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity"
                >
                  Delete everything
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <div className="text-center text-[12px] text-foreground-muted pt-4 border-t border-border">
        <div className="flex items-center justify-center gap-2">
          <Info size={12} />
          Leveling Up · All data stored locally
        </div>
      </div>
    </div>
  );
}
