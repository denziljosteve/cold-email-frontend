import { Sparkles, Copy, FileDown, FileJson, Eraser, RotateCcw } from "lucide-react";

interface ActionToolbarProps {
  onGenerate: () => void;
  onCopy: () => void;
  onDownloadTxt: () => void;
  onDownloadJson: () => void;
  onClearOptional: () => void;
  onReset: () => void;
  generateDisabled?: boolean;
}

export function ActionToolbar({
  onGenerate,
  onCopy,
  onDownloadTxt,
  onDownloadJson,
  onClearOptional,
  onReset,
  generateDisabled = false,
}: ActionToolbarProps) {
  return (
    <div className="cr-toolbar" role="toolbar" aria-label="Primary actions">
      <button
        type="button"
        className="btn cr-btn-primary"
        onClick={onGenerate}
        disabled={generateDisabled}
        title={generateDisabled ? "Fill in the required fields first" : "Generate plugin input"}
      >
        <Sparkles size={15} aria-hidden="true" />
        Generate Plugin Input
      </button>
      <button type="button" className="btn cr-btn-secondary" onClick={onCopy}>
        <Copy size={15} aria-hidden="true" />
        Copy Output
      </button>
      <button type="button" className="btn cr-btn-secondary" onClick={onDownloadTxt}>
        <FileDown size={15} aria-hidden="true" />
        Download TXT
      </button>
      <button type="button" className="btn cr-btn-secondary" onClick={onDownloadJson}>
        <FileJson size={15} aria-hidden="true" />
        Download JSON
      </button>
      <button type="button" className="btn cr-btn-ghost" onClick={onClearOptional} title="Clear optional inputs">
        <Eraser size={15} aria-hidden="true" />
        Clear Optional
      </button>
      <button
        type="button"
        className="btn cr-btn-danger"
        onClick={onReset}
        title="Reset the entire form"
      >
        <RotateCcw size={15} aria-hidden="true" />
        Reset Form
      </button>
    </div>
  );
}
