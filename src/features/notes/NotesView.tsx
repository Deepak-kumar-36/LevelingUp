import { useState } from 'react';
import { useAppStore, generateId } from '../../store/useAppStore';
import type { Note } from '../../types';
import { Plus, FileText, ChevronLeft, Calendar as CalendarIcon, Trash2 } from 'lucide-react';

export function NotesView({ toast }: { toast: (msg: string) => void }) {
  const { data, setData } = useAppStore();
  const notes = data.notes || [];
  
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  const createNote = () => {
    const id = 'note_' + generateId();
    const newNote: Note = {
      id,
      title: 'Untitled',
      body: '',
      date: new Date().toISOString(),
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    setData(d => ({ ...d, notes: [newNote, ...(d.notes || [])] }));
    setActiveNoteId(id);
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setData(d => ({ ...d, notes: (d.notes || []).filter(n => n.id !== id) }));
    if (activeNoteId === id) setActiveNoteId(null);
    toast('Note deleted');
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setData(d => ({
      ...d,
      notes: (d.notes || []).map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n)
    }));
  };

  if (activeNote) {
    const dateObj = new Date(activeNote.createdAt || activeNote.date);
    return (
      <div className="flex flex-col h-[calc(100vh-6rem)] fade-in">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setActiveNoteId(null)} 
            className="p-2 hover:bg-surface rounded-lg transition-colors text-foreground-muted hover:text-foreground"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-[14px] text-foreground-muted flex items-center gap-2">
            <CalendarIcon size={14} />
            {dateObj.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 md:px-0">
          <input
            type="text"
            value={activeNote.title}
            onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
            placeholder="Note title"
            className="w-full text-4xl font-semibold text-foreground bg-transparent border-none outline-none mb-8 placeholder:text-foreground-muted/30"
          />
          <textarea
            value={activeNote.body}
            onChange={(e) => updateNote(activeNote.id, { body: e.target.value })}
            placeholder="Start writing..."
            className="w-full flex-1 text-[16px] leading-relaxed text-foreground bg-transparent border-none outline-none resize-none placeholder:text-foreground-muted/30"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Notes</h1>
          <p className="text-[14px] text-foreground-muted mt-1">Your personal knowledge base</p>
        </div>
        <button
          onClick={createNote}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          New note
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="text-[14px] text-foreground-muted bg-surface p-12 rounded-lg border border-border text-center flex flex-col items-center">
          <FileText size={32} className="mb-4 opacity-50" />
          <p>No notes yet.</p>
          <p className="text-[13px] mt-1 opacity-75">Start writing to capture your thoughts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {notes.map(note => {
            const preview = note.body.slice(0, 100) + (note.body.length > 100 ? '...' : '');
            const date = new Date(note.createdAt || note.date).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
            
            return (
              <div 
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group relative flex flex-col h-[180px]"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => deleteNote(note.id, e)} className="p-1.5 text-foreground-muted hover:text-error hover:bg-error-muted rounded-md transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <h3 className="text-[15px] font-medium text-foreground mb-2 pr-8 truncate">
                  {note.title || 'Untitled'}
                </h3>
                
                <p className="text-[13px] text-foreground-secondary leading-relaxed line-clamp-4 flex-1 whitespace-pre-wrap">
                  {preview || <span className="italic opacity-50">Empty note...</span>}
                </p>
                
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-[11px] text-foreground-muted">
                  <span className="flex items-center gap-1.5"><CalendarIcon size={12} /> {date}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
