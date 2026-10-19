import { useState } from "react";
import { ChevronDown, Lock, Unlock } from "lucide-react";

interface CardShellProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  badge?: React.ReactNode;
  requiredCount?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/** Collapsible section card used for every form section. */
export function CardShell({
  id,
  icon,
  title,
  badge,
  requiredCount = 0,
  defaultOpen = true,
  children,
}: CardShellProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="cr-card" id={id}>
      <button
        type="button"
        className="cr-card-header"
        aria-expanded={open}
        aria-controls={`${id}-body`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="cr-card-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="cr-card-title">{title}</span>
        {badge}
        {requiredCount > 0 && (
          <span className="cr-badge-required">{requiredCount} required</span>
        )}
        <ChevronDown size={16} className={`cr-chevron ${open ? "open" : ""}`} aria-hidden="true" />
      </button>
      <div id={`${id}-body`} className="cr-card-body" hidden={!open}>
        {children}
      </div>
    </section>
  );
}

interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

/** Labeled field wrapper with optional hint and error text. */
export function Field({ label, htmlFor, required = false, hint, error, children }: FieldProps) {
  return (
    <div className={`cr-field ${error ? "has-error" : ""}`}>
      <label className="cr-label" htmlFor={htmlFor}>
        {label}
        {required ? (
          <span className="cr-req" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="cr-optional">optional</span>
        )}
      </label>
      {children}
      {hint && !error && <div className="cr-hint">{hint}</div>}
      {error && (
        <div className="cr-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

interface ToggleProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ id, label, checked, onChange, disabled = false }: ToggleProps) {
  return (
    <label className={`cr-toggle ${disabled ? "disabled" : ""}`} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="cr-toggle-track" aria-hidden="true">
        <span className="cr-toggle-thumb" />
      </span>
      <span className="cr-toggle-label">{label}</span>
    </label>
  );
}

interface CharCountProps {
  value: number;
  max?: number;
}

export function CharCount({ value, max }: CharCountProps) {
  const over = max !== undefined && value > max;
  return (
    <div className={`cr-charcount ${over ? "over" : ""}`} aria-live="polite">
      {value.toLocaleString()} characters
      {max !== undefined && ` / ${max.toLocaleString()}`}
    </div>
  );
}

export { Lock, Unlock };
