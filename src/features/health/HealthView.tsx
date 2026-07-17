import { useState } from 'react';
import { useAppStore, formatDateKey } from '../../store/useAppStore';
import type { WeightEntry, FoodEntry } from '../../types';

function WeightChart({ weights }: { weights: WeightEntry[] }) {
  if (weights.length < 2) return null;
  const vals = weights.map(w => w.weight);
  const mn = Math.min(...vals) - 0.3;
  const mx = Math.max(...vals) + 0.3;
  const W = 280;
  const H = 60;
  const px = (v: number, i: number) => [((i / (vals.length - 1)) * W).toFixed(1), (H - ((v - mn) / (mx - mn)) * H).toFixed(1)];
  const pts = vals.map((v, i) => px(v, i).join(',')).join(' ');

  return (
    <div className="w-full flex justify-center opacity-70">
      <svg width={W} height={H} className="block overflow-visible">
        <polyline points={pts} fill="none" stroke="#dc2626" strokeWidth={1} strokeOpacity={0.8} />
        {vals.map((v, i) => {
          const [cx, cy] = px(v, i);
          return <circle key={i} cx={cx} cy={cy} r={2} fill="#dc2626" />;
        })}
        <text x={0} y={10} fontSize={8} fill="rgba(255,255,255,0.3)" fontFamily="monospace">{(mx - 0.3).toFixed(1)}</text>
        <text x={0} y={H - 2} fontSize={8} fill="rgba(255,255,255,0.3)" fontFamily="monospace">{(mn + 0.3).toFixed(1)}</text>
      </svg>
    </div>
  );
}

