import { Briefcase } from "lucide-react";
import type { Opportunity } from "../types/careerCoach";
import { CardShell, Field } from "./Field";

interface OpportunityFormProps {
  value: Opportunity;
  onChange: (update: Partial<Opportunity>) => void;
}

export function OpportunityForm({ value, onChange }: OpportunityFormProps) {
  return (
    <CardShell id="card-opportunity" icon={<Briefcase size={16} />} title="Target Opportunity">
      <div className="cr-grid-2">
        <Field
          label="Target role/title"
          htmlFor="opp-title"
          hint="If no job description is given, fit is assessed against this title with inferred expectations labeled."
        >
          <input
            id="opp-title"
            className="cr-input"
            value={value.targetTitle}
            placeholder="e.g. Senior Backend Engineer"
            onChange={(e) => onChange({ targetTitle: e.target.value })}
          />
        </Field>
        <Field label="Job posting URL" htmlFor="opp-url">
          <input
            id="opp-url"
            className="cr-input"
            value={value.jobPostingUrl}
            placeholder="https://..."
            onChange={(e) => onChange({ jobPostingUrl: e.target.value })}
          />
        </Field>
        <Field label="Required skills or qualifications" htmlFor="opp-skills">
          <textarea
            id="opp-skills"
            className="cr-textarea"
            rows={3}
            value={value.requiredSkills}
            onChange={(e) => onChange({ requiredSkills: e.target.value })}
          />
        </Field>
        <div className="cr-grid-2 cr-grid-stack">
          <Field label="Preferred experience level" htmlFor="opp-level">
            <select
              id="opp-level"
              className="cr-input"
              value={value.experienceLevel}
              onChange={(e) => onChange({ experienceLevel: e.target.value })}
            >
              <option value="">Not specified</option>
              <option value="Entry level">Entry level</option>
              <option value="Mid level">Mid level</option>
              <option value="Senior">Senior</option>
              <option value="Staff/Principal">Staff/Principal</option>
              <option value="Lead/Manager">Lead/Manager</option>
              <option value="Director+">Director+</option>
            </select>
          </Field>
          <Field label="Industry/domain" htmlFor="opp-industry">
            <input
              id="opp-industry"
              className="cr-input"
              value={value.industry}
              placeholder="e.g. Fintech"
              onChange={(e) => onChange({ industry: e.target.value })}
            />
          </Field>
        </div>
      </div>
      <Field
        label="Job description"
        htmlFor="opp-jd"
        hint="Paste the posting, or upload a PDF/DOCX/TXT below. Optional — but improves fit scoring accuracy."
      >
        <textarea
          id="opp-jd"
          className="cr-textarea"
          rows={7}
          value={value.jobDescription}
          placeholder="Paste the job description here…"
          onChange={(e) => onChange({ jobDescription: e.target.value })}
        />
      </Field>
      <div className="cr-inline-upload">
        <label className="cr-browse" htmlFor="jd-file">
          Upload job description (PDF/DOCX/TXT)
        </label>
        <input
          id="jd-file"
          type="file"
          className="cr-sr-only"
          accept=".pdf,.docx,.txt,.md"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              file.text().then((t) => onChange({ jobDescription: t }));
            }
            e.target.value = "";
          }}
        />
      </div>
      <Field label="Additional hiring context" htmlFor="opp-context">
        <textarea
          id="opp-context"
          className="cr-textarea"
          rows={2}
          value={value.hiringContext}
          placeholder="e.g. Team is growing, role reports to the CTO"
          onChange={(e) => onChange({ hiringContext: e.target.value })}
        />
      </Field>
    </CardShell>
  );
}
