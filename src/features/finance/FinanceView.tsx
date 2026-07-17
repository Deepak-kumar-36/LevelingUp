import { useState } from 'react';
import { useAppStore, formatDateKey } from '../../store/useAppStore';
import { EXPENSE_CATEGORIES, MONTH_NAMES_SHORT } from '../../lib/constants';
import type { Expense } from '../../types';

export function FinanceView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();
  const [amt, setAmt] = useState('');
  const [cat, setCat] = useState('FOOD');
  const [desc, setDesc] = useState('');
  const [mDate, setMDate] = useState(new Date());

  const TK = formatDateKey(new Date());
  const fin = data.finance ?? { expenses: [], monthlyBudget: 5000 };
  const budget = fin.monthlyBudget || 5000;
  const expenses = fin.expenses ?? [];

  const y = mDate.getFullYear();
  const m = mDate.getMonth();
  const mk = `${y}-${(m + 1).toString().padStart(2, '0')}`;
  
  const mExp = expenses.filter(e => e.date.startsWith(mk));
  const mTotal = mExp.reduce((a, e) => a + (e.amount || 0), 0);
  const remaining = budget - mTotal;

  const catTotals: Record<string, number> = {};
  EXPENSE_CATEGORIES.forEach(c => {
    catTotals[c] = mExp.filter(e => e.category === c).reduce((a, e) => a + e.amount, 0);
  });

  const add = () => {
    const a = parseFloat(amt);
    if (isNaN(a) || a <= 0) {
      toast('✗ INVALID AMOUNT');
      return;
    }
    const e: Expense = { date: TK, amount: a, category: cat, desc: (desc.trim().toUpperCase() || cat) };
    setData(d => {
      const F = { ...(d.finance ?? { expenses: [], monthlyBudget: 5000 }) };
      return { ...d, finance: { ...F, expenses: [e, ...(F.expenses ?? [])] } };
    });
    setAmt('');
    setDesc('');
    toast(`✓ ₹${a} LOGGED`);
  };

  const del = (index: number) => {
    setData(d => {
      const F = { ...(d.finance ?? { expenses: [], monthlyBudget: 5000 }) };
      const newExpenses = [...(F.expenses ?? [])];
      const itemToDelete = mExp[index];
      const actualIndex = newExpenses.indexOf(itemToDelete);
      if (actualIndex > -1) {
        newExpenses.splice(actualIndex, 1);
      }
      return { ...d, finance: { ...F, expenses: newExpenses } };
    });
  };

  return (
    <div className="animate-in fade-in flex flex-col md:flex-row gap-16 max-w-5xl mx-auto z-10 relative pointer-events-auto h-full px-4 pt-4">
      
      {/* Left Column: Summary & Categories */}
      <div className="flex-1 flex flex-col gap-10">
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase">
              Financial Protocol
            </div>
            <div className="flex gap-4">
              <button onClick={() => setMDate(new Date(y, m - 1, 1))} className="text-[10px] tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors uppercase">PREV</button>
              <button onClick={() => setMDate(new Date())} className="text-[10px] tracking-[0.2em] text-primary hover:text-white transition-colors uppercase">NOW</button>
              <button onClick={() => setMDate(new Date(y, m + 1, 1))} className="text-[10px] tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors uppercase">NEXT</button>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-[11px] text-muted-foreground tracking-[0.2em] mb-1">{MONTH_NAMES_SHORT[m]} {y} TOTAL</div>
            <div className={`text-[32px] font-bold tracking-[0.1em] ${mTotal > budget ? 'text-destructive' : 'text-foreground'}`}>
              ₹{mTotal.toLocaleString()}
            </div>
          </div>
          
          <div className="h-[2px] bg-white/5 w-full mb-6">
            <div 
              className={`h-full transition-all duration-1000 ${mTotal > budget ? 'bg-destructive' : 'bg-primary'}`} 
              style={{ width: `${Math.min(100, (mTotal / budget) * 100)}%` }} 
            />
          </div>
          
          <div className="flex gap-12 mb-12">
            <div>
              <div className="text-[10px] text-muted-foreground tracking-[0.2em] mb-1">BUDGET</div>
              <div className="font-bold text-[16px] text-foreground">₹{budget.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground tracking-[0.2em] mb-1">REMAINING</div>
              <div className={`font-bold text-[16px] ${remaining < 0 ? 'text-destructive' : 'text-primary'}`}>
                ₹{remaining.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-6">
            Category Breakdown
          </div>
          <div className="flex flex-col gap-6">
            {EXPENSE_CATEGORIES.map(c => {
              const a = catTotals[c] ?? 0;
              const pct = mTotal ? Math.round((a / mTotal) * 100) : 0;
              if (a === 0) return null; // Hide empty categories in Void UI for extreme minimalism
              
              return (
                <div key={c}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-foreground">{c}</span>
                    <span className="text-[10px] tracking-[0.1em] text-muted-foreground">₹{a.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="h-[1px] bg-white/5 w-full">
                    <div 
                      className="h-full bg-white/20 transition-all duration-500" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Logging & History */}
      <div className="flex-1 flex flex-col gap-10">
        <div>
          <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-8">
            Inject Expense
          </div>
          
          <div className="flex flex-col gap-6 mb-10">
            <input 
              value={amt} 
              onChange={e => setAmt(e.target.value)} 
              placeholder="AMOUNT (₹)..." 
              type="number"
              className="w-full bg-transparent border-b border-white/10 p-2 text-[16px] font-mono font-bold outline-none text-primary tracking-[0.1em] placeholder:text-muted-foreground/30 focus:border-primary transition-colors"
            />
            
            <select 
              value={cat} 
              onChange={e => setCat(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 p-2 text-[12px] font-mono outline-none text-foreground tracking-[0.2em] focus:border-primary transition-colors appearance-none"
            >
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c} className="bg-background text-foreground">{c}</option>)}
            </select>
            
            <input 
              value={desc} 
              onChange={e => setDesc(e.target.value)} 
              placeholder="DESCRIPTION..."
              className="w-full bg-transparent border-b border-white/10 p-2 text-[12px] font-mono outline-none text-foreground tracking-[0.2em] uppercase placeholder:text-muted-foreground/30 focus:border-primary transition-colors"
            />
            
            <button 
              onClick={add} 
              className="text-primary text-[12px] tracking-[0.3em] uppercase hover:text-white transition-colors text-left pt-2 font-bold"
            >
              [ LOG ENTRY ]
            </button>
          </div>

          <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-6">
            Transaction History
          </div>
          
          {mExp.length === 0 ? (
            <div className="text-[11px] text-muted-foreground tracking-[0.2em] uppercase opacity-30 text-center mt-10">
              No Transactions Found
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto no-scrollbar">
              {[...mExp].sort((a, b) => b.date.localeCompare(a.date)).map((e, idx) => (
                <div key={idx} className="flex flex-col gap-1 py-2 border-b border-white/5 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] tracking-[0.2em] uppercase text-foreground">{e.desc}</span>
                    <span className="font-bold text-[12px] text-primary">₹{e.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-muted-foreground tracking-[0.2em] uppercase">
                    <span>{e.category}</span>
                    <div className="flex gap-4">
                      <span>{e.date}</span>
                      <button onClick={() => del(idx)} className="hover:text-destructive transition-colors">✕</button>
                    </div>
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
