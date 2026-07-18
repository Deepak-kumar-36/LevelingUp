import React, { useState, useMemo } from 'react';
import { useAppStore, generateId } from '../../store/useAppStore';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { GraphView } from './components/GraphView';
import { vibrateLight } from '../../lib/haptics';
import { Database, Network, PenTool } from 'lucide-react';
import type { Note } from '../../types';

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
      date: new Date().toISOString(), // legacy fallback
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

  return (
    <div className="absolute inset-0 flex flex-col font-mono bg-[#050505] text-foreground p-2 md:p-4 pb-20 overflow-hidden pointer-events-auto z-10">
      
      {/* Module Header / Tabs */}
      <div className="flex bg-black/60 border border-primary/20 mb-4 sticky top-0 z-20 shrink-0">
        <button
          onClick={() => { setActiveTab('LIST'); vibrateLight(); }}
          className={`flex-1 py-3 text-[10px] md:text-[11px] tracking-[0.2em] font-bold uppercase transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'LIST' ? 'text-primary bg-primary/10 border-b-2 border-primary glow-text' : 'text-muted-foreground hover:bg-white/5'
          }`}
        >
          <Database size={14} /> ARCHIVE
        </button>
        <button
          onClick={() => { 
            if (activeNoteId) setActiveTab('EDITOR');
            else handleCreateNote();
            vibrateLight(); 
          }}
          className={`flex-1 py-3 text-[10px] md:text-[11px] tracking-[0.2em] font-bold uppercase transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'EDITOR' ? 'text-primary bg-primary/10 border-b-2 border-primary glow-text' : 'text-muted-foreground hover:bg-white/5'
          }`}
        >
          <PenTool size={14} /> TERMINAL
        </button>
        <button
          onClick={() => { setActiveTab('GRAPH'); vibrateLight(); }}
          className={`flex-1 py-3 text-[10px] md:text-[11px] tracking-[0.2em] font-bold uppercase transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'GRAPH' ? 'text-primary bg-primary/10 border-b-2 border-primary glow-text' : 'text-muted-foreground hover:bg-white/5'
          }`}
        >
          <Network size={14} /> NEURAL WEB
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar relative min-h-0 border border-white/5 bg-black/40">
        {activeTab === 'LIST' && (
          <NoteList 
            notes={notes} 
            links={links}
            onOpen={handleOpenNote} 
            onCreate={handleCreateNote} 
          />
        )}
        
        {activeTab === 'EDITOR' && (
          activeNote ? (
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
          ) : (
            <div className="h-full flex items-center justify-center flex-col gap-4">
              <span className="text-muted-foreground/30 text-[10px] tracking-[0.3em] uppercase">NO ACTIVE CONNECTION</span>
              <button onClick={() => handleCreateNote()} className="border border-primary text-primary px-6 py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-primary hover:text-black font-bold transition-colors">
                INITIALIZE RECORD
              </button>
            </div>
          )
        )}
        
        {activeTab === 'GRAPH' && (
          <GraphView 
            notes={notes} 
            links={links} 
            onNodeClick={handleOpenNote}
          />
        )}
      </div>

    </div>
  );
}
