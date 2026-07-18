import { useState, useMemo } from 'react';
import { useAppStore, generateId } from '../../store/useAppStore';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { GraphView } from './components/GraphView';
import { vibrateLight } from '../../lib/haptics';
import type { Note } from '../../types';
import { ArrowLeft } from 'lucide-react';

export interface VoidKastenProps {
  onXpEvent?: (event: 'note_created' | 'link_created' | 'daily_note_streak', payload?: any) => void;
}

type TabState = 'LIST' | 'EDITOR' | 'GRAPH';

export function VoidKasten({ onXpEvent }: VoidKastenProps) {
  const { data, setData } = useAppStore();
  const notes = data.notes || [];
  const links = data.links || [];
  
  const [activeTab, setActiveTab] = useState<TabState>('LIST');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const activeNote = useMemo(() => notes.find(n => n.id === activeNoteId), [notes, activeNoteId]);

  const handleCreateNote = (initialTitle: string = '') => {
    const id = 'note_' + generateId();
    const newNote: Note = {
      id,
      title: initialTitle || 'UNTITLED_RECORD',
      body: '',
      date: new Date().toISOString(),
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    setData(d => ({
      ...d,
      notes: [newNote, ...(d.notes || [])]
    }));
    
    if (onXpEvent) onXpEvent('note_created');
    
    setActiveNoteId(id);
    setActiveTab('EDITOR');
    vibrateLight();
  };

  const handleOpenNote = (id: string) => {
    setActiveNoteId(id);
    setActiveTab('EDITOR');
    vibrateLight();
  };

  const goBack = () => {
    setActiveTab('LIST');
    vibrateLight();
  };

  return (
    <div className="absolute inset-0 flex flex-col font-mono bg-[#050505] text-foreground p-2 md:p-4 pb-20 overflow-hidden pointer-events-auto z-10">
      <div className="flex-1 overflow-y-auto no-scrollbar relative min-h-0 border border-white/5 bg-black/40">
        
        {activeTab === 'LIST' && (
          <NoteList 
            notes={notes} 
            links={links}
            onOpen={handleOpenNote} 
            onCreate={handleCreateNote} 
            onOpenGraph={() => { setActiveTab('GRAPH'); vibrateLight(); }}
          />
        )}
        
        {activeTab === 'EDITOR' && (
          activeNote ? (
            <div className="h-full flex flex-col relative">
              <div className="flex items-center px-4 py-3 border-b border-white/10 bg-black/60 shrink-0">
                <button onClick={goBack} className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors uppercase">
                  <ArrowLeft size={14} /> BACK
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <NoteEditor 
                  key={activeNote.id}
                  note={activeNote} 
                  notes={notes}
                  links={links}
                  setData={setData}
                  onXpEvent={onXpEvent}
                  onOpenNote={handleOpenNote}
                  onCreateNote={handleCreateNote}
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center flex-col gap-4">
              <span className="text-muted-foreground/30 text-[10px] tracking-[0.3em] uppercase">NO ACTIVE CONNECTION</span>
              <button onClick={() => handleCreateNote()} className="border border-primary text-primary px-6 py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-primary hover:text-black font-bold transition-colors">
                INITIALIZE RECORD
              </button>
              <button onClick={goBack} className="text-[10px] text-muted-foreground mt-4 hover:text-white underline decoration-dashed">
                RETURN TO DATABASE
              </button>
            </div>
          )
        )}
        
        {activeTab === 'GRAPH' && (
          <div className="h-full flex flex-col relative">
             <div className="absolute top-4 left-4 z-50">
                <button onClick={goBack} className="flex items-center gap-2 text-[10px] tracking-[0.2em] bg-black/80 border border-primary/30 px-3 py-2 text-primary hover:bg-primary hover:text-black transition-colors uppercase">
                  <ArrowLeft size={14} /> RETURN
                </button>
             </div>
             <GraphView 
              notes={notes} 
              links={links} 
              onNodeClick={handleOpenNote}
            />
          </div>
        )}
      </div>
    </div>
  );
}
