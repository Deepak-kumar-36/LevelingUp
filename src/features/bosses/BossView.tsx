import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { EQUIPMENT_ITEMS } from '../../lib/html-constants';
import { vibrateHeavy, vibrateSuccess } from '../../lib/haptics';

export function BossView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();
  const bosses = data.bosses || [];

  // Pomodoro State
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      handlePomodoroComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handlePomodoroComplete = () => {
    const timeBoss = bosses.find((b: any) => b.id === 'b4');
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

  const attackBoss = (b: any) => {
    setData((d) => {
      const bList = d.bosses || [];
      const idx = bList.findIndex((x: any) => x.id === b.id);
      if (idx === -1) return d;

      const updatedBoss = { ...bList[idx] };
      updatedBoss.hp -= updatedBoss.damage;

      let xpGained = 0;
      let coinsGained = 0;

      const newBosses = [...bList];
      const prevTotal = d.user?.totalXp || 0;

      if (updatedBoss.hp <= 0) {
        xpGained = updatedBoss.xpReward;
        coinsGained = updatedBoss.coinReward;
        updatedBoss.hp = updatedBoss.maxHp; // Respawn

        // 30% chance for an equipment drop
        if (Math.random() < 0.3) {
          const unownedEquipment = EQUIPMENT_ITEMS.filter(eq => !(d.inventory || []).includes(eq.id));
          if (unownedEquipment.length > 0) {
            const randomDrop = unownedEquipment[Math.floor(Math.random() * unownedEquipment.length)];
            
            // Queue the drop notification
            const achievementMsg = `🎁 LOOT DROP! You obtained: ${randomDrop.name}`;
            
            return {
              ...d,
              bosses: newBosses,
              inventory: [...(d.inventory || []), randomDrop.id],
              achievementQueue: [...(d.achievementQueue || []), achievementMsg],
              user: {
                ...d.user,
                totalXp: prevTotal + xpGained,
                coins: (d.user?.coins || 0) + coinsGained,
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
          coins: (d.user?.coins || 0) + coinsGained,
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
    <div className="animate-in fade-in space-y-4">
      {/* Pomodoro Arcanum */}
      <div className="bg-card border border-border p-4 flex flex-col items-center justify-center text-center">
        <div className="text-[11px] font-bold tracking-[2px] mb-1 flex items-center gap-1.5 uppercase text-muted-foreground">
          ✧ The Pomodoro Arcana ✧
        </div>
        <div className="text-xs text-muted-foreground tracking-[1px] mb-4 uppercase">
          Focus to damage Tempus Fugit
        </div>
        <div className="text-5xl font-mono font-bold tracking-widest mb-4 text-foreground">
          {formatTime(timeLeft)}
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleTimer}
            className={`px-6 py-2 border text-[11px] font-bold tracking-[2px] uppercase transition-colors ${
              isRunning ? 'bg-destructive text-destructive-foreground border-destructive' : 'bg-foreground text-background border-foreground hover:opacity-90'
            }`}
          >
            {isRunning ? 'PAUSE' : 'CAST FOCUS'}
          </button>
          {!isRunning && timeLeft < 3600 && (
            <button
              onClick={() => setTimeLeft(3600)}
              className="px-4 py-2 border border-border text-[11px] tracking-[1px] uppercase bg-background hover:bg-muted transition-colors text-muted-foreground"
            >
              RESET
            </button>
          )}
        </div>
      </div>

      {/* Boss List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bosses.map((b: any) => {
          const hpPct = Math.max(0, Math.min(100, (b.hp / b.maxHp) * 100));
          return (
            <div key={b.id} className="bg-card border border-border p-4 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-2 relative z-10">
                <div>
                  <div className="text-lg font-bold uppercase tracking-[1px] text-destructive">
                    {b.name}
                  </div>
                  <div className="text-[10px] uppercase tracking-[2px] text-muted-foreground">
                    {b.title}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold tracking-[1px] text-foreground">
                    {b.hp} / {b.maxHp} HP
                  </div>
                  <div className="text-[9px] uppercase tracking-[1px] text-success">
                    REWARD: {b.xpReward} XP
                  </div>
                </div>
              </div>

              <div className="h-4 bg-muted mb-4 border border-border relative z-10">
                <div
                  className="h-full bg-destructive transition-all duration-500 ease-out"
                  style={{ width: `${hpPct}%` }}
                />
              </div>

              <div className="flex justify-between items-center relative z-10">
                <div className="text-[10px] tracking-[1px] text-muted-foreground uppercase max-w-[60%]">
                  Action: {b.actionDesc}
                </div>
                <button
                  onClick={() => attackBoss(b)}
                  className="px-4 py-1.5 border border-destructive bg-destructive text-destructive-foreground text-[11px] font-bold tracking-[2px] uppercase hover:bg-background hover:text-destructive transition-colors"
                >
                  ATTACK
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
