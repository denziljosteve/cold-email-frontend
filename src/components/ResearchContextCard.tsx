import { Search } from "lucide-react";
import type { ResearchContext } from "../types/careerCoach";
import { CardShell, Field } from "./Field";

interface ResearchContextCardProps {
  value: ResearchContext;
  onChange: (update: Partial<ResearchContext>) => void;
}

export function ResearchContextCard({ value, onChange }: ResearchContextCardProps) {
  return (
    <CardShell id="card-research" icon={<Search size={16} />} title="Research & Personalization">
      <div className="cr-field">
        <span className="cr-label">Research mode</span>
        <div className="cr-segmented" role="radiogroup" aria-label="Research mode">
          <button
            type="button"
            role="radio"
            aria-checked={value.mode === "provided_information_only"}
            className={`cr-segment ${value.mode === "provided_information_only" ? "active" : ""}`}
            onClick={() => onChange({ mode: "provided_information_only" })}
          >
            Supplied information only
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={value.mode === "research_enabled"}
            className={`cr-segment ${value.mode === "research_enabled" ? "active" : ""}`}
            onClick={() => onChange({ mode: "research_enabled" })}
          >
            Research-enabled
          </button>
        </div>
        <div className="cr-hint">
          This app does not browse the web. Unless a research integration is actually connected, the
          generated package requires transparent disclosure and prohibits invented personalization.
        </div>
      </div>

      <div className="cr-grid-2">
        <Field label="Recipient profile URL" htmlFor="research-profile">
          <input
            id="research-profile"
            className="cr-input"
            value={value.recipientProfileUrl}
            placeholder="https://..."
            onChange={(e) => onChange({ recipientProfileUrl: e.target.value })}
          />
        </Field>
        <Field label="Company website" htmlFor="research-website">
          <input
            id="research-website"
            className="cr-input"
            value={value.companyWebsite}
            placeholder="https://..."
            onChange={(e) => onChange({ companyWebsite: e.target.value })}
          />
        </Field>
        <Field label="Known projects, products, or initiatives" htmlFor="research-projects">
          <textarea
            id="research-projects"
            className="cr-textarea"
            rows={2}
            value={value.knownProjects}
            onChange={(e) => onChange({ knownProjects: e.target.value })}
          />
        </Field>
        <Field label="Recent company developments" htmlFor="research-developments">
          <textarea
            id="research-developments"
            className="cr-textarea"
            rows={2}
            value={value.recentDevelopments}
            onChange={(e) => onChange({ recentDevelopments: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Existing relationship or shared professional context" htmlFor="research-relationship">
        <input
          id="research-relationship"
          className="cr-input"
          value={value.existingRelationship}
          placeholder="e.g. Met at TechCrunch Disrupt 2024"
          onChange={(e) => onChange({ existingRelationship: e.target.value })}
        />
      </Field>
      <Field label="Research notes" htmlFor="research-notes">
        <textarea
          id="research-notes"
          className="cr-textarea"
          rows={3}
          value={value.researchNotes}
          onChange={(e) => onChange({ researchNotes: e.target.value })}
        />
      </Field>
    </CardShell>
  );
}
