import { useState, useEffect } from 'react';
import { db } from '../data/db'; import type { VitalsEntry } from '../data/db';
import { vibrateLight, vibrateSuccess } from '../../../lib/haptics';
import { Save } from 'lucide-react';

interface Props {
  onXpEvent?: (event: 'vitals_logged') => void;
  onClose: () => void;
}

export function VitalsCheckIn({ onXpEvent, onClose }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [entry, setEntry] = useState<VitalsEntry>({
    date: today,
    sleepHours: null,
    sleepQuality: null,
    waterIntakeMl: 0,
    mood: null,
    energy: null,
    weightKg: null,
    notes: ''
  });

  useEffect(() => {
    db.vitals.get(today).then(existing => {
      if (existing) setEntry(existing);
    });
  }, [today]);

  const handleSave = async () => {
    vibrateSuccess();
    const isNew = !(await db.vitals.get(today));
    await db.vitals.put(entry);
    if (isNew && onXpEvent) onXpEvent('vitals_logged');
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] p-4 text-foreground font-mono animate-in fade-in overflow-y-auto">
      <div className="mb-6 border-b border-primary/20 pb-4">
        <h2 className="text-[16px] text-primary font-bold tracking-[0.2em] uppercase">SYSTEM VITALS</h2>
        <p className="text-[10px] text-muted-foreground tracking-[0.1em]">{today}</p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Sleep */}
        <div className="border border-white/10 p-4 bg-black/40">
          <div className="text-[10px] text-primary mb-3 tracking-[0.2em]">SLEEP DIAGNOSTICS</div>
          <div className="flex gap-4 items-center">
            <div className="flex-1 flex flex-col">
              <label className="text-[9px] text-muted-foreground mb-1">HOURS</label>
              <input 
                type="number" 
                value={entry.sleepHours || ''} 
                onChange={e => setEntry({...entry, sleepHours: parseFloat(e.target.value)})}
                className="bg-transparent border-b border-white/20 focus:border-primary focus:outline-none p-1 text-[14px]"
                placeholder="0.0"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-[9px] text-muted-foreground mb-1">QUALITY (1-5)</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(q => (
                  <button 
                    key={q}
                    onClick={() => { setEntry({...entry, sleepQuality: q}); vibrateLight(); }}
                    className={`flex-1 py-1 text-[12px] border ${entry.sleepQuality === q ? 'border-primary bg-primary/20 text-primary' : 'border-white/10 text-muted-foreground'}`}
                  >{q}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hydration */}
        <div className="border border-white/10 p-4 bg-black/40">
          <div className="text-[10px] text-primary mb-3 tracking-[0.2em]">HYDRATION LEVEL</div>
          <div className="flex items-center gap-4">
            <span className="text-[20px] font-bold text-white tracking-[0.1em]">{entry.waterIntakeMl} <span className="text-[10px] text-muted-foreground">ML</span></span>
            <div className="flex gap-2">
              <button onClick={() => { setEntry({...entry, waterIntakeMl: entry.waterIntakeMl + 250}); vibrateLight(); }} className="border border-primary/50 text-primary px-3 py-1 text-[10px] hover:bg-primary/20">+250</button>
              <button onClick={() => { setEntry({...entry, waterIntakeMl: entry.waterIntakeMl + 500}); vibrateLight(); }} className="border border-primary/50 text-primary px-3 py-1 text-[10px] hover:bg-primary/20">+500</button>
            </div>
          </div>
        </div>

        {/* Mood & Energy */}
        <div className="border border-white/10 p-4 bg-black/40">
          <div className="text-[10px] text-primary mb-3 tracking-[0.2em]">NEURAL STATE</div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[9px] text-muted-foreground mb-1 block">MOOD (1-5)</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(q => (
                  <button 
                    key={q}
                    onClick={() => { setEntry({...entry, mood: q}); vibrateLight(); }}
                    className={`flex-1 py-2 text-[12px] border ${entry.mood === q ? 'border-primary bg-primary/20 text-primary' : 'border-white/10 text-muted-foreground'}`}
                  >{q}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[9px] text-muted-foreground mb-1 block">ENERGY (1-5)</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(q => (
                  <button 
                    key={q}
                    onClick={() => { setEntry({...entry, energy: q}); vibrateLight(); }}
                    className={`flex-1 py-2 text-[12px] border ${entry.energy === q ? 'border-primary bg-primary/20 text-primary' : 'border-white/10 text-muted-foreground'}`}
                  >{q}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-8 mb-4">
        <button 
          onClick={handleSave}
          className="w-full bg-primary/10 border border-primary text-primary py-4 font-bold tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary hover:text-black transition-colors"
        >
          <Save size={16} /> COMMUNICATE TELEMETRY
        </button>
      </div>

    </div>
  );
}
