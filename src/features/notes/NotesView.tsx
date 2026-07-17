import { useState } from 'react';
import { useAppStore, formatDateKey, generateId } from '../../store/useAppStore';
import type { Note } from '../../types';

export function NotesView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();
  const [selId, setSelId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [fTitle, setFTitle] = useState('');
  const [fContent, setFContent] = useState('');
  const [editing, setEditing] = useState(false);

  const notes = data.notes ?? [];
  const q = search.toLowerCase();

  const filteredNotes = notes.filter((n) => 
    !q || 
    n.title.toLowerCase().includes(q) || 
    (n.body ?? '').toLowerCase().includes(q)
  );
  const sel = notes.find((n) => n.id === selId);

  const startNew = () => { 
    setSelId(null); 
    setFTitle(''); 
    setFContent(''); 
    setEditing(true); 
  };

  const pickNote = (n: Note) => { 
    setSelId(n.id); 
    setFTitle(n.title); 
    setFContent(n.body ?? ''); 
    setEditing(false); 
  };

  const startEdit = () => { 
    if (sel) { 
      setFTitle(sel.title); 
      setFContent(sel.body ?? ''); 
      setEditing(true); 
    } 
  };

  const save = () => {
    if (!fTitle.trim()) { toast('✗ TITLE REQUIRED'); return; }
    const now = formatDateKey(new Date());
    
    if (selId && sel) {
      setData(d => ({
        ...d,
        notes: (d.notes ?? []).map((n) => n.id === selId ? { ...n, title: fTitle.trim().toUpperCase(), body: fContent, date: now } : n)
      }));
      toast('✓ NOTE UPDATED');
    } else {
      const nn: Note = { id: `n_${generateId()}`, title: fTitle.trim().toUpperCase(), body: fContent, date: now };
      setData(d => ({ ...d, notes: [nn, ...(d.notes ?? [])] }));
      setSelId(nn.id);
      toast('✓ NOTE SAVED');
    }
    setEditing(false);
  };

  const del = (id: string) => {
    setData(d => ({ ...d, notes: (d.notes ?? []).filter((n) => n.id !== id) }));
    setSelId(null);
    setEditing(false);
    toast('✓ NOTE DELETED');
  };

  return (
    <div className="animate-in fade-in grid grid-cols-1 md:grid-cols-[260px_1fr] gap-12 max-w-5xl mx-auto z-10 relative pointer-events-auto h-full">
      {/* List Panel */}
      <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
        
        <div className="flex gap-4 shrink-0 items-center mb-6">
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="SEARCH RECORDS..."
            className="flex-1 bg-transparent border-none font-mono text-[11px] outline-none text-foreground tracking-[0.2em] uppercase placeholder:text-muted-foreground/50"
          />
          <button 
            onClick={startNew}
            className="text-primary text-[11px] tracking-[0.2em] uppercase hover:text-primary/70 transition-colors shrink-0"
          >
            [NEW]
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 flex flex-col gap-6 no-scrollbar">
          {filteredNotes.length === 0 ? (
            <div className="text-[11px] text-muted-foreground tracking-[0.2em] leading-relaxed uppercase opacity-50">
              No records found.
            </div>
          ) : (
            filteredNotes.map((n) => (
              <div 
                key={n.id}
                className={`cursor-pointer transition-all duration-300 ${
                  n.id === selId ? 'opacity-100 pl-2 border-l border-primary' : 'opacity-50 hover:opacity-100 pl-2 border-l border-transparent'
                }`}
                onClick={() => pickNote(n)}
              >
                <div className={`font-bold text-[12px] tracking-[0.1em] mb-1 overflow-hidden text-ellipsis whitespace-nowrap ${n.id === selId ? 'text-primary' : 'text-foreground'}`}>
                  {n.title}
                </div>
                <div className="text-[10px] text-muted-foreground tracking-[0.2em]">
                  {n.date}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor/Detail Panel */}
      <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
        {editing ? (
          <div className="flex flex-col h-full gap-6">
            <div className="text-[11px] text-primary tracking-[0.3em] uppercase flex items-center justify-between shrink-0">
              <span>{selId && sel ? 'EDITING RECORD' : 'NEW RECORD'}</span>
              <div className="flex gap-4">
                <button 
                  onClick={() => setEditing(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  onClick={save}
                  className="text-primary font-bold hover:text-white transition-colors"
                >
                  SAVE
                </button>
              </div>
            </div>

            <input 
              value={fTitle} 
              onChange={e => setFTitle(e.target.value.toUpperCase())}
              placeholder="RECORD TITLE..."
              className="w-full bg-transparent border-none font-bold font-mono text-[16px] outline-none text-foreground tracking-[0.1em] placeholder:text-muted-foreground/30 shrink-0"
            />
            
            <textarea
              value={fContent}
              onChange={e => setFContent(e.target.value)}
              placeholder="ENTER LOG DATA..."
              className="w-full flex-1 bg-transparent border-none font-mono text-[13px] text-muted-foreground hover:text-foreground focus:text-foreground outline-none leading-loose resize-none placeholder:text-muted-foreground/30 transition-colors"
            />
          </div>
        ) : sel ? (
          <div className="flex flex-col h-full gap-6">
            <div className="flex justify-between items-start shrink-0">
              <div className="flex flex-col gap-2">
                <div className="font-bold text-[16px] tracking-[0.1em] text-primary">{sel.title}</div>
                <div className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
                  LOGGED: {sel.date}
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={startEdit}
                  className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  EDIT
                </button>
                <button 
                  onClick={() => del(sel.id)}
                  className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-destructive transition-colors"
                >
                  PURGE
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto text-[13px] leading-loose text-foreground whitespace-pre-wrap no-scrollbar">
              {sel.body || <span className="text-[11px] text-muted-foreground tracking-[0.2em] uppercase opacity-50">Empty log entry.</span>}
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-muted-foreground tracking-[0.3em] uppercase opacity-30 mt-[20vh] text-center">
            Awaiting Record Selection
          </div>
        )}
      </div>
    </div>
  );
}
