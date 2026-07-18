import { useState, useEffect } from 'react';
import { db } from '../data/db';
import { VitalityBar } from './VitalityBar';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Dumbbell, HeartPulse, Brain, Utensils, Beaker } from 'lucide-react';

interface Props {
  onNavigate: (view: 'vitals' | 'workout' | 'injury' | 'mobility' | 'meditation' | 'meals' | 'supplements' | 'metrics' | 'photos') => void;
}

export function BiometricReadout({ onNavigate }: Props) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Load last 7 days of vitals for the chart
    const loadData = async () => {
      const entries = await db.vitals.orderBy('date').reverse().limit(7).toArray();
      // Reverse again to chronological
      const formatted = entries.reverse().map(e => ({
        date: e.date.split('-').slice(1).join('/'), // MM/DD
        sleep: e.sleepHours || 0,
        water: (e.waterIntakeMl || 0) / 1000 // Liters
      }));
      setChartData(formatted);
    };
    loadData();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#050505] p-4 text-foreground font-mono animate-in fade-in overflow-y-auto gap-6">
      
      {/* Header & Vitality Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-primary/20 pb-2">
          <div className="flex items-center gap-2 text-primary font-bold tracking-[0.2em] text-[18px]">
            <HeartPulse size={20} className="animate-pulse text-red-500" /> VITALITY CORE
          </div>
        </div>
        <VitalityBar />
      </div>

      {/* Main Navigation Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <button onClick={() => onNavigate('vitals')} className="border border-white/10 bg-black/60 p-4 flex flex-col items-center gap-2 hover:border-primary hover:text-primary transition-colors text-muted-foreground group">
          <Activity size={24} className="group-hover:text-primary transition-colors" />
          <span className="text-[10px] tracking-[0.2em] uppercase">Vitals</span>
        </button>
        <button onClick={() => onNavigate('workout')} className="border border-white/10 bg-black/60 p-4 flex flex-col items-center gap-2 hover:border-primary hover:text-primary transition-colors text-muted-foreground group">
          <Dumbbell size={24} className="group-hover:text-primary transition-colors" />
          <span className="text-[10px] tracking-[0.2em] uppercase">Combat Log</span>
        </button>
        <button onClick={() => onNavigate('injury')} className="border border-white/10 bg-black/60 p-4 flex flex-col items-center gap-2 hover:border-red-500 hover:text-red-500 transition-colors text-muted-foreground group">
          <HeartPulse size={24} className="group-hover:text-red-500 transition-colors" />
          <span className="text-[10px] tracking-[0.2em] uppercase">Damage Log</span>
        </button>
        <button onClick={() => onNavigate('mobility')} className="border border-white/10 bg-black/60 p-4 flex flex-col items-center gap-2 hover:border-cyan-400 hover:text-cyan-400 transition-colors text-muted-foreground group">
          <Activity size={24} className="group-hover:text-cyan-400 transition-colors" />
          <span className="text-[10px] tracking-[0.2em] uppercase">Mobility</span>
        </button>
        <button onClick={() => onNavigate('meditation')} className="border border-white/10 bg-black/60 p-4 flex flex-col items-center gap-2 hover:border-teal-400 hover:text-teal-400 transition-colors text-muted-foreground group">
          <Brain size={24} className="group-hover:text-teal-400 transition-colors" />
          <span className="text-[10px] tracking-[0.2em] uppercase">Meditation</span>
        </button>
        <button onClick={() => onNavigate('meals')} className="border border-white/10 bg-black/60 p-4 flex flex-col items-center gap-2 hover:border-green-400 hover:text-green-400 transition-colors text-muted-foreground group">
          <Utensils size={24} className="group-hover:text-green-400 transition-colors" />
          <span className="text-[10px] tracking-[0.2em] uppercase">Nutrition</span>
        </button>
        <button onClick={() => onNavigate('supplements')} className="border border-white/10 bg-black/60 p-4 flex flex-col items-center gap-2 hover:border-blue-400 hover:text-blue-400 transition-colors text-muted-foreground group col-span-2 md:col-span-1">
          <Beaker size={24} className="group-hover:text-blue-400 transition-colors" />
          <span className="text-[10px] tracking-[0.2em] uppercase">Synthetics</span>
        </button>
      </div>

      {/* Trend Charts */}
      {chartData.length > 0 ? (
        <div className="border border-white/10 bg-black/40 p-4 h-64 flex flex-col">
          <span className="text-[10px] text-primary tracking-[0.2em] mb-4 uppercase">7-DAY TELEMETRY (SLEEP HRS / WATER L)</span>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" stroke="#ffffff50" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis stroke="#ffffff50" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid var(--primary)', borderRadius: 0, fontFamily: 'monospace', fontSize: '10px' }}
                  itemStyle={{ color: 'var(--primary)' }}
                />
                <Line type="monotone" dataKey="sleep" stroke="var(--primary)" strokeWidth={2} dot={{ fill: 'var(--primary)', strokeWidth: 0, r: 3 }} />
                <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="border border-white/10 bg-black/40 p-4 h-32 flex items-center justify-center">
          <span className="text-[10px] text-muted-foreground/50 tracking-[0.2em] uppercase border border-dashed border-white/10 px-4 py-2">INSUFFICIENT DATA FOR TELEMETRY</span>
        </div>
      )}
      
      {/* Opt-In Tools */}
      <div className="flex gap-2 justify-center pb-8 mt-4 border-t border-white/10 pt-4">
        <button onClick={() => onNavigate('metrics')} className="text-[9px] text-muted-foreground hover:text-white uppercase tracking-[0.2em] underline decoration-dashed">Body Metrics</button>
        <span className="text-white/20">|</span>
        <button onClick={() => onNavigate('photos')} className="text-[9px] text-muted-foreground hover:text-white uppercase tracking-[0.2em] underline decoration-dashed">Progress Photos</button>
      </div>

    </div>
  );
}
