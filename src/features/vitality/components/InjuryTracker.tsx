import { useState, useEffect } from 'react';
import { db } from '../data/db'; import type { Injury, InjuryStatus } from '../data/db';
import { generateId } from '../../../store/useAppStore';
import { vibrateLight } from '../../../lib/haptics';
import { Plus } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function InjuryTracker({ onClose }: Props) {
  const [injuries, setInjuries] = useState<Injury[]>([]);
  const [newPart, setNewPart] = useState('');
  const [newStatus, setNewStatus] = useState<InjuryStatus>('active');

  useEffect(() => {
    db.injuries.toArray().then(setInjuries);
  }, []);

  const handleAdd = async () => {
    if (!newPart.trim()) return;
    vibrateLight();
    const inj: Injury = {
      id: 'inj_' + generateId(),
      bodyPart: newPart.toUpperCase(),
      status: newStatus,
      startDate: new Date().toISOString().split('T')[0],
      resolvedDate: null,
      notes: ''
    };
    await db.injuries.put(inj);
    setInjuries([...injuries, inj]);
    setNewPart('');
  };

  const handleUpdateStatus = async (inj: Injury, status: InjuryStatus) => {
    vibrateLight();
    const updated = { 
      ...inj, 
      status, 
      resolvedDate: status === 'resolved' ? new Date().toISOString().split('T')[0] : null 
    };
    await db.injuries.put(updated);
    setInjuries(injuries.map(i => i.id === inj.id ? updated : i));
  };

  const getColor = (status: InjuryStatus) => {
    switch(status) {
      case 'active': return 'fill-red-500/80 stroke-red-500';
      case 'recovering': return 'fill-yellow-500/80 stroke-yellow-500';
      default: return 'fill-transparent stroke-primary/30';
    }
  };

  // Simplified logic to map injury names to SVG parts
  const hasStatus = (part: string, status: InjuryStatus) => 
    injuries.some(i => i.bodyPart.includes(part) && i.status === status);

  const getPartColor = (part: string) => {
    if (hasStatus(part, 'active')) return getColor('active');
    if (hasStatus(part, 'recovering')) return getColor('recovering');
    return getColor('resolved');
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] p-4 text-foreground font-mono animate-in fade-in overflow-y-auto">
      <div className="mb-6 border-b border-primary/20 pb-4 flex justify-between items-center">
        <h2 className="text-[16px] text-primary font-bold tracking-[0.2em] uppercase">DAMAGE LOG</h2>
        <button onClick={onClose} className="text-[10px] text-muted-foreground hover:text-white uppercase tracking-[0.1em]">CLOSE</button>
      </div>

      <div className="flex gap-4">
        {/* Wireframe Body Map */}
        <div className="w-1/3 flex items-center justify-center border border-white/5 bg-black/40 p-4 shrink-0">
          <svg viewBox="0 0 100 200" className="w-full h-auto drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]">
            {/* Head */}
            <rect x="40" y="10" width="20" height="25" className={`transition-colors duration-500 ${getPartColor('HEAD')}`} strokeWidth="2" />
            {/* Torso */}
            <rect x="35" y="40" width="30" height="50" className={`transition-colors duration-500 ${getPartColor('TORSO')}`} strokeWidth="2" />
            {/* L Arm */}
            <rect x="15" y="40" width="15" height="40" className={`transition-colors duration-500 ${getPartColor('ARM')}`} strokeWidth="2" />
            {/* R Arm */}
            <rect x="70" y="40" width="15" height="40" className={`transition-colors duration-500 ${getPartColor('ARM')}`} strokeWidth="2" />
            {/* L Leg */}
            <rect x="35" y="95" width="12" height="50" className={`transition-colors duration-500 ${getPartColor('LEG')}`} strokeWidth="2" />
            {/* R Leg */}
            <rect x="53" y="95" width="12" height="50" className={`transition-colors duration-500 ${getPartColor('LEG')}`} strokeWidth="2" />
          </svg>
        </div>

        {/* Form & List */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex gap-2 bg-black/60 border border-white/10 p-2">
            <input 
              value={newPart}
              onChange={e => setNewPart(e.target.value)}
              placeholder="BODY PART"
              className="bg-transparent text-[11px] w-full focus:outline-none placeholder:text-muted-foreground/50 uppercase"
            />
            <select 
              value={newStatus} 
              onChange={e => setNewStatus(e.target.value as InjuryStatus)}
              className="bg-black text-[9px] text-primary focus:outline-none border border-white/10"
            >
              <option value="active">ACTIVE</option>
              <option value="recovering">RECOVERING</option>
            </select>
            <button onClick={handleAdd} className="text-primary hover:text-white"><Plus size={14} /></button>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto">
            {injuries.filter(i => i.status !== 'resolved').map(inj => (
              <div key={inj.id} className="border border-white/10 p-2 bg-black/40 flex justify-between items-center">
                <span className="text-[11px] font-bold text-white tracking-[0.1em]">{inj.bodyPart}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdateStatus(inj, 'active')} className={`text-[9px] px-2 py-1 border ${inj.status === 'active' ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-white/10 text-muted-foreground'}`}>ACT</button>
                  <button onClick={() => handleUpdateStatus(inj, 'recovering')} className={`text-[9px] px-2 py-1 border ${inj.status === 'recovering' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-white/10 text-muted-foreground'}`}>REC</button>
                  <button onClick={() => handleUpdateStatus(inj, 'resolved')} className="text-[9px] px-2 py-1 border border-white/10 text-muted-foreground hover:text-white">RES</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