export function HealthView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();
  const [wIn, setWIn] = useState('');
  const [fName, setFName] = useState('');
  const [fCal, setFCal] = useState('');
  const [fPro, setFPro] = useState('');
  const [showDiet, setShowDiet] = useState(false);

  const TK = formatDateKey(new Date());
  const H0 = { weights: [], foodLogs: [], targets: { calories: 2500, protein: 100, targetWeight: 65, startWeight: 56 } };
  const health = data.health ?? H0;
  const tgt = health.targets ?? H0.targets;

  const todayFood = (health.foodLogs ?? []).filter(f => f.date === TK);
  const totCal = todayFood.reduce((a, f) => a + (f.calories || 0), 0);
  const totPro = todayFood.reduce((a, f) => a + (f.protein || 0), 0);
  const calPct = Math.min(100, Math.round((totCal / tgt.calories) * 100));
  const proPct = Math.min(100, Math.round((totPro / tgt.protein) * 100));

  const sortedW = [...(health.weights ?? [])].sort((a, b) => a.date.localeCompare(b.date));
  const lastW = sortedW.length ? sortedW[sortedW.length - 1] : null;
  const sw = tgt.startWeight || 56;
  const tw = tgt.targetWeight || 65;
  const wPct = lastW ? Math.min(100, Math.max(0, Math.round(((lastW.weight - sw) / (tw - sw)) * 100))) : 0;

  const logW = () => {
    const w = parseFloat(wIn);
    if (isNaN(w) || w <= 0) { toast('✗ INVALID WEIGHT'); return; }
    const e: WeightEntry = { date: TK, weight: w };
    setData(d => {
      const H = { ...(d.health ?? H0) };
      return { ...d, health: { ...H, weights: [...(H.weights ?? []), e] } };
    });
    setWIn('');
    toast(`✓ LOGGED: ${w} KG`);
  };

  const logF = () => {
    if (!fName.trim()) { toast('✗ FOOD NAME REQUIRED'); return; }
    const e: FoodEntry = { 
      date: TK, 
      name: fName.trim().toUpperCase(), 
      calories: parseInt(fCal) || 0, 
      protein: parseInt(fPro) || 0 
    };
    setData(d => {
      const H = { ...(d.health ?? H0) };
      return { ...d, health: { ...H, foodLogs: [...(H.foodLogs ?? []), e] } };
    });
    setFName(''); setFCal(''); setFPro('');
    toast('✓ FOOD LOGGED');
  };

  const delF = (index: number) => {
    setData(d => {
      const H = { ...(d.health ?? H0) };
      const itemToDelete = todayFood[index];
      const newLogs = (H.foodLogs ?? []).filter(f => f !== itemToDelete);
      return { ...d, health: { ...H, foodLogs: newLogs } };
    });
  };

  return (
    <div className="animate-in fade-in flex flex-col md:flex-row gap-16 max-w-5xl mx-auto z-10 relative pointer-events-auto h-full px-4 pt-4">
      
      {/* Left Column: Physical metrics */}
      <div className="flex-1 flex flex-col gap-10">
        
        {/* Weight Module */}
        <div>
          <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-8">
            Physical Protocol
          </div>
          
          <div className="flex gap-8 mb-8">
            <div>
              <div className="text-[10px] text-muted-foreground tracking-[0.2em] mb-1">MASS</div>
              <div className="font-bold text-[24px] text-primary">{(lastW ? lastW.weight : sw).toFixed(1)}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground tracking-[0.2em] mb-1">TARGET</div>
              <div className="font-bold text-[24px] text-foreground">{tw.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground tracking-[0.2em] mb-1">ALIGNMENT</div>
              <div className={`font-bold text-[24px] ${wPct >= 100 ? 'text-primary' : 'text-foreground/50'}`}>{wPct}%</div>
            </div>
          </div>
          
          {sortedW.length >= 2 && (
            <div className="mb-8">
              <WeightChart weights={sortedW.slice(-14)} />
            </div>
          )}

          <div className="flex items-center gap-4">
            <input 
              value={wIn} 
              onChange={e => setWIn(e.target.value)} 
              placeholder="ENTER KG..." 
              type="number"
              className="bg-transparent border-b border-white/10 p-2 text-[12px] font-mono outline-none text-foreground tracking-[0.2em] w-32 placeholder:text-muted-foreground/30 focus:border-primary transition-colors"
            />
            <button 
              onClick={logW} 
              className="text-primary text-[11px] tracking-[0.2em] uppercase hover:text-white transition-colors"
            >
              [ SYNC ]
            </button>
          </div>
          
          {sortedW.length > 0 && (
            <div className="mt-8 flex flex-col gap-3">
              {/* Only show last 3 entries to keep it minimal */}
              {[...sortedW].reverse().slice(0, 3).map((w, idx) => (
                <div key={idx} className="flex justify-between text-[10px] tracking-[0.2em] opacity-50">
                  <span>{w.date}</span>
                  <span>{w.weight.toFixed(1)} KG</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Nutrition metrics */}
      <div className="flex-1 flex flex-col gap-10">
        <div>
          <div className="flex justify-between items-center mb-8">
            <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase">
              Nutritional Protocol
            </div>
            <button 
              onClick={() => setShowDiet(!showDiet)}
              className="text-[10px] tracking-[0.2em] text-primary hover:text-white transition-colors"
            >
              [ {showDiet ? 'HIDE PLAN' : 'VIEW PLAN'} ]
            </button>
          </div>

          {showDiet && (
            <div className="mb-8 text-[11px] leading-loose tracking-[0.1em] text-muted-foreground/70">
              <div className="text-primary font-bold mb-4 uppercase tracking-[0.2em]">Active Regimen</div>
              1. 0700: Soaked Chane + Soyabean + Peanuts<br/>
              2. 0900: Banana Shake + Oats + Dry Fruits + PB<br/>
              3. 1100: Dahi / 2 Bananas / 1 Apple<br/>
              4. 1330: Standard Lunch + Dahi<br/>
              5. 1700: Brown Bread + PB<br/>
              6. 1900: Post-Workout Shake + Creatine (5g)<br/>
              7. 2100: Paneer<br/>
              8. 2200: Standard Dinner<br/>
              9. 2330: Milk + Banana + Supplements<br/>
            </div>
          )}

          <div className="flex flex-col gap-8 mb-8">
            {/* Calories */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[10px] text-muted-foreground tracking-[0.2em]">ENERGY (KCAL)</span>
                <span className={`text-[12px] font-bold tracking-[0.1em] ${calPct >= 100 ? 'text-primary' : 'text-foreground'}`}>
                  {totCal} / {tgt.calories}
                </span>
              </div>
              <div className="h-[2px] bg-white/5 w-full">
                <div className={`h-full transition-all duration-1000 ${calPct >= 100 ? 'bg-primary' : 'bg-primary/50'}`} style={{ width: `${Math.min(100, calPct)}%` }} />
              </div>
            </div>

            {/* Protein */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[10px] text-muted-foreground tracking-[0.2em]">SYNTHESIS (PRO)</span>
                <span className={`text-[12px] font-bold tracking-[0.1em] ${proPct >= 100 ? 'text-primary' : 'text-foreground'}`}>
                  {totPro} / {tgt.protein}G
                </span>
              </div>
              <div className="h-[2px] bg-white/5 w-full">
                <div className={`h-full transition-all duration-1000 ${proPct >= 100 ? 'bg-primary' : 'bg-primary/50'}`} style={{ width: `${Math.min(100, proPct)}%` }} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <input 
              value={fName} 
              onChange={e => setFName(e.target.value)} 
              placeholder="IDENTIFIER..."
              className="w-full bg-transparent border-b border-white/10 p-2 text-[12px] font-mono outline-none text-foreground tracking-[0.2em] uppercase placeholder:text-muted-foreground/30 focus:border-primary transition-colors"
            />
            <div className="flex gap-4 items-center">
              <input 
                value={fCal} 
                onChange={e => setFCal(e.target.value)} 
                placeholder="KCAL" 
                type="number"
                className="flex-1 bg-transparent border-b border-white/10 p-2 text-[12px] font-mono outline-none text-foreground tracking-[0.2em] placeholder:text-muted-foreground/30 focus:border-primary transition-colors"
              />
              <input 
                value={fPro} 
                onChange={e => setFPro(e.target.value)} 
                placeholder="PRO (G)" 
                type="number"
                className="flex-1 bg-transparent border-b border-white/10 p-2 text-[12px] font-mono outline-none text-foreground tracking-[0.2em] placeholder:text-muted-foreground/30 focus:border-primary transition-colors"
              />
              <button 
                onClick={logF} 
                className="text-primary text-[11px] tracking-[0.2em] uppercase hover:text-white transition-colors"
              >
                [ INJECT ]
              </button>
            </div>
          </div>

          {todayFood.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase opacity-50 mb-2">
                Active Injections
              </div>
              {todayFood.map((f, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] tracking-[0.1em]">
                  <span className="uppercase text-foreground">{f.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">{f.calories} KCAL / {f.protein}G</span>
                    <button onClick={() => delF(idx)} className="text-primary hover:text-red-500 transition-colors">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
