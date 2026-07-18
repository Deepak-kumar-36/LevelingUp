import { VitalityCore } from '../vitality/VitalityCore';
import { useAppStore } from '../../store/useAppStore';

export function HealthView({ toast }: { toast: (msg: string) => void }) {
  const { setData } = useAppStore();

  const handleXpEvent = (event: string, _payload?: any) => {
    let xpGain = 0;
    
    switch (event) {
      case 'vitals_logged':
        xpGain = 10;
        break;
      case 'workout_logged':
        xpGain = 30;
        break;
      case 'pr_achieved':
        xpGain = 50;
        toast(`[ LIMITER BROKEN ] NEW MAX OUTPUT DETECTED`);
        break;
      case 'mobility_logged':
        xpGain = 15;
        break;
      case 'meditation_logged':
        xpGain = 15;
        break;
      case 'meal_logged':
        xpGain = 5;
        break;
    }

    if (xpGain > 0) {
      setData(d => ({
        ...d,
        user: { ...d.user, totalXp: d.user.totalXp + xpGain }
      }));
      toast(`✓ +${xpGain} XP | ${event.replace('_', ' ').toUpperCase()}`);
    }
  };

  return (
    <div className="absolute inset-0">
      <VitalityCore onXpEvent={handleXpEvent} />
    </div>
  );
}
