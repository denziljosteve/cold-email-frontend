import { useEffect, useRef } from "react";
import { CheckCircle2, AlertTriangle, CircleDot } from "lucide-react";
import type { OutputMode, Readiness } from "../types/careerCoach";
import { APP_CONFIG } from "../config/defaultInstructions";

interface OutputPanelProps {
  mode: OutputMode;
  onModeChange: (m: OutputMode) => void;
  content: string;
  readiness: Readiness;
  statusMessage: string;
  charCount: number;
  overLimit: boolean;
}

const MODES: { value: OutputMode; label: string }[] = [
  { value: "complete", label: "Complete Plugin Input" },
  { value: "json", label: "Structured JSON" },
  { value: "prompt", label: "Plain-Text Prompt" },
];

const READINESS_META: Record<Readiness, { label: string; className: string }> = {
  missing_required: { label: "Missing required inputs", className: "missing" },
  ready: { label: "Ready to generate", className: "ready" },
  generated: { label: "Input generated", className: "generated" },
};

function ReadinessIndicator({ readiness }: { readiness: Readiness }) {
  const meta = READINESS_META[readiness];
  const Icon = readiness === "generated" ? CheckCircle2 : readiness === "ready" ? CircleDot : AlertTriangle;
  return (
    <span className={`cr-readiness ${meta.className}`}>
      <Icon size={13} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function OutputPanel({
  mode,
  onModeChange,
  content,
  readiness,
  statusMessage,
  charCount,
  overLimit,
}: OutputPanelProps) {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (preRef.current) preRef.current.scrollTop = 0;
  }, [content]);

  return (
    <section className="cr-output" aria-label="Generated plugin input">
      <div className="cr-output-header">
        <h2 className="cr-output-title">Generated Plugin Input</h2>
        <ReadinessIndicator readiness={readiness} />
      </div>

      <div className="cr-tabs" role="tablist" aria-label="Output format">
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            role="tab"
            aria-selected={mode === m.value}
            className={`cr-tab ${mode === m.value ? "active" : ""}`}
            onClick={() => onModeChange(m.value)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <pre className="cr-output-pre" ref={preRef} tabIndex={0} aria-label="Output content">
        {content || "Click “Generate Plugin Input” to assemble the package."}
      </pre>

      <div className="cr-output-footer">
        <span className="cr-output-status" role="status" aria-live="polite">
          {statusMessage}
        </span>
        <span className="cr-output-count">
          {charCount.toLocaleString()} chars
          {mode !== "json" && ` · limit ${APP_CONFIG.contextLimitChars.toLocaleString()}`}
        </span>
      </div>
      {overLimit && (
        <div className="cr-status cr-status-warn" role="alert">
          The assembled package exceeds the configured downstream context limit (
          {APP_CONFIG.contextLimitChars.toLocaleString()} chars). Review the content and trim optional
          sections before sending it to a model.
        </div>
      )}
    </section>
  );
}
