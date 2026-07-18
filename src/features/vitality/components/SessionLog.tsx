import { useState } from 'react';
import { db } from '../data/db'; import type { MobilitySession, MeditationSession } from '../data/db';
import { generateId } from '../../../store/useAppStore';
import { vibrateLight, vibrateSuccess } from '../../../lib/haptics';
import { Save } from 'lucide-react';

interface Props {
  mode: 'mobility' | 'meditation';
  onXpEvent?: (event: 'mobility_logged' | 'meditation_logged') => void;
  onClose: () => void;
}

export function SessionLog({ mode, onXpEvent, onClose }: Props) {
  const [duration, setDuration] = useState(15);
  const [type, setType] = useState(mode === 'mobility' ? 'STRETCHING' : 'BREATHWORK');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    vibrateSuccess();
    const session = {
      id: 'sess_' + generateId(),
      date: new Date().toISOString().split('T')[0],
      type,
      durationMin: duration,
      notes
    };

    if (mode === 'mobility') {
      await db.mobility.put(session as MobilitySession);
      if (onXpEvent) onXpEvent('mobility_logged');
    } else {
      await db.meditation.put(session as MeditationSession);
      if (onXpEvent) onXpEvent('meditation_logged');
    }
    
    onClose();
  };

  const title = mode === 'mobility' ? 'JOINT INTEGRITY' : 'MENTAL OVERRIDE';
  
  return (
    <div className="flex flex-col h-full bg-[#050505] p-4 text-foreground font-mono animate-in fade-in overflow-y-auto">
      <div className="mb-6 border-b border-primary/20 pb-4 flex justify-between items-center">
        <h2 className="text-[16px] text-primary font-bold tracking-[0.2em] uppercase">{title}</h2>
        <button onClick={onClose} className="text-[10px] text-muted-foreground hover:text-white uppercase tracking-[0.1em]">CLOSE</button>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        
        <div className="flex flex-col gap-2">
          <label className="text-[9px] text-primary tracking-[0.2em]">SESSION TYPE</label>
          <input 
            value={type}
            onChange={e => setType(e.target.value)}
            className="bg-black/60 border border-white/20 p-3 text-[12px] uppercase focus:outline-none focus:border-primary w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[9px] text-primary tracking-[0.2em]">DURATION (MINUTES)</label>
          <div className="flex items-center gap-4">
            <span className="text-[32px] font-bold text-white tracking-[0.1em] w-16 text-center">{duration}</span>
            <div className="flex gap-2 flex-1">
              <button onClick={() => { setDuration(Math.max(1, duration - 5)); vibrateLight(); }} className="flex-1 border border-white/20 py-3 hover:border-primary/50 transition-colors">-5</button>
              <button onClick={() => { setDuration(duration + 5); vibrateLight(); }} className="flex-1 border border-white/20 py-3 hover:border-primary/50 transition-colors">+5</button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-[9px] text-primary tracking-[0.2em]">NOTES (OPTIONAL)</label>
          <textarea 
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="bg-black/60 border border-white/20 p-3 text-[12px] focus:outline-none focus:border-primary w-full resize-none flex-1"
            placeholder="ANY OBSERVATIONS?"
          />
        </div>

      </div>

      <div className="mt-8 mb-4 shrink-0">
        <button 
          onClick={handleSave}
          className="w-full bg-primary/10 border border-primary text-primary py-4 font-bold tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary hover:text-black transition-colors"
        >
          <Save size={16} /> RECORD SESSION
        </button>
      </div>

    </div>
  );
}
