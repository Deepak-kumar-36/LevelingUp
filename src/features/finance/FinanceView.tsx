import React, { useState, useMemo } from 'react';
import { useAppStore, formatDateKey } from '../../store/useAppStore';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, CATEGORY_COLORS } from '../../lib/constants';
import { vibrateLight, vibrateSuccess, vibrateError } from '../../lib/haptics';
import type { Transaction, TransactionType } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell } from 'recharts';
import { Terminal, Database, Shield, Activity, Plus, Trash2, Crosshair, Zap } from 'lucide-react';

type TreasuryTab = 'DASHBOARD' | 'LEDGER' | 'POOLS' | 'ANALYTICS';

export function FinanceView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();
  const [tab, setTab] = useState<TreasuryTab>('DASHBOARD');

  const TK = formatDateKey(new Date());
  
  const fin = data.finance || { transactions: [], budgets: [], meta: { logStreak: 0, lastLogDate: null }, monthlyBudget: 5000 };
  const transactions = fin.transactions || [];
  const budgets = fin.budgets || [];
  const meta = fin.meta || { logStreak: 0, lastLogDate: null };

  // Month Filtering (Default to Current Month)
  const [mDate, setMDate] = useState(new Date());
  const mk = `${mDate.getFullYear()}-${(mDate.getMonth() + 1).toString().padStart(2, '0')}`;
  
  const mTrans = useMemo(() => transactions.filter(t => t.date.startsWith(mk)), [transactions, mk]);
  const mIncome = useMemo(() => mTrans.filter(t => t.type === 'INCOME').reduce((a, t) => a + t.amount, 0), [mTrans]);
  const mExpense = useMemo(() => mTrans.filter(t => t.type === 'EXPENSE').reduce((a, t) => a + t.amount, 0), [mTrans]);
  const netBalance = mIncome - mExpense;
  const savingsRate = mIncome > 0 ? ((netBalance) / mIncome) * 100 : 0;

  // Global Rank Calculation
  const financialRank = useMemo(() => {
    if (netBalance < 0) return 'F — DEBT LORD';
    if (savingsRate < 5) return 'D — SURVIVING';
    if (savingsRate < 15) return 'C — STABILIZED';
    if (savingsRate < 25) return 'B — GROWING';
    if (savingsRate < 40) return 'A — THRIVING';
    return 'S — VOID TREASURY';
  }, [netBalance, savingsRate]);

  // Form State
  const [showLogModal, setShowLogModal] = useState(false);
  const [logType, setLogType] = useState<TransactionType>('EXPENSE');
  const [amt, setAmt] = useState('');
  const [cat, setCat] = useState(EXPENSE_CATEGORIES[0] as string);
  const [desc, setDesc] = useState('');

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

    let streak = meta.logStreak || 0;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yK = formatDateKey(yesterday);
    
    if (meta.lastLogDate === TK) {
      // already logged today
    } else if (meta.lastLogDate === yK) {
      streak += 1;
    } else {
      streak = 1;
    }

    setData(d => {
      const F = d.finance || { transactions: [], budgets: [], meta: { logStreak: 0, lastLogDate: null }, monthlyBudget: 5000 };
      return { 
        ...d, 
        user: { ...d.user, totalXp: d.user.totalXp + 5 }, // +5 XP per log
        finance: { 
          ...F, 
          transactions: [t, ...(F.transactions || [])],
          meta: { logStreak: streak, lastLogDate: TK }
        } 
      };
    });

    setAmt('');
    setDesc('');
    setShowLogModal(false);
    vibrateSuccess();
    toast(`✓ +5 XP | LOGGED IN TREASURY`);
  };

  const deleteTransaction = (id: string) => {
    vibrateLight();
    setData(d => {
      const F = d.finance || { transactions: [], budgets: [], meta: { logStreak: 0, lastLogDate: null }, monthlyBudget: 5000 };
      return { ...d, finance: { ...F, transactions: (F.transactions || []).filter(x => x.id !== id) } };
    });
    toast('✓ ENTRY PURGED');
  };

  // Pools State
  const [poolCat, setPoolCat] = useState(EXPENSE_CATEGORIES[0] as string);
  const [poolLimit, setPoolLimit] = useState('');
  
  const savePool = () => {
    const l = parseFloat(poolLimit);
    if (isNaN(l) || l < 0) return;
    vibrateLight();
    setData(d => {
      const F = d.finance;
      const b = [...(F.budgets || [])];
      const idx = b.findIndex(x => x.categoryId === poolCat);
      if (idx >= 0) b[idx].limitAmount = l;
      else b.push({ categoryId: poolCat, limitAmount: l });
      return { ...d, finance: { ...F, budgets: b } };
    });
    setPoolLimit('');
    toast('✓ RESOURCE POOL UPDATED');
  };

  // Analytics Data
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

  // AI Debrief Generation
  const debrief = useMemo(() => {
    if (mTrans.length === 0) return "AWAITING DATA TO INITIALIZE VOID SCANS.";
    let msg = `CYCLE [${mk}] DEBRIEF:\n`;
    const topDrain = pieData[0];
    if (topDrain) msg += `PRIMARY DRAIN DETECTED IN [${topDrain.name}] (₹${topDrain.value.toLocaleString()}).\n`;
    if (savingsRate > 20) msg += `TREASURY YIELD STABLE. SAVINGS RATE AT ${savingsRate.toFixed(1)}%.\n`;
    else if (savingsRate < 0) msg += `CRITICAL WARNING: TREASURY BLEEDING. DEFICIT IMMINENT.\n`;
    else msg += `MAINTAINING OPERATIONAL CAPACITY. SAVINGS RATE MARGINAL.\n`;
    return msg;
  }, [mk, mTrans, pieData, savingsRate]);

  return (
    <div className="absolute inset-0 flex flex-col font-mono p-2 md:p-4 pb-20 overflow-hidden pointer-events-auto z-10 bg-[#050505] text-foreground">
      
      {/* Header Tabs */}
      <div className="flex bg-black/60 border border-white/10 mb-4 sticky top-0 z-20">
        {(['DASHBOARD', 'LEDGER', 'POOLS', 'ANALYTICS'] as TreasuryTab[]).map(t => (
          <button
            key={t}
            onClick={() => { vibrateLight(); setTab(t); }}
            className={`flex-1 py-3 text-[10px] md:text-[11px] tracking-[0.2em] font-bold uppercase transition-colors flex items-center justify-center gap-1 md:gap-2 ${
              tab === t ? 'text-primary bg-primary/10 border-b-2 border-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-white'
            }`}
          >
            {t === 'DASHBOARD' && <Terminal size={14} className="hidden md:block" />}
            {t === 'LEDGER' && <Database size={14} className="hidden md:block" />}
            {t === 'POOLS' && <Shield size={14} className="hidden md:block" />}
            {t === 'ANALYTICS' && <Activity size={14} className="hidden md:block" />}
            <span className="hidden sm:inline">{t}</span>
            <span className="sm:hidden">{t.substring(0, 3)}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar relative">

        {/* =========================================================================
            DASHBOARD 
        ========================================================================== */}
        {tab === 'DASHBOARD' && (
          <div className="animate-in fade-in flex flex-col gap-6 max-w-4xl mx-auto w-full p-2">
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Main Display */}
              <div className="flex-1 border border-primary/30 bg-black/60 p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                <div className="text-[10px] text-primary tracking-[0.4em] uppercase mb-4 opacity-80 flex items-center gap-2">
                  <Crosshair size={12} /> TREASURY GOLD
                </div>
                <div className={`text-4xl md:text-6xl font-bold tracking-widest ${netBalance >= 0 ? 'text-white text-glow' : 'text-destructive text-glow-destructive'}`}>
                  {netBalance >= 0 ? '+' : '-'}₹{Math.abs(netBalance).toLocaleString()}
                </div>
                
                <div className="mt-6 flex flex-col items-center">
                  <div className="text-[9px] text-muted-foreground tracking-[0.3em] uppercase mb-1">FINANCIAL RANK</div>
                  <div className="px-3 py-1 border border-white/20 bg-white/5 text-[12px] text-primary font-bold tracking-[0.2em]">
                    [{financialRank}]
                  </div>
                </div>

                {/* Background Decor */}
                <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
                  <Terminal size={120} />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="border border-white/10 bg-black/40 p-4 flex flex-col justify-between">
                  <div className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase">M-INCOME</div>
                  <div className="text-[18px] font-bold text-[#34d399] mt-2">+₹{mIncome.toLocaleString()}</div>
                </div>
                <div className="border border-white/10 bg-black/40 p-4 flex flex-col justify-between">
                  <div className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase">M-DRAIN</div>
                  <div className="text-[18px] font-bold text-destructive mt-2">-₹{mExpense.toLocaleString()}</div>
                </div>
                <div className="border border-white/10 bg-black/40 p-4 flex flex-col justify-between">
                  <div className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase">SAVINGS RATE</div>
                  <div className="text-[18px] font-bold text-primary mt-2">{savingsRate.toFixed(1)}%</div>
                </div>
                <div className="border border-white/10 bg-black/40 p-4 flex flex-col justify-between">
                  <div className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase">LOG STREAK</div>
                  <div className="text-[18px] font-bold text-white mt-2 flex items-center gap-1">
                    <Zap size={14} className="text-primary" /> {meta.logStreak} DAYS
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => { vibrateLight(); setShowLogModal(true); }}
              className="w-full py-6 border-2 border-primary bg-primary/10 hover:bg-primary hover:text-black text-primary font-bold tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-3 text-[14px]"
            >
              <Plus size={18} /> INITIATE TRANSACTION
            </button>
          </div>
        )}

        {/* =========================================================================
            LEDGER
        ========================================================================== */}
        {tab === 'LEDGER' && (
          <div className="animate-in fade-in flex flex-col gap-4 max-w-4xl mx-auto w-full p-2">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-2">
              <div className="text-[12px] text-primary tracking-[0.3em] font-bold">GOLD LEDGER</div>
              <div className="flex gap-2">
                <button onClick={() => setMDate(new Date(mDate.getFullYear(), mDate.getMonth() - 1, 1))} className="px-2 py-1 border border-white/10 text-[10px] hover:bg-white/10">&lt;</button>
                <div className="px-4 py-1 border border-white/10 text-[10px] tracking-[0.2em] font-bold bg-white/5">{mk}</div>
                <button onClick={() => setMDate(new Date(mDate.getFullYear(), mDate.getMonth() + 1, 1))} className="px-2 py-1 border border-white/10 text-[10px] hover:bg-white/10">&gt;</button>
              </div>
            </div>

            {mTrans.length === 0 ? (
              <div className="text-[10px] text-muted-foreground/30 tracking-[0.3em] uppercase text-center mt-20">
                NO RECORDS IN THIS CYCLE.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {mTrans.map(t => (
                  <div key={t.id} className="flex flex-col md:flex-row justify-between border-l-2 border border-white/5 bg-black/40 p-4 hover:bg-white/5 transition-colors group" style={{ borderLeftColor: CATEGORY_COLORS[t.category] || '#fff' }}>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold tracking-[0.1em] uppercase text-foreground">{t.desc}</span>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] px-2 py-0.5 border border-white/10 bg-black/50 tracking-[0.1em] uppercase" style={{ color: CATEGORY_COLORS[t.category] || '#fff' }}>
                          {t.category}
                        </span>
                        <span className="text-[9px] text-muted-foreground tracking-[0.1em]">{t.date}</span>
                      </div>
                    </div>
                    <div className="flex md:flex-col justify-between items-center md:items-end mt-4 md:mt-0">
                      <span className={`text-[15px] font-bold tracking-[0.1em] ${t.type === 'INCOME' ? 'text-[#34d399]' : 'text-destructive'}`}>
                        {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toLocaleString()}
                      </span>
                      <button 
                        onClick={() => deleteTransaction(t.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors md:opacity-0 group-hover:opacity-100 p-2 md:p-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            POOLS (BUDGETS)
        ========================================================================== */}
        {tab === 'POOLS' && (
          <div className="animate-in fade-in flex flex-col gap-6 max-w-4xl mx-auto w-full p-2">
            
            <div className="border border-white/10 bg-black/60 p-4 md:p-6">
              <div className="text-[10px] text-primary tracking-[0.2em] font-bold mb-4 uppercase flex items-center gap-2">
                <Shield size={14} /> CONFIGURE RESOURCE POOL
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase block mb-2">ARSENAL CLASS</label>
                  <select value={poolCat} onChange={e => setPoolCat(e.target.value)} className="w-full bg-black/80 border border-white/20 p-3 text-[11px] tracking-[0.1em] uppercase text-foreground focus:border-primary focus:outline-none">
                    {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex-1 w-full">
                  <label className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase block mb-2">CAPACITY LIMIT (₹)</label>
                  <input type="number" value={poolLimit} onChange={e => setPoolLimit(e.target.value)} className="w-full bg-black/80 border border-white/20 p-3 text-[14px] font-bold tracking-[0.1em] uppercase text-foreground focus:border-primary focus:outline-none" placeholder="0" />
                </div>
                <button onClick={savePool} className="w-full md:w-auto px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-black font-bold tracking-[0.2em] text-[11px] uppercase transition-all">
                  SAVE POOL
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              {EXPENSE_CATEGORIES.map(cat => {
                const b = budgets.find(x => x.categoryId === cat);
                if (!b) return null;
                const spent = mTrans.filter(t => t.type === 'EXPENSE' && t.category === cat).reduce((a, t) => a + t.amount, 0);
                const pct = (spent / b.limitAmount) * 100;
                let colorClass = 'bg-[#10b981]'; // safe
                if (pct > 75) colorClass = 'bg-[#f59e0b]'; // warn
                if (pct > 90) colorClass = 'bg-destructive shadow-[0_0_15px_rgba(239,68,68,0.5)]'; // critical
                
                return (
                  <div key={cat} className="border border-white/10 bg-black/40 p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border" style={{ borderColor: CATEGORY_COLORS[cat] }} />
                        <span className="text-[12px] font-bold tracking-[0.2em] uppercase">{cat}</span>
                      </div>
                      <div className="text-[10px] tracking-[0.1em] uppercase font-mono">
                        <span className={pct > 100 ? 'text-destructive' : 'text-foreground'}>{spent.toLocaleString()}</span> / {b.limitAmount.toLocaleString()}
                      </div>
                    </div>
                    <div className={`h-[8px] w-full bg-black border border-white/10 relative overflow-hidden ${pct > 100 ? 'glitch-bar' : ''}`}>
                      <div className={`absolute top-0 left-0 h-full transition-all duration-1000 ${colorClass}`} style={{ width: `${Math.min(100, pct)}%` }} />
                    </div>
                  </div>
                );
              })}
              {budgets.length === 0 && (
                <div className="text-[10px] text-muted-foreground/30 tracking-[0.3em] uppercase text-center mt-10">
                  NO POOLS CONFIGURED.
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            ANALYTICS 
        ========================================================================== */}
        {tab === 'ANALYTICS' && (
          <div className="animate-in fade-in flex flex-col gap-8 max-w-4xl mx-auto w-full p-2">
            
            {/* AI Debrief */}
            <div className="border border-primary/40 bg-black/60 p-5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary animate-pulse" />
              <div className="text-[9px] text-primary tracking-[0.4em] uppercase mb-3 flex items-center gap-2">
                <Terminal size={12} /> VOID_INTELLIGENCE_DEBRIEF.EXE
              </div>
              <pre className="text-[11px] md:text-[13px] text-white/90 font-mono whitespace-pre-wrap leading-loose">
                {debrief}
              </pre>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="border border-white/10 bg-black/40 p-4">
                <div className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase mb-6 text-center">DRAIN BREAKDOWN</div>
                {pieData.length > 0 ? (
                  <>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#999'} />)}
                          </Pie>
                          <RechartsTooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontFamily: 'monospace', fontSize: '12px' }} itemStyle={{ color: '#fff' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 max-h-[150px] overflow-y-auto no-scrollbar">
                      {pieData.map(d => (
                        <div key={d.name} className="flex justify-between text-[9px] tracking-[0.1em] uppercase">
                          <div className="flex gap-2 items-center"><div className="w-2 h-2" style={{ backgroundColor: CATEGORY_COLORS[d.name] }} />{d.name}</div>
                          <span className="font-bold">₹{d.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-[9px] text-muted-foreground/30 text-center mt-10">NO DATA</div>
                )}
              </div>

              <div className="border border-white/10 bg-black/40 p-4">
                <div className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase mb-6 text-center">CASH FLOW SUMMARY</div>
                <div className="h-[200px] w-full mt-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[ { name: 'INCOME', value: mIncome, fill: '#34d399' }, { name: 'DRAIN', value: mExpense, fill: '#ef4444' } ]}>
                      <XAxis dataKey="name" stroke="#333" tick={{ fontSize: 10, fill: '#666', fontFamily: 'monospace' }} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontFamily: 'monospace', fontSize: '12px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                        {[ { name: 'INCOME', value: mIncome, fill: '#34d399' }, { name: 'DRAIN', value: mExpense, fill: '#ef4444' } ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          LOG MODAL
      ========================================================================== */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#050505] border border-primary/50 p-6 flex flex-col gap-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
            
            <button onClick={() => setShowLogModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-white">✕</button>
            <div className="text-[12px] text-primary tracking-[0.3em] font-bold uppercase mb-2">INITIATE TRANSACTION</div>

            <div className="flex gap-2 p-1 bg-black/40 border border-white/10">
              {(['INCOME', 'EXPENSE'] as TransactionType[]).map(t => (
                <button
                  key={t}
                  onClick={() => { 
                    setLogType(t); 
                    if (t === 'INCOME') setCat(INCOME_CATEGORIES[0]);
                    else if (t === 'EXPENSE') setCat(EXPENSE_CATEGORIES[0]);
                  }}
                  className={`flex-1 text-[10px] tracking-[0.2em] py-3 uppercase transition-all ${
                    logType === t ? (t === 'INCOME' ? 'bg-[#34d399]/20 text-[#34d399]' : 'bg-destructive/20 text-destructive') : 'text-muted-foreground hover:bg-white/5'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-5 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase">Amount (₹)</label>
                <input 
                  type="number" value={amt} onChange={e => setAmt(e.target.value)}
                  className="bg-black/50 border border-white/20 p-4 text-[20px] font-bold text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="0" autoFocus
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase">Arsenal Class / Category</label>
                <select value={cat} onChange={e => setCat(e.target.value)} className="bg-black/50 border border-white/20 p-4 text-[12px] tracking-[0.1em] uppercase text-foreground focus:outline-none focus:border-primary">
                  {(logType === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase">Memo / Description</label>
                <input 
                  type="text" value={desc} onChange={e => setDesc(e.target.value)}
                  className="bg-black/50 border border-white/20 p-4 text-[12px] text-foreground focus:outline-none focus:border-primary transition-colors uppercase"
                  placeholder="OPTIONAL DATA..."
                />
              </div>

              <button 
                onClick={addTransaction}
                className={`mt-4 py-4 text-[12px] font-bold tracking-[0.3em] uppercase transition-colors border ${
                  logType === 'INCOME' ? 'text-[#34d399] border-[#34d399] hover:bg-[#34d399] hover:text-black' :
                  'text-destructive border-destructive hover:bg-destructive hover:text-white'
                }`}
              >
                [ COMMIT TRANSACTION ]
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
