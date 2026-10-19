import { useEffect } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

export type ToastKind = "success" | "error" | "info";

export interface ToastState {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastProps {
  toast: ToastState | null;
  onDismiss: () => void;
}

const AUTO_DISMISS_MS = 3200;

export function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const Icon = toast.kind === "success" ? CheckCircle2 : toast.kind === "error" ? XCircle : Info;

  return (
    <div
      className={`cr-toast cr-toast-${toast.kind}`}
      role={toast.kind === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <Icon size={16} aria-hidden="true" />
      <span>{toast.message}</span>
      <button type="button" className="cr-toast-close" onClick={onDismiss} aria-label="Dismiss notification">
        ×
      </button>
    </div>
  );
}
