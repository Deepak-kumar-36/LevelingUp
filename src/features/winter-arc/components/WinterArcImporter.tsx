import { useState, useRef } from 'react';
import { parseMarkdown } from '../parser/markdownParser';
import { normalizeMarkdown } from '../parser/normalizer';
import { generateImportPreview } from '../import/diffEngine';
import type { ImportPreviewData } from '../import/diffEngine';
import { executeImportTransaction } from '../import/transaction';
import { Upload, AlertCircle, Check } from 'lucide-react';

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
      if (preview.errors.length > 0 && !window.confirm('There are validation warnings. Import anyway?')) {
        setLoading(false);
        return;
      }
      await executeImportTransaction(config);
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Import failed.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 max-w-xl">
      {!preview ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <Upload size={18} className="text-foreground-muted" />
            <div>
              <h3 className="text-[14px] font-medium text-foreground">Import Markdown</h3>
              <p className="text-[13px] text-foreground-muted">Select a .md file to import your program configuration.</p>
            </div>
          </div>
          <input type="file" accept=".md" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="w-full py-2.5 border border-border rounded-lg text-[13px] text-foreground-secondary hover:bg-surface transition-colors"
          >
            {loading ? 'Analyzing...' : 'Choose file'}
          </button>
          {error && <p className="text-[13px] text-error flex items-center gap-2"><AlertCircle size={14} /> {error}</p>}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-[15px] font-semibold text-foreground mb-1">Import preview</h3>
            <p className="text-[13px] text-foreground-muted">
              {preview.programName} · {preview.durationWeeks} weeks
              {preview.startDate ? ` · starts ${preview.startDate}` : ''}
            </p>
          </div>

          {preview.errors.length > 0 && (
            <div className="bg-warning-muted border border-warning/20 rounded-lg p-3">
              <div className="text-[12px] font-medium text-warning mb-1">Warnings</div>
              <ul className="text-[12px] text-foreground-secondary list-disc pl-4">
                {preview.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {Object.entries(preview.diffs).map(([key, diff]) => (
              <div key={key} className="bg-surface rounded-lg p-3">
                <div className="text-[11px] text-foreground-muted capitalize mb-1">{key}</div>
                <div className="text-[13px] font-medium text-foreground">
                  {diff.added > 0 && <span className="text-success">+{diff.added}</span>}
                  {diff.added > 0 && diff.updated > 0 && ' · '}
                  {diff.updated > 0 && <span>~{diff.updated}</span>}
                  {diff.added === 0 && diff.updated === 0 && '—'}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setPreview(null); setFileContent(null); }}
              className="flex-1 py-2.5 border border-border rounded-lg text-[13px] text-foreground-secondary hover:bg-surface transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={loading}
              className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Check size={14} />
              {loading ? 'Importing...' : 'Confirm import'}
            </button>
          </div>
          {error && <p className="text-[13px] text-error">{error}</p>}
        </div>
      )}
    </div>
  );
}
