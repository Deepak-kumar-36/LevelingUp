import { useState } from 'react';
import { useAppStore, dKey, numId } from '../../store/useAppStore';

function WeightChart({ weights }: { weights: any[] }) {
  if (weights.length < 2) return null;
  const vals = weights.map(w => w.weight);
  const mn = Math.min(...vals) - 0.3;
  const mx = Math.max(...vals) + 0.3;
  const W = 220;
  const H = 48;
  const px = (v: number, i: number) => [((i / (vals.length - 1)) * W).toFixed(1), (H - ((v - mn) / (mx - mn)) * H).toFixed(1)];
  const pts = vals.map((v, i) => px(v, i).join(',')).join(' ');

  return (
    <svg width={W} height={H} className="block border border-border bg-background">
      <polyline points={pts} fill="none" stroke="#16a34a" strokeWidth={1.5} />
      {vals.map((v, i) => {
        const [cx, cy] = px(v, i);
        return <circle key={i} cx={cx} cy={cy} r={2.5} fill="#16a34a" />;
      })}
      <text x={2} y={10} fontSize={8} fill="#aaaaaa" fontFamily="monospace">{(mx - 0.3).toFixed(1)}</text>
      <text x={2} y={H - 2} fontSize={8} fill="#aaaaaa" fontFamily="monospace">{(mn + 0.3).toFixed(1)}</text>
    </svg>
  );
}

