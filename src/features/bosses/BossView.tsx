import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { BOSS_MATERIALS } from '../../lib/constants';
import { vibrateHeavy, vibrateSuccess, vibrateError, vibrateMedium } from '../../lib/haptics';
import type { Boss } from '../../types';

export function BossView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();
  const bosses = data.bosses || [];

  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isRunning, setIsRunning] = useState(false);
  
  // Phase 4: Active Pomodoro (Focus Checks)
  const [focusCheckActive, setFocusCheckActive] = useState(false);
  const focusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Time Weaver perk checking
  const hasTimeWeaver = (data.user.unlockedPerks || []).includes('p_sage_2');
  const hasBloodlust = (data.user.unlockedPerks || []).includes('p_berserk_2');

  const attackBoss = (b: Boss, multiplier = 1) => {
    setData((d) => {
      const bList = d.bosses || [];
      const idx = bList.findIndex(x => x.id === b.id);
      if (idx === -1) return d;

      const updatedBoss = { ...bList[idx] };
      const baseDmg = hasBloodlust ? Math.ceil(updatedBoss.damage * 1.2) : updatedBoss.damage;
      const finalDmg = Math.ceil(baseDmg * multiplier);
      
      updatedBoss.hp -= finalDmg;

      let xpGained = 0;
      let coinsGained = 0;

      const newBosses = [...bList];
      const prevTotal = d.user.totalXp;

      if (updatedBoss.hp <= 0) {
        xpGained = updatedBoss.xpReward;
        coinsGained = updatedBoss.coinReward;
        updatedBoss.hp = updatedBoss.maxHp; // Respawn

        // Boss material drops
        const droppedMats: string[] = [];
        const newMaterials = { ...(d.materials || {}) };
        
        BOSS_MATERIALS.forEach(mat => {
          if (Math.random() < mat.dropChance) {
            droppedMats.push(mat.name);
            newMaterials[mat.id] = (newMaterials[mat.id] || 0) + 1;
          }
        });

        if (droppedMats.length > 0) {
          const achievementMsg = `🎁 DROPPED: ${droppedMats.join(', ')}`;
          newBosses[idx] = updatedBoss;

          return {
            ...d,
            bosses: newBosses,
            materials: newMaterials,
            achievementQueue: [...(d.achievementQueue || []), achievementMsg],
            user: {
              ...d.user,
              totalXp: prevTotal + xpGained,
              coins: d.user.coins + coinsGained,
            }
          };
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

    if (b.hp - (hasBloodlust ? Math.ceil(b.damage * 1.2) : b.damage) * multiplier <= 0) {
      vibrateSuccess();
      toast(`☠ ${b.name.toUpperCase()} DEFEATED! +${b.xpReward} XP`);
    } else {
      vibrateHeavy();
      toast(`⚔ -${Math.ceil((hasBloodlust ? Math.ceil(b.damage * 1.2) : b.damage) * multiplier)} HP`);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0 && !focusCheckActive) {
      interval = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) return 0;
          
          // Random focus check every minute (roughly 5% chance per second when it's a multiple of 60)
          if (t % 60 === 0 && Math.random() < 0.2) {
            triggerFocusCheck();
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, focusCheckActive]); 

  // Completion effect to avoid synchronous setState inside render loop
  useEffect(() => {
    if (isRunning && timeLeft === 0 && !focusCheckActive) {
      setTimeout(() => {
        setIsRunning(false);
        const timeBoss = bosses.find(b => b.id === 'b4');
        if (timeBoss) {
          attackBoss(timeBoss);
          toast('✧ TEMPUS FUGIT DAMAGED ✧');
        }
        
        if (hasTimeWeaver) {
          setData(d => ({
            ...d,
            user: { ...d.user, totalXp: d.user.totalXp + 15 }
          }));
          toast('✧ TIME WEAVER: +15 XP ✧');
        }
        
        setTimeLeft(3600);
      }, 0);
    }
  }, [isRunning, timeLeft, focusCheckActive]);  

  const triggerFocusCheck = () => {
    setFocusCheckActive(true);
    vibrateMedium();
    
    // If they don't answer in 15 seconds, penalize
    focusTimeoutRef.current = setTimeout(() => {
      setFocusCheckActive(false);
      vibrateError();
      toast('⚠ FOCUS LOST: BOSS HEALED ⚠');
      setData(d => {
        const bList = d.bosses || [];
        const idx = bList.findIndex(x => x.id === 'b4');
        if (idx === -1) return d;
        const newBosses = [...bList];
        newBosses[idx] = { ...newBosses[idx], hp: Math.min(newBosses[idx].maxHp, newBosses[idx].hp + 20) };
        return { ...d, bosses: newBosses };
      });
    }, 15000);
  };

  const passFocusCheck = () => {
    if (focusTimeoutRef.current) clearTimeout(focusTimeoutRef.current);
    setFocusCheckActive(false);
    
    const timeBoss = bosses.find(b => b.id === 'b4');
    if (timeBoss) {
      // Critical hit for focusing!
      attackBoss(timeBoss, 2);
      toast('✧ CRITICAL FOCUS STRIKE! ✧');
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="animate-in fade-in flex flex-col gap-16 max-w-5xl mx-auto z-10 relative pointer-events-auto h-full px-4 pt-4 pb-20 overflow-y-auto no-scrollbar">
      
      {/* Focus Check Overlay */}
      {focusCheckActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="flex flex-col items-center p-8 border border-primary/50 bg-[#030303] max-w-sm w-full text-center">
            <div className="text-[24px] font-bold tracking-[0.2em] text-destructive text-glow mb-2 animate-pulse">
              SYSTEM AUDIT
            </div>
            <div className="text-[12px] text-muted-foreground tracking-[0.2em] uppercase mb-10">
              Acknowledge within 15 seconds to deal critical damage.
            </div>
            <button
              onClick={passFocusCheck}
              className="text-[16px] font-bold tracking-[0.3em] uppercase text-primary hover:text-white transition-colors border border-primary/20 hover:border-primary px-8 py-4"
            >
              [ I AM FOCUSED ]
            </button>
          </div>
        </div>
      )}

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
