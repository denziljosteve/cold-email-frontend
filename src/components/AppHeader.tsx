import { Moon, Sun, RotateCcw, Settings } from "lucide-react";
import { APP_CONFIG } from "../config/defaultInstructions";
import type { Theme } from "../hooks/useTheme";

interface AppHeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  onReset: () => void;
}

export function AppHeader({ theme, onToggleTheme, onReset }: AppHeaderProps) {
  return (
    <header className="cr-header">
      <div className="cr-header-brand">
        <span className="cr-logo" aria-hidden="true">
          <Settings size={18} />
        </span>
        <div className="cr-header-text">
          <h1 className="cr-header-title">{APP_CONFIG.productName}</h1>
          <p className="cr-header-subtitle">{APP_CONFIG.tagline}</p>
        </div>
      </div>
      <div className="cr-header-actions">
        <button
          type="button"
          className="cr-icon-btn"
          onClick={onReset}
          title="Reset entire form"
          aria-label="Reset entire form"
        >
          <RotateCcw size={16} />
        </button>
        <button
          type="button"
          className="cr-icon-btn"
          onClick={onToggleTheme}
          title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
