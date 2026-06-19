import { useAppStore, dKey, numId } from '../../store/useAppStore';
import { SHOP, EQUIPMENT_ITEMS } from '../../lib/html-constants';

export function ShopView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();
  const redeemed = data.redeemed ?? [];
  const TK = dKey(new Date());

  const buyItem = (item: typeof SHOP[0]) => {
    setData(d => {
      if (d.user.coins < item.cost) {
        toast('✗ INSUFFICIENT COINS');
        return d;
      }
      toast('✓ REDEEMED: ' + item.name);
      return {
        ...d,
        user: { ...d.user, coins: d.user.coins - item.cost },
        redeemed: [
          ...(d.redeemed ?? []),
          { id: numId(), item: item.name, date: TK }
        ]
      };
    });
  };

  const buyEquipment = (eq: typeof EQUIPMENT_ITEMS[0]) => {
    setData(d => {
      if (d.user.coins < eq.cost) {
        toast('✗ INSUFFICIENT COINS');
        return d;
      }
      toast('✓ ACQUIRED: ' + eq.name);
      return {
        ...d,
        user: { ...d.user, coins: d.user.coins - eq.cost },
        inventory: [...(d.inventory || []), eq.id]
      };
    });
  };

  return (
    <div className="animate-in fade-in flex flex-col gap-3">
      <div className="bg-card border border-border p-3">
        <div className="text-[11px] font-bold tracking-[2px] mb-2.5 flex items-center gap-1.5">⚡ REWARD SHOP</div>
        <div className="text-[11px] text-muted-foreground tracking-[1px] mb-4">
          BALANCE: <span className="font-bold text-foreground text-[15px] ml-1">{data.user.coins} COINS</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {SHOP.map(item => {
            const can = data.user.coins >= item.cost;
            return (
              <div 
                key={item.id} 
                className={`border border-border p-3.5 ${can ? 'bg-background opacity-100' : 'bg-muted/50 opacity-65'}`}
              >
                <div className="font-bold tracking-[2px] mb-1 text-[12px] uppercase">{item.name}</div>
                <div className="text-[11px] text-muted-foreground tracking-[1px] mb-1">{item.cost} COINS</div>
                <div className="text-[10px] text-muted-foreground mb-3 leading-[1.6] uppercase">{item.desc}</div>
                
                <button
                  onClick={() => buyItem(item)}
                  disabled={!can}
                  className={`w-full p-2 text-[11px] tracking-[2px] uppercase border border-border transition-colors ${
                    can ? 'bg-foreground text-background hover:opacity-90 cursor-pointer' : 'bg-background text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {can ? 'REDEEM' : `NEED ${(item.cost - data.user.coins).toLocaleString()}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card border border-border p-3">
        <div className="text-[11px] font-bold tracking-[2px] mb-2.5 flex items-center gap-1.5">🗡 BLACKSMITH</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {EQUIPMENT_ITEMS.map(eq => {
            const owned = (data.inventory || []).includes(eq.id);
            const can = data.user.coins >= eq.cost && !owned;
            return (
              <div 
                key={eq.id} 
                className={`border border-border p-3.5 ${can || owned ? 'bg-background opacity-100' : 'bg-muted/50 opacity-65'}`}
              >
                <div className="font-bold tracking-[2px] mb-1 text-[12px] uppercase">{eq.name}</div>
                <div className="text-[11px] text-muted-foreground tracking-[1px] mb-1">{owned ? 'OWNED' : `${eq.cost} COINS`}</div>
                <div className="text-[10px] text-muted-foreground mb-3 leading-[1.6] uppercase">
                  {eq.desc}<br/>
                  <span className="text-success mt-1 inline-block font-bold">
                    {Object.entries(eq.stats).map(([k, v]) => `+${v} ${k}`).join(', ')}
                  </span>
                </div>
                
                <button
                  onClick={() => buyEquipment(eq)}
                  disabled={!can}
                  className={`w-full p-2 text-[11px] tracking-[2px] uppercase border border-border transition-colors ${
                    owned ? 'bg-background text-muted-foreground cursor-not-allowed border-muted-foreground' :
                    can ? 'bg-foreground text-background hover:opacity-90 cursor-pointer' : 'bg-background text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {owned ? 'OWNED' : can ? 'ACQUIRE' : `NEED ${(eq.cost - data.user.coins).toLocaleString()}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {redeemed.length > 0 && (
        <div className="bg-card border border-border p-3">
          <div className="text-[11px] font-bold tracking-[2px] mb-2.5 flex items-center gap-1.5">REDEMPTION HISTORY</div>
          {[...redeemed].reverse().slice(0, 10).map((r, i) => (
            <div key={i} className="flex justify-between py-1.5 border-b border-border text-[11px]">
              <span className="tracking-[1px] uppercase">{r.item}</span>
              <span className="text-muted-foreground">{r.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
