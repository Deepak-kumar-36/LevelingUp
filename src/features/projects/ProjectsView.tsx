import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { Project } from '../../types';
import { Plus, FolderKanban, Trash2 } from 'lucide-react';

export function ProjectsView() {
  const { data, setData } = useAppStore();
  const projects = data.projects || [];

  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [status, setStatus] = useState<Project['status']>('Not Started');
  const [category, setCategory] = useState('');

  const addProject = () => {
    if (!name.trim()) return;
    const p: Project = {
      id: 'p_' + Date.now().toString(36),
      name: name.trim(),
      description: desc.trim(),
      status,
      priority,
      category: category.trim(),
      createdAt: Date.now()
    };
    
    setData(d => ({ ...d, projects: [p, ...(d.projects || [])] }));
    setShowForm(false);
    resetForm();
  };

  const deleteProject = (id: string) => {
    setData(d => ({ ...d, projects: (d.projects || []).filter(x => x.id !== id) }));
  };

  const updateStatus = (id: string, newStatus: Project['status']) => {
    setData(d => ({
      ...d,
      projects: (d.projects || []).map(p => p.id === id ? { ...p, status: newStatus } : p)
    }));
  };

  const resetForm = () => {
    setName(''); setDesc(''); setPriority('Medium'); setStatus('Not Started'); setCategory('');
  };

  // Group by status
  const grouped = {
    'Active': projects.filter(p => p.status === 'In Progress' || p.status === 'Planning'),
    'Pending': projects.filter(p => p.status === 'Not Started' || p.status === 'Paused'),
    'Completed': projects.filter(p => p.status === 'Completed' || p.status === 'Archived')
  };

  return (
    <div className="flex flex-col gap-10 fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Projects</h1>
          <p className="text-[14px] text-foreground-muted mt-1">Manage long-term initiatives</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          New project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-[14px] text-foreground-muted bg-surface p-12 rounded-lg border border-border text-center flex flex-col items-center">
          <FolderKanban size={32} className="mb-4 opacity-50" />
          <p>No projects yet.</p>
          <p className="text-[13px] mt-1 opacity-75">Create one to start tracking your work.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {Object.entries(grouped).map(([groupName, groupProjects]) => {
            if (groupProjects.length === 0) return null;
            return (
              <section key={groupName}>
                <h2 className="text-[12px] font-semibold text-foreground-muted uppercase tracking-wider mb-4">
                  {groupName} · {groupProjects.length}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupProjects.map(p => (
                    <div key={p.id} className="bg-card border border-border rounded-lg p-5 flex flex-col group relative">
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <select 
                          value={p.status}
                          onChange={(e) => updateStatus(p.id, e.target.value as Project['status'])}
                          className="text-[11px] bg-surface border-none rounded px-2 py-1 outline-none cursor-pointer"
                        >
                          <option>Not Started</option>
                          <option>Planning</option>
                          <option>In Progress</option>
                          <option>Paused</option>
                          <option>Completed</option>
                          <option>Archived</option>
                        </select>
                        <button onClick={() => deleteProject(p.id)} className="text-foreground-muted hover:text-error p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="pr-20 mb-3">
                        <h3 className="text-[15px] font-medium text-foreground">{p.name}</h3>
                        {p.description && <p className="text-[13px] text-foreground-muted mt-1">{p.description}</p>}
                      </div>

                      <div className="mt-auto pt-4 flex items-center gap-2">
                        <span className={`text-[11px] px-2 py-0.5 rounded-md ${
                          p.status === 'Completed' ? 'bg-success-muted text-success' :
                          p.status === 'In Progress' ? 'bg-primary-muted text-primary' :
                          'bg-surface text-foreground-muted'
                        }`}>
                          {p.status}
                        </span>
                        {p.priority === 'High' && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-error-muted text-error">
                            High Priority
                          </span>
                        )}
                        {p.category && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md border border-border text-foreground-secondary">
                            {p.category}
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
            <h3 className="text-[16px] font-semibold text-foreground mb-2">New project</h3>
            
            <div>
              <label className="text-[12px] text-foreground-muted mb-1.5 block">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-[14px] bg-background" autoFocus />
            </div>
            <div>
              <label className="text-[12px] text-foreground-muted mb-1.5 block">Description</label>
              <input type="text" value={desc} onChange={e => setDesc(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-[14px] bg-background" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] text-foreground-muted mb-1.5 block">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value as Project['status'])} className="w-full px-3 py-2 border border-border rounded-lg text-[14px] bg-background">
                  <option>Not Started</option>
                  <option>Planning</option>
                  <option>In Progress</option>
                  <option>Paused</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] text-foreground-muted mb-1.5 block">Priority</label>
                <select value={priority} onChange={e => setPriority(e.target.value as Project['priority'])} className="w-full px-3 py-2 border border-border rounded-lg text-[14px] bg-background">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-[12px] text-foreground-muted mb-1.5 block">Category (optional)</label>
              <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-[14px] bg-background" placeholder="e.g. Web Dev" />
            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-border rounded-lg text-[14px] text-foreground-secondary hover:bg-surface">Cancel</button>
              <button onClick={addProject} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-[14px] font-medium">Create project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
