import { useState } from 'react';
import { useAppStore, dKey, numId } from '../../store/useAppStore';

export function NotesView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();
  const [selId, setSelId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [fTitle, setFTitle] = useState('');
  const [fContent, setFContent] = useState('');
  const [fTags, setFTags] = useState('');
  const [editing, setEditing] = useState(false);

  const notes = data.notes ?? [];
  const q = search.toLowerCase();
  const filtered = notes.filter((n: any) => 
    !q || 
    n.title.toLowerCase().includes(q) || 
    (n.content ?? '').toLowerCase().includes(q) || 
    (n.tags ?? []).some((t: string) => t.toLowerCase().includes(q))
  );
  const sel = notes.find((n: any) => n.id === selId);

  const startNew = () => { 
    setSelId(null); 
    setFTitle(''); 
    setFContent(''); 
    setFTags(''); 
    setEditing(true); 
  };

  const pickNote = (n: any) => { 
    setSelId(n.id); 
    setFTitle(n.title); 
    setFContent(n.content ?? ''); 
    setFTags((n.tags ?? []).join(', ')); 
    setEditing(false); 
  };

  const startEdit = () => { 
    if (sel) { 
      setFTitle(sel.title); 
      setFContent(sel.content ?? ''); 
      setFTags((sel.tags ?? []).join(', ')); 
      setEditing(true); 
    } 
  };

  const save = () => {
    if (!fTitle.trim()) { toast('✗ TITLE REQUIRED'); return; }
    const tags = fTags.split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
    const now = dKey(new Date());
    
    if (selId && sel) {
      setData(d => ({
        ...d,
        notes: (d.notes ?? []).map((n: any) => n.id === selId ? { ...n, title: fTitle.trim().toUpperCase(), content: fContent, tags, updatedAt: now } : n)
      }));
      toast('✓ NOTE UPDATED');
    } else {
      const nn = { id: numId(), title: fTitle.trim().toUpperCase(), content: fContent, tags, createdAt: now, updatedAt: now };
      setData(d => ({ ...d, notes: [nn, ...(d.notes ?? [])] }));
      setSelId(nn.id);
      toast('✓ NOTE SAVED');
    }
    setEditing(false);
  };

  const del = (id: number) => {
    setData(d => ({ ...d, notes: (d.notes ?? []).filter((n: any) => n.id !== id) }));
    setSelId(null);
    setEditing(false);
    toast('✓ NOTE DELETED');
  };

  return (
    <div className="animate-in fade-in grid grid-cols-1 md:grid-cols-[260px_1fr] gap-3">
      {/* List Panel */}
      <div className="bg-card border border-border/50 rounded-xl card-shadow p-0 flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
        <div className="p-3 border-b border-border flex gap-1.5 shrink-0">
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="SEARCH..."
            className="flex-1 bg-background border border-border px-2 py-1.5 font-mono text-[11px] outline-none text-foreground tracking-wide min-w-0"
          />
          <button 
            onClick={startNew}
            className="bg-foreground text-background border border-foreground px-2 py-1.5 text-[10px] tracking-wide uppercase hover:opacity-90 shrink-0"
          >
            + NEW
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-3 flex flex-col">
          {filtered.length === 0 ? (
            <div className="text-[11px] text-muted-foreground tracking-wide leading-[1.8]">
              No notes yet.<br/><br/>Create your first note.
            </div>
          ) : (
            filtered.map((n: any) => (
              <div 
                key={n.id}
                className={`p-2 mb-1 cursor-pointer border-l-[3px] border ${
                  n.id === selId 
                    ? 'border-l-foreground border-y-foreground border-r-foreground bg-background' 
                    : 'border-l-transparent border-y-border border-r-border bg-card hover:bg-muted'
                }`}
                onClick={() => pickNote(n)}
              >
                <div className="font-bold text-[11px] tracking-wide mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                  {n.title}
                </div>
                <div className={`text-[11px] text-muted-foreground tracking-wide ${n.tags?.length ? 'mb-1' : ''}`}>
                  {n.updatedAt}
                </div>
                {n.tags?.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {n.tags.map((t: string) => (
                      <span key={t} className="text-[9px] px-1.5 py-[1px] border border-muted-foreground tracking-wide uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor/Detail Panel */}
      <div className="bg-card border border-border/50 rounded-xl card-shadow p-0 flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
        {editing ? (
          <div className="p-3 flex flex-col h-full">
            <div className="text-[11px] font-bold tracking-wide mb-2.5 flex items-center gap-1.5">
              ✏ {selId && sel ? 'EDIT NOTE' : 'NEW NOTE'}
            </div>
            <div className="text-[11px] text-muted-foreground tracking-wide mb-1 shrink-0">TITLE</div>
            <input 
              value={fTitle} 
              onChange={e => setFTitle(e.target.value.toUpperCase())}
              className="w-full bg-background border border-border p-2 mb-2.5 font-mono text-[13px] outline-none text-foreground shrink-0"
            />
            <div className="text-[11px] text-muted-foreground tracking-wide mb-1 shrink-0">CONTENT</div>
            <textarea
              value={fContent}
              onChange={e => setFContent(e.target.value)}
              className="w-full flex-1 bg-background border border-border p-2 mb-2.5 font-mono text-[12px] text-foreground outline-none leading-[1.7] resize-none"
            />
            <div className="text-[11px] text-muted-foreground tracking-wide mb-1 shrink-0">TAGS (comma-separated)</div>
            <input 
              value={fTags} 
              onChange={e => setFTags(e.target.value)} 
              placeholder="DSA, IDEA, WEBDEV..."
              className="w-full bg-background border border-border p-2 mb-3 font-mono text-[11px] outline-none text-foreground tracking-wide shrink-0 uppercase"
            />
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={save}
                className="flex-1 bg-foreground text-background border border-foreground p-2 text-[11px] tracking-wide uppercase font-bold hover:opacity-90"
              >
                SAVE
              </button>
              <button 
                onClick={() => setEditing(false)}
                className="bg-background text-foreground border border-border p-2 text-[11px] tracking-wide uppercase hover:bg-muted"
              >
                CANCEL
              </button>
            </div>
          </div>
        ) : sel ? (
          <div className="flex flex-col h-full">
            <div className="p-3 border-b border-border shrink-0">
              <div className="font-bold text-[14px] tracking-wide mb-1">{sel.title}</div>
              <div className="text-[11px] text-muted-foreground tracking-wide">
                Created: {sel.createdAt} · Updated: {sel.updatedAt}
              </div>
              {sel.tags?.length > 0 && (
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {sel.tags.map((t: string) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 border border-muted-foreground tracking-wide uppercase">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="p-3 flex-1 overflow-y-auto text-[12px] leading-[1.9] text-foreground whitespace-pre-wrap">
              {sel.content || <span className="text-[11px] text-muted-foreground tracking-wide">No content.</span>}
            </div>
            <div className="p-3 border-t border-border flex gap-2 shrink-0">
              <button 
                onClick={startEdit}
                className="bg-background text-foreground border border-border p-2 text-[11px] tracking-wide uppercase hover:bg-muted"
              >
                EDIT
              </button>
              <button 
                onClick={() => del(sel.id)}
                className="bg-background text-destructive border border-destructive p-2 text-[11px] tracking-wide uppercase hover:bg-destructive/10"
              >
                DELETE
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 text-[11px] text-muted-foreground tracking-wide leading-[1.9]">
            Select a note or create<br/>a new one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
