import { useState } from 'react';
import { BiometricReadout } from './components/BiometricReadout';
import { VitalsCheckIn } from './components/VitalsCheckIn';
import { WorkoutLogger } from './components/WorkoutLogger';
import { InjuryTracker } from './components/InjuryTracker';
import { SessionLog } from './components/SessionLog';
import { MealLog } from './components/MealLog';
import { SupplementChecklist } from './components/SupplementChecklist';

export interface VitalityCoreProps {
  onXpEvent?: (event: 'vitals_logged' | 'workout_logged' | 'pr_achieved' | 'mobility_logged' | 'meditation_logged' | 'meal_logged' | 'checkin_streak', payload?: any) => void;
}

type ViewState = 'dashboard' | 'vitals' | 'workout' | 'injury' | 'mobility' | 'meditation' | 'meals' | 'supplements' | 'metrics' | 'photos';

export function VitalityCore({ onXpEvent }: VitalityCoreProps) {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');

  const closeView = () => setActiveView('dashboard');

  return (
    <div className="absolute inset-0 bg-[#050505] overflow-hidden">
      {activeView === 'dashboard' && <BiometricReadout onNavigate={setActiveView} />}
      {activeView === 'vitals' && <VitalsCheckIn onXpEvent={onXpEvent as any} onClose={closeView} />}
      {activeView === 'workout' && <WorkoutLogger onXpEvent={onXpEvent as any} onClose={closeView} />}
      {activeView === 'injury' && <InjuryTracker onClose={closeView} />}
      {activeView === 'mobility' && <SessionLog mode="mobility" onXpEvent={onXpEvent as any} onClose={closeView} />}
      {activeView === 'meditation' && <SessionLog mode="meditation" onXpEvent={onXpEvent as any} onClose={closeView} />}
      {activeView === 'meals' && <MealLog onXpEvent={onXpEvent as any} onClose={closeView} />}
      {activeView === 'supplements' && <SupplementChecklist onClose={closeView} />}
      
      {/* Optional Metrics & Photos */}
      {(activeView === 'metrics' || activeView === 'photos') && (
        <div className="h-full flex flex-col items-center justify-center font-mono p-4 text-center">
          <span className="text-primary text-[12px] tracking-[0.2em] mb-4">MODULE OFFLINE</span>
          <span className="text-muted-foreground text-[10px] tracking-[0.1em] max-w-[250px]">
            This opt-in feature is not yet initialized in the current build of Vitality Core.
          </span>
          <button onClick={closeView} className="mt-8 border border-white/20 px-6 py-2 text-[10px] uppercase hover:text-white">RETURN TO DASHBOARD</button>
        </div>
      )}
    </div>
  );
}
