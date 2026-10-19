import { Send } from "lucide-react";
import type { EmailLength, OutreachObjective, OutreachPreferences, OutreachTone } from "../types/careerCoach";
import { CardShell, Field, Toggle } from "./Field";

interface OutreachPreferencesCardProps {
  value: OutreachPreferences;
  onChange: (update: Partial<OutreachPreferences>) => void;
}

const OBJECTIVES: { value: OutreachObjective; label: string }[] = [
  { value: "explore_opportunities", label: "Explore relevant opportunities" },
  { value: "informational_interview", label: "Request an informational interview" },
  { value: "ask_about_team_or_hiring", label: "Ask about the appropriate team or hiring process" },
  { value: "request_referral", label: "Request a referral" },
  { value: "contact_hiring_manager", label: "Contact a hiring manager" },
  { value: "request_introduction", label: "Request an introduction" },
  { value: "follow_up", label: "Follow up on previous outreach" },
  { value: "custom", label: "Custom objective" },
];

const TONES: { value: OutreachTone; label: string }[] = [
  { value: "professional_direct", label: "Professional and direct" },
  { value: "warm_conversational", label: "Warm and conversational" },
  { value: "confident_concise", label: "Confident and concise" },
  { value: "formal", label: "Formal" },
  { value: "custom", label: "Custom" },
];

const LENGTHS: { value: EmailLength; label: string }[] = [
  { value: "short", label: "Short · 60–100 words" },
  { value: "standard", label: "Standard · 100–170 words" },
  { value: "detailed", label: "Detailed · 170–250 words" },
];

export function OutreachPreferencesCard({ value, onChange }: OutreachPreferencesCardProps) {
  return (
    <CardShell id="card-preferences" icon={<Send size={16} />} title="Outreach Preferences">
      <div className="cr-grid-2">
        <Field label="Outreach objective" htmlFor="pref-objective">
          <select
            id="pref-objective"
            className="cr-input"
            value={value.objective}
            onChange={(e) => onChange({ objective: e.target.value as OutreachObjective })}
          >
            {OBJECTIVES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tone" htmlFor="pref-tone">
          <select
            id="pref-tone"
            className="cr-input"
            value={value.tone}
            onChange={(e) => onChange({ tone: e.target.value as OutreachTone })}
          >
            {TONES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {value.objective === "custom" && (
        <Field label="Custom objective" htmlFor="pref-objective-custom">
          <input
            id="pref-objective-custom"
            className="cr-input"
            value={value.objectiveCustom}
            onChange={(e) => onChange({ objectiveCustom: e.target.value })}
          />
        </Field>
      )}
      {value.tone === "custom" && (
        <Field label="Custom tone" htmlFor="pref-tone-custom">
          <input
            id="pref-tone-custom"
            className="cr-input"
            value={value.toneCustom}
            onChange={(e) => onChange({ toneCustom: e.target.value })}
          />
        </Field>
      )}

      <div className="cr-field">
        <span className="cr-label">Email length</span>
        <div className="cr-segmented" role="radiogroup" aria-label="Email length">
          {LENGTHS.map((l) => (
            <button
              key={l.value}
              type="button"
              role="radio"
              aria-checked={value.length === l.value}
              className={`cr-segment ${value.length === l.value ? "active" : ""}`}
              onClick={() => onChange({ length: l.value })}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="cr-grid-2">
        <Field label="Preferred language" htmlFor="pref-language">
          <input
            id="pref-language"
            className="cr-input"
            value={value.language}
            onChange={(e) => onChange({ language: e.target.value })}
          />
        </Field>
        <Field label="Preferred sign-off" htmlFor="pref-signoff">
          <input
            id="pref-signoff"
            className="cr-input"
            value={value.signOff}
            placeholder="e.g. Best regards,"
            onChange={(e) => onChange({ signOff: e.target.value })}
          />
        </Field>
        <Field label="Specific achievements to emphasize" htmlFor="pref-achievements">
          <textarea
            id="pref-achievements"
            className="cr-textarea"
            rows={2}
            value={value.achievementsToEmphasize}
            onChange={(e) => onChange({ achievementsToEmphasize: e.target.value })}
          />
        </Field>
        <Field label="Call-to-action preference" htmlFor="pref-cta">
          <input
            id="pref-cta"
            className="cr-input"
            value={value.callToAction}
            placeholder="e.g. A 15-minute call"
            onChange={(e) => onChange({ callToAction: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Avoided phrases or constraints" htmlFor="pref-avoided">
        <textarea
          id="pref-avoided"
          className="cr-textarea"
          rows={2}
          value={value.avoidedPhrases}
          placeholder="e.g. Avoid the word 'passionate'"
          onChange={(e) => onChange({ avoidedPhrases: e.target.value })}
        />
      </Field>

      <div className="cr-toggle-row">
        <Toggle
          id="pref-networking"
          label="Include networking alternative"
          checked={value.includeNetworkingAlternative}
          onChange={(v) => onChange({ includeNetworkingAlternative: v })}
        />
        <Toggle
          id="pref-referral"
          label="Include referral-request alternative"
          checked={value.includeReferralAlternative}
          onChange={(v) => onChange({ includeReferralAlternative: v })}
        />
        <Toggle
          id="pref-short"
          label="Include shorter email version"
          checked={value.includeShortVersion}
          onChange={(v) => onChange({ includeShortVersion: v })}
        />
      </div>
    </CardShell>
  );
}
