import { Lock, Unlock, RotateCcw } from "lucide-react";
import type { MasterInstructions } from "../types/careerCoach";
import { DEFAULT_MASTER_INSTRUCTIONS } from "../config/defaultInstructions";
import { CharCount, Toggle } from "./Field";

interface MasterInstructionsCardProps {
  value: MasterInstructions;
  onChange: (update: Partial<MasterInstructions>) => void;
}

export function MasterInstructionsCard({ value, onChange }: MasterInstructionsCardProps) {
  return (
    <section className="cr-card cr-card-master">
      <div className="cr-card-header-static">
        <span className="cr-card-title">MASTER INSTRUCTIONS</span>
        <div className="cr-master-controls">
          <button
            type="button"
            className="cr-icon-btn"
            onClick={() => onChange({ locked: !value.locked })}
            title={value.locked ? "Unlock for editing" : "Lock instructions"}
            aria-label={value.locked ? "Unlock instructions for editing" : "Lock instructions"}
            aria-pressed={value.locked}
          >
            {value.locked ? <Lock size={15} /> : <Unlock size={15} />}
          </button>
          <button
            type="button"
            className="cr-icon-btn"
            onClick={() => onChange({ text: DEFAULT_MASTER_INSTRUCTIONS, locked: true })}
            title="Reset to default instructions"
            aria-label="Reset master instructions to default"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      <div className="cr-master-body">
        <label className="cr-sr-only" htmlFor="master-instructions">
          Master instructions
        </label>
        <textarea
          id="master-instructions"
          className="cr-textarea cr-master-textarea"
          value={value.text}
          readOnly={value.locked}
          rows={12}
          spellCheck={false}
          onChange={(e) => onChange({ text: e.target.value })}
          aria-describedby="master-instructions-count"
        />
        <div className="cr-master-footer">
          <CharCount value={value.text.length} />
          <div className="cr-master-toggles">
            <Toggle
              id="master-locked"
              label={value.locked ? "Locked" : "Unlocked"}
              checked={value.locked}
              onChange={(v) => onChange({ locked: v })}
            />
            <Toggle
              id="master-included"
              label="Include in output"
              checked={value.included}
              onChange={(v) => onChange({ included: v })}
            />
          </div>
        </div>
        {value.locked && (
          <div className="cr-hint">
            Instructions are locked (read-only). Unlock to edit. Excluding them keeps your text in the
            form but removes it from the generated package.
          </div>
        )}
      </div>
    </section>
  );
}
