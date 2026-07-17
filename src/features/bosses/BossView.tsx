import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { EQUIPMENT_ITEMS } from '../../lib/constants';
import { vibrateHeavy, vibrateSuccess } from '../../lib/haptics';
import type { Boss } from '../../types';

export function BossView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();
  const bosses = data.bosses || [];

  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      handlePomodoroComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePomodoroComplete = () => {
    const timeBoss = bosses.find(b => b.id === 'b4');
    if (timeBoss) {
      attackBoss(timeBoss);
      toast('✧ TEMPUS FUGIT DAMAGED ✧');
    }
    setTimeLeft(3600); // Reset timer
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const attackBoss = (b: Boss) => {
    setData((d) => {
      const bList = d.bosses || [];
      const idx = bList.findIndex(x => x.id === b.id);
      if (idx === -1) return d;

      const updatedBoss = { ...bList[idx] };
      updatedBoss.hp -= updatedBoss.damage;

      let xpGained = 0;
      let coinsGained = 0;

      const newBosses = [...bList];
      const prevTotal = d.user.totalXp;

      if (updatedBoss.hp <= 0) {
        xpGained = updatedBoss.xpReward;
        coinsGained = updatedBoss.coinReward;
        updatedBoss.hp = updatedBoss.maxHp; // Respawn

        if (Math.random() < 0.3) {
          const unownedEquipment = EQUIPMENT_ITEMS.filter(eq => !(d.inventory || []).includes(eq.id));
          if (unownedEquipment.length > 0) {
            const randomDrop = unownedEquipment[Math.floor(Math.random() * unownedEquipment.length)];
            const achievementMsg = `🎁 LOOT DROP! You obtained: ${randomDrop.name}`;
            newBosses[idx] = updatedBoss;

            return {
              ...d,
              bosses: newBosses,
              inventory: [...(d.inventory || []), randomDrop.id],
              achievementQueue: [...(d.achievementQueue || []), achievementMsg],
              user: {
                ...d.user,
                totalXp: prevTotal + xpGained,
                coins: d.user.coins + coinsGained,
              }
            };
          }
        }
      }

      newBosses[idx] = updatedBoss;

      return {
        ...d,
        bosses: newBosses,
        user: {
          ...d.user,
          totalXp: prevTotal + xpGained,
          coins: d.user.coins + coinsGained,
        }
      };
    });

    if (b.hp - b.damage <= 0) {
      vibrateSuccess();
      toast(`☠ ${b.name.toUpperCase()} DEFEATED! +${b.xpReward} XP`);
    } else {
      vibrateHeavy();
      toast(`⚔ -${b.damage} HP`);
    }
  };

  return (
    <div className="animate-in fade-in flex flex-col gap-16 max-w-5xl mx-auto z-10 relative pointer-events-auto h-full px-4 pt-4 pb-20 overflow-y-auto no-scrollbar">
      
      {/* Pomodoro Arcanum */}
      <div className="flex flex-col items-center justify-center text-center mt-10">
        <div className="text-[11px] font-bold tracking-[0.3em] mb-2 flex items-center gap-1.5 uppercase text-muted-foreground/50">
          The Chronos Protocol
        </div>
        <div className="text-[10px] text-muted-foreground tracking-[0.2em] mb-8 uppercase opacity-50">
          Focus to damage Tempus Fugit
        </div>
        <div className="text-[80px] md:text-[120px] font-mono font-bold tracking-widest text-primary text-glow leading-none mb-10">
          {formatTime(timeLeft)}
        </div>
        <div className="flex gap-6">
          <button
            onClick={toggleTimer}
            className={`text-[12px] font-bold tracking-[0.3em] uppercase transition-colors ${
              isRunning ? 'text-destructive hover:text-white' : 'text-primary hover:text-white'
            }`}
          >
            {isRunning ? '[ SUSPEND ]' : '[ INITIATE ]'}
          </button>
          {!isRunning && timeLeft < 3600 && (
            <button
              onClick={() => setTimeLeft(3600)}
              className="text-[12px] tracking-[0.3em] uppercase text-muted-foreground hover:text-white transition-colors"
            >
              [ RESET ]
            </button>
          )}
        </div>
      </div>

      <div className="w-full h-[1px] bg-white/5 my-4" />

      {/* Boss List */}
      <div className="flex flex-col gap-12">
        <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase text-center mb-4">
          Active Threats
        </div>
        
        {bosses.map((b) => {
          const hpPct = Math.max(0, Math.min(100, (b.hp / b.maxHp) * 100));
          return (
            <div key={b.id} className="flex flex-col gap-3">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[16px] font-bold uppercase tracking-[0.2em] text-foreground mb-1">
                    {b.name}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {b.title}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] font-bold font-mono tracking-[0.1em] text-primary">
                    {b.hp} <span className="text-[10px] text-muted-foreground">/ {b.maxHp} HP</span>
                  </div>
                </div>
              </div>

              <div className="h-[2px] bg-white/5 w-full relative">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: `${hpPct}%` }}
                />
              </div>

              <div className="flex justify-between items-start mt-2">
                <div className="text-[10px] tracking-[0.1em] text-muted-foreground uppercase max-w-[60%] leading-relaxed">
                  REQUIREMENT: {b.actionDesc}<br/>
                  REWARD: {b.xpReward} XP / {b.coinReward} C
                </div>
                <button
                  onClick={() => attackBoss(b)}
                  className="text-[11px] font-bold tracking-[0.3em] uppercase text-destructive hover:text-white transition-colors"
                >
                  [ STRIKE ]
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
