import { useState, useEffect } from 'react';
import { getCondition } from '../utils/condition'; import type { ConditionReport } from '../utils/condition';
import { Shield, Zap, AlertTriangle, Coffee, Flame, Heart } from 'lucide-react';

export function VitalityBar() {
  const [condition, setCondition] = useState<ConditionReport>({ score: 0, tags: [] });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    getCondition(today).then(setCondition);
    
    // Polling is fine here for local DB if we want it to react without complex event buses,
    // but just checking on mount and every 5s is sufficient for a standalone PWA.
    const interval = setInterval(() => {
      getCondition(today).then(setCondition);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Determine bar color
  let barColor = 'bg-primary';
  if (condition.score < 30) barColor = 'bg-red-500';
  else if (condition.score < 60) barColor = 'bg-yellow-500';

  const renderIcon = (tag: string) => {
    switch (tag) {
      case 'Optimal': return <Shield size={12} className="text-primary" />;
      case 'Pumped': return <Flame size={12} className="text-orange-500" />;
      case 'Hydrated': return <Zap size={12} className="text-blue-400" />;
      case 'Dehydrated': return <AlertTriangle size={12} className="text-red-500" />;
      case 'Fatigued': return <Coffee size={12} className="text-yellow-600" />;
      case 'Injured': return <AlertTriangle size={12} className="text-red-500" />;
      case 'Recovering': return <Heart size={12} className="text-yellow-500" />;
      case 'Zen': return <Shield size={12} className="text-cyan-400" />;
      case 'Fed': return <Zap size={12} className="text-green-400" />;
      case 'Limber': return <Zap size={12} className="text-teal-400" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-2 font-mono">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[10px] text-primary tracking-[0.3em] uppercase">SYSTEM CONDITION</span>
          <span className="text-[24px] font-bold text-white tracking-[0.1em]">{condition.score}%</span>
        </div>
        <div className="flex gap-2">
          {condition.tags.map(t => (
            <div key={t} className="flex items-center gap-1 border border-white/10 bg-black/40 px-2 py-1" title={t}>
              {renderIcon(t)}
              <span className="text-[9px] text-muted-foreground uppercase hidden md:inline">{t}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* HP Bar */}
      <div className="h-2 w-full bg-black border border-white/10 overflow-hidden relative">
        <div 
          className={`h-full ${barColor} transition-all duration-1000 ease-out`} 
          style={{ width: `${condition.score}%`, boxShadow: `0 0 10px var(--primary)` }}
        />
        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay" style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)' }} />
      </div>
    </div>
  );
}
