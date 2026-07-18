import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useAppStore, formatDateKey, generateId } from '../../store/useAppStore';
import { vibrateLight, vibrateSuccess, vibrateError } from '../../lib/haptics';
import type { Note } from '../../types';
import { Search, Plus, Edit2, Network, Link as LinkIcon, Trash2, Download, Upload } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ForceGraph2D from 'react-force-graph-2d';
import JSZip from 'jszip';

// --- Markdown Rendering ---
const WikiLinkMarkdown = ({ content, onLinkClick }: { content: string, onLinkClick: (t: string) => void }) => {
  const processed = useMemo(() => {
    return content.replace(/\[\[(.*?)\]\]/g, '[$1](wikilink:$1)');
  }, [content]);

  return (
    <div className="font-mono text-[13px] leading-loose text-foreground/90 break-words max-w-none
      [&>p]:mb-4 
      [&>h1]:text-[20px] [&>h1]:font-bold [&>h1]:text-primary [&>h1]:mb-4 [&>h1]:tracking-[0.1em] [&>h1]:uppercase
      [&>h2]:text-[16px] [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:tracking-[0.1em] [&>h2]:uppercase
      [&>h3]:text-[14px] [&>h3]:font-bold [&>h3]:mb-2
      [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul>li]:pl-2
      [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 
      [&>blockquote]:border-l-2 [&>blockquote]:border-primary/50 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-muted-foreground [&>blockquote]:my-4
      [&>pre]:bg-black/60 [&>pre]:p-4 [&>pre]:border [&>pre]:border-white/10 [&>pre]:overflow-x-auto [&>pre]:mb-4
      [&_code]:bg-white/5 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-primary
      [&>table]:w-full [&>table]:mb-4 [&>table]:border-collapse [&_th]:border [&_th]:border-white/10 [&_th]:p-2 [&_th]:bg-black/50 [&_td]:border [&_td]:border-white/10 [&_td]:p-2
    ">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ ...props }) => {
            if (props.href?.startsWith('wikilink:')) {
              const link = props.href.replace('wikilink:', '').toUpperCase();
              return (
                <span 
                  onClick={() => onLinkClick(link)}
                  className="text-primary cursor-pointer font-bold transition-all hover:text-white hover:underline text-glow"
                >
                  [[{props.children}]]
                </span>
              );
            }
            return <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline" />;
          }
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
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
  const [showRight, setShowRight] = useState(false);
  
  const [graphDim, setGraphDim] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const graphContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!graphContainerRef.current) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setGraphDim({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    ro.observe(graphContainerRef.current);
    return () => ro.disconnect();
  }, [rightPanel]);

  const selNote = notes.find(n => n.id === selId);

  // Parse links for backlinks and graph
  const extractLinks = useCallback((text: string) => {
    const regex = /\[\[(.*?)\]\]/g;
    const links: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      links.push(match[1].trim().toUpperCase());
    }
    return [...new Set(links)];
  }, []);

  const filteredNotes = useMemo(() => {
    const q = search.toLowerCase();
    return notes.filter(n => !q || n.title.toLowerCase().includes(q) || (n.body ?? '').toLowerCase().includes(q))
                .sort((a, b) => b.date.localeCompare(a.date));
  }, [notes, search]);

  const backlinks = useMemo(() => {
    if (!selNote) return [];
    return notes.filter(n => n.id !== selNote.id && extractLinks(n.body).includes(selNote.title));
  }, [notes, selNote, extractLinks]);

  // Graph Data structure for react-force-graph-2d
  const graphData = useMemo(() => {
    const nodes = notes.map(n => ({ id: n.id, name: n.title }));
    const links: { source: string, target: string }[] = [];
    notes.forEach(n => {
      const extracted = extractLinks(n.body);
      extracted.forEach(l => {
        const target = notes.find(x => x.title === l);
        if (target) links.push({ source: n.id, target: target.id });
      });
    });
    return { nodes, links };
  }, [notes, extractLinks]);

  const navigateToNote = useCallback((title: string) => {
    vibrateLight();
    const existing = notes.find(n => n.title === title);
    if (existing) {
      setSelId(existing.id);
      setFTitle(existing.title);
      setFContent(existing.body);
      setMode('PREVIEW');
    } else {
      const nn: Note = { id: `n_${generateId()}`, title: title, body: '', date: formatDateKey(new Date()) };
      setData(d => ({ ...d, notes: [nn, ...(d.notes ?? [])] }));
      setSelId(nn.id);
      setFTitle(title);
      setFContent('');
      setMode('EDIT');
      toast(`✓ NEW NODE CREATED: ${title}`);
    }
    // Auto-switch to editor view on mobile
    if (window.innerWidth < 768) {
      setShowLeft(false);
      setShowRight(false);
    }
  }, [notes, setData, toast]);

  const startNew = () => { 
    vibrateLight();
    setSelId(null); 
    setFTitle(''); 
    setFContent(''); 
    setMode('EDIT'); 
    if (window.innerWidth < 768) {
      setShowLeft(false);
      setShowRight(false);
    }
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

  // --- Storage Functions ---
  const exportVault = async () => {
    vibrateLight();
    try {
      const zip = new JSZip();
      notes.forEach(n => {
        const safeTitle = n.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        zip.file(`${safeTitle}.md`, n.body || '');
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `void_vault_${formatDateKey(new Date())}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast('✓ VAULT EXPORTED');
    } catch {
      toast('✗ EXPORT FAILED');
    }
  };

  const importFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    vibrateLight();
    const files = Array.from(e.target.files);
    let imported = 0;
    const newNotes: Note[] = [];
    
    for (const file of files) {
      if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        const text = await file.text();
        const title = file.name.replace(/\.(md|txt)$/, '').toUpperCase();
        
        // Skip if title already exists to prevent pure duplicates, or append
        newNotes.push({
          id: `n_${generateId()}`,
          title: title,
          body: text,
          date: formatDateKey(new Date())
        });
        imported++;
      }
    }
    
    if (imported > 0) {
      setData(d => ({ ...d, notes: [...newNotes, ...(d.notes ?? [])] }));
      vibrateSuccess();
      toast(`✓ IMPORTED ${imported} NODES`);
    }
    e.target.value = '';
  };

  return (
    <div className="absolute inset-0 flex flex-col md:flex-row font-mono bg-black text-foreground overflow-hidden pointer-events-auto z-10 p-2 md:p-4 gap-4">
      
      {/* LEFT PANEL: The Index */}
      <div className={`flex flex-col border border-white/10 bg-black/50 ${showLeft ? 'flex-[0.4] md:flex-[0.3]' : 'hidden md:flex flex-[0.3]'} min-w-[250px] transition-all`}>
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="text-[11px] tracking-[0.3em] uppercase font-bold text-muted-foreground">The Index</div>
          <div className="flex gap-3">
            <button onClick={() => fileInputRef.current?.click()} className="text-muted-foreground hover:text-white transition-colors" title="Import .md files">
              <Upload size={14} />
            </button>
            <input type="file" ref={fileInputRef} onChange={importFiles} multiple accept=".md,.txt" className="hidden" />
            <button onClick={exportVault} className="text-muted-foreground hover:text-white transition-colors" title="Export Vault as .zip">
              <Download size={14} />
            </button>
            <button onClick={startNew} className="text-primary hover:text-white transition-colors ml-1" title="New Note">
              <Plus size={16} />
            </button>
          </div>
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
                  <span className={`text-[12px] font-bold tracking-[0.1em] uppercase truncate ${selId === n.id ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
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
        
        <div className="md:hidden p-3 border-b border-white/10 flex justify-between bg-white/5">
          <button onClick={() => { setShowLeft(true); setShowRight(false); }} className="text-[10px] tracking-[0.2em] text-primary uppercase flex items-center gap-1">
            &lt; INDEX
          </button>
          <button onClick={() => { setShowRight(true); setShowLeft(false); }} className="text-[10px] tracking-[0.2em] text-primary uppercase flex items-center gap-1">
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
            
            <div className="flex-1 p-4 md:p-8 overflow-y-auto no-scrollbar relative">
              {mode === 'EDIT' ? (
                <textarea
                  value={fContent}
                  onChange={e => setFContent(e.target.value)}
                  className="w-full h-full bg-transparent border-none focus:outline-none text-[14px] tracking-wide text-foreground/90 font-mono resize-none leading-loose"
                  placeholder="Initiate data stream... Use [[Title]] to create neural links. Markdown supported."
                />
              ) : (
                <WikiLinkMarkdown content={fContent} onLinkClick={navigateToNote} />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30 gap-4 p-4 text-center">
            <Network size={48} className="text-primary" />
            <div className="text-[11px] tracking-[0.4em] uppercase leading-loose">
              NO NODE SELECTED.<br/>
              AWAITING INPUT...
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL: The Network (Graph / Backlinks) */}
      <div className={`${showRight ? 'flex' : 'hidden'} flex-col flex-[0.35] border border-white/10 bg-black/50 min-w-[250px] transition-all`}>
        <div className="md:hidden p-3 border-b border-white/10 flex justify-start bg-white/5">
          <button onClick={() => { setShowRight(false); setShowLeft(false); }} className="text-[10px] tracking-[0.2em] text-primary uppercase">
            &lt; BACK TO EDITOR
          </button>
        </div>

        <div className="flex bg-white/5 border-b border-white/10 shrink-0">
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

        <div className="flex-1 overflow-hidden relative bg-[#0a0a0a]" ref={graphContainerRef}>
          {rightPanel === 'GRAPH' && (
            <div className="absolute inset-0">
              {graphDim.width > 0 && graphDim.height > 0 && (
                <ForceGraph2D
                  width={graphDim.width}
                  height={graphDim.height}
                  graphData={graphData}
                  nodeLabel="name"
                  nodeColor={() => '#4ade80'}
                  linkColor={() => 'rgba(255,255,255,0.2)'}
                  backgroundColor="#0a0a0a"
                  onNodeClick={(node) => navigateToNote(node.name as string)}
                  nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.name as string;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px monospace`;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    // Draw dot
                    ctx.beginPath();
                    ctx.arc(node.x as number, node.y as number, 4 / globalScale, 0, 2 * Math.PI, false);
                    ctx.fillStyle = '#4ade80';
                    ctx.fill();
                    
                    // Draw text
                    ctx.fillText(label, node.x as number, (node.y as number) + (8 / globalScale));
                  }}
                />
              )}
            </div>
          )}
          
          {rightPanel === 'BACKLINKS' && (
            <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto no-scrollbar">
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
                      className="text-left p-3 border border-white/10 bg-black/40 hover:border-primary/50 transition-colors group rounded-sm"
                    >
                      <div className="text-[11px] font-bold tracking-[0.1em] text-foreground group-hover:text-primary uppercase mb-1 truncate">{b.title}</div>
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