export function HealthView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();
  const [wIn, setWIn] = useState('');
  const [fName, setFName] = useState('');
  const [fCal, setFCal] = useState('');
  const [fPro, setFPro] = useState('');

  const TK = dKey(new Date());
  const H0 = { weights: [], foodLogs: [], targets: { calories: 2500, protein: 100, targetWeight: 65, startWeight: 56 } };
  const health = data.health ?? H0;
  const tgt = health.targets ?? H0.targets;

  const todayFood = (health.foodLogs ?? []).filter((f: any) => f.date === TK);
  const totCal = todayFood.reduce((a: number, f: any) => a + (f.calories || 0), 0);
  const totPro = todayFood.reduce((a: number, f: any) => a + (f.protein || 0), 0);
  const calPct = Math.min(100, Math.round((totCal / tgt.calories) * 100));
  const proPct = Math.min(100, Math.round((totPro / tgt.protein) * 100));

  const sortedW = [...(health.weights ?? [])].sort((a: any, b: any) => a.date.localeCompare(b.date));
  const lastW = sortedW.length ? sortedW[sortedW.length - 1] : null;
  const sw = tgt.startWeight || 56;
  const tw = tgt.targetWeight || 65;
  const wPct = lastW ? Math.min(100, Math.max(0, Math.round(((lastW.weight - sw) / (tw - sw)) * 100))) : 0;

  const logW = () => {
    const w = parseFloat(wIn);
    if (isNaN(w) || w <= 0) { toast('✗ INVALID WEIGHT'); return; }
    const e = { id: numId(), date: TK, weight: w };
    setData(d => {
      const H = { ...(d.health ?? H0) };
      return { ...d, health: { ...H, weights: [...(H.weights ?? []), e] } };
    });
    setWIn('');
    toast(`✓ LOGGED: ${w} KG`);
  };

  const logF = () => {
    if (!fName.trim()) { toast('✗ FOOD NAME REQUIRED'); return; }
    const e = { 
      id: numId(), 
      date: TK, 
      foodName: fName.trim().toUpperCase(), 
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

  const delF = (id: number) => {
    setData(d => {
      const H = { ...(d.health ?? H0) };
      return { ...d, health: { ...H, foodLogs: (H.foodLogs ?? []).filter((f: any) => f.id !== id) } };
    });
  };

  return (
    <div className="animate-in fade-in grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Weight Card */}
      <div className="bg-card border border-border p-3">
        <div className="text-[11px] font-bold tracking-[2px] mb-2.5 flex items-center gap-1.5">⚖ WEIGHT TRACKING</div>
        <div className="flex flex-wrap gap-5 mb-2.5">
          <div>
            <div className="text-[11px] text-muted-foreground tracking-[1px]">CURRENT</div>
            <div className="font-bold text-[22px]">{(lastW ? lastW.weight : sw)} KG</div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground tracking-[1px]">TARGET</div>
            <div className="font-bold text-[22px]">{tw} KG</div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground tracking-[1px]">PROGRESS</div>
            <div className={`font-bold text-[22px] ${wPct >= 100 ? 'text-success' : 'text-foreground'}`}>{wPct}%</div>
          </div>
        </div>
        <div className="h-[8px] bg-muted overflow-hidden">
          <div className="h-full bg-success transition-all duration-300" style={{ width: `${Math.max(0, wPct)}%` }} />
        </div>

        {sortedW.length >= 2 && (
          <div className="mt-3">
            <div className="text-[11px] text-muted-foreground tracking-[1px] mb-1">WEIGHT HISTORY (LAST 14)</div>
            <WeightChart weights={sortedW.slice(-14)} />
          </div>
        )}

        <div className="text-[11px] text-muted-foreground tracking-[1px] mt-3 mb-1.5">LOG WEIGHT (KG)</div>
        <div className="flex items-center gap-2">
          <input 
            value={wIn} 
            onChange={e => setWIn(e.target.value)} 
            placeholder="56.5" 
            type="number"
            className="flex-1 bg-background border border-border p-1.5 text-[13px] outline-none text-foreground"
          />
          <button 
            onClick={logW} 
            className="bg-foreground text-background border border-foreground px-3 py-1.5 text-[11px] tracking-[1px] uppercase hover:opacity-90"
          >
            LOG
          </button>
        </div>

        {sortedW.length > 0 && (
          <div className="mt-3">
            <div className="text-[11px] text-muted-foreground tracking-[1px] mb-1">RECENT ENTRIES</div>
            {[...sortedW].reverse().slice(0, 5).map(w => (
              <div key={w.id} className="flex justify-between py-[3px] border-b border-border text-[11px]">
                <span className="text-muted-foreground tracking-[1px]">{w.date}</span>
                <span className="font-bold">{w.weight} KG</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nutrition Card */}
      <div className="bg-card border border-border p-3">
        <div className="text-[11px] font-bold tracking-[2px] mb-2.5 flex items-center gap-1.5">TODAY'S NUTRITION</div>
        
        <div className="mb-3">
          <div className="flex justify-between mb-[3px]">
            <span className="text-[11px] tracking-[1px]">CALORIES</span>
            <span className={`text-[11px] font-bold ${calPct >= 100 ? 'text-success' : 'text-foreground'}`}>
              {totCal} / {tgt.calories} KCAL
            </span>
          </div>
          <div className="h-[10px] bg-muted overflow-hidden">
            <div className={`h-full transition-all duration-300 ${calPct >= 100 ? 'bg-success' : 'bg-success-alt'}`} style={{ width: `${Math.min(100, calPct)}%` }} />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-[3px]">
            <span className="text-[11px] tracking-[1px]">PROTEIN</span>
            <span className={`text-[11px] font-bold ${proPct >= 100 ? 'text-success' : 'text-foreground'}`}>
              {totPro} / {tgt.protein} G
            </span>
          </div>
          <div className="h-[10px] bg-muted overflow-hidden">
            <div className={`h-full transition-all duration-300 ${proPct >= 100 ? 'bg-success' : 'bg-[#a3e635]'}`} style={{ width: `${Math.min(100, proPct)}%` }} />
          </div>
        </div>

        <div className="text-[11px] text-muted-foreground tracking-[1px] mb-1.5">LOG FOOD</div>
        <input 
          value={fName} 
          onChange={e => setFName(e.target.value)} 
          placeholder="FOOD NAME"
          className="w-full bg-background border border-border p-1.5 mb-1.5 text-[11px] outline-none text-foreground tracking-[1px]"
        />
        <div className="flex gap-1.5 mb-2.5 items-center">
          <input 
            value={fCal} 
            onChange={e => setFCal(e.target.value)} 
            placeholder="KCAL" 
            type="number"
            className="flex-1 bg-background border border-border p-1.5 text-[11px] outline-none text-foreground tracking-[1px] min-w-0"
          />
          <input 
            value={fPro} 
            onChange={e => setFPro(e.target.value)} 
            placeholder="PROTEIN (G)" 
            type="number"
            className="flex-1 bg-background border border-border p-1.5 text-[11px] outline-none text-foreground tracking-[1px] min-w-0"
          />
          <button 
            onClick={logF} 
            className="bg-foreground text-background border border-foreground px-3 py-1.5 text-[11px] tracking-[1px] uppercase hover:opacity-90"
          >
            LOG
          </button>
        </div>

        {todayFood.length > 0 && (
          <div className="border-t border-border pt-2 mt-2">
            <div className="text-[11px] text-muted-foreground tracking-[1px] mb-1.5">TODAY'S FOOD LOG</div>
            {todayFood.map((f: any) => (
              <div key={f.id} className="flex items-center justify-between py-1 border-b border-border text-[11px]">
                <span className="tracking-[1px] uppercase">{f.foodName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{f.calories}kcal · {f.protein}g prot</span>
                  <button onClick={() => delF(f.id)} className="px-1.5 py-[1px] border border-border bg-background text-[9px] hover:bg-muted">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
