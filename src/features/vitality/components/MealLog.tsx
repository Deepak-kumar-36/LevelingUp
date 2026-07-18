import { useState, useEffect } from 'react';
import { db } from '../data/db'; import type { Meal } from '../data/db';
import { generateId } from '../../../store/useAppStore';
import { vibrateLight, vibrateSuccess } from '../../../lib/haptics';
import { Save, Plus } from 'lucide-react';

interface Props {
  onXpEvent?: (event: 'meal_logged') => void;
  onClose: () => void;
}

export function MealLog({ onXpEvent, onClose }: Props) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [name, setName] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    db.meals.where('date').equals(today).toArray().then(setMeals);
  }, [today]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toUpperCase())) {
      setTags([...tags, tagInput.trim().toUpperCase()]);
      setTagInput('');
      vibrateLight();
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    vibrateSuccess();

    const newMeal: Meal = {
      id: 'meal_' + generateId(),
      date: today,
      time: new Date().toTimeString().substring(0, 5),
      name: name.trim(),
      tags
    };

    await db.meals.put(newMeal);
    if (onXpEvent) onXpEvent('meal_logged');
    
    // reset form but stay open to see history
    setName('');
    setTags([]);
    setMeals([...meals, newMeal]);
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] p-4 text-foreground font-mono animate-in fade-in overflow-y-auto">
      <div className="mb-6 border-b border-primary/20 pb-4 flex justify-between items-center">
        <h2 className="text-[16px] text-primary font-bold tracking-[0.2em] uppercase">NUTRITION LOG</h2>
        <button onClick={onClose} className="text-[10px] text-muted-foreground hover:text-white uppercase tracking-[0.1em]">CLOSE</button>
      </div>

      <div className="flex flex-col gap-4">
        
        {/* Form */}
        <div className="border border-white/10 p-4 bg-black/40 flex flex-col gap-4">
          <div>
            <label className="text-[9px] text-primary tracking-[0.2em] mb-1 block">MEAL DESIGNATION</label>
            <input 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="E.G. CHICKEN & RICE"
              className="bg-black/60 border border-white/20 p-2 text-[12px] uppercase focus:outline-none focus:border-primary w-full"
            />
          </div>
          
          <div>
            <label className="text-[9px] text-primary tracking-[0.2em] mb-1 block">TAGS (OPTIONAL)</label>
            <div className="flex gap-2 mb-2">
              <input 
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                placeholder="HIGH-PROTEIN..."
                className="bg-black/60 border border-white/20 p-2 text-[12px] uppercase focus:outline-none focus:border-primary flex-1"
              />
              <button onClick={handleAddTag} className="border border-white/20 px-3 hover:bg-white/10"><Plus size={14}/></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(t => (
                <span key={t} className="text-[9px] border border-primary/50 text-primary bg-primary/10 px-2 py-1 tracking-[0.1em]">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-primary/10 border border-primary text-primary py-3 font-bold tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary hover:text-black transition-colors mt-2 text-[11px]"
          >
            <Save size={14} /> LOG MEAL
          </button>
        </div>

        {/* History */}
        <div className="mt-4">
          <div className="text-[10px] text-muted-foreground tracking-[0.2em] mb-2 uppercase">TODAY'S INTAKE</div>
          <div className="flex flex-col gap-2">
            {meals.length === 0 ? (
              <div className="text-[10px] text-muted-foreground/30 border border-dashed border-white/10 p-4 text-center tracking-[0.1em]">NO MEALS LOGGED YET</div>
            ) : (
              meals.map(m => (
                <div key={m.id} className="border border-white/5 bg-black/60 p-3 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-bold text-white tracking-[0.1em]">{m.name}</span>
                    <span className="text-[10px] text-muted-foreground">{m.time}</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    {m.tags.map(t => (
                      <span key={t} className="text-[9px] text-primary/70 tracking-[0.1em]">#{t}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
