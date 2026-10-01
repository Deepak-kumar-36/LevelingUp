import { useState, useRef } from 'react';
import { parseMarkdown } from '../parser/markdownParser';
import { normalizeMarkdown } from '../parser/normalizer';
import { generateImportPreview } from '../import/diffEngine';
import type { ImportPreviewData } from '../import/diffEngine';
import { executeImportTransaction } from '../import/transaction';

export function WinterArcImporter({ onComplete }: { onComplete: () => void }) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportPreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const text = await file.text();
      setFileContent(text);
      
      const parsed = parseMarkdown(text);
      const config = normalizeMarkdown(text, parsed);
      
      const prev = await generateImportPreview(config);
      setPreview(prev);
    } catch (err: any) {
      setError(err.message || 'Failed to parse file.');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!fileContent || !preview) return;
    try {
      setLoading(true);
      const parsed = parseMarkdown(fileContent);
      const config = normalizeMarkdown(fileContent, parsed);
      
      if (preview.errors.length > 0) {
        if (!window.confirm('There are validation errors. Import anyway?')) {
          setLoading(false);
          return;
        }
      }

      await executeImportTransaction(config);
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to complete transaction.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto p-6 bg-card border border-border/50 rounded-xl">
      <div className="text-[14px] font-bold tracking-widest uppercase">Winter Arc Configuration</div>
      
      {!preview && (
        <div className="flex flex-col gap-4">
          <p className="text-[12px] text-muted-foreground">Select a Markdown (.md) file to import your Winter Arc configuration.</p>
          <input 
            type="file" 
            accept=".md" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 border border-primary text-primary hover:bg-primary/10 transition-colors uppercase tracking-widest text-[11px]"
            disabled={loading}
          >
            {loading ? 'ANALYZING...' : 'SELECT MARKDOWN FILE'}
          </button>
          {error && <div className="text-destructive text-[11px] mt-2">{error}</div>}
        </div>
      )}

      {preview && (
        <div className="flex flex-col gap-6">
          <div className="bg-black/40 p-4 border border-white/5 flex flex-col gap-2 text-[11px]">
            <div className="text-primary tracking-widest uppercase mb-2">Import Preview</div>
            <div><span className="text-muted-foreground">Program:</span> {preview.programName}</div>
            <div><span className="text-muted-foreground">Start Date:</span> {preview.startDate || 'N/A'}</div>
            <div><span className="text-muted-foreground">Duration:</span> {preview.durationWeeks} weeks</div>
          </div>

          {preview.errors.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/50 p-4 flex flex-col gap-2">
              <div className="text-destructive tracking-widest uppercase text-[11px]">Validation Errors</div>
              <ul className="list-disc pl-4 text-[10px] text-destructive/80">
                {preview.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[10px] uppercase tracking-wider">
            {Object.entries(preview.diffs).map(([key, diff]) => (
              <div key={key} className="bg-black/20 p-3 border border-white/5 flex flex-col gap-1">
                <div className="text-muted-foreground mb-1">{key}</div>
                <div className="text-primary">+{diff.added} Added</div>
                <div className="text-white">~{diff.updated} Updated</div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <button 
              onClick={() => { setPreview(null); setFileContent(null); }}
              className="flex-1 px-4 py-3 border border-white/20 text-white hover:bg-white/5 transition-colors uppercase tracking-widest text-[11px]"
            >
              CANCEL
            </button>
            <button 
              onClick={handleImport}
              className="flex-1 px-4 py-3 bg-primary text-black hover:bg-white transition-colors uppercase tracking-widest text-[11px] font-bold"
              disabled={loading}
            >
              {loading ? 'IMPORTING...' : 'CONFIRM IMPORT'}
            </button>
          </div>
          {error && <div className="text-destructive text-[11px] mt-2">{error}</div>}
        </div>
      )}
    </div>
  );
}
