import { useState, useMemo } from 'react';
import { useAppStore, formatDateKey } from '../../store/useAppStore';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, CATEGORY_COLORS } from '../../lib/constants';
import { vibrateLight, vibrateSuccess, vibrateError } from '../../lib/haptics';
import type { Transaction, TransactionType } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell } from 'recharts';

type FinanceTab = 'LEDGER' | 'LOG' | 'STATS';

export function FinanceView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();
  const [tab, setTab] = useState<FinanceTab>('LEDGER');

  const TK = formatDateKey(new Date());
  
  const fin = data.finance || { transactions: [], monthlyBudget: 5000 };
  const transactions = fin.transactions || [];
  const budget = fin.monthlyBudget || 5000;

  // Log Form State
  const [logType, setLogType] = useState<TransactionType>('EXPENSE');
  const [amt, setAmt] = useState('');
  const [cat, setCat] = useState(EXPENSE_CATEGORIES[0] as string);
  const [desc, setDesc] = useState('');

  // Month Filtering
  const [mDate] = useState(new Date());
  const mk = `${mDate.getFullYear()}-${(mDate.getMonth() + 1).toString().padStart(2, '0')}`;
  
  const mTrans = useMemo(() => transactions.filter(t => t.date.startsWith(mk)), [transactions, mk]);
  const mIncome = mTrans.filter(t => t.type === 'INCOME').reduce((a, t) => a + t.amount, 0);
  const mExpense = mTrans.filter(t => t.type === 'EXPENSE').reduce((a, t) => a + t.amount, 0);
  const netBalance = mIncome - mExpense;

  const addTransaction = () => {
    const a = parseFloat(amt);
    if (isNaN(a) || a <= 0) {
      vibrateError();
      toast('✗ INVALID AMOUNT');
      return;
    }

    const t: Transaction = {
      id: 'tx_' + Date.now().toString(36),
      date: TK,
      type: logType,
      amount: a,
      category: cat,
      desc: (desc.trim().toUpperCase() || cat)
    };

    setData(d => {
      const F = d.finance || { transactions: [], monthlyBudget: 5000 };
      return { ...d, finance: { ...F, transactions: [t, ...(F.transactions || [])] } };
    });

    setAmt('');
    setDesc('');
    vibrateSuccess();
    toast(`✓ TRANSACTION LOGGED`);
    setTab('LEDGER');
  };

  const deleteTransaction = (id: string) => {
    vibrateLight();
    setData(d => {
      const F = d.finance || { transactions: [], monthlyBudget: 5000 };
      return { ...d, finance: { ...F, transactions: (F.transactions || []).filter(x => x.id !== id) } };
    });
    toast('✓ DELETED');
  };

  // Stats Data
  const pieData = useMemo(() => {
    const expenses = mTrans.filter(t => t.type === 'EXPENSE');
    const grouped: Record<string, number> = {};
    expenses.forEach(e => {
      grouped[e.category] = (grouped[e.category] || 0) + e.amount;
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [mTrans]);

  const barData = [
    { name: 'INCOME', value: mIncome, fill: '#4ade80' },
    { name: 'EXPENSE', value: mExpense, fill: '#ef4444' }
  ];

  return (
    <div className="absolute inset-0 flex flex-col font-mono p-4 md:p-6 pb-20 overflow-hidden pointer-events-auto z-10">
      
      {/* Top Navigation */}
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
        {(['LEDGER', 'LOG', 'STATS'] as FinanceTab[]).map(t => (
          <button
            key={t}
            onClick={() => { vibrateLight(); setTab(t); }}
            className={`flex-1 text-[11px] tracking-[0.2em] py-2 uppercase transition-all ${
              tab === t ? 'text-primary border-b-2 border-primary font-bold text-glow' : 'text-muted-foreground hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Global Net Balance Header */}
      <div className="flex flex-col items-center mb-8 border border-white/5 bg-black/40 py-4 px-6">
        <div className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase mb-1">Monthly Net Balance</div>
        <div className={`text-[28px] font-bold tracking-widest ${netBalance >= 0 ? 'text-primary text-glow' : 'text-destructive text-glow'}`}>
          {netBalance >= 0 ? '+' : '-'}₹{Math.abs(netBalance).toLocaleString()}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        
        {/* LOG TAB */}
        {tab === 'LOG' && (
          <div className="animate-in fade-in flex flex-col gap-6 max-w-md mx-auto w-full">
            <div className="flex gap-2 p-1 bg-black/40 border border-white/5 rounded-none">
              {(['INCOME', 'EXPENSE'] as TransactionType[]).map(t => (
                <button
                  key={t}
                  onClick={() => { 
                    setLogType(t); 
                    if (t === 'INCOME') setCat(INCOME_CATEGORIES[0]);
                    else if (t === 'EXPENSE') setCat(EXPENSE_CATEGORIES[0]);
                  }}
                  className={`flex-1 text-[10px] tracking-[0.2em] py-3 uppercase transition-all ${
                    logType === t ? (t === 'INCOME' ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive') : 'text-muted-foreground hover:bg-white/5'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Amount (₹)</label>
                <input 
                  type="number" 
                  value={amt} 
                  onChange={e => setAmt(e.target.value)}
                  className="bg-transparent border-b border-white/20 pb-2 text-[24px] font-bold text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="0"
                />
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Category</label>
                <select 
                  value={cat} 
                  onChange={e => setCat(e.target.value)}
                  className="bg-black/50 border border-white/10 p-3 text-[12px] tracking-[0.1em] uppercase text-foreground focus:outline-none focus:border-primary"
                >
                  {(logType === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Memo / Description</label>
                <input 
                  type="text" 
                  value={desc} 
                  onChange={e => setDesc(e.target.value)}
                  className="bg-transparent border-b border-white/20 pb-2 text-[14px] text-foreground focus:outline-none focus:border-primary transition-colors uppercase"
                  placeholder="OPTIONAL"
                />
              </div>

              <button 
                onClick={addTransaction}
                className={`mt-6 py-4 text-[12px] font-bold tracking-[0.3em] uppercase transition-colors border ${
                  logType === 'INCOME' ? 'text-primary border-primary hover:bg-primary hover:text-black' :
                  'text-destructive border-destructive hover:bg-destructive hover:text-white'
                }`}
              >
                [ COMMIT TRANSACTION ]
              </button>
            </div>
          </div>
        )}

        {/* LEDGER TAB */}
        {tab === 'LEDGER' && (
          <div className="animate-in fade-in flex flex-col gap-4 max-w-md mx-auto w-full">
            {transactions.length === 0 ? (
              <div className="text-[11px] text-muted-foreground/50 tracking-[0.3em] uppercase text-center mt-10 leading-loose">
                DATABASE EMPTY.<br/>
                NO TRANSACTIONS LOGGED.
              </div>
            ) : (
              transactions.map(t => (
                <div key={t.id} className="flex flex-col border border-white/5 bg-black/20 p-4 hover:border-white/10 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold tracking-[0.1em] uppercase text-foreground">{t.desc}</span>
                      <span className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase mt-1">
                        {t.category} • {t.date}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-[14px] font-bold tracking-[0.1em] ${t.type === 'INCOME' ? 'text-primary' : 'text-destructive'}`}>
                        {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-2">
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      className="text-[9px] text-muted-foreground/30 hover:text-destructive tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      [ DELETE ]
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* STATS TAB */}
        {tab === 'STATS' && (
          <div className="animate-in fade-in flex flex-col gap-12 max-w-md mx-auto w-full">
            
            <div>
              <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-6 text-center">Budget Status</div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                  <span>Spent: ₹{mExpense.toLocaleString()}</span>
                  <span>Budget: ₹{budget.toLocaleString()}</span>
                </div>
                <div className="h-[4px] w-full bg-white/5 relative overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ${mExpense > budget ? 'bg-destructive' : 'bg-primary'}`}
                    style={{ width: `${Math.min(100, (mExpense / budget) * 100)}%` }}
                  />
                </div>
                {mExpense > budget && (
                  <div className="text-[9px] text-destructive tracking-[0.2em] uppercase text-right mt-1 animate-pulse">
                    WARNING: BUDGET EXCEEDED
                  </div>
                )}
              </div>
            </div>

            <div className="h-[1px] w-full bg-white/5" />

            <div>
              <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-6 text-center">Cash Flow (This Month)</div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#333" tick={{ fontSize: 10, fill: '#666', fontFamily: 'monospace' }} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontFamily: 'monospace', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="h-[1px] w-full bg-white/5" />

            <div>
              <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-6 text-center">Expense Breakdown</div>
              {pieData.length > 0 ? (
                <>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#999'} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontFamily: 'monospace', fontSize: '12px', textTransform: 'uppercase' }}
                          itemStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    {pieData.map(d => (
                      <div key={d.name} className="flex justify-between items-center text-[10px] tracking-[0.1em] uppercase">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[d.name] || '#999' }} />
                          <span className="text-muted-foreground">{d.name}</span>
                        </div>
                        <span className="text-foreground font-bold">₹{d.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-[10px] text-muted-foreground/30 tracking-[0.2em] uppercase text-center mt-10">
                  NO DATA AVAILABLE
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
