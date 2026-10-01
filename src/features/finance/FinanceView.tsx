import { useState, useMemo } from 'react';
import { useAppStore, formatDateKey } from '../../store/useAppStore';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../lib/constants';
import type { Transaction, TransactionType } from '../../types';
import { Plus, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  PROVISIONS: 'Food',
  SHELTER: 'Rent / Housing',
  ARSENAL: 'Gear / Equipment',
  INTEL: 'Education',
  COMBAT: 'Fitness',
  RESTORATION: 'Health / Medical',
  TRAVERSAL: 'Transport',
  TRIBUTE: 'Bills / Subscriptions',
  CUSTOM: 'Other',
  SALARY: 'Salary',
  BOUNTY: 'Freelance',
  LOOT: 'Side Income',
  YIELD: 'Returns',
};

export function FinanceView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();
  const TK = formatDateKey(new Date());

  const fin = data.finance || { transactions: [], budgets: [], meta: { logStreak: 0, lastLogDate: null }, monthlyBudget: 5000 };
  const transactions = fin.transactions || [];

  const [mDate, setMDate] = useState(new Date());
  const mk = `${mDate.getFullYear()}-${(mDate.getMonth() + 1).toString().padStart(2, '0')}`;
  const monthLabel = mDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const mTrans = useMemo(() => transactions.filter(t => t.date.startsWith(mk)), [transactions, mk]);
  const mIncome = useMemo(() => mTrans.filter(t => t.type === 'INCOME').reduce((a, t) => a + t.amount, 0), [mTrans]);
  const mExpense = useMemo(() => mTrans.filter(t => t.type === 'EXPENSE').reduce((a, t) => a + t.amount, 0), [mTrans]);
  const remaining = (fin.monthlyBudget || 5000) - mExpense;

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const grouped: Record<string, number> = {};
    mTrans.filter(t => t.type === 'EXPENSE').forEach(e => {
      grouped[e.category] = (grouped[e.category] || 0) + e.amount;
    });
    return Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  }, [mTrans]);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [logType, setLogType] = useState<TransactionType>('EXPENSE');
  const [amt, setAmt] = useState('');
  const [cat, setCat] = useState(EXPENSE_CATEGORIES[0] as string);
  const [desc, setDesc] = useState('');

  const addTransaction = () => {
    const a = parseFloat(amt);
    if (isNaN(a) || a <= 0) { toast('Enter a valid amount'); return; }

    const t: Transaction = {
      id: 'tx_' + Date.now().toString(36),
      date: TK,
      type: logType,
      amount: a,
      category: cat,
      desc: desc.trim() || CATEGORY_LABELS[cat] || cat,
    };

    setData(d => {
      const F = d.finance || { transactions: [], budgets: [], meta: { logStreak: 0, lastLogDate: null }, monthlyBudget: 5000 };
      return {
        ...d,
        finance: {
          ...F,
          transactions: [t, ...(F.transactions || [])],
        }
      };
    });

    setAmt('');
    setDesc('');
    setShowForm(false);
    toast('Transaction added');
  };

  const deleteTransaction = (id: string) => {
    setData(d => {
      const F = d.finance || { transactions: [], budgets: [], meta: { logStreak: 0, lastLogDate: null }, monthlyBudget: 5000 };
      return { ...d, finance: { ...F, transactions: (F.transactions || []).filter(x => x.id !== id) } };
    });
    toast('Transaction removed');
  };

  const updateBudget = (val: string) => {
    const n = parseInt(val, 10);
    if (!isNaN(n) && n > 0) {
      setData(d => ({
        ...d,
        finance: { ...(d.finance || { transactions: [], budgets: [], meta: { logStreak: 0, lastLogDate: null }, monthlyBudget: 5000 }), monthlyBudget: n }
      }));
    }
  };

  return (
    <div className="flex flex-col gap-10 fade-in">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Budget</h1>
          <p className="text-[14px] text-foreground-muted mt-1">Monthly spending tracker</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setMDate(new Date(mDate.getFullYear(), mDate.getMonth() - 1, 1))} className="p-2 hover:bg-surface rounded-lg transition-colors">
          <ChevronLeft size={18} className="text-foreground-muted" />
        </button>
        <span className="text-[15px] font-medium text-foreground">{monthLabel}</span>
        <button onClick={() => setMDate(new Date(mDate.getFullYear(), mDate.getMonth() + 1, 1))} className="p-2 hover:bg-surface rounded-lg transition-colors">
          <ChevronRight size={18} className="text-foreground-muted" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-[12px] text-foreground-muted mb-1">Budget</div>
          <div className="flex items-center gap-1">
            <span className="text-[12px] text-foreground-muted">₹</span>
            <input
              type="number"
              value={fin.monthlyBudget || 5000}
              onChange={e => updateBudget(e.target.value)}
              className="text-[20px] font-semibold text-foreground bg-transparent w-full tabular-nums border-none outline-none"
            />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-[12px] text-foreground-muted mb-1">Spent</div>
          <div className="text-[20px] font-semibold text-foreground tabular-nums">₹{mExpense.toLocaleString()}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-[12px] text-foreground-muted mb-1">Remaining</div>
          <div className={`text-[20px] font-semibold tabular-nums ${remaining >= 0 ? 'text-success' : 'text-error'}`}>
            ₹{remaining.toLocaleString()}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-[12px] text-foreground-muted mb-1">Income</div>
          <div className="text-[20px] font-semibold text-foreground tabular-nums">₹{mIncome.toLocaleString()}</div>
        </div>
      </div>

      {/* Budget Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-[12px] text-foreground-muted mb-2">
          <span>Budget used</span>
          <span>{Math.round((mExpense / Math.max(1, fin.monthlyBudget || 5000)) * 100)}%</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              mExpense > (fin.monthlyBudget || 5000) ? 'bg-error' : mExpense > (fin.monthlyBudget || 5000) * 0.8 ? 'bg-warning' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(100, (mExpense / Math.max(1, fin.monthlyBudget || 5000)) * 100)}%` }}
          />
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <section>
          <h2 className="text-[15px] font-semibold text-foreground mb-4">By category</h2>
          <div className="flex flex-col gap-2">
            {categoryBreakdown.map(([catKey, amount]) => (
              <div key={catKey} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-[13px] text-foreground">{CATEGORY_LABELS[catKey] || catKey}</span>
                <span className="text-[13px] font-medium text-foreground tabular-nums">₹{amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Transactions */}
      <section>
        <h2 className="text-[15px] font-semibold text-foreground mb-4">Transactions</h2>
        {mTrans.length === 0 ? (
          <div className="text-[13px] text-foreground-muted bg-surface rounded-lg p-6 text-center">
            No transactions this month.
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {mTrans.map(t => (
              <div key={t.id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-surface group transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-foreground truncate">{t.desc}</div>
                  <div className="text-[12px] text-foreground-muted">{CATEGORY_LABELS[t.category] || t.category} · {t.date}</div>
                </div>
                <span className={`text-[14px] font-medium tabular-nums shrink-0 ${t.type === 'INCOME' ? 'text-success' : 'text-foreground'}`}>
                  {t.type === 'INCOME' ? '+' : '−'}₹{t.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="text-foreground-muted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-1"
                  aria-label="Delete transaction"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Transaction Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg flex flex-col gap-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-foreground">Add transaction</h3>
              <button onClick={() => setShowForm(false)} className="p-1 text-foreground-muted hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            {/* Type Toggle */}
            <div className="flex bg-surface rounded-lg p-1">
              {(['EXPENSE', 'INCOME'] as TransactionType[]).map(t => (
                <button
                  key={t}
                  onClick={() => { setLogType(t); setCat(t === 'INCOME' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]); }}
                  className={`flex-1 py-2 text-[13px] rounded-md transition-colors ${
                    logType === t ? 'bg-card text-foreground font-medium shadow-sm' : 'text-foreground-muted'
                  }`}
                >
                  {t === 'EXPENSE' ? 'Expense' : 'Income'}
                </button>
              ))}
            </div>

            {/* Amount */}
            <div>
              <label className="text-[12px] text-foreground-muted mb-1.5 block">Amount (₹)</label>
              <input
                type="number"
                value={amt}
                onChange={e => setAmt(e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-[15px] text-foreground bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="0"
                autoFocus
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-[12px] text-foreground-muted mb-1.5 block">Category</label>
              <select
                value={cat}
                onChange={e => setCat(e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-[14px] text-foreground bg-background"
              >
                {(logType === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="text-[12px] text-foreground-muted mb-1.5 block">Description (optional)</label>
              <input
                type="text"
                value={desc}
                onChange={e => setDesc(e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-[14px] text-foreground bg-background"
                placeholder="e.g. Lunch at canteen"
              />
            </div>

            <button
              onClick={addTransaction}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-[14px] font-medium hover:opacity-90 transition-opacity mt-2"
            >
              Add {logType === 'INCOME' ? 'income' : 'expense'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
