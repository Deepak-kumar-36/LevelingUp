import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAppStore, formatDateKey, generateId } from '../../store/useAppStore';
import { vibrateLight, vibrateSuccess, vibrateError } from '../../lib/haptics';
import type { Note } from '../../types';
import { Search, Plus, Edit2, Network, Link as LinkIcon, Trash2 } from 'lucide-react';

// --- Markdown Parsers ---
const extractLinks = (text: string) => {
  const regex = /\[\[(.*?)\]\]/g;
  const links: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    links.push(match[1].trim().toUpperCase());
  }
  return [...new Set(links)];
};

const renderLine = (line: string, onLinkClick: (t: string) => void) => {
  const parts = line.split(/(\[\[.*?\]\]|\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('[[') && part.endsWith(']]')) {
      const link = part.slice(2, -2).trim().toUpperCase();
      return (
        <span 
          key={i} 
          onClick={() => onLinkClick(link)}
          className="text-primary cursor-pointer font-bold transition-all hover:text-white"
        >
          {part}
        </span>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <span key={i} className="font-bold text-foreground text-glow">{part.slice(2, -2)}</span>;
    }
    return <span key={i} className="opacity-80">{part}</span>;
  });
};

const MarkdownPreview = ({ content, onLinkClick }: { content: string, onLinkClick: (t: string) => void }) => {
  const lines = content.split('\n');
  return (
    <div className="flex flex-col gap-2 font-mono text-[13px] leading-relaxed break-words whitespace-pre-wrap">
      {lines.map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-[20px] font-bold text-primary tracking-[0.1em] mt-6 mb-2 uppercase">{renderLine(line.substring(2), onLinkClick)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-[16px] font-bold text-foreground tracking-[0.1em] mt-4 mb-1 uppercase">{renderLine(line.substring(3), onLinkClick)}</h2>;
        if (line.startsWith('- ')) return <div key={i} className="flex gap-3 items-start"><span className="text-primary opacity-50 mt-1">◇</span><span>{renderLine(line.substring(2), onLinkClick)}</span></div>;
        if (line.startsWith('> ')) return <div key={i} className="border-l-2 border-primary/50 pl-4 py-1 my-2 text-muted-foreground italic">{renderLine(line.substring(2), onLinkClick)}</div>;
        if (line.trim() === '') return <div key={i} className="h-3" />;
        return <div key={i}>{renderLine(line, onLinkClick)}</div>;
      })}
    </div>
  );
};

// --- Custom Physics Graph ---
const GraphView = ({ notes, onNodeClick }: { notes: Note[], onNodeClick: (t: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Scale canvas for retina displays
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const nodes = notes.map(n => ({ 
      id: n.id, 
      title: n.title, 
      x: Math.random() * canvas.width, 
      y: Math.random() * canvas.height, 
      vx: 0, 
      vy: 0 
    }));
    
    const edges: {source: string, target: string}[] = [];
    notes.forEach(n => {
      const links = extractLinks(n.body || '');
      links.forEach(l => {
        const target = nodes.find(x => x.title === l);
        if (target) edges.push({ source: n.id, target: target.id });
      });
    });

    let animationFrameId: number;

    const simulate = () => {
      const k = 0.02; // spring constant
      const maxForce = 3;

      nodes.forEach(n => { n.vx *= 0.8; n.vy *= 0.8; }); // damping

      // Spring force
      edges.forEach(e => {
        const s = nodes.find(x => x.id === e.source);
        const t = nodes.find(x => x.id === e.target);
        if (s && t) {
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const dist = Math.sqrt(dx*dx + dy*dy) || 1;
          const force = (dist - 80) * k;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          s.vx += fx; s.vy += fy;
          t.vx -= fx; t.vy -= fy;
        }
      });

      // Repulsion
      for(let i=0; i<nodes.length; i++) {
        for(let j=i+1; j<nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx*dx + dy*dy) || 1;
          if (dist < 150) {
            const force = -800 / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            a.vx += fx; a.vy += fy;
            b.vx -= fx; b.vy -= fy;
          }
        }
      }

      // Center gravity
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      nodes.forEach(n => {
        const dx = cx - n.x;
        const dy = cy - n.y;
        n.vx += dx * 0.005;
        n.vy += dy * 0.005;
      });

      // Update positions
      nodes.forEach(n => {
        n.vx = Math.max(-maxForce, Math.min(maxForce, n.vx));
        n.vy = Math.max(-maxForce, Math.min(maxForce, n.vy));
        n.x += n.vx;
        n.y += n.vy;
      });

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw edges
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      edges.forEach(e => {
        const s = nodes.find(x => x.id === e.source);
        const t = nodes.find(x => x.id === e.target);
        if (s && t) {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(t.x, t.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#4ade80'; 
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '10px monospace';
        ctx.fillText(n.title, n.x + 8, n.y + 4);
      });

      animationFrameId = requestAnimationFrame(simulate);
    };

    simulate();
    
    // Minimal click detection
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Find closest node
      let closest: string | null = null;
      let minDist = 20; // click radius
      
      nodes.forEach(n => {
        const dist = Math.sqrt(Math.pow(n.x - x, 2) + Math.pow(n.y - y, 2));
        if (dist < minDist) {
          minDist = dist;
          closest = n.title;
        }
      });
      
      if (closest) onNodeClick(closest);
    };
    
    canvas.addEventListener('click', handleClick);
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('click', handleClick);
    };
  }, [notes, onNodeClick]);

  return <canvas ref={canvasRef} className="w-full h-full bg-black/50 border border-white/5 cursor-crosshair rounded-sm" />;
};

