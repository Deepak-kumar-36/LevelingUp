import { useEffect, useState } from 'react';
import { wadb } from '../winter-arc/data/db';
import type { WAGoal, WACategory } from '../winter-arc/data/db';
import { Target } from 'lucide-react';

export function GoalsView() {
  const [goals, setGoals] = useState<WAGoal[]>([]);
  const [categories, setCategories] = useState<WACategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const gs = await wadb.goals.toArray();
        const cats = await wadb.categories.toArray();
        setGoals(gs);
        setCategories(cats);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="text-sm text-foreground-muted">Loading goals...</div>;

  // Group goals by category
  const grouped: Record<string, WAGoal[]> = {};
  
  // Default general goals
  grouped['unmapped'] = [];

  goals.forEach(g => {
    const cat = categories.find(c => c.id === g.categoryId);
    if (cat) {
      if (!grouped[cat.name]) grouped[cat.name] = [];
      grouped[cat.name].push(g);
    } else {
      grouped['unmapped'].push(g);
    }
  });

  return (
    <div className="flex flex-col gap-10 fade-in">
      <header>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Goals</h1>
        <p className="text-[14px] text-foreground-muted mt-1">What are you working towards?</p>
      </header>

      {Object.keys(grouped).length === 1 && grouped['unmapped'].length === 0 && (
        <div className="text-[14px] text-foreground-muted bg-surface p-6 rounded-lg border border-border">
          No goals defined yet. Set them up in your Winter Arc plan.
        </div>
      )}

      <div className="flex flex-col gap-10">
        {Object.entries(grouped).map(([catName, catGoals]) => {
          if (catGoals.length === 0) return null;
          return (
            <section key={catName}>
              <h2 className="text-[12px] font-semibold text-foreground-muted uppercase tracking-wider mb-4">
                {catName === 'unmapped' ? 'General' : catName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catGoals.map(g => (
                  <div key={g.id} className="bg-card border border-border rounded-lg p-5 flex flex-col gap-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-[15px] font-medium text-foreground">{g.title}</h3>
                        {g.description && <p className="text-[13px] text-foreground-muted">{g.description}</p>}
                      </div>
                      <div className="p-2 bg-primary-muted text-primary rounded-md shrink-0">
                        <Target size={18} />
                      </div>
                    </div>
                    
                    {/* Progress area */}
                    <div className="pt-2 border-t border-border mt-auto">
                      <div className="flex items-center justify-between text-[12px] mb-2">
                        <span className="text-foreground-secondary">Progress</span>
                        <span className="text-foreground font-medium">{g.progress} / {g.target} {g.unit}</span>
                      </div>
                      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${Math.min(100, (g.progress / Math.max(1, g.target)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
