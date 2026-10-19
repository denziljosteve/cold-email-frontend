import { useCallback, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import type { ResumeState } from "../types/careerCoach";
import { useFileExtraction } from "../hooks/useFileExtraction";
import { formatFileSize } from "../lib/fileExtraction";
import { CardShell, CharCount, Field } from "./Field";

interface ResumeUploadCardProps {
  value: ResumeState;
  onChange: (update: Partial<ResumeState>) => void;
}

export function ResumeUploadCard({ value, onChange }: ResumeUploadCardProps) {
  const { status, error, fileMeta, processFile, clearFile } = useFileExtraction({ onExtract: onChange });
  const [dragging, setDragging] = useState(false);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) void processFile(file);
    },
    [processFile],
  );

  return (
    <CardShell id="card-resume" icon={<FileText size={16} />} title="Resume Upload & Content">
      <div
        className={`cr-dropzone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <Upload size={20} className="cr-dropzone-icon" aria-hidden="true" />
        <div className="cr-dropzone-text">
          Drag &amp; drop a resume here, or{" "}
          <label className="cr-browse" htmlFor="resume-file">
            browse files
          </label>
        </div>
        <div className="cr-dropzone-hint">Accepted: PDF, DOCX, TXT — up to {formatFileSize(5 * 1024 * 1024)}</div>
        <input
          id="resume-file"
          type="file"
          className="cr-sr-only"
          accept=".pdf,.docx,.txt,.md,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void processFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {status === "processing" && <div className="cr-status cr-status-info">Extracting text…</div>}
      {status === "done" && fileMeta && (
        <div className="cr-status cr-status-success">
          Extracted text from <strong>{fileMeta.name}</strong> ({fileMeta.sizeLabel})
        </div>
      )}
      {status === "error" && (
        <div className="cr-status cr-status-error" role="alert">
          <div>
            {error} You can paste the resume text below manually.
          </div>
          <button type="button" className="btn cr-btn-ghost btn-sm" onClick={clearFile}>
            Dismiss
          </button>
        </div>
      )}

      {fileMeta && status !== "error" && (
        <div className="cr-file-chip">
          <FileText size={14} aria-hidden="true" />
          <span className="cr-file-name">{fileMeta.name}</span>
          <span className="cr-file-size">{fileMeta.sizeLabel}</span>
          <button
            type="button"
            className="cr-icon-btn cr-icon-btn-sm"
            onClick={clearFile}
            title="Remove file"
            aria-label={`Remove file ${fileMeta.name}`}
          >
            <X size={13} />
          </button>
        </div>
      )}

      <Field
        label="Resume text"
        htmlFor="resume-text"
        hint="Editable after extraction — review before generating."
      >
        <textarea
          id="resume-text"
          className="cr-textarea cr-resume-textarea"
          rows={10}
          value={value.text}
          placeholder="Upload a file or paste resume content here…"
          onChange={(e) => onChange({ text: e.target.value })}
        />
      </Field>
      <CharCount value={value.text.length} />
    </CardShell>
  );
}
