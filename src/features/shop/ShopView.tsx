import { useAppStore, formatDateKey, generateId } from '../../store/useAppStore';
import { SHOP_ITEMS, EQUIPMENT_ITEMS } from '../../lib/constants';
import { vibrateSuccess, vibrateError } from '../../lib/haptics';

export function ShopView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();
  const redeemed = data.redeemed ?? [];
  const TK = formatDateKey(new Date());

  const buyItem = (item: typeof SHOP_ITEMS[0]) => {
    setData(d => {
      if (d.user.coins < item.cost) {
        vibrateError();
        toast('✗ INSUFFICIENT COINS');
        return d;
      }
      vibrateSuccess();
      toast('✓ REDEEMED: ' + item.name);
      return {
        ...d,
        user: { ...d.user, coins: d.user.coins - item.cost },
        redeemed: [
          ...d.redeemed,
          JSON.stringify({ id: generateId(), item: item.name, date: TK })
        ]
      };
    });
  };

  const buyEquipment = (eq: typeof EQUIPMENT_ITEMS[0]) => {
    setData(d => {
      if (d.user.coins < eq.cost) {
        vibrateError();
        toast('✗ INSUFFICIENT COINS');
        return d;
      }
      vibrateSuccess();
      toast('✓ ACQUIRED: ' + eq.name);
      return {
        ...d,
        user: { ...d.user, coins: d.user.coins - eq.cost },
        inventory: [...(d.inventory || []), eq.id]
      };
    });
  };

  return (
    <div className="animate-in fade-in flex flex-col md:flex-row gap-16 max-w-5xl mx-auto z-10 relative pointer-events-auto h-full px-4 pt-4">
      
      {/* Left Column: Balances & History */}
      <div className="flex-[0.8] flex flex-col gap-12">
        <div>
          <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-4">
            Available Capital
          </div>
          <div className="text-[32px] font-bold tracking-[0.1em] text-primary text-glow">
            {data.user.coins} <span className="text-[14px] text-muted-foreground tracking-[0.2em] ml-2">COINS</span>
          </div>
        </div>

        {redeemed.length > 0 && (
          <div>
            <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-6">
              Redemption History
            </div>
            <div className="flex flex-col gap-4">
              {[...redeemed].reverse().slice(0, 10).map((rString, i) => {
                let r: { item?: string; date?: string } = {};
                try {
                  if (typeof rString === 'string') {
                    r = JSON.parse(rString);
                  } else {
                    r = rString;
                  }
                } catch (e) {
                  r = { item: String(rString), date: '' };
                }
                return (
                  <div key={i} className="flex justify-between items-center text-[11px] tracking-[0.1em] border-b border-white/5 pb-2 opacity-70">
                    <span className="uppercase text-foreground">{r.item}</span>
                    <span className="text-muted-foreground">{r.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: The Shop */}
      <div className="flex-1 flex flex-col gap-12">
        
        {/* Consumables */}
        <div>
          <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-8">
            Consumables
          </div>
          
          <div className="flex flex-col gap-6">
            {SHOP_ITEMS.map(item => {
              const can = data.user.coins >= item.cost;
              return (
                <div key={item.id} className={`flex flex-col gap-2 transition-opacity ${can ? 'opacity-100' : 'opacity-30'}`}>
                  <div className="flex justify-between items-start">
                    <div className="font-bold tracking-[0.1em] text-[13px] uppercase text-foreground">{item.name}</div>
                    <div className="text-[12px] font-mono font-bold text-primary">{item.cost} C</div>
                  </div>
                  <div className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase leading-relaxed">
                    {item.desc}
                  </div>
                  
                  <div className="mt-2">
                    <button
                      onClick={() => buyItem(item)}
                      disabled={!can}
                      className={`text-[10px] tracking-[0.3em] uppercase transition-colors font-bold ${
                        can ? 'text-primary hover:text-white' : 'text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      {can ? '[ REDEEM ]' : `[ SHORT ${item.cost - data.user.coins} C ]`}
                    </button>
                  </div>
                  <div className="h-[1px] w-full bg-white/5 mt-4" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Equipment */}
        <div>
          <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase mb-8">
            Blacksmith (Equipment)
          </div>
          
          <div className="flex flex-col gap-6">
            {EQUIPMENT_ITEMS.map(eq => {
              const owned = (data.inventory || []).includes(eq.id);
              const can = data.user.coins >= eq.cost && !owned;
              return (
                <div key={eq.id} className={`flex flex-col gap-2 transition-opacity ${can || owned ? 'opacity-100' : 'opacity-30'}`}>
                  <div className="flex justify-between items-start">
                    <div className="font-bold tracking-[0.1em] text-[13px] uppercase text-foreground">
                      {eq.name} <span className="text-[9px] text-muted-foreground ml-2">[{eq.slot}]</span>
                    </div>
                    <div className="text-[12px] font-mono font-bold text-primary">
                      {owned ? 'ACQUIRED' : `${eq.cost} C`}
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase leading-relaxed">
                    {eq.desc}
                  </div>
                  <div className="text-[10px] tracking-[0.1em] uppercase text-primary font-bold">
                    {Object.entries(eq.stats).map(([k, v]) => `+${v} ${k}`).join(' | ')}
                  </div>
                  
                  <div className="mt-2">
                    <button
                      onClick={() => buyEquipment(eq)}
                      disabled={!can}
                      className={`text-[10px] tracking-[0.3em] uppercase transition-colors font-bold ${
                        owned ? 'text-muted-foreground/30 cursor-not-allowed' :
                        can ? 'text-primary hover:text-white' : 'text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      {owned ? '[ ACQUIRED ]' : can ? '[ PURCHASE ]' : `[ SHORT ${eq.cost - data.user.coins} C ]`}
                    </button>
                  </div>
                  <div className="h-[1px] w-full bg-white/5 mt-4" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
