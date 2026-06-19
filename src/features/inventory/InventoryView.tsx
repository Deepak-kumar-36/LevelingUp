import { useAppStore } from '../../store/useAppStore';
import { EQUIPMENT_ITEMS } from '../../lib/html-constants';
import { vibrateLight, vibrateSuccess } from '../../lib/haptics';
import { useMemo } from 'react';

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

  const unequipItem = (slot: string) => {
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

  // Calculate total stat bonuses
  const bonusStats = useMemo(() => {
    const bonuses = { intelligence: 0, builder: 0, discipline: 0, vitality: 0, wealth: 0 };
    Object.values(equippedItems).forEach(item => {
      if (item && item.stats) {
        Object.entries(item.stats).forEach(([k, v]) => {
          if (k in bonuses) bonuses[k as keyof typeof bonuses] += v;
        });
      }
    });
    return bonuses;
  }, [equippedItems]);

  const slots = ['head', 'body', 'weapon', 'accessory'] as const;

  return (
    <div className="animate-in fade-in flex flex-col gap-3">
      <div className="bg-card border border-border p-3">
        <div className="text-[11px] font-bold tracking-[2px] mb-3 flex items-center gap-1.5">🛡 EQUIPPED GEAR</div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {slots.map(slot => {
            const item = equippedItems[slot];
            return (
              <div key={slot} className="border border-border p-2 flex flex-col items-center text-center">
                <div className="text-[9px] text-muted-foreground tracking-[2px] uppercase mb-1">{slot}</div>
                {item ? (
                  <>
                    <div className="text-[11px] font-bold uppercase mb-1">{item.name}</div>
                    <div className="text-[9px] text-success font-bold mb-2">
                      {Object.entries(item.stats).map(([k, v]) => `+${v} ${k.slice(0,3)}`).join(', ')}
                    </div>
                    <button 
                      onClick={() => unequipItem(slot)}
                      className="text-[9px] tracking-[1px] uppercase border border-border px-2 py-1 hover:bg-muted"
                    >
                      UNEQUIP
                    </button>
                  </>
                ) : (
                  <div className="text-[11px] text-muted-foreground/50 py-4">EMPTY</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="border border-border p-3 bg-muted/20">
          <div className="text-[10px] tracking-[2px] mb-2 font-bold uppercase">TOTAL EQUIPMENT BONUS</div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(bonusStats).filter(([,v]) => v > 0).map(([k, v]) => (
              <div key={k} className="text-[11px] uppercase"><span className="text-success font-bold">+{v}</span> {k}</div>
            ))}
            {Object.values(bonusStats).every(v => v === 0) && (
              <div className="text-[11px] text-muted-foreground uppercase">No bonuses active</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border p-3">
        <div className="text-[11px] font-bold tracking-[2px] mb-3 flex items-center gap-1.5">🎒 INVENTORY</div>
        {inventoryItems.length === 0 ? (
          <div className="text-[11px] text-muted-foreground uppercase py-4 text-center">
            Your inventory is empty. Visit the Blacksmith in the shop to acquire gear.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {inventoryItems.map(item => {
              const isEquipped = data.equipped?.[item.slot as keyof typeof data.equipped] === item.id;
              return (
                <div key={item.id} className="border border-border p-3">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-bold tracking-[1px] text-[11px] uppercase">{item.name}</div>
                    <div className="text-[9px] text-muted-foreground tracking-[1px] uppercase border border-border px-1">
                      {item.slot}
                    </div>
                  </div>
                  <div className="text-[10px] text-success font-bold mb-3 uppercase">
                    {Object.entries(item.stats).map(([k, v]) => `+${v} ${k}`).join(', ')}
                  </div>
                  <button
                    onClick={() => equipItem(item)}
                    disabled={isEquipped}
                    className={`w-full p-2 text-[10px] tracking-[2px] uppercase border border-border transition-colors ${
                      isEquipped ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background hover:bg-muted'
                    }`}
                  >
                    {isEquipped ? 'EQUIPPED' : 'EQUIP'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
