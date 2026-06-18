import { useState } from 'react';
import { useAppStore, dKey, numId } from '../../store/useAppStore';
import { EXP_CATS, CAT_CLR, MONTHS_S } from '../../lib/html-constants';

export function FinanceView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();
  const [amt, setAmt] = useState('');
  const [cat, setCat] = useState('FOOD');
  const [desc, setDesc] = useState('');
  const [mDate, setMDate] = useState(new Date());

  const TK = dKey(new Date());
  const fin = data.finance ?? { expenses: [], monthlyBudget: 5000 };
  const budget = fin.monthlyBudget || 5000;
  const expenses = fin.expenses ?? [];

  const y = mDate.getFullYear();
  const m = mDate.getMonth();
  const mk = `${y}-${(m + 1).toString().padStart(2, '0')}`;
  
  const mExp = expenses.filter((e: any) => e.date.startsWith(mk));
  const mTotal = mExp.reduce((a: number, e: any) => a + (e.amount || 0), 0);
  const remaining = budget - mTotal;

  const catTotals: Record<string, number> = {};
  EXP_CATS.forEach(c => {
    catTotals[c] = mExp.filter((e: any) => e.category === c).reduce((a: number, e: any) => a + e.amount, 0);
  });

  const add = () => {
    const a = parseFloat(amt);
    if (isNaN(a) || a <= 0) {
      toast('✗ INVALID AMOUNT');
      return;
    }
    const e = { id: numId(), date: TK, amount: a, category: cat, description: (desc.trim().toUpperCase() || cat) };
    setData(d => {
      const F = { ...(d.finance ?? { expenses: [], monthlyBudget: 5000 }) };
      return { ...d, finance: { ...F, expenses: [e, ...(F.expenses ?? [])] } };
    });
    setAmt('');
    setDesc('');
    toast(`✓ ₹${a} LOGGED`);
  };

  const del = (id: number) => {
    setData(d => {
      const F = { ...(d.finance ?? { expenses: [], monthlyBudget: 5000 }) };
      return { ...d, finance: { ...F, expenses: (F.expenses ?? []).filter((e: any) => e.id !== id) } };
    });
  };

  return (
    <div className="animate-in fade-in flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3">
        {/* Month Summary */}
        <div className="bg-card border border-border p-3">
          <div className="text-[11px] font-bold tracking-[2px] mb-2.5 flex items-center gap-1.5">💰 MONTHLY</div>
          <div className="mb-2">
            <div className="text-[11px] text-muted-foreground tracking-[1px]">{MONTHS_S[m]} {y}</div>
            <div className={`text-[24px] font-bold ${mTotal > budget ? 'text-destructive' : 'text-foreground'}`}>
              ₹{mTotal.toLocaleString()}
            </div>
          </div>
          <div className="h-[8px] bg-muted overflow-hidden mb-2">
            <div 
              className={`h-full transition-all duration-300 ${mTotal > budget ? 'bg-destructive' : 'bg-success'}`} 
              style={{ width: `${Math.min(100, (mTotal / budget) * 100)}%` }} 
            />
          </div>
          <div className="flex flex-wrap gap-4 mt-2 mb-3">
            <div>
              <div className="text-[11px] text-muted-foreground tracking-[1px]">BUDGET</div>
              <div className="font-bold">₹{budget.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground tracking-[1px]">LEFT</div>
              <div className={`font-bold ${remaining < 0 ? 'text-destructive' : 'text-success'}`}>
                ₹{remaining.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 mt-3">
            <button onClick={() => setMDate(new Date(y, m - 1, 1))} className="px-2 py-1 bg-background border border-border text-[11px] tracking-[1px] flex-1 hover:bg-muted">◀</button>
            <button onClick={() => setMDate(new Date())} className="px-2 py-1 bg-background border border-border text-[11px] tracking-[1px] flex-1 hover:bg-muted">NOW</button>
            <button onClick={() => setMDate(new Date(y, m + 1, 1))} className="px-2 py-1 bg-background border border-border text-[11px] tracking-[1px] flex-1 hover:bg-muted">▶</button>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-card border border-border p-3">
          <div className="text-[11px] font-bold tracking-[2px] mb-2.5 flex items-center gap-1.5">BY CATEGORY</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            {EXP_CATS.map(c => {
              const a = catTotals[c] ?? 0;
              const pct = mTotal ? Math.round((a / mTotal) * 100) : 0;
              return (
                <div key={c} className="mb-2.5">
                  <div className="flex justify-between mb-[3px]">
                    <span className="text-[11px] tracking-[1px] uppercase">{c}</span>
                    <span className="text-[11px]">₹{a.toLocaleString()} · {pct}%</span>
                  </div>
                  <div className="h-[6px] bg-muted overflow-hidden">
                    <div 
                      className="h-full transition-all duration-300" 
                      style={{ width: `${pct}%`, backgroundColor: CAT_CLR[c] ?? '#16a34a' }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-3">
        {/* Add Form */}
        <div className="bg-card border border-border p-3">
          <div className="text-[11px] font-bold tracking-[2px] mb-2.5 flex items-center gap-1.5">+ LOG EXPENSE</div>
          <div className="text-[11px] text-muted-foreground tracking-[1px] mb-1">AMOUNT (₹)</div>
          <input 
            value={amt} 
            onChange={e => setAmt(e.target.value)} 
            placeholder="150" 
            type="number"
            className="w-full bg-background border border-border p-2 mb-2 font-mono text-[14px] outline-none text-foreground"
          />
          <div className="text-[11px] text-muted-foreground tracking-[1px] mb-1">CATEGORY</div>
          <select 
            value={cat} 
            onChange={e => setCat(e.target.value)}
            className="w-full bg-background border border-border p-1.5 mb-2 font-mono text-[11px] outline-none text-foreground tracking-[1px]"
          >
            {EXP_CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="text-[11px] text-muted-foreground tracking-[1px] mb-1">DESCRIPTION</div>
          <input 
            value={desc} 
            onChange={e => setDesc(e.target.value)} 
            placeholder="LUNCH, AUTO, BOOK..."
            className="w-full bg-background border border-border p-1.5 mb-3 font-mono text-[11px] outline-none text-foreground tracking-[1px]"
          />
          <button 
            onClick={add} 
            className="w-full bg-foreground text-background border border-foreground p-2.5 text-[11px] tracking-[2px] uppercase font-bold hover:opacity-90 transition-opacity"
          >
            LOG EXPENSE
          </button>
        </div>

        {/* Expense List */}
        <div className="bg-card border border-border p-3">
          <div className="text-[11px] font-bold tracking-[2px] mb-2.5 flex items-center gap-1.5">EXPENSE LOG</div>
          {mExp.length === 0 ? (
            <div className="text-[11px] text-muted-foreground tracking-[1px]">No expenses logged this month.</div>
          ) : (
            <div className="flex flex-col">
              {[...mExp].sort((a, b) => b.date.localeCompare(a.date)).map(e => (
                <div key={e.id} className="flex items-center justify-between py-1.5 border-b border-border text-[11px]">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] px-1.5 py-[1px] border border-muted-foreground bg-background tracking-[1px]">{e.category}</span>
                      <span className="tracking-[1px] uppercase">{e.description}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground tracking-[1px] mt-0.5">{e.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">₹{e.amount.toLocaleString()}</span>
                    <button onClick={() => del(e.id)} className="px-1.5 py-[1px] border border-border bg-background text-[9px] hover:bg-muted">✕</button>
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
