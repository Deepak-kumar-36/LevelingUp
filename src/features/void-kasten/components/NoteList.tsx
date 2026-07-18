import React, { useState, useMemo } from 'react';
import { Search, Plus, Hash } from 'lucide-react';
import type { Note, NoteLink } from '../../../types';

interface NoteListProps {
  notes: Note[];
  links: NoteLink[];
  onOpen: (id: string) => void;
  onCreate: () => void;
}

export function NoteList({ notes, links, onOpen, onCreate }: NoteListProps) {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach(n => {
      if (n.tags) n.tags.forEach(t => tags.add(t));
    });
    return Array.from(tags).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    let result = notes;
    if (activeTag) {
      result = result.filter(n => n.tags?.includes(activeTag));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      // Ranked search: title match > body match
      const exactTitle = result.filter(n => n.title.toLowerCase() === q);
      const includesTitle = result.filter(n => n.title.toLowerCase().includes(q) && n.title.toLowerCase() !== q);
      const includesBody = result.filter(n => n.body.toLowerCase().includes(q) && !n.title.toLowerCase().includes(q));
      result = [...exactTitle, ...includesTitle, ...includesBody];
    }
    return result;
  }, [notes, search, activeTag]);

  return (
    <div className="h-full flex flex-col p-4 gap-4 animate-in fade-in">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="QUERY ARCHIVE..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/60 border border-white/20 pl-9 pr-4 py-3 text-[12px] tracking-[0.1em] text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50 uppercase"
          />
        </div>
        <button
          onClick={onCreate}
          className="bg-primary/10 border border-primary text-primary px-6 py-3 flex items-center justify-center gap-2 text-[11px] font-bold tracking-[0.2em] hover:bg-primary hover:text-black transition-colors uppercase shrink-0"
        >
          <Plus size={14} /> NEW_RECORD
        </button>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeTag && (
            <button
              onClick={() => setActiveTag(null)}
              className="text-[9px] border border-white/20 px-2 py-1 tracking-[0.1em] hover:bg-white/10 uppercase"
            >
              [CLEAR_FILTER]
            </button>
          )}
          {allTags.map(t => (
            <button
              key={t}
              onClick={() => setActiveTag(t === activeTag ? null : t)}
              className={`text-[9px] border px-2 py-1 tracking-[0.1em] uppercase flex items-center gap-1 transition-colors ${
                t === activeTag ? 'border-primary text-primary bg-primary/10' : 'border-white/10 text-muted-foreground hover:border-white/30 hover:text-foreground'
              }`}
            >
              <Hash size={10} /> {t}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2">
        {filteredNotes.length === 0 ? (
          <div className="text-center mt-20 text-[10px] text-muted-foreground/30 tracking-[0.3em] uppercase">
            NO RECORDS MATCH QUERY
          </div>
        ) : (
          filteredNotes.map(note => {
            const incoming = links.filter(l => l.targetNoteId === note.id).length;
            const outgoing = links.filter(l => l.sourceNoteId === note.id).length;
            return (
              <button
                key={note.id}
                onClick={() => onOpen(note.id)}
                className="flex flex-col border border-white/5 bg-black/40 p-4 hover:border-primary/50 hover:bg-white/5 transition-all text-left group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[13px] font-bold text-primary group-hover:text-white transition-colors tracking-[0.1em] uppercase">
                    {note.title}
                  </span>
                  <span className="text-[9px] text-muted-foreground tracking-[0.2em]">
                    {new Date(note.updatedAt || 0).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed opacity-70 mb-3">
                  {note.body.substring(0, 150) || 'EMPTY_RECORD_DATA'}
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex gap-2">
                    {(note.tags || []).slice(0, 3).map(t => (
                      <span key={t} className="text-[9px] text-primary/70 tracking-[0.1em] uppercase">#{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-3 text-[9px] text-muted-foreground tracking-[0.2em]">
                    <span title="Outgoing Links">OUT:{outgoing}</span>
                    <span title="Incoming Signals">IN:{incoming}</span>
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  );
}
