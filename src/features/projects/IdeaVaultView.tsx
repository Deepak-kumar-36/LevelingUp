import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { Idea, Project } from '../../types';
import { Plus, Lightbulb, Trash2, ArrowUpRight } from 'lucide-react';

export function IdeaVaultView() {
  const { data, setData } = useAppStore();
  const ideas = data.ideas || [];

  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<Idea['status']>('Inbox');

  const addIdea = () => {
    if (!title.trim()) return;
    const i: Idea = {
      id: 'i_' + Date.now().toString(36),
      title: title.trim(),
      description: desc.trim(),
      category: category.trim(),
      status,
      createdAt: Date.now()
    };
    
    setData(d => ({ ...d, ideas: [i, ...(d.ideas || [])] }));
    setShowForm(false);
    resetForm();
  };

  const deleteIdea = (id: string) => {
    setData(d => ({ ...d, ideas: (d.ideas || []).filter(x => x.id !== id) }));
  };

  const updateStatus = (id: string, newStatus: Idea['status']) => {
    setData(d => ({
      ...d,
      ideas: (d.ideas || []).map(i => i.id === id ? { ...i, status: newStatus } : i)
    }));
  };

  const promoteToProject = (idea: Idea) => {
    const p: Project = {
      id: 'p_' + Date.now().toString(36),
      name: idea.title,
      description: idea.description,
      status: 'Planning',
      priority: 'Medium',
      category: idea.category,
      createdAt: Date.now()
    };
    
    setData(d => ({ 
      ...d, 
      projects: [p, ...(d.projects || [])],
      ideas: (d.ideas || []).map(i => i.id === idea.id ? { ...i, status: 'Promoted' } : i)
    }));
  };

  const resetForm = () => {
    setTitle(''); setDesc(''); setCategory(''); setStatus('Inbox');
  };

  // Group by status
  const grouped = {
    'Inbox': ideas.filter(i => i.status === 'Inbox'),
    'Exploring': ideas.filter(i => i.status === 'Exploring'),
    'Maybe Later': ideas.filter(i => i.status === 'Maybe Later'),
    'Archived & Promoted': ideas.filter(i => i.status === 'Archived' || i.status === 'Promoted')
  };

  return (
    <div className="flex flex-col gap-10 fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Idea Vault</h1>
          <p className="text-[14px] text-foreground-muted mt-1">Capture ideas without commitments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          New idea
        </button>
      </div>

      {ideas.length === 0 ? (
        <div className="text-[14px] text-foreground-muted bg-surface p-12 rounded-lg border border-border text-center flex flex-col items-center">
          <Lightbulb size={32} className="mb-4 opacity-50" />
          <p>Your vault is empty.</p>
          <p className="text-[13px] mt-1 opacity-75">Dump your thoughts here before they become tasks.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {Object.entries(grouped).map(([groupName, groupIdeas]) => {
            if (groupIdeas.length === 0) return null;
            return (
              <section key={groupName}>
                <h2 className="text-[12px] font-semibold text-foreground-muted uppercase tracking-wider mb-4">
                  {groupName} · {groupIdeas.length}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {groupIdeas.map(i => (
                    <div key={i.id} className="bg-card border border-border rounded-lg p-5 flex flex-col group relative">
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        {i.status !== 'Promoted' && (
                          <button onClick={() => promoteToProject(i)} className="text-foreground-muted hover:text-primary p-1" title="Promote to Project">
                            <ArrowUpRight size={14} />
                          </button>
                        )}
                        <select 
                          value={i.status}
                          onChange={(e) => updateStatus(i.id, e.target.value as Idea['status'])}
                          className="text-[11px] bg-surface border-none rounded px-2 py-1 outline-none cursor-pointer"
                        >
                          <option>Inbox</option>
                          <option>Exploring</option>
                          <option>Maybe Later</option>
                          <option>Promoted</option>
                          <option>Archived</option>
                        </select>
                        <button onClick={() => deleteIdea(i.id)} className="text-foreground-muted hover:text-error p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="pr-16 mb-3">
                        <h3 className="text-[14px] font-medium text-foreground">{i.title}</h3>
                        {i.description && <p className="text-[13px] text-foreground-muted mt-1 line-clamp-3">{i.description}</p>}
                      </div>

                      <div className="mt-auto pt-4 flex items-center gap-2">
                        {i.category && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md border border-border text-foreground-secondary">
                            {i.category}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg flex flex-col gap-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-[16px] font-semibold text-foreground mb-2">Capture idea</h3>
            
            <div>
              <label className="text-[12px] text-foreground-muted mb-1.5 block">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-[14px] bg-background" autoFocus />
            </div>
            <div>
              <label className="text-[12px] text-foreground-muted mb-1.5 block">Description</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-[14px] bg-background min-h-[100px]" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] text-foreground-muted mb-1.5 block">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value as Idea['status'])} className="w-full px-3 py-2 border border-border rounded-lg text-[14px] bg-background">
                  <option>Inbox</option>
                  <option>Exploring</option>
                  <option>Maybe Later</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] text-foreground-muted mb-1.5 block">Category (optional)</label>
                <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-[14px] bg-background" placeholder="e.g. App Idea" />
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-border rounded-lg text-[14px] text-foreground-secondary hover:bg-surface">Cancel</button>
              <button onClick={addIdea} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-[14px] font-medium">Save idea</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
