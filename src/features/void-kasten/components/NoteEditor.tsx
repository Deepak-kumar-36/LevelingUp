import React, { useState, useRef } from 'react';
import { extractLinks, extractTags } from '../utils/markdown';
import { generateId } from '../../../store/useAppStore';
import type { Note, NoteLink, AppState } from '../../../types';
import { Eye, Edit2, Link as LinkIcon, Trash2 } from 'lucide-react';
import { vibrateLight, vibrateSuccess } from '../../../lib/haptics';

interface NoteEditorProps {
  note: Note;
  notes: Note[];
  links: NoteLink[];
  setData: (updater: (prev: AppState) => AppState) => void;
  onXpEvent?: (event: 'note_created' | 'link_created' | 'daily_note_streak', payload?: any) => void;
  onOpenNote: (id: string) => void;
  onCreateNote: (title: string) => void;
}

export function NoteEditor({ note, notes, links, setData, onXpEvent, onOpenNote, onCreateNote }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [mode, setMode] = useState<'EDIT' | 'PREVIEW'>('EDIT');
  
  // Link Autocomplete state
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [autoCompleteQuery, setAutoCompleteQuery] = useState('');
  const [cursorPos, setCursorPos] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);



  // Backlinks
  const incomingLinks = links.filter(l => l.targetNoteId === note.id);
  const incomingNotes = incomingLinks
    .map(l => notes.find(n => n.id === l.sourceNoteId))
    .filter((n): n is Note => n !== undefined);

  // Save changes
  const saveChanges = (newTitle: string, newBody: string) => {
    const extractedTargets = extractLinks(newBody);
    const newTags = extractTags(newBody);
    
    let linkCreated = false;

    setData(d => {
      const prevNotes = d.notes || [];
      const prevLinks = d.links || [];
      
      // Target Note IDs
      const targetIds = extractedTargets.map(t => {
        const existing = prevNotes.find(n => n.title.toUpperCase() === t.toUpperCase());
        return existing ? existing.id : null;
      }).filter((id): id is string => id !== null);

      // Current links from this note
      const existingOutgoing = prevLinks.filter(l => l.sourceNoteId === note.id);
      
      // Determine links to add
      const linksToAdd: NoteLink[] = [];
      targetIds.forEach(tId => {
        if (!existingOutgoing.find(l => l.targetNoteId === tId)) {
          linksToAdd.push({
            id: 'link_' + generateId(),
            sourceNoteId: note.id,
            targetNoteId: tId,
            createdAt: Date.now()
          });
          linkCreated = true;
        }
      });

      // Determine links to keep (remove deleted links)
      const linksToKeep = prevLinks.filter(l => {
        if (l.sourceNoteId !== note.id) return true; // keep other notes' links
        return targetIds.includes(l.targetNoteId); // keep if still in text
      });

      const updatedLinks = [...linksToKeep, ...linksToAdd];
      
      const updatedNotes = prevNotes.map(n => 
        n.id === note.id 
          ? { ...n, title: newTitle, body: newBody, tags: newTags, updatedAt: Date.now() } 
          : n
      );

      return { ...d, notes: updatedNotes, links: updatedLinks };
    });

    if (linkCreated && onXpEvent) {
      onXpEvent('link_created');
      vibrateSuccess();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    saveChanges(e.target.value, body);
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setBody(val);
    saveChanges(title, val);
    
    // Autocomplete Logic
    const pos = e.target.selectionStart;
    setCursorPos(pos);
    const textBeforeCursor = val.substring(0, pos);
    const match = textBeforeCursor.match(/\[\[([^\]]*)$/);
    if (match) {
      setShowAutoComplete(true);
      setAutoCompleteQuery(match[1]);
    } else {
      setShowAutoComplete(false);
    }
  };

  const insertLink = (targetTitle: string, isNew: boolean) => {
    if (isNew) {
      onCreateNote(targetTitle);
      return;
    }
    
    const textBefore = body.substring(0, cursorPos);
    const textAfter = body.substring(cursorPos);
    
    const match = textBefore.match(/\[\[([^\]]*)$/);
    if (match) {
      const newTextBefore = textBefore.substring(0, match.index) + `[[${targetTitle}]]`;
      const newBody = newTextBefore + textAfter;
      setBody(newBody);
      saveChanges(title, newBody);
      setShowAutoComplete(false);
      
      // Reset focus
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newPos = newTextBefore.length;
          textareaRef.current.setSelectionRange(newPos, newPos);
        }
      }, 0);
    }
  };

  const handleDelete = () => {
    vibrateLight();
    setData(d => ({
      ...d,
      notes: (d.notes || []).filter(n => n.id !== note.id),
      links: (d.links || []).filter(l => l.sourceNoteId !== note.id && l.targetNoteId !== note.id)
    }));
  };

  // Preview Renderer
  const renderPreviewLine = (line: string, i: number) => {
    const parts = line.split(/(\[\[.*?\]\]|\*\*.*?\*\*|#[a-zA-Z0-9_-]+)/g);
    return (
      <div key={i} className="min-h-[1.5em]">
        {parts.map((part, j) => {
          if (part.startsWith('[[') && part.endsWith(']]')) {
            const linkTitle = part.slice(2, -2).trim();
            const targetNote = notes.find(n => n.title.toUpperCase() === linkTitle.toUpperCase());
            return (
              <span 
                key={j} 
                onClick={() => targetNote ? onOpenNote(targetNote.id) : onCreateNote(linkTitle)}
                className={`cursor-pointer font-bold transition-all ${targetNote ? 'text-primary hover:text-white glow-text' : 'text-muted-foreground underline decoration-dashed'}`}
              >
                {part}
              </span>
            );
          }
          if (part.startsWith('**') && part.endsWith('**')) {
            return <span key={j} className="font-bold text-white">{part.slice(2, -2)}</span>;
          }
          if (part.startsWith('#') && part.length > 1) {
            return <span key={j} className="text-primary/80">{part}</span>;
          }
          return <span key={j} className="opacity-80">{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col relative animate-in fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-white/10 shrink-0 bg-black/60">
        <input 
          value={title}
          onChange={handleTitleChange}
          className="bg-transparent text-[18px] md:text-[20px] font-bold text-primary tracking-[0.2em] focus:outline-none uppercase w-full mr-4 placeholder:text-primary/30"
          placeholder="UNTITLED_RECORD"
        />
        <div className="flex gap-2">
          <button onClick={() => setMode(mode === 'EDIT' ? 'PREVIEW' : 'EDIT')} className="p-2 text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors">
            {mode === 'EDIT' ? <Eye size={16} /> : <Edit2 size={16} />}
          </button>
          <button onClick={handleDelete} className="p-2 text-muted-foreground hover:text-destructive hover:bg-white/5 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Editor / Preview Area */}
      <div className="flex-1 overflow-y-auto relative p-4 group">
        {mode === 'EDIT' ? (
          <>
            <textarea
              ref={textareaRef}
              value={body}
              onChange={handleBodyChange}
              className="w-full h-full bg-transparent resize-none focus:outline-none text-[13px] md:text-[14px] leading-relaxed tracking-wide placeholder:text-white/10 font-mono"
              placeholder="BEGIN DATA ENTRY... USE [[LINK]] FOR CONNECTIONS, #TAG FOR INDEXING."
            />
            {/* Blinking terminal cursor effect on focus handled natively, but we ensure styling is monospaced */}
            
            {/* Autocomplete Popup */}
            {showAutoComplete && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] p-2 w-64 z-50">
                <div className="text-[9px] text-primary mb-2 tracking-[0.2em]">AVAILABLE CONNECTIONS</div>
                <div className="max-h-48 overflow-y-auto flex flex-col gap-1">
                  {notes
                    .filter(n => n.id !== note.id && n.title.toLowerCase().includes(autoCompleteQuery.toLowerCase()))
                    .slice(0, 5)
                    .map(n => (
                      <button 
                        key={n.id} 
                        onClick={() => insertLink(n.title, false)}
                        className="text-left text-[11px] p-2 hover:bg-primary/20 hover:text-primary transition-colors uppercase truncate"
                      >
                        {n.title}
                      </button>
                    ))
                  }
                  {autoCompleteQuery.trim() && !notes.find(n => n.title.toLowerCase() === autoCompleteQuery.trim().toLowerCase()) && (
                    <button 
                      onClick={() => insertLink(autoCompleteQuery.trim(), true)}
                      className="text-left text-[11px] p-2 text-primary border-t border-white/10 hover:bg-white/5 transition-colors uppercase mt-1 flex items-center gap-2"
                    >
                      <Plus size={12} /> CREATE "{autoCompleteQuery}"
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex flex-col gap-1 text-[13px] md:text-[14px] leading-relaxed tracking-wide font-mono">
            {body.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-[20px] font-bold text-primary tracking-[0.1em] mt-4 mb-2 uppercase">{renderPreviewLine(line.substring(2), i)}</h1>;
              if (line.startsWith('## ')) return <h2 key={i} className="text-[16px] font-bold text-white tracking-[0.1em] mt-3 mb-1 uppercase">{renderPreviewLine(line.substring(3), i)}</h2>;
              if (line.startsWith('> ')) return <div key={i} className="border-l-2 border-primary/50 pl-4 py-1 my-2 text-muted-foreground italic">{renderPreviewLine(line.substring(2), i)}</div>;
              if (line.trim() === '') return <div key={i} className="h-4" />;
              return renderPreviewLine(line, i);
            })}
          </div>
        )}
      </div>

      {/* Backlinks Panel (Incoming Signals) */}
      <div className="border-t border-white/10 bg-black/80 p-4 shrink-0 max-h-48 overflow-y-auto">
        <div className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
          <LinkIcon size={12} /> INCOMING SIGNALS ({incomingNotes.length})
        </div>
        {incomingNotes.length === 0 ? (
          <div className="text-[10px] opacity-30 italic tracking-[0.1em]">NO EXTERNAL CONNECTIONS DETECTED</div>
        ) : (
          <div className="flex flex-col gap-2">
            {incomingNotes.map(inNote => (
              <button 
                key={inNote.id}
                onClick={() => onOpenNote(inNote.id)}
                className="text-left text-[11px] text-primary hover:text-white hover:bg-white/5 p-2 border border-white/5 transition-all truncate"
              >
                [[{inNote.title}]]
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
