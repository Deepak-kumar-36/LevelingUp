import { useState, useEffect } from 'react';
import { db } from '../data/db'; import type { SupplementChecklist as SuppChecklistType } from '../data/db';
import { vibrateLight } from '../../../lib/haptics';
import { Plus, Check, Trash2 } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function SupplementChecklist({ onClose }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [checklist, setChecklist] = useState<SuppChecklistType>({
    date: today,
    items: []
  });
  const [newItem, setNewItem] = useState('');

  // We carry over items from the most recent checklist if today's is empty
  useEffect(() => {
    const load = async () => {
      const todayList = await db.supplements.get(today);
      if (todayList) {
        setChecklist(todayList);
      } else {
        // Find last list
        const last = await db.supplements.orderBy('date').reverse().first();
        if (last) {
          const carriedOver = last.items.map(i => ({ name: i.name, completed: false }));
          setChecklist({ date: today, items: carriedOver });
        }
      }
    };
    load();
  }, [today]);

  const save = async (cl: SuppChecklistType) => {
    setChecklist(cl);
    await db.supplements.put(cl);
  };

  const handleAdd = () => {
    if (!newItem.trim()) return;
    vibrateLight();
    const cl = {
      ...checklist,
      items: [...checklist.items, { name: newItem.trim().toUpperCase(), completed: false }]
    };
    setNewItem('');
    save(cl);
  };

  const toggleItem = (idx: number) => {
    vibrateLight();
    const cl = { ...checklist };
    cl.items[idx].completed = !cl.items[idx].completed;
    save(cl);
  };

  const removeItem = (idx: number) => {
    vibrateLight();
    const cl = { ...checklist };
    cl.items.splice(idx, 1);
    save(cl);
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] p-4 text-foreground font-mono animate-in fade-in overflow-y-auto">
      <div className="mb-6 border-b border-primary/20 pb-4 flex justify-between items-center">
        <h2 className="text-[16px] text-primary font-bold tracking-[0.2em] uppercase">SYNTHETIC INTAKE</h2>
        <button onClick={onClose} className="text-[10px] text-muted-foreground hover:text-white uppercase tracking-[0.1em]">CLOSE</button>
      </div>

      <div className="flex flex-col gap-4">
        
        {/* Add */}
        <div className="flex gap-2 bg-black/60 border border-white/10 p-2">
          <input 
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="E.G. CREATINE 5G"
            className="bg-transparent text-[11px] w-full focus:outline-none placeholder:text-muted-foreground/50 uppercase"
          />
          <button onClick={handleAdd} className="text-primary hover:text-white"><Plus size={14} /></button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2">
          {checklist.items.length === 0 ? (
            <div className="text-[10px] text-muted-foreground/30 border border-dashed border-white/10 p-4 text-center tracking-[0.1em]">PROTOCOL EMPTY</div>
          ) : (
            checklist.items.map((item, idx) => (
              <div 
                key={idx} 
                className={`flex justify-between items-center border p-3 cursor-pointer transition-colors ${item.completed ? 'border-primary/30 bg-primary/10' : 'border-white/10 bg-black/40 hover:border-white/30'}`}
                onClick={() => toggleItem(idx)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 border flex items-center justify-center ${item.completed ? 'border-primary bg-primary text-black' : 'border-muted-foreground'}`}>
                    {item.completed && <Check size={12} strokeWidth={4} />}
                  </div>
                  <span className={`text-[12px] font-bold tracking-[0.1em] ${item.completed ? 'text-primary' : 'text-white'}`}>{item.name}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeItem(idx); }}
                  className="p-2 text-muted-foreground hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
