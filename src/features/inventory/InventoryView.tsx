import { useAppStore } from '../../store/useAppStore';
import { EQUIPMENT_ITEMS } from '../../lib/constants';
import { vibrateLight, vibrateSuccess } from '../../lib/haptics';
import { useMemo } from 'react';
import type { EquipmentSlot } from '../../types';

export function InventoryView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();

  const inventoryItems = useMemo(() => {
    return (data.inventory || []).map(id => EQUIPMENT_ITEMS.find(e => e.id === id)).filter(Boolean) as typeof EQUIPMENT_ITEMS;
  }, [data.inventory]);

  const equipItem = (item: typeof EQUIPMENT_ITEMS[0]) => {
    setData(d => ({
      ...d,
      equipped: {
        ...(d.equipped || { head: null, body: null, weapon: null, accessory: null }),
        [item.slot]: item.id
      }
    }));
    vibrateSuccess();
    toast(`✓ EQUIPPED: ${item.name}`);
  };

  const unequipItem = (slot: EquipmentSlot) => {
    vibrateLight();
    setData(d => ({
      ...d,
      equipped: {
        ...(d.equipped || { head: null, body: null, weapon: null, accessory: null }),
        [slot]: null
      }
    }));
  };

  const equippedItems = useMemo(() => {
    const eq = data.equipped || { head: null, body: null, weapon: null, accessory: null };
    return {
      head: EQUIPMENT_ITEMS.find(e => e.id === eq.head),
      body: EQUIPMENT_ITEMS.find(e => e.id === eq.body),
      weapon: EQUIPMENT_ITEMS.find(e => e.id === eq.weapon),
      accessory: EQUIPMENT_ITEMS.find(e => e.id === eq.accessory)
    };
  }, [data.equipped]);

  const bonusStats = useMemo(() => {
    const bonuses = { intelligence: 0, builder: 0, discipline: 0, vitality: 0, wealth: 0 };
    Object.values(equippedItems).forEach(item => {
      if (item && item.stats) {
        Object.entries(item.stats).forEach(([k, v]) => {
          if (k in bonuses) bonuses[k as keyof typeof bonuses] += v as number;
        });
      }
    });
    return bonuses;
  }, [equippedItems]);

  const slots: EquipmentSlot[] = ['head', 'body', 'weapon', 'accessory'];

  return (
    <div className="animate-in fade-in flex flex-col md:flex-row gap-16 max-w-5xl mx-auto z-10 relative pointer-events-auto h-full px-4 pt-4">
      
      {/* Left Column: Equipped Gear & Bonuses */}
      <div className="flex-[0.8] flex flex-col gap-12">
        <div>
          <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-8">
            Active Loadout
          </div>
          
          <div className="flex flex-col gap-6">
            {slots.map(slot => {
              const item = equippedItems[slot];
              return (
                <div key={slot} className="flex flex-col gap-1 border-b border-white/5 pb-4">
                  <div className="text-[9px] text-muted-foreground tracking-[0.3em] uppercase">{slot}</div>
                  {item ? (
                    <div className="flex justify-between items-start mt-2">
                      <div>
                        <div className="text-[14px] font-bold tracking-[0.1em] text-primary uppercase">{item.name}</div>
                        <div className="text-[10px] text-foreground tracking-[0.1em] mt-1 uppercase">
                          {item.stats ? Object.entries(item.stats).map(([k, v]) => `+${v} ${k.slice(0,3)}`).join(' | ') : ''}
                        </div>
                      </div>
                      <button 
                        onClick={() => unequipItem(slot)}
                        className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-destructive transition-colors"
                      >
                        [ UNEQUIP ]
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-muted-foreground/30 tracking-[0.2em] uppercase mt-2">
                      NO ITEM EQUIPPED
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-4">
            System Modifiers
          </div>
          <div className="flex flex-col gap-2">
            {Object.entries(bonusStats).filter(([,v]) => v > 0).map(([k, v]) => (
              <div key={k} className="flex justify-between text-[11px] tracking-[0.2em] uppercase border-b border-white/5 pb-2">
                <span className="text-foreground">{k}</span>
                <span className="text-primary font-bold">+{v}</span>
              </div>
            ))}
            {Object.values(bonusStats).every(v => v === 0) && (
              <div className="text-[10px] text-muted-foreground/30 tracking-[0.2em] uppercase">
                NO ACTIVE MODIFIERS
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Inventory List */}
      <div className="flex-1 flex flex-col gap-12">
        <div>
          <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-8">
            Inventory Database
          </div>
          
          {inventoryItems.length === 0 ? (
            <div className="text-[11px] text-muted-foreground/30 tracking-[0.3em] uppercase text-center mt-20 leading-loose">
              Database Empty.<br/>
              Acquire gear via Blacksmith.
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {inventoryItems.map(item => {
                const isEquipped = data.equipped?.[item.slot as keyof typeof data.equipped] === item.id;
                return (
                  <div key={item.id} className={`flex flex-col gap-2 transition-opacity ${isEquipped ? 'opacity-30' : 'opacity-100'}`}>
                    <div className="flex justify-between items-start">
                      <div className="font-bold tracking-[0.1em] text-[13px] uppercase text-foreground">
                        {item.name} <span className="text-[9px] text-muted-foreground ml-2">[{item.slot}]</span>
                      </div>
                    </div>
                    
                    <div className="text-[10px] tracking-[0.1em] uppercase text-primary font-bold">
                      {item.stats ? Object.entries(item.stats).map(([k, v]) => `+${v} ${k}`).join(' | ') : ''}
                    </div>
                    
                    <div className="mt-2">
                      <button
                        onClick={() => equipItem(item)}
                        disabled={isEquipped}
                        className={`text-[10px] tracking-[0.3em] uppercase transition-colors font-bold ${
                          isEquipped ? 'text-muted-foreground cursor-not-allowed' : 'text-primary hover:text-white'
                        }`}
                      >
                        {isEquipped ? '[ EQUIPPED ]' : '[ EQUIP TO SLOT ]'}
                      </button>
                    </div>
                    <div className="h-[1px] w-full bg-white/5 mt-4" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