// --- Main View ---
export function NotesView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();
  const notes = data.notes ?? [];

  const [selId, setSelId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
  const [fTitle, setFTitle] = useState('');
  const [fContent, setFContent] = useState('');
  
  const [mode, setMode] = useState<'PREVIEW' | 'EDIT'>('PREVIEW');
  const [rightPanel, setRightPanel] = useState<'BACKLINKS' | 'GRAPH'>('GRAPH');
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(false); // Default hidden on smaller screens to save space

  const selNote = notes.find(n => n.id === selId);

  const filteredNotes = useMemo(() => {
    const q = search.toLowerCase();
    return notes.filter(n => !q || n.title.toLowerCase().includes(q) || (n.body ?? '').toLowerCase().includes(q))
                .sort((a, b) => b.date.localeCompare(a.date));
  }, [notes, search]);

  const backlinks = useMemo(() => {
    if (!selNote) return [];
    return notes.filter(n => n.id !== selNote.id && extractLinks(n.body).includes(selNote.title));
  }, [notes, selNote]);

  const navigateToNote = (title: string) => {
    vibrateLight();
    const existing = notes.find(n => n.title === title);
    if (existing) {
      setSelId(existing.id);
      setFTitle(existing.title);
      setFContent(existing.body);
      setMode('PREVIEW');
    } else {
      // Create it instantly to satisfy the zettelkasten flow
      const nn: Note = { id: `n_${generateId()}`, title: title, body: '', date: formatDateKey(new Date()) };
      setData(d => ({ ...d, notes: [nn, ...(d.notes ?? [])] }));
      setSelId(nn.id);
      setFTitle(title);
      setFContent('');
      setMode('EDIT');
      toast(`✓ NEW NODE CREATED: ${title}`);
    }
  };

  const startNew = () => { 
    vibrateLight();
    setSelId(null); 
    setFTitle(''); 
    setFContent(''); 
    setMode('EDIT'); 
  };

  const pickNote = (n: Note) => { 
    vibrateLight();
    setSelId(n.id); 
    setFTitle(n.title); 
    setFContent(n.body ?? ''); 
    setMode('PREVIEW'); 
    if (window.innerWidth < 768) {
      setShowLeft(false);
      setShowRight(false);
    }
  };

  const save = () => {
    if (!fTitle.trim()) { vibrateError(); toast('✗ TITLE REQUIRED'); return; }
    vibrateSuccess();
    const now = formatDateKey(new Date());
    const finalTitle = fTitle.trim().toUpperCase();
    
    if (selId && selNote) {
      setData(d => ({
        ...d,
        notes: (d.notes ?? []).map((n) => n.id === selId ? { ...n, title: finalTitle, body: fContent, date: now } : n)
      }));
      toast('✓ NOTE UPDATED');
    } else {
      const nn: Note = { id: `n_${generateId()}`, title: finalTitle, body: fContent, date: now };
      setData(d => ({ ...d, notes: [nn, ...(d.notes ?? [])] }));
      setSelId(nn.id);
      toast('✓ NODE ESTABLISHED');
    }
    setMode('PREVIEW');
  };

  const deleteSelected = () => {
    if (!selId) return;
    vibrateLight();
    setData(d => ({ ...d, notes: (d.notes ?? []).filter(n => n.id !== selId) }));
    setSelId(null);
    toast('✓ NODE PURGED');
  };

  return (
    <div className="absolute inset-0 flex flex-col md:flex-row font-mono bg-black text-foreground overflow-hidden pointer-events-auto z-10 p-2 md:p-4 gap-4">
      
      {/* LEFT PANEL: The Index */}
      <div className={`flex flex-col border border-white/10 bg-black/50 ${showLeft ? 'flex-[0.4] md:flex-[0.3]' : 'hidden md:flex flex-[0.3]'} min-w-[250px] transition-all`}>
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="text-[11px] tracking-[0.3em] uppercase font-bold text-muted-foreground">The Index</div>
          <button onClick={startNew} className="text-primary hover:text-white transition-colors">
            <Plus size={16} />
          </button>
        </div>
        
        <div className="p-3 border-b border-white/5 flex gap-2 items-center bg-black/30">
          <Search size={14} className="text-muted-foreground" />
          <input 
            type="text" 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-[11px] tracking-[0.1em] w-full text-foreground uppercase placeholder:text-muted-foreground/30"
            placeholder="SEARCH ARCHIVES..."
          />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredNotes.length === 0 ? (
            <div className="text-[10px] text-muted-foreground/30 tracking-[0.2em] p-6 text-center uppercase">
              NO NODES FOUND.
            </div>
          ) : (
            filteredNotes.map(n => (
              <button
                key={n.id}
                onClick={() => pickNote(n)}
                className={`w-full text-left p-4 border-b border-white/5 transition-colors group ${
                  selId === n.id ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-white/5 border-l-2 border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[12px] font-bold tracking-[0.1em] uppercase ${selId === n.id ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                    {n.title}
                  </span>
                </div>
                <div className="text-[9px] text-muted-foreground tracking-[0.2em] line-clamp-1 opacity-70">
                  {n.date} • {n.body ? n.body.substring(0, 30) + '...' : 'EMPTY'}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* CENTER PANEL: The Editor/Viewer */}
      <div className={`flex-1 flex flex-col border border-white/10 bg-[#050505] relative ${!showLeft && !showRight && !selId ? 'hidden md:flex' : (showLeft && window.innerWidth < 768) ? 'hidden' : (showRight && window.innerWidth < 768) ? 'hidden' : 'flex'}`}>
        {/* Mobile Header (only visible when Left Panel is hidden) */}
        <div className="md:hidden p-3 border-b border-white/10 flex justify-between bg-white/5">
          <button onClick={() => { setShowLeft(true); setShowRight(false); }} className="text-[10px] tracking-[0.2em] text-primary uppercase">
            &lt; INDEX
          </button>
          <button onClick={() => { setShowRight(true); setShowLeft(false); }} className="text-[10px] tracking-[0.2em] text-primary uppercase">
            NETWORK &gt;
          </button>
        </div>

        {selId || mode === 'EDIT' ? (
          <>
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50 sticky top-0 z-20 backdrop-blur-md">
              <div className="flex items-center gap-2 flex-1 min-w-0 mr-4">
                <button 
                  onClick={() => setShowLeft(!showLeft)}
                  className="hidden md:block text-muted-foreground hover:text-white transition-colors flex-shrink-0"
                  title="Toggle Index"
                >
                  <Search size={14} />
                </button>
                {mode === 'EDIT' ? (
                  <input
                    type="text"
                    value={fTitle}
                    onChange={e => setFTitle(e.target.value.toUpperCase())}
                    className="bg-transparent border-none focus:outline-none text-[16px] md:text-[18px] font-bold tracking-[0.1em] text-primary w-full uppercase placeholder:text-primary/30 truncate"
                    placeholder="NODE TITLE..."
                  />
                ) : (
                  <h1 className="text-[16px] md:text-[18px] font-bold tracking-[0.1em] text-primary uppercase truncate">{fTitle}</h1>
                )}
              </div>
              
              <div className="flex gap-3 md:gap-4 items-center flex-shrink-0">
                {selId && mode === 'PREVIEW' && (
                  <button onClick={() => { vibrateLight(); setMode('EDIT'); }} className="text-muted-foreground hover:text-white transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </button>
                )}
                {mode === 'EDIT' && (
                  <button onClick={save} className="text-[10px] md:text-[11px] tracking-[0.2em] font-bold text-primary hover:text-white transition-colors uppercase border border-primary px-2 md:px-3 py-1">
                    [ SAVE ]
                  </button>
                )}
                {selId && mode === 'EDIT' && (
                  <button onClick={deleteSelected} className="text-destructive hover:text-white transition-colors ml-1 md:ml-2" title="Delete">
                    <Trash2 size={16} />
                  </button>
                )}
                <button 
                  onClick={() => setShowRight(!showRight)}
                  className="hidden md:block text-muted-foreground hover:text-white transition-colors ml-2"
                  title="Toggle Network"
                >
                  <Network size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto no-scrollbar relative">
              {mode === 'EDIT' ? (
                <textarea
                  value={fContent}
                  onChange={e => setFContent(e.target.value)}
                  className="w-full h-full bg-transparent border-none focus:outline-none text-[13px] tracking-wide text-foreground/90 font-mono resize-none leading-loose"
                  placeholder="Initiate data stream... Use [[Title]] to create neural links."
                />
              ) : (
                <MarkdownPreview content={fContent} onLinkClick={navigateToNote} />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30 gap-4">
            <Network size={48} className="text-primary" />
            <div className="text-[11px] tracking-[0.4em] uppercase text-center leading-loose">
              NO NODE SELECTED.<br/>
              AWAITING INPUT...
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL: The Network (Graph / Backlinks) */}
      <div className={`${showRight ? 'flex' : 'hidden'} flex-col flex-[0.35] border border-white/10 bg-black/50 min-w-[250px] transition-all`}>
        {/* Mobile Header */}
        <div className="md:hidden p-3 border-b border-white/10 flex justify-start bg-white/5">
          <button onClick={() => { setShowRight(false); setShowLeft(false); }} className="text-[10px] tracking-[0.2em] text-primary uppercase">
            &lt; BACK TO EDITOR
          </button>
        </div>

        <div className="flex bg-white/5 border-b border-white/10">
          {(['BACKLINKS', 'GRAPH'] as const).map(p => (
            <button
              key={p}
              onClick={() => { vibrateLight(); setRightPanel(p); }}
              className={`flex-1 p-4 text-[10px] tracking-[0.3em] font-bold uppercase transition-colors ${
                rightPanel === p ? 'text-primary bg-white/5 border-b-2 border-primary' : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex-1 p-4 overflow-y-auto no-scrollbar relative">
          {rightPanel === 'GRAPH' && (
            <div className="absolute inset-4">
              <GraphView notes={notes} onNodeClick={navigateToNote} />
            </div>
          )}
          
          {rightPanel === 'BACKLINKS' && (
            <div className="flex flex-col gap-4">
              {!selNote ? (
                <div className="text-[10px] text-muted-foreground/40 tracking-[0.2em] text-center mt-10 uppercase">
                  SELECT A NODE TO VIEW CONNECTIONS
                </div>
              ) : backlinks.length === 0 ? (
                <div className="text-[10px] text-muted-foreground/40 tracking-[0.2em] text-center mt-10 uppercase">
                  0 INCOMING LINKS
                </div>
              ) : (
                <>
                  <div className="text-[10px] text-primary tracking-[0.3em] uppercase font-bold flex items-center gap-2 mb-2">
                    <LinkIcon size={12} /> {backlinks.length} INCOMING LINKS
                  </div>
                  {backlinks.map(b => (
                    <button 
                      key={b.id} 
                      onClick={() => navigateToNote(b.title)}
                      className="text-left p-3 border border-white/10 bg-black/40 hover:border-primary/50 transition-colors group"
                    >
                      <div className="text-[11px] font-bold tracking-[0.1em] text-foreground group-hover:text-primary uppercase mb-1">{b.title}</div>
                      {/* Show snippet of where it's linked */}
                      <div className="text-[9px] text-muted-foreground tracking-[0.1em] line-clamp-2 leading-relaxed opacity-70">
                        {b.body.replace(/\n/g, ' ').substring(0, 80)}...
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
